const express = require('express');
const router = express.Router();
const { VpnService, Endpoint, Review } = require('../database');

// Получить все VPN сервисы
router.get('/', async (req, res) => {
    try {
        const services = await VpnService.findAll({
            where: { status: 'active' },
            attributes: ['id', 'name', 'description', 'protocol', 'priceMonthly', 'priceYearly', 'rating', 'totalUsers']
        });
        
        res.json({
            success: true,
            count: services.length,
            services: services
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получить детали сервиса
router.get('/:id', async (req, res) => {
    try {
        const service = await VpnService.findByPk(req.params.id, {
            include: [
                { model: Endpoint, as: 'Endpoints' },
                { model: Review, as: 'Reviews', limit: 5 }
            ]
        });
        
        if (!service) {
            return res.status(404).json({ error: 'Сервис не найден' });
        }
        
        res.json({ success: true, service });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получить эндпоинты сервиса
router.get('/:id/endpoints', async (req, res) => {
    try {
        const endpoints = await Endpoint.findAll({
            where: { serviceId: req.params.id, isActive: true }
        });
        res.json({ success: true, endpoints });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;