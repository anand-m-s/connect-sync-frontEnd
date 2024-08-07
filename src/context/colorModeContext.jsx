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
                selectedChat: {
                    main: '#e6eaeb', // Custom color for selectedChat in light mode
                },
                comments:{
                    main:'#E6EBEB'
                },
                home:{
                    main:'#BEE4DF',
                    text:'#000'
                }
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
                selectedChat: {
                    main: '#393939', // Custom color for selectedChat in dark mode
                },
                comments:{
                    main:'#2C3734'
                },
                home:{
                    main:'#365657',
                    text:'#000'
                }
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
