// FILE: src/sections/Home.jsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link as ScrollLink } from 'react-scroll';

export default function Home() {
  return (
    <Box
      id="home"
      sx={{
        minHeight: '80vh',          // 高度占满整个屏幕
        display: 'flex',             // flex 布局
        flexDirection: 'column',     // 垂直排列
        justifyContent: 'center',    // 垂直居中
        alignItems: 'center',        // 水平居中
        textAlign: 'center',
        px: 2,// 示例背景，可替换动画
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" component="h1" sx={{ fontWeight: 700 }}>
          生命韧性
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
          以“生命韧性”与“群体治愈”为核心，通过数字技术构建可感知的希望载体
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <ScrollLink to="tree" smooth offset={-80}>
          <Button variant="contained" sx={{ backgroundColor: 'error.main' }}>
            探索生命树
          </Button>
        </ScrollLink>
        <ScrollLink to="voice" smooth offset={-80}>
          <Button variant="outlined" sx={{ borderColor: 'text.primary', color: 'text.primary' }}>
            开始互动
          </Button>
        </ScrollLink>
      </Box>
    </Box>
  );
}
