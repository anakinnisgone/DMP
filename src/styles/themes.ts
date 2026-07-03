export type Theme = 'light' | 'dark' | 'midnight';

export interface ThemeColors {
  background: string;
  surface: string;
  cards: string;
  border: string;
  borderLight: string;
  primary: string;
  primaryHover: string;
  primaryLight: string;
  accent: string;
  accentLight: string;
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  scrollbar: {
    track: string;
    thumb: string;
  };
}

export const themes: Record<Theme, ThemeColors> = {
  light: {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    cards: '#FFFFFF',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    primary: '#7C3AED',
    primaryHover: '#6D28D9',
    primaryLight: '#EDE9FE',
    accent: '#8B5CF6',
    accentLight: '#F3E8FF',
    text: {
      primary: '#000000',
      secondary: '#6B7280',
      tertiary: '#9CA3AF',
    },
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    scrollbar: {
      track: '#F3F4F6',
      thumb: '#D1D5DB',
    },
  },

  dark: {
    background: '#1A1A1A',
    surface: '#2A2A2A',
    cards: '#262626',
    border: '#3F3F3F',
    borderLight: '#4B4B4B',
    primary: '#7C3AED',
    primaryHover: '#8B5CF6',
    primaryLight: '#4C1D95',
    accent: '#A855F7',
    accentLight: '#6B21A8',
    text: {
      primary: '#FFFFFF',
      secondary: '#D4D4D8',
      tertiary: '#A1A1AA',
    },
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    scrollbar: {
      track: '#2A2A2A',
      thumb: '#404040',
    },
  },

  midnight: {
    background: '#0B0D12',
    surface: '#111827',
    cards: '#171A24',
    border: '#262B3A',
    borderLight: '#2D323F',
    primary: '#7C3AED',
    primaryHover: '#8B5CF6',
    primaryLight: '#5B21B6',
    accent: '#A855F7',
    accentLight: '#7C3AED',
    text: {
      primary: '#FFFFFF',
      secondary: '#A1A1AA',
      tertiary: '#71717A',
    },
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    scrollbar: {
      track: '#111827',
      thumb: '#262B3A',
    },
  },
};

export function getThemeColors(theme: Theme): ThemeColors {
  return themes[theme];
}
