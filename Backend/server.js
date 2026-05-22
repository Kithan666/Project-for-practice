const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});
app.use(express.urlencoded({ extended: true }));

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Routes
const authRoutes = require('./routes/auth');
const vpnServiceRoutes = require('./routes/vpn-services');
const userRoutes = require('./routes/users');

app.use('/api/auth', authRoutes);
app.use('/api/services', vpnServiceRoutes);
app.use('/api/users', userRoutes);

// WebSocket для живых обновлений статуса VPN серверов
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('subscribe-server', (serverId) => {
    socket.join(`server-${serverId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// API endpoint для получения статистики
app.get('/api/stats', async (req, res) => {
  try {
    const User = require('./models/User');
    const VpnService = require('./models/VpnService');
    const Subscription = require('./models/Subscription');
    
    const stats = {
      totalUsers: await User.countDocuments(),
      activeServices: await VpnService.countDocuments({ status: 'active' }),
      totalSubscriptions: await Subscription.countDocuments({ status: 'active' }),
      activeConnections: Math.floor(Math.random() * 1000) // Заглушка
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});app.get("/", (req, res) => { res.json({ message: "VPN Hub API работает!", endpoints: ["/api/auth", "/api/services", "/api/users"] }); });
