// FILE: src/components/Navbar.jsx
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Box, Button, IconButton, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as ScrollLink } from 'react-scroll';
import { FaTree } from 'react-icons/fa';

export default function Navbar() {
  const isMobile = useMediaQuery('(max-width:768px)');

  const navs = [
    { id: 'home', label: '首页' },
    { id: 'tree', label: '生命树' },
    { id: 'waterfall', label: '瀑布数据流' },
    { id: 'voice', label: '语音互动' },
    { id: 'capsule', label: '时间胶囊' },
    { id: 'relay', label: '生命接力' },
    { id: 'map', label: '微光地图' },
  ];

  return (
    <AppBar position="fixed" sx={{ background: 'rgba(2,6,23,0.6)', backdropFilter: 'blur(6px)' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, }}>
          <FaTree style={{ color: '#008227', fontSize: '24px' }} /> 
          <Box component="span" sx={{ fontWeight: 700 }}>生命韧性</Box>
        </Box>

        {!isMobile ? (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {navs.map(n => (
              <ScrollLink key={n.id} to={n.id} smooth offset={-80} duration={400}>
                <Button variant="text" sx={{ color: 'rgba(255,255,255,0.9)' }}>{n.label}</Button>
              </ScrollLink>
            ))}
          </Box>
        ) : (
          <IconButton color="inherit"><MenuIcon /></IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
}
