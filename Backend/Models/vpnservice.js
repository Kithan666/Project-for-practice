const mongoose = require('mongoose');

const vpnServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: String,
  protocol: {
    type: String,
    enum: ['v2ray', 'shadowsocks', 'wireguard', 'openvpn', 'ikev2'],
    required: true
  },
  serverAddress: String,
  port: Number,
  encryption: String,
  configUrl: String,
  endpoints: [{
    country: String,
    city: String,
    serverUrl: String,
    latency: Number,
    isActive: Boolean
  }],
  pricing: {
    daily: Number,
    weekly: Number,
    monthly: Number,
    yearly: Number
  },
  features: [String],
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  totalUsers: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('VpnService', vpnServiceSchema);