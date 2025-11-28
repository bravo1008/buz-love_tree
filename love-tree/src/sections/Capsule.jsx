// src/pages/LetterApp.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import Box from '@mui/material/Box';

import EnvelopeDisplay from '../components/EnvelopeDisplay';
import LetterModal from '../components/LetterModal';
import LetterWriter from '../components/LetterWriter';

const API_URL = "http://localhost:5000/api/letters";

const LetterApp = () => {
  const [letters, setLetters] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setLetters(Array.isArray(data.letters) ? data.letters : []))
      .catch(() => toast.error("无法连接后端"));
  }, []);

  const handleSealLetter = async (newLetter) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLetter),
      });

      const saved = await res.json();

      if (res.ok) {
        setLetters((prev) => [saved.letter, ...prev]);
        toast.success("信件已成功上传并存入展柜");
      } else {
        toast.error("上传失败");
      }
    } catch (err) {
      toast.error("后端连接失败");
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        background: 'transparent',
        width: '100%',
        px: { xs: 2, md: 4 },
        py: { xs: 2, md: 6 },
      }}
    >
      {/* 背景装饰 */}
      <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <motion.div
          style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '16rem',
            height: '16rem',
            background: 'rgba(79, 218, 160, 0.15)', // emerald-400-ish
            borderRadius: '9999px',
            filter: 'blur(3rem)',
          }}
          animate={{ x: [0, 20, 0], y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 15 }}
        />
        <motion.div
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '10%',
            width: '20rem',
            height: '20rem',
            background: 'rgba(56, 189, 248, 0.12)', // cyan-400-ish
            borderRadius: '9999px',
            filter: 'blur(3rem)',
          }}
          animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 20 }}
        />
      </Box>

      {/* 标题 —— 使用参考代码的样式 */}
      <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 10, mb: 4 }}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            margin: 0,
            background: 'linear-gradient(to right, #0d9488, #0ea5e9, #0284c7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          <i className="fa-solid fa-envelope-open-text" style={{ marginRight: 8 }}></i>
          时光信笺
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12 }}
          style={{ color: '#0f766e', marginTop: '0.5rem' }}
        >
          写下你的心情，封存美好回忆，让每一封信都成为时光的见证
        </motion.p>
      </Box>

      {/* 布局：左右两列 */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          alignItems: 'stretch',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        {/* 展柜（左侧） */}
        <Box
          sx={{
            flex: { xs: '0 0 100%', md: '0 0 620px' },
            maxWidth: { xs: '100%', md: '620px' },
            width: { xs: '100%', md: '620px' },
            boxSizing: 'border-box',
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '12px',
            border: '2px solid rgba(16, 185, 129, 0.2)', // emerald-500/20
            boxShadow: '0 8px 18px rgba(2,6,23,0.06)',
            height: { xs: 'auto', md: 'calc(100vh - 240px)' },
            overflow: 'hidden',
            p: 1,
          }}
        >
          <Box sx={{ height: '100%', overflowY: 'auto', pr: 1 }}>
            <EnvelopeDisplay letters={letters} onSelectLetter={setSelectedLetter} />
          </Box>
        </Box>

        {/* 写信区域（右侧） */}
        <Box
          sx={{
            flex: '1 1 0%',
            minWidth: { xs: '100%', md: '400px' },
            maxWidth: { xs: '100%', md: 'calc(100% - 540px)' },
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            height: { xs: '250px', md: 'calc(100vh - 240px)' },
            px: { xs: 1.5, md: 2 },
          }}
        >
          <Box sx={{ width: '100%', flex: 1 }}>
            <LetterWriter onSealLetter={handleSealLetter} />
          </Box>
        </Box>
      </Box>

      <LetterModal letter={selectedLetter} onClose={() => setSelectedLetter(null)} />
      <Toaster position="top-right" />
    </Box>
  );
};

export default LetterApp;