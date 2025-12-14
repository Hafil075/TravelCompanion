import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Optionally check if token is valid on mount by calling a /me endpoint if it exists
        // For now, we assume if token exists, we are logged in. 
        // Ideally, we would decode the JWT to check expiry or make a request to the backend.

        // Simulating user restore from simply having the token.
        // In a real app, you might want to fetch the user profile here.
        const storedUser = localStorage.getItem('user');
        if (token) {
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    // Invalid user data
                }
            } else {
                // Fallback or just set a dummy user if backend doesn't return user obj on login
                setUser({ username: 'User' });
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await api.post('/api/auth/login', { username, password });
            const { token } = response.data;

            setToken(token);
            localStorage.setItem('token', token);

            // Since backend only returns token, we set the user manually based on input or decode if it was a real JWT with claims
            const userData = { username };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));

            toast.success('Welcome back!');
            return true;
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.response?.data?.message || 'Invalid credentials');
            return false;
        }
    };

    const register = async (username, password) => {
        try {
            await api.post('/api/auth/register', { username, password });
            toast.success('Registration successful! Please login.');
            return true;
        } catch (error) {
            console.error('Registration error:', error);
            toast.error(error.response?.data?.message || 'Registration failed');
            return false;
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success('Logged out successfully');
    };

    const value = {
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
