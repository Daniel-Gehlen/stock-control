import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<string>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'claro';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);

    // Aplicar tema ao documento
    if (theme === 'escuro') {
      document.documentElement.setAttribute('data-theme', 'escuro');
      document.body.classList.add('dark-theme');
    } else if (theme === 'claro') {
      document.documentElement.setAttribute('data-theme', 'claro');
      document.body.classList.remove('dark-theme');
    } else if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'escuro');
        document.body.classList.add('dark-theme');
      } else {
        document.documentElement.setAttribute('data-theme', 'claro');
        document.body.classList.remove('dark-theme');
      }
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
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
