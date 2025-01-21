const lightColors = {
  primary: '#65a30d',
  primaryDark: '#4d7c0f',
  primaryLight: '#86cb16',
  link: '#2f95dc',
  background: '#fff',
  border: '#e1e1e1',
  text: '#222831',
  textSecondary: '#393E46',
  textTertiary: '#666',
  error: '#ff4444',
  success: '#00c851',
  warning: '#ffbb33',
  divider: '#e1e1e1',
  info: '#33b5e5',
  buttonText: '#EEEEEE',
  buttonBackground: '#65a30d',
  inputBackground: '#f9f9f9',
  inputBorder: '#e1e1e1',
  inputText: '#222831',
  inputPlaceholder: '#999',
  socialButtonBorder: '#e1e1e1',
} as const;

const darkColors = {
  primary: '#86cb16',
  primaryDark: '#65a30d',
  primaryLight: '#4d7c0f',
  link: '#2f95dc',
  background: '#222831',
  border: '#393E46',
  text: '#EEEEEE',
  textSecondary: '#b3b3b3',
  textTertiary: '#737373',
  error: '#ff6b6b',
  success: '#00e676',
  warning: '#ffd54f',
  divider: '#393E46',
  info: '#33b5e5',
  buttonText: '#EEEEEE',
  buttonBackground: '#86cb16',
  inputBackground: '#393E46',
  inputBorder: '#393E46',
  inputText: '#EEEEEE',
  inputPlaceholder: '#737373',
  socialButtonBorder: '#393E46',
} as const;

export type ColorTheme = typeof lightColors;

export const Colors = {
  light: lightColors,
  dark: darkColors,
} as const;
