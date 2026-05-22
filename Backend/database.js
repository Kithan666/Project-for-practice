const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const bcrypt = require('bcryptjs');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'vpn_hub.sqlite'),
    logging: false
});

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    balance: { type: DataTypes.FLOAT, defaultValue: 0 }
});

const VpnService = sequelize.define('VpnService', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    priceMonthly: { type: DataTypes.FLOAT, defaultValue: 0 }
});

const Subscription = sequelize.define('Subscription', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    status: { type: DataTypes.STRING, defaultValue: 'active' }
});

User.hasMany(Subscription);
Subscription.belongsTo(User);
VpnService.hasMany(Subscription);
Subscription.belongsTo(VpnService);

async function initDatabase() {
    try {
        await sequelize.authenticate();
        console.log('✅ SQLite подключена');
        
        await sequelize.sync({ force: true });
        console.log('✅ Таблицы созданы');
        
        const count = await VpnService.count();
        if (count === 0) {
            await VpnService.bulkCreate([
                { name: 'ExpressVPN', description: 'Быстрый VPN', priceMonthly: 12.95 },
                { name: 'NordVPN', description: 'Безопасный VPN', priceMonthly: 11.95 },
                { name: 'CyberGhost', description: 'Простой VPN', priceMonthly: 10.95 }
            ]);
            console.log('✅ 3 сервиса добавлены');
        }
        
        const userCount = await User.count();
        if (userCount === 0) {
            const hash = await bcrypt.hash('123456', 10);
            await User.create({ username: 'test', email: 'test@test.com', password: hash });
            console.log('✅ Пользователь test@test.com / 123456');
        }
        
        console.log('✅ База готова');
        return true;
    } catch (error) {
        console.error('❌ Ошибка:', error);
        return false;
    }
}

module.exports = { sequelize, User, VpnService, Subscription, initDatabase };