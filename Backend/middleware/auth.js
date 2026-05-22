// Простая middleware для аутентификации (пока заглушка)
const auth = (req, res, next) => {
    // Пока пропускаем все запросы без проверки
    next();
};

module.exports = auth;