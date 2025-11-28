// FILE: src/components/Footer.jsx
import React from 'react';
import { Box, Container, Typography, IconButton } from '@mui/material';
import WechatIcon from '@mui/icons-material/Chat';
import MailIcon from '@mui/icons-material/Email';
import { FaTree } from 'react-icons/fa';


export default function Footer(){
  return (
    <Box component="footer" sx={{ background: '#000', py: 6, mt: 2 }}>
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap:2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap:1 }}>
            <FaTree style={{ color: '#008227', fontSize: '24px' }} /> 
            <Typography variant="h6" color="#fff">生命韧性</Typography>
          </Box>
          <Typography variant="body2" color="#fff">以数字技术构建可感知的希望载体</Typography>
        </Box>
      </Container>
      <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.04)', mt:0, pt:3 }}>
        <Container maxWidth="lg" sx={{ display:'flex', justifyContent:'space-between' }}>
          <Typography variant="caption" color="#fff">© 2025 生命韧性. 保留所有权利.</Typography>
          <Box sx={{ display:'flex', gap:2 }}>
            <Typography variant="caption" color="#fff">隐私政策</Typography>
            <Typography variant="caption" color="#fff">使用条款</Typography>
            <Typography variant="caption" color="#fff">联系我们</Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
