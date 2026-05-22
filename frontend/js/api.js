const API_URL = 'http://localhost:5000/api';

class VPNHubAPI {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Request failed');
        }

        return response.json();
    }

    // Аутентификация
    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async login(credentials) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        
        if (data.token) {
            this.token = data.token;
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        return data;
    }

    logout() {
        this.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    // VPN Сервисы
    async getServices() {
        return this.request('/services');
    }

    async getService(id) {
        return this.request(`/services/${id}`);
    }

    async subscribeToService(serviceId, plan) {
        return this.request('/services/subscribe', {
            method: 'POST',
            body: JSON.stringify({ serviceId, plan })
        });
    }

    // Пользователь
    async getProfile() {
        return this.request('/users/profile');
    }

    async getSubscriptions() {
        return this.request('/users/subscriptions');
    }

    // Статистика
    async getStats() {
        const response = await fetch('http://localhost:5000/api/stats');
        return response.json();
    }
}

const api = new VPNHubAPI();