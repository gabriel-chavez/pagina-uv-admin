import { FC, useState, createContext, useEffect } from 'react';
// import { ThemeProvider } from '@mui/material';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';

import { themeCreator } from './base';


export const ThemeContext = createContext((_themeName: string): void => {});

const ThemeProviderWrapper: FC = (props) => {
  const [themeName, _setThemeName] = useState('PureLightTheme');

  useEffect(() => {
    const curThemeName =
      window.localStorage.getItem('appTheme') || 'PureLightTheme';
    _setThemeName(curThemeName);
  }, []);

  const theme = themeCreator(themeName);
  const setThemeName = (themeName: string): void => {
    window.localStorage.setItem('appTheme', themeName);
    _setThemeName(themeName);
  };

  return (
    <StyledEngineProvider  injectFirst>
      <ThemeContext.Provider value={setThemeName}>
        <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
      </ThemeContext.Provider>
    </StyledEngineProvider >
  );
};

export default ThemeProviderWrapper;
