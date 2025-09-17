import { DefaultTheme } from 'react-native-paper';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 28,
  },
  h5: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 24,
  },
  h6: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
  body1: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
}; theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2D5A27',        // Forest Green
    secondary: '#4A9B8E',      // Ocean Teal  
    accent: '#E67E22',         // Sunset Orange
    background: '#FFFFFF',     // Pure White
    surface: '#F8F9FA',        // Light surface
    text: '#34495E',          // Neutral Charcoal
    textSecondary: '#7F8C8D',  // Secondary text
    onPrimary: '#FFFFFF',      // Text on primary
    onSecondary: '#FFFFFF',    // Text on secondary
    onSurface: '#34495E',      // Text on surface
    onBackground: '#34495E',   // Text on background
    disabled: '#BDC3C7',       // Disabled elements
    placeholder: '#95A5A6',    // Placeholder text
    border: '#E8E8E8',        // Border color
    notification: '#E74C3C',   // Notification/error
    success: '#27AE60',        // Success color
    warning: '#F39C12',        // Warning color
    sage: '#A8C686',          // Light Sage
  },
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100',
    },
  },
  roundness: 8,
};

export const darkTheme = {
  ...theme,
  dark: true,
  colors: {
    ...theme.colors,
    primary: '#2D5A27',
    secondary: '#4A9B8E',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B3B3B3',
    onSurface: '#FFFFFF',
    onBackground: '#FFFFFF',
    border: '#333333',
  },
};

export const 