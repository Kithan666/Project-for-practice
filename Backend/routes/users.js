const express = require('express');
const router = express.Router();
const { User, Subscription, VpnService } = require('../database');
const jwt = require('jsonwebtoken');

// Middleware для проверки токена
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Нет токена' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_change_me');
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Неверный токен' });
    }
};

// Профиль пользователя
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.userId, {
            attributes: ['id', 'username', 'email', 'role', 'balance', 'isActive', 'createdAt', 'lastLogin']
        });
        
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Подписки пользователя
router.get('/subscriptions', authMiddleware, async (req, res) => {
    try {
        const subscriptions = await Subscription.findAll({
            where: { userId: req.userId, status: 'active' },
            include: [{ model: VpnService, attributes: ['name', 'protocol', 'rating'] }]
        });
        
        res.json({ success: true, subscriptions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;