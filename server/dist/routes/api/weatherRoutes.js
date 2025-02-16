import { Router } from 'express';
const router = Router();
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';
router.post('/', async (req, res) => {
    const city = req.body.cityName;
    const weatherData = await WeatherService.getWeatherForCity(city);
    res.json(weatherData);
    await HistoryService.addCity(city);
});
router.get('/history', async (_req, res) => {
    try {
        const cities = await HistoryService.getCities();
        res.json(cities);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});
export default router;
