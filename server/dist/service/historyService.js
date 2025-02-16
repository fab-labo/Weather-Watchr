import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
class City {
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }
}
class HistoryService {
    async read() {
        const data = await fs.readFile(path.join(__dirname, '../../db/db.json'), 'utf-8');
        return JSON.parse(data);
    }
    async write(cities) {
        await fs.writeFile(path.join(__dirname, '../../db/db.json'), JSON.stringify(cities));
    }
    async getCities() {
        const cities = await this.read();
        return cities.map((city) => new City(city.name, city.id));
    }
    async addCity(city) {
        const cities = await this.read();
        cities.push(new City(city, uuidv4()));
        await this.write(cities);
    }
}
export default new HistoryService();
