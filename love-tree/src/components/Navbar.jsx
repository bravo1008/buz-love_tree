import React from 'react';
import { Box, Button, useMediaQuery, useTheme } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { FaHeart, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import {
  Typography
} from "@mui/material";

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  const navs = [
    { path: '/', label: '祈愿树', icon: <FaHeart /> },
    { path: '/capsule', label: '时光信笺', icon: <FaEnvelope /> },
    { path: '/map', label: '微光地图', icon: <FaMapMarkerAlt /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        px: 2,
        py: 3,
        background: '#fffaf5', // 浅米白背景
        position: 'relative',
        zIndex: 1000,
      }}
    >
      {/* 主标题 + 副标题：垂直排列 */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography
          variant="h6"
          align="center"
          sx={{
            fontSize: { xs: '2.25rem', md: '3rem' },
            fontWeight: 'bold',
            mb: 2,
            background: 'linear-gradient(to right, #1e40af, #1d4d4b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          心愿时光
        </Typography>
        <Typography
          align="center" color="text.secondary" sx={{ mb: 0 }}
        >
          用温暖连接，让思念看得见
        </Typography>
      </Box>

      {/* 导航按钮组 */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          p: 1,
          borderRadius: '24px',
          background: '#ffffff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          width: '100%',
          maxWidth: '600px',
          overflowX: 'auto',
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
        }}
      >
        {navs.map((item) => (
          <Button
            key={item.path}
            component={Link}
            to={item.path}
            startIcon={item.icon}
            variant={isActive(item.path) ? 'contained' : 'outlined'}
            sx={{
              borderRadius: '18px',
              px: 2,
              py: 1,
              minWidth: isMobile ? '90px' : '120px',
              textTransform: 'none',
              fontSize: isMobile ? '0.85rem' : '0.95rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              border: '1px solid #e0e0e0',
              color: '#444',
              backgroundColor: 'transparent',
              ...(isActive(item.path) && {
                backgroundColor: '#d32f2f',
                color: '#ffffff',
                borderColor: '#c62828',
                boxShadow: '0 2px 6px rgba(211, 47, 47, 0.3)',
              }),
              '&:hover': {
                backgroundColor: isActive(item.path) ? '#b71c1c' : '#f5f5f5',
                borderColor: '#d32f2f',
              },
              transition: 'all 0.2s ease',
            }}
          >
            {item.label}
          </Button>
        ))}
      </Box>
    </Box>
  );
}