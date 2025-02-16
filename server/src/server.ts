import dotenv from 'dotenv';
import express from 'express';
dotenv.config();


import routes from './routes/index.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();

const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




app.use(express.static('../client/dist'));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

const staticFolder = path.join(__dirname,  '../client/dist');
app.use(express.static(staticFolder))


app.use(routes);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
