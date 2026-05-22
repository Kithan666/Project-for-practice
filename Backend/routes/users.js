const express = require('express');
const router = express.Router();

// GET /api/users/profile
router.get('/profile', (req, res) => {
    res.json({ message: 'Профиль пользователя' });
});

// GET /api/users/subscriptions
router.get('/subscriptions', (req, res) => {
    res.json({ subscriptions: [] });
});

module.exports = router;