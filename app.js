// app.js
// Hauptdatei des Anwendungsprogramms, in der Serverinitialisierung und Konfiguration erfolgen.
import express from 'express';
import pkg from 'body-parser';
const { urlencoded, json } = pkg;
import {oauth_model} from './models/oauth_model.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(urlencoded({ extended: true }));
app.use(json());


import index_routes from './routes/index.js';
app.get('/', (req, res) => {
    res.redirect('http://127.0.0.1:3000/auth');
});

app.get('/cb', (req, res) => {
    // Ваш код обработки обратного вызова
    res.send('Callback route');
});

app.listen(PORT, () => {
    console.log(`App server is running on http://127.0.0.1:${PORT}`);
})
