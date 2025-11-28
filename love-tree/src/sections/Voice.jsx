import React, { useState } from 'react';
import { Container, Typography, Grid, Paper, Button, Box, CircularProgress } from '@mui/material';
import useRecorder from '../hooks/useRecorder';
import { generateMascotFromAudio } from '../api/ai';
import luckImg from '../assets/lucky.jpg';
import FloatingBubble from '../components/FloatingBubble';
import HotMascotSlider from "../components/HotMascotSlider";

export default function Voice() {
  const { recording, seconds, start, stop } = useRecorder();
  const [generating, setGenerating] = useState(false);
  const [mascot, setMascot] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

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
      const res = await generateMascotFromAudio(blob);
      if (res?.success) {
        setMascot(res.mascot);
      }
      setGenerating(false);
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* 主卡片 - 完全保留你现在的精美样式 */}
      <Paper
        className="card"
        sx={{
          p: 4,
          borderRadius: '1.2rem',
          border: '4px solid',
          borderColor: 'primary.main',
          background: 'linear-gradient(to bottom right, rgba(255,255,255,0.8), rgba(100, 180, 100, 0.1))',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* ✅ 关键修改：FloatingBubble 作为直接子元素，但绝对定位居中 */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          <FloatingBubble count={30} />
        </Box>

        {/* 内容区域：zIndex > 0，确保在泡泡上方 */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4}>
            {/* 左侧：录音区 —— 使用 size={6}，参考旧布局 */}
            <Grid size={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                录制你的声音
              </Typography>

              <Box sx={{ mt: 2, mb: 3 }}>
                <Button
                  onClick={recording ? handleStop : handleStart}
                  sx={{
                    width: 128,
                    height: 128,
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
                          background: 'linear-gradient(to bottom right, #3e92cc, #d8315b)',
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

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {recording ? '正在录音中... 点击停止' : '点击按钮开始录音'}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                录制时长：{String(Math.floor(seconds / 60)).padStart(2, '0')}:
                {String(seconds % 60).padStart(2, '0')}
              </Typography>
            </Grid>

            {/* 右侧：吉祥物展示区 —— 同样使用 size={6} */}
            <Grid size={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                你的吉祥物
              </Typography>

              {generating ? (
                <Box sx={{ mt: 5 }}>
                  <CircularProgress size={60} />
                  <Typography sx={{ mt: 2, color: 'text.secondary' }}>正在生成你的吉祥物…</Typography>
                </Box>
              ) : mascot ? (
                <>
                  <Box
                    component="img"
                    src={mascot.imageUrl}
                    alt="generated mascot"
                    sx={{
                      width: "100%",
                      maxWidth: 240,
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
                  <Typography color="text.secondary" sx={{ mt: 2, fontWeight: 'medium' }}>
                    {mascot.textPrompt || "你的语音已生成专属吉祥物"}
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

      <HotMascotSlider />
    </Container>
  );
}