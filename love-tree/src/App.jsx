// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // 👈 新增
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './sections/Home';
import Tree from './sections/Tree';
import Waterfall from './sections/Waterfall';
import Voice from './sections/Voice';
import Relay from './sections/Relay';
import Capsule from './sections/Capsule';
import MapSection from './sections/Map';
import LetterDetailPage from './components/LetterDetailPage'; // 👈 引入详情页
import { Box } from '@mui/material';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <Router> {/* 👈 用 Router 包裹整个应用 */}
      <div className="w-screen overflow-hidden day-night-bg">
        <div className={`loader ${loading ? '' : 'hidden'}`}>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                border: '6px solid rgba(255,255,255,0.2)',
                borderTopColor: 'var(--accent)'
              }}
              className="spin"
            />
            <div style={{ marginTop: 12 }}>加载中，请稍候...</div>
          </div>
        </div>

        {/* 只在非 /letter 页面显示 Navbar 和主内容 */}
        <Routes>
          {/* 信件详情页：独立全屏，无 Navbar/Footer */}
          <Route path="/letter/:id" element={<LetterDetailPage />} />

          {/* 默认首页（包含所有 sections） */}
          <Route
            path="/*"
            element={
              <>
                <Navbar />
                <Box component="main">
                  <section id="tree" className="section">
                    <Tree>
                      <Voice />
                    </Tree>
                  </section>

                  <section id="capsule" className="section">
                    <Capsule />
                  </section>

                  <section id="relay" className="section">
                    <Relay />
                  </section>

                  <section id="map" className="section">
                    <MapSection />
                  </section>
                </Box>
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}