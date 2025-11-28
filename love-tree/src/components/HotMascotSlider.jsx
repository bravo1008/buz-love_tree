// FILE: src/components/HotMascotSlider.jsx
import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, Paper, CircularProgress } from "@mui/material";
import { FaHeart, FaMedal } from "react-icons/fa";
import AnimatedBorder from "./AnimatedBorder";

// 奖牌颜色映射
const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32']; // gold, silver, bronze

export default function HotMascotSlider() {
  const [mascots, setMascots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMascots = async () => {
    try {
      const res = await fetch("/api/mascot");
      const data = await res.json();
      if (data.success) {
        setMascots(data.mascots);
      } else {
        setError("加载失败");
      }
    } catch (err) {
      console.error("获取吉祥物失败:", err);
      setError("网络错误");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      const res = await fetch(`/api/mascot/${id}/like`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        setMascots((prev) =>
          prev.map((m) =>
            m._id === id ? { ...m, likes: data.likes } : m
          ).sort((a, b) => b.likes - a.likes)
        );
      }
    } catch (err) {
      console.error("点赞失败:", err);
      alert("点赞失败，请重试");
    }
  };

  useEffect(() => {
    fetchMascots();
  }, []);

  if (loading) {
    return (
      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4, textAlign: "center", color: "error.main" }}>
        {error}
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      {/* 排行榜标题 - 匹配 ShadCN */}
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          fontWeight: "bold",
          textAlign: "center",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          color: '#3e92cc', // primary
        }}
      >
        <FaMedal style={{ color: '#FFD700' }} />
        热度排行榜
        <FaMedal style={{ color: '#FFD700' }} />
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '1.2rem',
          border: '4px solid',
          borderColor: 'secondary.main', // #64b464
          opacity: 1,
          background: 'linear-gradient(to bottom right, rgba(255,255,255,0.9), rgba(100, 180, 100, 0.1))',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <AnimatedBorder />
        {mascots.length === 0 ? (
          <Box sx={{ py: 4, textAlign: "center", color: "#999" }}>
            暂无吉祥物
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              overflowX: "auto",
              gap: 2,
              py: 1,
              px: 1,
              scrollBehavior: "smooth",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {mascots.map((m, index) => (
              <Paper
                key={m._id}
                sx={{
                  minWidth: 150,
                  maxWidth: 150,
                  borderRadius: '1rem',
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(8px)',
                  p: 2,
                  textAlign: "center",
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(62, 146, 204, 0.2)', // primary border
                  position: 'relative',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                  },
                }}
              >
                {/* 奖牌图标（前3名） */}
                {index < 3 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -10,
                      right: -10,
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      bgcolor: medalColors[index],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: '0.7rem',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                    }}
                  >
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </Box>
                )}

                <Box
                  component="img"
                  src={m.imageUrl}
                  alt="mascot"
                  sx={{
                    width: "100%",
                    height: 100,
                    borderRadius: '0.8rem',
                    objectFit: "cover",
                    mb: 1,
                    border: '2px solid white',
                  }}
                />

                <Typography
                  variant="subtitle2"
                  fontWeight="medium"
                  sx={{ mb: 1, color: 'text.primary' }}
                >
                  {m.name}
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleLike(m._id)}
                    sx={{
                      color: '#d8315b', // accent
                      '&:hover': { bgcolor: 'rgba(216, 49, 91, 0.1)' },
                    }}
                  >
                    <FaHeart />
                  </IconButton>
                  <Typography variant="body2" color="text.secondary">
                    {m.likes}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
}