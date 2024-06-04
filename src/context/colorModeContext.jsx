import React, { createContext, useState, useMemo } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { useEffect } from 'react';

const ColorModeContext = createContext({ toggleColorMode: () => { }});

const getDesignTokens = (mode) => ({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                // palette values for light mode
                primary: {
                    main: '#1976d2',
                },
                secondary: {
                    main: '#dc004e',
                },
            }
            : {
                // palette values for dark mode
                primary: {
                    main: '#90caf9',
                },
                secondary: {
                    main: '#f48fb1',
                },
                background: {
                    default: '#121212',
                    paper: '#121212',
                },
                text: {
                    primary: '#ffffff',
                    secondary: 'rgba(255, 255, 255, 0.7)',
                },
                
            }),
    },
    typography: {
        fontFamily: 'Work Sans, sans-serif',
    },
});

export const ColorModeProvider = ({ children }) => {
    const [mode, setMode] = useState('light');

    useEffect(() => {
        const savedMode = localStorage.getItem('themeMode') || 'light';
        setMode(savedMode);
    }, []);

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => {
                    const newMode = prevMode === 'light' ? 'dark' : 'light';
                    localStorage.setItem('themeMode', newMode);
                    return newMode;
                });
            },
        }),
        []
    );


    const theme = useMemo(() =>
        createTheme(getDesignTokens(mode))
        , [mode]);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

export default ColorModeContext;
