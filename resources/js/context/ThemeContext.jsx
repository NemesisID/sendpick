import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(undefined);

const THEME_STORAGE_KEY = 'dashboard-theme-preference';

const LIGHT_THEME = 'light';

function applyLightTheme() {
    if (typeof document === 'undefined') {
        return;
    }

    const root = document.documentElement;
    const body = document.body;

    root.dataset.theme = LIGHT_THEME;
    root.classList.remove('dark');

    if (body) {
        body.dataset.theme = LIGHT_THEME;
        body.style.transition = body.style.transition || 'background-color 0.3s ease, color 0.3s ease';
        body.style.backgroundColor = '#ffffff';
        body.style.color = '#0f172a';
    }
}

export function ThemeProvider({ children }) {
    const [theme, setThemeState] = useState(LIGHT_THEME);

    useEffect(() => {
        setThemeState(LIGHT_THEME);
        applyLightTheme();
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        window.localStorage.setItem(THEME_STORAGE_KEY, LIGHT_THEME);
    }, []);

    const setTheme = useCallback(() => {
        setThemeState(LIGHT_THEME);
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(THEME_STORAGE_KEY, LIGHT_THEME);
        }
        applyLightTheme();
    }, []);

    const value = useMemo(
        () => ({
            theme,
            resolvedTheme: LIGHT_THEME,
            setTheme,
        }),
        [theme, setTheme],
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
}
