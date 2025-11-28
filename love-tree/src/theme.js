// FILE: src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3e92cc', // ← 改回 HEX（MUI 安全）
    },
    secondary: {
      main: '#64b464', // 自然绿（接近 #4caf50 但更柔和）
    },
    error: {
      main: '#d8315b',
    },
    background: {
      default: 'transparent',
      paper: 'rgba(255, 255, 255, 0.4)',
    },
    text: {
      primary: '#2a2a2a',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
  },
  typography: {
    fontFamily: "'Noto Sans SC', Arial, sans-serif",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(12px)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.1)',
        },
      },
    },
  },
});

export default theme;