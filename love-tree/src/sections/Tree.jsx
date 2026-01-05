// FILE: src/components/Tree.jsx

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Modal,
  IconButton,
  Tooltip,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import treeVideo from "../assets/light2.webm";
import Voice from "./Voice";
import { getLatestMascot, getTopMascots } from '../api/ai';

// ✅ 扩展到 15 个悬挂位置（模拟树冠分布）
const hangingPositions = [
  // 第一层（顶部稀疏）
  { top: "28%", left: "50%" },
  // 第二层
  { top: "36%", left: "40%" },
  { top: "32%", left: "70%" },
  // 第三层
  { top: "38%", left: "17%" },
  { top: "42%", left: "56%" },
  { top: "42%", left: "82%" },
  // 第四层
  { top: "45%", left: "31%" },
  { top: "52%", left: "46%" },
  { top: "50%", left: "65%" },
  { top: "52%", left: "82%" },
  // 第五层（底部密集）
  { top: "53%", left: "20%" },
];

const swingKeyframes = `
  @keyframes swing {
    0% { transform: translate(-50%, -50%) rotate(-10deg); }
    100% { transform: translate(-50%, -50%) rotate(10deg); }
  }
`;

// Fisher-Yates shuffle
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Tree({ onSwipeRight }) {
  const [hangingMascots, setHangingMascots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [latestMascot, setLatestMascot] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewTitle, setPreviewTitle] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isMobile = useMediaQuery("(max-width:600px)");

  const generateUniqueKey = (mascot, index) => {
    if (mascot._id) return `${mascot._id}-${mascot.isLatest ? 'latest' : 'random'}-${index}`;
    if (mascot.isPlaceholder) return `placeholder-${index}`;
    return `fallback-${index}-${Date.now()}`;
  };

  const updateHangingMascots = async () => {
    setLoading(true);
    try {
      const [allMascots, latestResponse] = await Promise.all([
        getTopMascots(),      // 现在返回全部
        getLatestMascot(),
      ]);
      const latest = latestResponse?.success ? latestResponse.mascot : null;
      setLatestMascot(latest);

      const mascotsToHang = [];

      // 随机打乱所有吉祥物
      const shuffled = shuffleArray(allMascots);
      const randomMascots = shuffled.slice(0, 10); // 取10个

      // 填充前10个位置
      for (let i = 0; i < 10; i++) {
        if (randomMascots[i]) {
          mascotsToHang.push({
            ...randomMascots[i],
            isLatest: false,
            position: hangingPositions[i],
            displayIndex: i + 1,
            swingAmplitude: 5 + Math.random() * 30,
            swingDuration: 2.5 + Math.random() * 1.5,
            swingDelay: Math.random() * 1,
          });
        } else if (allMascots.length > 0) {
          // 数据不足：循环复用
          const fallback = allMascots[i % allMascots.length];
          mascotsToHang.push({
            ...fallback,
            isLatest: false,
            position: hangingPositions[i],
            displayIndex: i + 1,
            isDuplicate: true,
            swingAmplitude: 5 + Math.random() * 30,
            swingDuration: 2.5 + Math.random() * 1.5,
            swingDelay: Math.random() * 1,
          });
        } else {
          // 完全无数据：占位符
          mascotsToHang.push({
            _id: `placeholder-${i}`,
            imageUrl: null,
            isLatest: false,
            position: hangingPositions[i],
            isPlaceholder: true,
            displayIndex: i + 1,
            swingAmplitude: 5 + Math.random() * 30,
            swingDuration: 2.5 + Math.random() * 1.5,
            swingDelay: Math.random() * 1,
          });
        }
      }

      // 第11个位置：最新吉祥物（优先），否则兜底
      if (latest && latest.imageUrl) {
        mascotsToHang.push({
          ...latest,
          isLatest: true,
          position: hangingPositions[10],
          displayIndex: 11,
          swingAmplitude: 5 + Math.random() * 30,
          swingDuration: 2.5 + Math.random() * 1.5,
          swingDelay: Math.random() * 1,
        });
      } else if (allMascots.length > 0) {
        const fallback = allMascots[0];
        mascotsToHang.push({
          ...fallback,
          isLatest: true,
          position: hangingPositions[10],
          displayIndex: 11,
          isDuplicate: true,
          swingAmplitude: 5 + Math.random() * 30,
          swingDuration: 2.5 + Math.random() * 1.5,
          swingDelay: Math.random() * 1,
        });
      } else {
        mascotsToHang.push({
          _id: "placeholder-latest",
          imageUrl: null,
          isLatest: true,
          position: hangingPositions[10],
          isPlaceholder: true,
          displayIndex: 11,
          swingAmplitude: 5 + Math.random() * 30,
          swingDuration: 2.5 + Math.random() * 1.5,
          swingDelay: Math.random() * 1,
        });
      }

      setHangingMascots(mascotsToHang);
    } catch (err) {
      console.error("更新悬挂吉祥物失败:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateHangingMascots();
  }, []);

  useEffect(() => {
    const handleNewMascot = (e) => {
      const newMascot = e.detail;
      if (newMascot?._id) {
        setLatestMascot(newMascot);
        updateHangingMascots();
      }
    };
    const handleRankingChange = () => updateHangingMascots();

    window.addEventListener("newMascotGenerated", handleNewMascot);
    window.addEventListener("rankingChanged", handleRankingChange);
    return () => {
      window.removeEventListener("newMascotGenerated", handleNewMascot);
      window.removeEventListener("rankingChanged", handleRankingChange);
    };
  }, []);

  const handleMascotClick = (mascot) => {
    if (mascot.isPlaceholder || !mascot.imageUrl) return;
    setPreviewImage(mascot.imageUrl);
    setPreviewTitle(mascot.isLatest ? "我的吉祥物" : `吉祥物 #${mascot.displayIndex}`);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewImage(null);
    setPreviewTitle("");
  };

  const getSwingAnimation = (mascot) => {
    if (!mascot) return {};
    return {
      animation: `swing ${mascot.swingDuration}s ease-in-out ${mascot.swingDelay}s infinite alternate`,
      transformOrigin: "top center",
    };
  };

  // 动态调整图标大小
  const iconSize = isFullscreen ? 60 : isMobile ? 36 : 36;

  const treeContainerSx = isFullscreen
    ? {
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1300,
        mt: 0,
        backgroundColor: "#113055",
      }
    : {
        width: "100%",
        height: isMobile ? 300 : 400, // 增高以容纳更多吉祥物
        position: "relative",
        mt: 2,
        overflow: "hidden",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        backgroundColor: "#113055",
      };

  return (
    <>
      <style>{swingKeyframes}</style>

      {!isFullscreen && (
        <>
          <Voice />
          <Box sx={{ mt: 1, mb: 2, textAlign: "center" }}>
            <Button
              variant="contained"
              onClick={() => setIsFullscreen(true)}
              sx={{
                backgroundColor: "#3e92cc",
                "&:hover": { backgroundColor: "#2c7bb6" },
                px: 4,
                py: 1,
                fontWeight: "bold",
              }}
            >
              🌲 全屏查看许愿树
            </Button>
          </Box>
        </>
      )}

      <Box sx={treeContainerSx}>
        <Box
          component="video"
          autoPlay
          muted
          loop
          playsInline
          src={treeVideo}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            objectFit: isFullscreen ? "contain" :"cover",
            height:isFullscreen ?"100%":"120%",
            pointerEvents: "none",
            backgroundColor: "#113055",
            zIndex: 0,
          }}
        />

        {!loading &&
          hangingMascots.map((mascot, index) => {
            const uniqueKey = generateUniqueKey(mascot, index);
            return (
              <Box
                key={uniqueKey}
                sx={{
                  position: "absolute",
                  ...mascot.position,
                  transform: "translate(-50%, -50%)",
                  zIndex: 5,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  ...getSwingAnimation(mascot),
                  cursor: mascot.isPlaceholder ? "default" : "pointer",
                }}
                onClick={() => handleMascotClick(mascot)}
              >
                <Box
                  sx={{
                    width: iconSize,
                    height: iconSize,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "2px solid",
                    borderColor: mascot.isLatest ? "#ff5252" : "#3e92cc",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                    backgroundColor: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.15)",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
                    },
                  }}
                >
                  {mascot.isPlaceholder ? (
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f0f0f0",
                      }}
                    >
                      <span style={{ fontSize: iconSize * 0.6, color: "#999" }}>?</span>
                    </Box>
                  ) : (
                    <Box
                      component="img"
                      src={mascot.imageUrl}
                      alt="吉祥物"
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center top",
                      }}
                    />
                  )}
                </Box>
              </Box>
            );
          })}

        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 5,
            }}
          >
            <CircularProgress sx={{ color: "#3e92cc" }} />
          </Box>
        )}

        {isFullscreen && (
          <Box
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 10,
            }}
          >
            <Tooltip title="退出全屏">
              <IconButton
                onClick={() => setIsFullscreen(false)}
                sx={{
                  backgroundColor: "rgba(255,255,255,0.8)",
                  "&:hover": { backgroundColor: "white" },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>

      {/* 预览弹窗 */}
      <Modal
        open={previewOpen}
        onClose={handleClosePreview}
        aria-labelledby="image-preview-modal"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(5px)",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "90vw",
            maxWidth: 500,
            maxHeight: "90vh",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 0,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderBottom: "1px solid #e0e0e0",
              backgroundColor: "#f5f5f5",
            }}
          >
            <Box sx={{ fontSize: "1.2rem", fontWeight: "bold", color: "#333" }}>
              {previewTitle}
            </Box>
            <IconButton onClick={handleClosePreview} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 3,
              backgroundColor: "#fff",
            }}
          >
            {previewImage && (
              <Box
                component="img"
                src={previewImage}
                alt="吉祥物预览"
                sx={{
                  maxWidth: "100%",
                  maxHeight: "70vh",
                  objectFit: "contain",
                  borderRadius: 1,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                  clipPath: 'inset(0 0 5% 0)', // 添加这一行以裁剪掉底部10%
                }}
              />
            )}
          </Box>
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid #e0e0e0",
              backgroundColor: "#f5f5f5",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              onClick={handleClosePreview}
              sx={{
                backgroundColor: "#3e92cc",
                "&:hover": { backgroundColor: "#2c7bb6" },
              }}
            >
              关闭
            </Button>
          </Box>
        </Box>
      </Modal>

      {!isFullscreen && onSwipeRight && <Box sx={{ mt: 2 }} />}
    </>
  );
}