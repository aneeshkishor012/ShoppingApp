'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ConfigProvider, theme } from 'antd';
import themeConfig from '../theme/themeConfig';

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
    currentTheme: ThemeType;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentTheme, setCurrentTheme] = useState<ThemeType>('light');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem('theme') as ThemeType;
        if (savedTheme) {
            setCurrentTheme(savedTheme);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setCurrentTheme('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setCurrentTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    // Removed blocking check for SSR
    // if (!mounted) {
    //     return <>{children}</>;
    // }

    // Use default 'light' algorithm during SSR to prevent mismatch errors or undefined contexts
    const algorithm = currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm;

    return (
        <ThemeContext.Provider value={{ currentTheme, toggleTheme }}>
            <ConfigProvider
                theme={{
                    ...themeConfig,
                    algorithm,
                }}
            >
                {children}
            </ConfigProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
