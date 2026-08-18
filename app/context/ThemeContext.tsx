'use client';

import { createContext, useContext, useState, useEffect } from 'react';

export interface ThemeColors {
  background: string;
  cardBackground: string;
  textPrimary: string;
  textSecondary: string;
  borderColor: string;
  purple: string;
  yellow: string;
  green: string;
  red: string;
  blue: string;
  pink: string;
  indigo: string;
}

const LIGHT_COLORS: ThemeColors = {
  background: '#FFFFFF',
  cardBackground: '#F5F5F7',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  borderColor: '#E5E7EB',
  purple: '#8B5CF6',
  yellow: '#FFC93C',
  green: '#34D399',
  red: '#F87171',
  blue: '#60A5FA',
  pink: '#EC4899',
  indigo: '#A78BFA',
};

const DARK_COLORS: ThemeColors = {
  background: '#0E1013',
  cardBackground: '#16181D',
  textPrimary: '#E8EAED',
  textSecondary: '#9AA1AA',
  borderColor: '#23262C',
  purple: '#8B5CF6',
  yellow: '#FFC93C',
  green: '#34D399',
  red: '#F87171',
  blue: '#60A5FA',
  pink: '#EC4899',
  indigo: '#A78BFA',
};

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme');
    if (saved) {
      setIsDark(saved === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(prev => {
      const newValue = !prev;
      localStorage.setItem('theme', newValue ? 'dark' : 'light');
      return newValue;
    });
  };

  if (!mounted) {
    return <>{children}</>;
  }

  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      isDark: true,
      toggleTheme: () => {},
      colors: DARK_COLORS,
    };
  }
  return context;
}
