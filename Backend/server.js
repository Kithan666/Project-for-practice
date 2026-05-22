const express = require('express');
const cors = require('cors');
const { initDatabase, VpnService } = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'VPN Hub API работает!' });
});

app.get('/api/services', async (req, res) => {
    try {
        const services = await VpnService.findAll();
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

initDatabase().then(() => {
    app.listen(5000, () => console.log('Сервер на http://localhost:5000'));
});