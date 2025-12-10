// src/pages/LetterApp.jsx 
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import {
  Typography,
  Box,
} from "@mui/material";

import EnvelopeDisplay from '../components/EnvelopeDisplay';
import LetterModal from '../components/LetterModal';
import LetterWriter from '../components/LetterWriter';
import SwipeHintButton from "../components/SwipeHintButton"; 

const API_URL = "https://buz-love-tree.onrender.com/api/letters";

const LetterApp = ({ onSwipeRight }) => {
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
        width: '100%',
        position: 'relative',
        background: 'transparent',
        px: { xs: 2, md: 4 },
        py: { xs: 2, md: 4 },
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',   // ✅ 允许页面整体向下滚动
        boxSizing: 'border-box',
        mt:7
      }}
    >
      {/* 背景动效 */}
      <Box sx={{ 
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        height: '100%',      // ✅ 避免背景层撑开页面导致无法滚动
      }}>
        <motion.div
          style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '16rem',
            height: '16rem',
            background: 'rgba(79, 218, 160, 0.15)',
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
            background: 'rgba(56, 189, 248, 0.12)',
            borderRadius: '9999px',
            filter: 'blur(3rem)',
          }}
          animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 20 }}
        />
      </Box>

      {/* 标题 */}
      <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 20, mt:5 }}>
        <Typography
              variant="h4"
              align="center"
              sx={{
                fontSize: { xs: '2.25rem', md: '3rem' }, // text-4xl / text-5xl
                fontWeight: 'bold',
                mb: 2,
                background: 'linear-gradient(to right, #1e40af, #1d4d4b)', // primary, accent, secondary
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              时光信笺
            </Typography>
      <Typography align="center" color="text.secondary" sx={{ mb: 3 }}>
        写下你的心情，封存美好回忆，让每一封信都成为时光的见证
      </Typography>
      </Box>

      {/* 主内容区 */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          width: '100%',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* 展柜 */}
        <Box
          sx={{
            flex: { xs: '0 0 100%', md: '0 0 620px' },
            maxWidth: { xs: '100%', md: '620px' },
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '12px',
            border: '2px solid rgba(16, 185, 129, 0.2)',
            p: 1,
            boxShadow: '0 8px 18px rgba(2,6,23,0.06)',
          }}
        >
          <Box sx={{ maxHeight: '600px', overflowY: 'auto', pr: 1 }}>
            <EnvelopeDisplay 
              letters={letters} 
              onSelectLetter={setSelectedLetter} 
            />
          </Box>
        </Box>

        {/* 写信 */}
        <Box
          sx={{
            flex: 1,
            minWidth: { xs: '100%', md: '400px' },
            display: 'flex',
            flexDirection: 'column',
            minHeight: { xs: '250px', md: '300px' },
          }}
        >
          <LetterWriter onSealLetter={handleSealLetter} />
        </Box>
      </Box>

      <LetterModal letter={selectedLetter} onClose={() => setSelectedLetter(null)} />
      <Toaster position="top-right" />

      {onSwipeRight && <SwipeHintButton onClick={onSwipeRight} />} 
    </Box>
  );
};

export default LetterApp;
