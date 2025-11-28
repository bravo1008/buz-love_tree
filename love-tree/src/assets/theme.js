// FILE: src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0a2463',
    },
    secondary: {
      main: '#3e92cc',
    },
    error: {
      main: '#d8315b',
    },
    background: {
      default: '#20028c',
      paper: 'rgba(255,255,255,0.04)',
    },
    text: {
      primary: '#fffaff',
      secondary: 'rgba(255,255,255,0.7)',
    },
  },
  typography: {
    fontFamily: "'Noto Sans SC', Arial, sans-serif",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(8px)',
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
