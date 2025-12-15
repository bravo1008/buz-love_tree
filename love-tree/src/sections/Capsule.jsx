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

// 👇 引入 deviceId 工具函数
import { getDeviceId } from '../utils/deviceId';

const API_URL = "https://buz-love-tree.onrender.com/api/letters";

const LetterApp = ({ onSwipeRight }) => {
  const [letters, setLetters] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);

  // 👇 获取当前设备 ID（每次请求都调用，确保存在）
  const deviceId = getDeviceId();

  useEffect(() => {
    // 👇 带上 x-device-id 请求头
    fetch(API_URL, {
      headers: {
        "x-device-id": deviceId,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("请求失败");
        return res.json();
      })
      .then((data) => {
        setLetters(Array.isArray(data.letters) ? data.letters : []);
      })
      .catch((err) => {
        console.error("获取信件失败:", err);
        toast.error("无法加载你的信件");
      });
  }, [deviceId]); // 👈 依赖 deviceId，虽然它不变，但语义清晰

  const handleSealLetter = async (newLetter) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-device-id": deviceId, // 👈 关键：绑定设备 ID
        },
        body: JSON.stringify(newLetter),
      });

      const result = await res.json();

      if (res.ok && result.letter) {
        setLetters((prev) => [result.letter, ...prev]);
        toast.success("信件已成功上传并存入展柜");
      } else {
        toast.error(result.message || "上传失败");
      }
    } catch (err) {
      console.error("上传信件出错:", err);
      toast.error("网络错误，请重试");
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
        overflowY: 'auto',
        boxSizing: 'border-box',
        mt:7
      }}
    >
      {/* 背景动效 */}
      <Box sx={{ 
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        height: '100%',
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