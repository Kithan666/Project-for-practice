const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ 
        message: 'Список VPN сервисов',
        services: [
            { id: 1, name: 'VPN Сервис 1', price: '5$' },
            { id: 2, name: 'VPN Сервис 2', price: '10$' }
        ]
    });
});

router.post('/subscribe', (req, res) => {
    res.json({ message: 'Подписка оформлена успешно!' });
});

module.exports = router;