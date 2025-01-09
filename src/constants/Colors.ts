const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};

export const Colors = {
  primary: '#65a30d',
  primaryDark: '#4d7c0f',
  primaryLight: '#86cb16',
  link: '#2f95dc',
  background: '#fff',
  border: '#e1e1e1',
  text: '#333',
  textSecondary: '#666',
  textTertiary: '#999',
  error: '#ff4444',
  success: '#00c851',
  warning: '#ffbb33',
  info: '#33b5e5',
} as const;
