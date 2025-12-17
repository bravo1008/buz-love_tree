// FILE: src/components/Tree.jsx

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Tooltip,
  CircularProgress,
  Modal,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import treeVideo from "../assets/love.webm"; // WebM 格式
import Voice from "./Voice";
import SwipeHintButton from "../components/SwipeHintButton";
import luckImg from '../assets/lucky.jpg';

// ✅ 新增导入
import { getLatestMascot, getTopMascots } from '../api/ai';

export default function Tree({ onSwipeRight }) {
  const [openGenerate, setOpenGenerate] = useState(false);
  const [hangingMascots, setHangingMascots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [latestMascot, setLatestMascot] = useState(null);

  // 新增：控制图片预览弹窗的状态
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewTitle, setPreviewTitle] = useState("");

  const needsRefreshRef = useRef(false);

  // 八个固定位置坐标
  const hangingPositions = [
    { top: "34%", left: "42%" },
    { top: "34%", left: "62%" },
    { top: "40%", left: "55%" },
    { top: "42%", left: "32%" },
    { top: "47%", left: "67%" },
    { top: "49%", left: "37%" },
    { top: "46%", left: "52%" },
    { top: "43%", left: "76%" },
  ];

  // ❌ 删除了 fetchTopMascots 和 fetchLatestMascot

  const generateUniqueKey = (mascot, index) => {
    if (mascot._id) {
      return `${mascot._id}-${mascot.isLatest ? 'latest' : 'ranked'}-${index}`;
    } else if (mascot.isPlaceholder) {
      return `placeholder-${index}-${Math.random().toString(36).substr(2, 9)}`;
    }
    return `fallback-${index}-${Date.now()}`;
  };

  const updateHangingMascots = async () => {
    setLoading(true);
    try {
      // ✅ 使用 ai.js 的封装函数
      const [topMascots, latestResponse] = await Promise.all([
        getTopMascots(),
        getLatestMascot(),
      ]);

      // ✅ 正确解构 latest
      const latest = latestResponse?.success ? latestResponse.mascot : null;
      setLatestMascot(latest);

      const mascotsToHang = [];

      for (let i = 0; i < 7; i++) {
        if (topMascots[i]) {
          mascotsToHang.push({
            ...topMascots[i],
            isLatest: false,
            position: hangingPositions[i],
            displayIndex: i + 1,
            swingAmplitude: 5 + Math.random() * 40,
            swingDuration: 3 + Math.random() * 1,
            swingDelay: Math.random() * 0.5,
          });
        } else if (topMascots.length > 0) {
          mascotsToHang.push({
            ...topMascots[0],
            isLatest: false,
            position: hangingPositions[i],
            displayIndex: i + 1,
            isDuplicate: true,
            swingAmplitude: 5 + Math.random() * 40,
            swingDuration: 3 + Math.random() * 1,
            swingDelay: Math.random() * 0.5,
          });
        } else {
          mascotsToHang.push({
            _id: `placeholder-${i}`,
            imageUrl: null, // 明确设为 null
            isLatest: false,
            position: hangingPositions[i],
            isPlaceholder: true,
            displayIndex: i + 1,
            swingAmplitude: 5 + Math.random() * 40,
            swingDuration: 3 + Math.random() * 1,
            swingDelay: Math.random() * 0.5,
          });
        }
      }

      if (latest && latest.imageUrl) {
        // ✅ 只有有 imageUrl 才挂最新
        mascotsToHang.push({
          ...latest,
          isLatest: true,
          position: hangingPositions[7],
          displayIndex: 8,
          swingAmplitude: 5 + Math.random() * 40,
          swingDuration: 3 + Math.random() * 1,
          swingDelay: Math.random() * 0.5,
        });
      } else if (topMascots.length > 0) {
        mascotsToHang.push({
          ...topMascots[0],
          isLatest: true,
          position: hangingPositions[7],
          displayIndex: 8,
          isDuplicate: true,
          swingAmplitude: 5 + Math.random() * 40,
          swingDuration: 3 + Math.random() * 1,
          swingDelay: Math.random() * 0.5,
        });
      } else {
        mascotsToHang.push({
          _id: "placeholder-latest",
          imageUrl: null,
          isLatest: true,
          position: hangingPositions[7],
          isPlaceholder: true,
          displayIndex: 8,
          swingAmplitude: 5 + Math.random() * 40,
          swingDuration: 3 + Math.random() * 1,
          swingDelay: Math.random() * 0.5,
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
    const handleNewMascot = (event) => {
      const newMascot = event.detail;
      if (newMascot && newMascot._id) {
        setLatestMascot(newMascot);
        updateHangingMascots();
      }
    };

    const handleRankingChange = () => {
      updateHangingMascots();
    };

    window.addEventListener("newMascotGenerated", handleNewMascot);
    window.addEventListener("rankingChanged", handleRankingChange);

    return () => {
      window.removeEventListener("newMascotGenerated", handleNewMascot);
      window.removeEventListener("rankingChanged", handleRankingChange);
    };
  }, []);

  useEffect(() => {
    if (openGenerate) {
      needsRefreshRef.current = true;
    } else if (needsRefreshRef.current) {
      needsRefreshRef.current = false;
      updateHangingMascots();
    }
  }, [openGenerate]);

  const handleMascotClick = (mascot) => {
    if (mascot.isPlaceholder || !mascot.imageUrl) return;
    setPreviewImage(mascot.imageUrl);
    setPreviewTitle(mascot.isLatest ? "最新吉祥物" : `排行榜第${mascot.displayIndex}名`);
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

  const swingKeyframes = `
    @keyframes swing {
      0% { transform: translate(-50%, -50%) rotate(-15deg); }
      100% { transform: translate(-50%, -50%) rotate(15deg); }
    }
  `;

  return (
    <>
      <style>{swingKeyframes}</style>

      {/* ====== Tree 主容器（相对定位，建立本地背景上下文） ====== */}
      <Box
        sx={{
          width: "100vw",
          minHeight: "92vh",
          position: "relative",
          mt: 2,
          overflow: "hidden",
        }}
      >
        {/* ====== 局部背景视频 ====== */}
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
            height: "100%",
            objectFit: "cover",
            zIndex: -1,
            pointerEvents: "none",
          }}
        />

        {/* 悬挂的吉祥物 */}
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
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "3px solid",
                    borderColor: mascot.isLatest ? "#ff5252" : "#3e92cc",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    backgroundColor: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.1)",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
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
                      <span style={{ fontSize: "24px", color: "#999" }}>?</span>
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

        {/* 加载指示器 */}
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

        {/* 录音按钮 */}
        <Box
          sx={{
            position: "absolute",
            top: 60,
            right: 24,
            zIndex: 10,
          }}
        >
          <Tooltip title="录音生成我的吉祥物">
            <Button
              variant="contained"
              onClick={() => setOpenGenerate(true)}
              sx={{
                minWidth: 70,
                height: 70,
                borderRadius: "50%",
                backgroundColor: "#3e92cc",
                color: "white",
                boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
                "&:hover": {
                  background: "linear-gradient(135deg, #ff5252, #c53030)",
                  transform: "scale(1.05)",
                },
                fontSize: "1.8rem",
                fontWeight: "bold",
              }}
            >
              🎤
            </Button>
          </Tooltip>
        </Box>
      </Box>

      {/* 图片预览弹窗 */}
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

      {/* 生成吉祥物弹窗 */}
      <Dialog
        open={openGenerate}
        onClose={() => setOpenGenerate(false)}
        maxWidth="lg"
        fullWidth
        fullScreen
        PaperProps={{
          sx: {
            margin: 0,
            maxHeight: "100vh",
            height: "100%",
            borderRadius: 0,
            overflow: "auto",
          },
        }}
      >
        <DialogContent sx={{ p: 0, height: "100%" }}>
          <Box
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 20,
            }}
          >
            <Button
              variant="outlined"
              size="small"
              onClick={() => setOpenGenerate(false)}
              sx={{ borderRadius: 20, color: "white" }}
            >
              关闭
            </Button>
          </Box>
          <Voice />
        </DialogContent>
      </Dialog>

      {/* 滑动提示按钮 */}
      {onSwipeRight && <SwipeHintButton onClick={onSwipeRight} />}
    </>
  );
}