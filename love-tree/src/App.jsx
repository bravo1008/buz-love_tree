// FILE: src/App.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Tree from './sections/Tree';
import Voice from './sections/Voice';
import Capsule from './sections/Capsule';
import Relay from './sections/Relay';
import MapSection from './sections/Map';
import LetterDetailPage from './components/LetterDetailPage';
import { Box } from '@mui/material';
import SwipeHintButton from './components/SwipeHintButton';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  const homePages = [
    { id: 'tree', component: <Tree><Voice /></Tree> },
    { id: 'capsule', component: <Capsule /> },
    { id: 'relay', component: <Relay /> },
    { id: 'map', component: <MapSection /> },
  ];

  const totalPages = homePages.length;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  // ✅ 修正：不依赖 currentPageIndex，直接从 scrollLeft 计算下一页
  const scrollToNextPage = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const pageWidth = window.innerWidth;
    const currentScroll = container.scrollLeft;
    const currentPage = Math.floor(currentScroll / pageWidth); // 👈 floor!
    const nextPage = currentPage + 1;

    if (nextPage < totalPages) {
      container.scrollTo({
        left: nextPage * pageWidth,
        behavior: 'smooth',
      });
    }
  }, [totalPages]); // 不再依赖 currentPageIndex

  // ✅ 用 Math.floor 更新 currentPageIndex
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const pageWidth = window.innerWidth;
      const scrollLeft = container.scrollLeft;
      const index = Math.floor(scrollLeft / pageWidth); // 👈 关键：用 floor
      setCurrentPageIndex(Math.min(index, totalPages - 1));
    };

    handleScroll(); // 初始化
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [totalPages]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center day-night-bg">
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              border: '6px solid rgba(255,255,255,0.2)',
              borderTopColor: 'var(--accent)',
            }}
            className="spin"
          />
          <div style={{ marginTop: 12 }}>加载中，请稍候...</div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="w-screen day-night-bg">
        <Routes>
          <Route path="/letter/:id" element={<LetterDetailPage />} />

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
                }}
              >
                <Navbar />

                <Box
                  ref={scrollContainerRef}
                  sx={{
                    flex: 1,
                    display: 'flex',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    scrollSnapType: 'x mandatory',
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': { display: 'none' },
                  }}
                >
                  {homePages.map((page, index) => (
                    <Box
                      key={page.id}
                      sx={{
                        minWidth: '100vw',
                        scrollSnapAlign: 'start',
                        height: 'calc(100vh - 64px)',
                        overflowY: 'auto',
                        boxSizing: 'border-box',
                        position: 'relative',
                      }}
                    >
                      {page.component}
                    </Box>
                  ))}
                </Box>

                {/* ✅ 只要不是最后一页，就显示按钮 */}
                {currentPageIndex < totalPages - 1 && (
                  <SwipeHintButton onClick={scrollToNextPage} />
                )}
              </Box>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}