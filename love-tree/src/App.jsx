import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Tree from './sections/Tree';
import Voice from './sections/Voice';
import Capsule from './sections/Capsule';
import Relay from './sections/Relay';
import MapSection from './sections/Map';
import LetterDetailPage from './components/LetterDetailPage';
import { Box } from '@mui/material';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center day-night-bg" style={{backgroundColor: '#fffaf5'}}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              border: '6px solid rgba(255,255,255,0.2)',
              borderTopColor: 'var(--accent)',
              backgroundColor: '#fffaf5', // 统一背景色
            }}
            className="spin"
          />
          <div style={{ marginTop: 12, color: '#2a2a2a' }}>加载中，请稍候...</div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="w-screen day-night-bg" style={{backgroundColor: '#fffaf5'}}>
        <Routes>
          {/* 详情页 */}
          <Route path="/letter/:id" element={<LetterDetailPage />} />

          {/* 主页内容：通过导航跳转 */}
          <Route
            path="/*"
            element={
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100vh',
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: '#fffaf5', // 统一背景色
                }}
              >
                <Navbar />

                {/* 主内容区 */}
                <Box
                  sx={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '2rem',
                    background: '#fffaf5', // 统一背景色
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)',
                    backgroundImage: 'linear-gradient(to bottom, #fffaf5, #f9f9f9)', // 渐变保持米色系
                  }}
                >
                  <Routes>
                    <Route path="/" element={<Tree><Voice /></Tree>} />
                    <Route path="/capsule" element={<Capsule />} />
                    <Route path="/relay" element={<Relay />} />
                    <Route path="/map" element={<MapSection />} />
                  </Routes>
                </Box>
              </Box>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}