import dotenv from 'dotenv';
dotenv.config();


// TODO: Define an interface for the Coordinates object
interface Coordinates {
  coord: {
  lat: number;
  lon: number;
};
  lat: number;
  lon: number;
}


// TODO: Define a class for the Weather object
class Weather {
  current: any; 
  forecast: any[]; 

  constructor(current: any, forecast: any[]) {
    this.current = current;
    this.forecast = forecast;
  }
}


// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string = 'https://api.openweathermap.org/data/2.5';
  private apiKey: string = process.env.API_KEY || '';
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<Coordinates> {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${this.apiKey}`);
    const data = await response.json();
    if (data.length === 0) {
      throw new Error('City not found');
    }

    return this.destructureLocationData(data[0]);
  }


  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    return {
      coord: {
      lat: locationData.lat,
      lon: locationData.lon,
    },
      lat: locationData.lat,
      lon: locationData.lon,
    };
  }
  


  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates, type: 'weather' | 'forecast'): string {
    return `${this.baseURL}/${type}?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
  }


  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: string): Promise<Coordinates>{
    const locationData = await this.fetchLocationData(city);
    return locationData;
  }



  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    try {
      const currentWeatherUrl = this.buildWeatherQuery(coordinates, 'weather');
      const forecastUrl = this.buildWeatherQuery(coordinates, 'forecast');
  
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(currentWeatherUrl),
        fetch(forecastUrl)
      ]);
  
      if (!currentResponse.ok || !forecastResponse.ok) {
        throw new Error('Failed to fetch weather data');
      }
  
      const currentData = await currentResponse.json();
      const forecastData = await forecastResponse.json();
  
      // Combine current weather and forecast data
      return {
        ...currentData,
        list: forecastData.list
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }



  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const currentWeather = {
      city: response.name,
      date: new Date().toLocaleDateString(),
      icon: response.weather[0]?.icon,
      description: response.weather[0].description,
      tempF: response.main.temp,
      humidity: response.main.humidity,
      windSpeed: response.wind.speed,
    };
    const forecastData = this.buildForecastArray(response.list);
    return new Weather(currentWeather, forecastData);
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData: any[]): any[] {
    const forecastData: any[] = [];
    weatherData.forEach((item, i) => {
      if (i % 8 === 0) {
        forecastData.push({ date: new Date(item.dt_txt).toLocaleDateString(),
          icon: item.weather[0].icon,
          description: item.weather[0].description,
          tempF: item.main.temp,
          humidity: item.main.humidity,
          windSpeed: item.wind.speed,});
      } 
    });
    return forecastData;
  }



  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<Weather> {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    return this.parseCurrentWeather(weatherData);
  }
}

export default new WeatherService();


