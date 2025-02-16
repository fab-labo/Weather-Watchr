import dotenv from 'dotenv';
dotenv.config();
class Weather {
    constructor(city, date, icon, tempF, windSpeed, humidity, iconDescription) {
        this.city = city;
        this.date = date;
        this.icon = icon;
        this.tempF = tempF;
        this.windSpeed = windSpeed;
        this.humidity = humidity;
        this.iconDescription = iconDescription;
    }
}
class WeatherService {
    constructor() {
        this.city = '';
        this.baseURL = process.env.API_BASE_URL || '';
        this.apiKey = process.env.API_KEY || '';
    }
    formatDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${month}-${day}-${year}`;
    }
    async fetchLocationData(query) {
        const response = await fetch(query);
        const data = await response.json();
        return data;
    }
    destructureLocationData(locationData) {
        const coordinates = {
            name: locationData.name,
            lat: locationData.lat,
            lon: locationData.lon,
            country: locationData.country,
            state: locationData.state
        };
        return coordinates;
    }
    buildGeocodeQuery() {
        const query = `${this.baseURL}/geo/1.0/direct?q=${this.city}&limit=1&appid=${this.apiKey}`;
        return query;
    }
    buildWeatherQuery(coordinates) {
        const query = `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
        return query;
    }
    async fetchAndDestructureLocationData() {
        const query = this.buildGeocodeQuery();
        const locationData = await this.fetchLocationData(query);
        const coordinates = this.destructureLocationData(locationData[0]);
        return coordinates;
    }
    async fetchWeatherData(coordinates) {
        const response = await fetch(this.buildWeatherQuery(coordinates));
        const data = await response.json();
        return data;
    }
    parseCurrentWeather(response) {
        const { list } = response;
        const currentWeather = list[0];
        const weather = new Weather(this.city, this.formatDate(new Date(currentWeather.dt_txt)), currentWeather.weather[0].icon, currentWeather.main.temp, currentWeather.wind.speed, currentWeather.main.humidity, currentWeather.weather[0].description);
        return weather;
    }
    buildForecastArray(currentWeather, weatherData) {
        const forecastArray = [currentWeather];
        for (let i = 1; i < weatherData.length; i += 8) {
            const { weather, main, wind, dt_txt } = weatherData[i];
            forecastArray.push(new Weather(this.city, this.formatDate(new Date(dt_txt)), weather[0].icon, main.temp, wind.speed, main.humidity, weather[0].description));
        }
        return forecastArray;
    }
    async getWeatherForCity(city) {
        this.city = city;
        const coordinates = await this.fetchAndDestructureLocationData();
        const weatherData = await this.fetchWeatherData(coordinates);
        const currentWeather = this.parseCurrentWeather(weatherData);
        return this.buildForecastArray(currentWeather, weatherData.list);
    }
}
export default new WeatherService();
