import fs from 'fs/promises';

class City {
  constructor(public id: string, public name: string) {}
}

class HistoryService {
  private filePath: string;

  constructor() {
    this.filePath = './db/searchHistory.json';
  }

  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading search history:', error);
      return [];
    }
  }

  private async write(cities: City[]): Promise<void> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2));
    } catch (error) {
      console.error('Error writing search history:', error);
    }
  }

  async getCities(): Promise<City[]> {
    return this.read();
  }

  async addCity(cityName: string) {
    const cities = await this.getCities();
    const newId = (Math.max(...cities.map(c => parseInt(c.id)), 0) + 1).toString();
    const newCity = new City(newId, cityName);
    cities.push(newCity);
    await this.write(cities);
  }

  async removeCity(id: string) {
    const cities = await this.getCities();
    const updatedCities = cities.filter(city => city.id !== id);
    await this.write(updatedCities);
  }
}

export default new HistoryService();