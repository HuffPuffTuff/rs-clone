import React from 'react'

export enum themes {
  dark = 'dark',
  light = 'light',
}

export interface themeToggler {
  theme: themes,
  setTheme: (theme: themes) => void;
}

export const ThemeContext = React.createContext({} as themeToggler);
