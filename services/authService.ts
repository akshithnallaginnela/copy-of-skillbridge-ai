import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth Service
export const authService = {
    // Signup
    signup: async (name: string, email: string, password: string, role: 'WORKER' | 'CUSTOMER') => {
        try {
            const response = await api.post('/auth/signup', {
                name,
                email,
                password,
                role
            });

            if (response.data.success && response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error: any) {
            throw error.response?.data || { success: false, message: 'Signup failed' };
        }
    },

    // Login
    login: async (email: string, password: string) => {
        try {
            const response = await api.post('/auth/login', {
                email,
                password
            });

            if (response.data.success && response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error: any) {
            throw error.response?.data || { success: false, message: 'Login failed' };
        }
    },

    // Get current user
    getCurrentUser: async () => {
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { success: false, message: 'Failed to get user' };
        }
    },

    // Update profile
    updateProfile: async (data: any) => {
        try {
            const response = await api.put('/auth/profile', data);
            if (response.data.success && response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { success: false, message: 'Profile update failed' };
        }
    },

    // Logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    // Get stored user
    getStoredUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
};

// Gig Service
export const gigService = {
    // Get all gigs for current user
    getMyGigs: async () => {
        try {
            const response = await api.get('/gigs');
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { success: false, message: 'Failed to get gigs' };
        }
    },

    // Create a new gig
    createGig: async (gigData: any) => {
        try {
            const response = await api.post('/gigs', gigData);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { success: false, message: 'Failed to create gig' };
        }
    },

    // Update a gig
    updateGig: async (id: string, gigData: any) => {
        try {
            const response = await api.put(`/gigs/${id}`, gigData);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { success: false, message: 'Failed to update gig' };
        }
    },

    // Delete a gig
    deleteGig: async (id: string) => {
        try {
            const response = await api.delete(`/gigs/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { success: false, message: 'Failed to delete gig' };
        }
    }
};

export default api;
