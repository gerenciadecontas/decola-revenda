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
  background: '#F8F6F1',
  cardBackground: '#FFFFFF',
  textPrimary: '#1A1A1A',
  textSecondary: '#888888',
  borderColor: '#E5DCD2',
  purple: '#7C5CF0',
  yellow: '#F5A623',
  green: '#52C77C',
  red: '#E85D5D',
  blue: '#5B7FBD',
  pink: '#E74299',
  indigo: '#7B6BB0',
};

const DARK_COLORS: ThemeColors = {
  background: '#1C1E23',
  cardBackground: '#212329',
  textPrimary: '#ECEEF3',
  textSecondary: '#A4A8B3',
  borderColor: '#2D3038',
  purple: '#9686C9',
  yellow: '#E6B23E',
  green: '#34D399',
  red: '#E08585',
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
      if (saved === 'light') {
        document.body.classList.add('light');
      }
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
    }
  }, [isDark]);

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
