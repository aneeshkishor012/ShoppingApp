'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { App } from 'antd';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { message } = App.useApp();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check for logged in user
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user from local storage", e);
                localStorage.removeItem('user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                let errorMsg = 'Login failed';
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.error || errorMsg;
                } catch {
                    // Response likely HTML (500 error page)
                    errorMsg = `Server Error: ${response.status} ${response.statusText}`;
                }
                throw new Error(errorMsg);
            }

            const userData: User = await response.json();
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));

            message.success('Login successful!');

            if (userData.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/');
            }
        } catch (error: any) {
            message.error(error.message || 'Invalid credentials');
            throw error;
        }
    };

    const register = async (name: string, email: string, password: string) => {
        // For now, keeping mock register or can implement similarly if needed
        // Ideally should call an API endpoint
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                const userData: User = { id: Math.random().toString(), name, email, role: 'user' };
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                message.success('Registration successful!');
                router.push('/');
                resolve();
            }, 1000);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        message.info('Logged out');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
