import React from "react";
import { Container, Box, Typography, Paper } from "@mui/material";
import treeGif from "../assets/love2.gif";
import Voice from "./Voice";

export default function Tree() {
  return (
    <Container maxWidth="xl" disableGutters sx={{ py: 3 }}>
      {/* ====== 渐变标题（参考下方代码） ====== */}
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
        语音交互生命树
      </Typography>

      <Typography align="center" color="text.secondary" sx={{ mb: 6 }}>
        解锁声音“吉祥物”挂件，赋予生命树独特的生命力
      </Typography>

      {/* ======= 主体布局：小屏上下，大屏左右 ======= */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "center", md: "flex-start" },
          justifyContent: "flex-start",
          gap: 4,
          px: { xs: 2, md: 3 },
          width: "100%",
        }}
      >
        {/* ======= GIF 区域（添加边框、背景、阴影） ======= */}
        <Box
          sx={{
            flexBasis: { md: "40%" },
            flexGrow: 0,
            display: "flex",
            justifyContent: { xs: "center", md: "flex-start" },
            alignItems: "flex-start",
          }}
        >
          {/* ✅ 模拟 Card：带边框、渐变背景、阴影 */}
          <Paper
            elevation={12} // shadow-2xl ≈ elevation 12~24
            sx={{
              p: 0,
              borderRadius: 2,
              border: '4px solid',
              borderColor: 'primary.main',
              opacity: 1, // 实现 /30 透明效果
              background: 'linear-gradient(to bottom, rgba(25, 118, 210, 0.05), rgba(216, 49, 91, 0.05))', // from-primary/5 to-accent/5
              overflow: 'hidden',
              maxWidth: '480px',
              width: '100%',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                height: { xs: '500px', md: '700px' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(to bottom, rgba(100, 180, 255, 0.1), transparent)',
              }}
            >
              <img
                src={treeGif}
                alt="tree"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </Box>
          </Paper>
        </Box>

        {/* ======= Voice 组件区域 ======= */}
        <Box
          sx={{
            flexBasis: { md: "65%" },
            maxWidth: { xs: "100%", md: "65%" },
            flexShrink: 0,
          }}
        >
          <Voice />
        </Box>
      </Box>
    </Container>
  );
}