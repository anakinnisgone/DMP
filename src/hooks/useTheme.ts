import { useContext } from 'react';
import { ThemeContext, ThemeContextType } from '../context/ThemeContext';
import { getThemeColors, ThemeColors } from '../styles/themes';

interface UseThemeReturn extends ThemeContextType {
  colors: ThemeColors;
}

export function useTheme(): UseThemeReturn {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return {
    ...context,
    colors: getThemeColors(context.theme),
  };
}
