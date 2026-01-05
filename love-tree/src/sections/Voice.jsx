import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Paper, Button, Box, CircularProgress } from '@mui/material';
import useRecorder from '../hooks/useRecorder';
import { generateMascotFromAudio, getLatestMascot } from '../api/ai';
import luckImg from '../assets/lucky.jpg';
import FloatingBubble from '../components/FloatingBubble';
import HotMascotSlider from "../components/HotMascotSlider";

export default function Voice() {
  const { recording, seconds, start, stop } = useRecorder();
  const [generating, setGenerating] = useState(false);
  const [mascot, setMascot] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  // ✅ 【新增】组件加载时获取最新吉祥物
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const latest = await getLatestMascot();
        if (latest?.success && latest.mascot) {
          setMascot(latest.mascot);
        }
      } catch (err) {
        console.warn('未能获取最新吉祥物:', err.message);
      }
    };
    fetchLatest();
  }, []);

  const triggerNewMascotEvent = (newMascot) => {
    const event = new CustomEvent('newMascotGenerated', { detail: newMascot });
    window.dispatchEvent(event);
    console.log('新吉祥物已生成并触发事件:', newMascot);
  };

  async function handleStart() {
    try {
      await start();
    } catch (err) {
      alert('无法访问麦克风：' + err.message);
    }
  }

  async function handleStop() {
    const blob = await stop();
    if (blob) {
      setAudioUrl(URL.createObjectURL(blob));
      setGenerating(true);
      try {
        const res = await generateMascotFromAudio(blob);
        if (res?.success) {
          setMascot(res.mascot);
          triggerNewMascotEvent(res.mascot);
        } else {
          alert('生成失败：' + (res?.error || '未知错误'));
        }
      } catch (err) {
        console.error('吉祥物生成失败:', err);
        alert('生成过程中出现错误，请重试');
      } finally {
        setGenerating(false);
      }
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2, mt: -4 }}>
      <Paper
        className="card"
        sx={{
          p: 4,
          borderRadius: '1.2rem',
          border: '4px solid',
          borderColor: 'transparent', // ✅ 暖橙色边框（amber-600）
          background: 'linear-gradient(to bottom right, rgba(255,255,255,0.85), rgba(251, 191, 36, 0.1))', // 微调为暖黄底
          boxShadow: '0 10px 30px rgba(245, 158, 11, 0.2)', // 投影也带暖色
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4}>
            {/* 左侧：录音区 */}
            <Grid size={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                录制声音
              </Typography>

              <Box sx={{ mt: 2, mb: 3 }}>
                <Button
                  onClick={recording ? handleStop : handleStart}
                  sx={{
                    width: 98,
                    height: 98,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease',
                    ...(recording
                      ? {
                          background: 'linear-gradient(to bottom right, #e53e3e, #c53030)',
                          '&:hover': { background: 'linear-gradient(to bottom right, #dd6b20, #c53030)' },
                        }
                      : {
                          background: 'linear-gradient(to bottom right, #f59e0b, #ea580c)', // 按钮也用暖色
                          '&:hover': { transform: 'scale(1.05)' },
                        }),
                  }}
                >
                  <i
                    className={`fas fa-microphone${recording ? '-slash' : ''}`}
                    style={{ fontSize: 32 }}
                  />
                </Button>
              </Box>

              <Typography variant="body2" color="text.secondary">
                录制时长：{String(Math.floor(seconds / 60)).padStart(2, '0')}:
                {String(seconds % 60).padStart(2, '0')}
              </Typography>
            </Grid>

            {/* 右侧：吉祥物展示区 */}
            <Grid size={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 5 }}>
                吉祥物
              </Typography>

              {generating ? (
                <Box sx={{ mt: 5 }}>
                  <CircularProgress size={60} />
                  <Typography sx={{ mt: 2, color: 'text.secondary' }}>正在生成你的吉祥物…</Typography>
                </Box>
              ) : mascot && mascot.imageUrl ? (
                <>
                  <Box
                    component="img"
                    src={mascot.imageUrl}
                    alt="generated mascot"
                    sx={{
                      width: "100%",
                      maxWidth: 260,
                      height: "auto",
                      objectFit: "cover",
                      display: "block",
                      mx: "auto",
                      borderRadius: '1.2rem',
                      border: '4px solid white',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                      animation: 'float 3s ease-in-out infinite',
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontWeight: 'medium' }}>
                    { "你的语音已生成专属吉祥物"}
                  </Typography>
                </>
              ) : (
                <>
                  <Box
                    component="img"
                    src={luckImg}
                    alt="placeholder"
                    sx={{
                      width: "100%",
                      maxWidth: 240,
                      height: "auto",
                      objectFit: "cover",
                      display: "block",
                      mx: "auto",
                      borderRadius: '1.2rem',
                      opacity: 1,
                    }}
                  />
                  <Typography color="text.secondary" sx={{ mt: 2 }}>
                    录制并生成专属吉祥物
                  </Typography>
                </>
              )}
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}