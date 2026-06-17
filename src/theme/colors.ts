export const colors = {
  zinc: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    950: '#09090b',
  },
  blue: {
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
  },
  emerald: {
    400: '#34d399',
    500: '#10b981',
  },
  amber: {
    400: '#fbbf24',
    500: '#f59e0b',
  },
  orange: {
    400: '#fb923c',
    500: '#f97316',
  },
  rose: {
    400: '#fb7185',
    500: '#f43f5e',
  },
};

export const theme = {
  background: colors.zinc[950],
  text: {
    primary: '#ffffff',
    secondary: colors.zinc[400],
    muted: colors.zinc[500],
  },
  border: colors.zinc[800],
  card: {
    bg: colors.zinc[900],
    border: colors.zinc[800],
  },
  code: {
    bg: '#0d1117',
    header: '#161b22',
  },
  accent: colors.blue[500],
};
