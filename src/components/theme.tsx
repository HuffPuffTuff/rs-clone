import React, { ReactNode } from 'react'
import { ThemeContext, themes, themeToggler } from '../context/theme-context';
import ReactDOM from 'react-dom/client';

interface Props {
  children?: ReactNode
}

const getTheme = () => {
  const theme = `${window?.localStorage?.getItem('theme')}`
  if (Object.values(themes).includes(theme as themes)) return theme;

  const userMedia = window.matchMedia('(prefers-color-scheme: light)');
  if (userMedia.matches) return themes.light;

  return themes.dark;
}

const ThemeProvider = ({ children }: Props ) => {
  const [ theme, setTheme ] = React.useState(getTheme)

  React.useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [ theme ])

  return (
    <ThemeContext.Provider value={{ theme, setTheme } as themeToggler}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider;
