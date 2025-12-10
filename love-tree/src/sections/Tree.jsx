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
import treeGif from "../assets/love2.gif";
import Voice from "./Voice";
import HotMascotSlider from "../components/HotMascotSlider";
import SwipeHintButton from "../components/SwipeHintButton";

export default function Tree({ onSwipeRight }) {
  const [openGenerate, setOpenGenerate] = useState(false);
  const [openRanking, setOpenRanking] = useState(false);
  const [hangingMascots, setHangingMascots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [latestMascot, setLatestMascot] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // 新增：控制图片预览弹窗的状态
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewTitle, setPreviewTitle] = useState("");
  
  // 使用ref来存储是否需要刷新
  const needsRefreshRef = useRef(false);

  // 六个固定位置坐标（相对于Tree容器的百分比位置）- 可调整
  const hangingPositions = [
    { top: "34%", left: "42%" },   // 位置1 - 调整后的位置
    { top: "34%", left: "62%" },   // 位置2 - 调整后的位置
    { top: "40%", left: "55%" },   // 位置3 - 调整后的位置
    { top: "42%", left: "32%" },   // 位置4 - 调整后的位置
    { top: "47%", left: "67%" },   // 位置5 - 调整后的位置
    { top: "49%", left: "37%" },   // 位置6（最新吉祥物位置）- 调整后的位置
    { top: "46%", left: "52%" },   // 位置7 - 调整后的位置
    { top: "43%", left: "76%" },   // 位置8（最新吉祥物位置）- 调整后的位置
  ];

  // 获取排行榜前五名
  const fetchTopMascots = async () => {
    try {
      const res = await fetch("/api/mascot");
      const data = await res.json();
      if (data.success) {
        // 按点赞数降序排序，取前5名
        const topMascots = data.mascots
          .sort((a, b) => b.likes - a.likes)
          .slice(0, 7);
        return topMascots;
      }
      return [];
    } catch (err) {
      console.error("获取排行榜失败:", err);
      return [];
    }
  };

  // 获取最新吉祥物
  const fetchLatestMascot = async () => {
    try {
      const res = await fetch("/api/mascot/latest");
      const data = await res.json();
      if (data.success && data.mascot) {
        return data.mascot;
      }
      return null;
    } catch (err) {
      console.error("获取最新吉祥物失败:", err);
      return null;
    }
  };

  // 生成唯一key - 解决重复key问题
  const generateUniqueKey = (mascot, index) => {
    // 使用组合字段策略确保key的唯一性
    if (mascot._id) {
      // 结合_id、isLatest状态和索引生成唯一key
      return `${mascot._id}-${mascot.isLatest ? 'latest' : 'ranked'}-${index}-${Date.now()}`;
    } else if (mascot.isPlaceholder) {
      // 占位符使用特殊key
      return `placeholder-${index}-${Math.random().toString(36).substr(2, 9)}`;
    }
    // 最后保障：使用时间戳和随机数
    return `fallback-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // 更新悬挂的吉祥物
  const updateHangingMascots = async () => {
    setLoading(true);
    try {
      const [topMascots, latest] = await Promise.all([
        fetchTopMascots(),
        fetchLatestMascot(),
      ]);

      setLatestMascot(latest);

      // 构建悬挂吉祥物数组
      const mascotsToHang = [];
      
      // 前5个位置放排行榜前5名
      for (let i = 0; i < 7; i++) {
        if (topMascots[i]) {
          mascotsToHang.push({
            ...topMascots[i],
            isLatest: false,
            position: hangingPositions[i],
            displayIndex: i + 1,
            // 为每个吉祥物添加随机摇摆参数
            swingAmplitude: 5 + Math.random() * 40, // 摇摆幅度 5-15度
            swingDuration: 3 + Math.random() * 1,   // 摇摆周期 3-7秒
            swingDelay: Math.random() * 0.5,         // 摇摆延迟 0-2秒
          });
        } else if (topMascots.length > 0) {
          // 如果不够5个，用第一个填充
          mascotsToHang.push({
            ...topMascots[0],
            isLatest: false,
            position: hangingPositions[i],
            displayIndex: i + 1,
            isDuplicate: true,
            swingAmplitude: 5 + Math.random() * 40, // 摇摆幅度 5-15度
            swingDuration: 3 + Math.random() * 1,   // 摇摆周期 3-7秒
            swingDelay: Math.random() * 0.5,         // 摇摆延迟 0-2秒
          });
        } else {
          // 如果没有吉祥物，用占位符
          mascotsToHang.push({
            _id: `placeholder-${i}`,
            imageUrl: null,
            isLatest: false,
            position: hangingPositions[i],
            isPlaceholder: true,
            displayIndex: i + 1,
            swingAmplitude: 5 + Math.random() * 40, // 摇摆幅度 5-15度
            swingDuration: 3 + Math.random() * 1,   // 摇摆周期 3-7秒
            swingDelay: Math.random() * 0.5,         // 摇摆延迟 0-2秒
          });
        }
      }

      // 第6个位置放最新吉祥物
      if (latest) {
        mascotsToHang.push({
          ...latest,
          isLatest: true,
          position: hangingPositions[7],
          displayIndex: 6,
          swingAmplitude: 5 + Math.random() * 40, // 摇摆幅度 5-15度
          swingDuration: 3 + Math.random() * 1,   // 摇摆周期 3-7秒
          swingDelay: Math.random() * 0.5,         // 摇摆延迟 0-2秒
        });
      } else if (topMascots.length > 0) {
        // 如果没有最新吉祥物，用排行榜第一名填充
        mascotsToHang.push({
          ...topMascots[0],
          isLatest: true,
          position: hangingPositions[7],
          displayIndex: 6,
          isDuplicate: true,
          swingAmplitude: 5 + Math.random() * 40, // 摇摆幅度 5-15度
          swingDuration: 3 + Math.random() * 1,   // 摇摆周期 3-7秒
          swingDelay: Math.random() * 0.5,         // 摇摆延迟 0-2秒
        });
      } else {
        // 用占位符
        mascotsToHang.push({
          _id: "placeholder-latest",
          imageUrl: null,
          isLatest: true,
          position: hangingPositions[7],
          isPlaceholder: true,
          displayIndex: 6,
          swingAmplitude: 5 + Math.random() * 40, // 摇摆幅度 5-15度
          swingDuration: 3 + Math.random() * 1,   // 摇摆周期 3-7秒
          swingDelay: Math.random() * 0.5,         // 摇摆延迟 0-2秒
        });
      }

      setHangingMascots(mascotsToHang);
    } catch (err) {
      console.error("更新悬挂吉祥物失败:", err);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    updateHangingMascots();
  }, []);

  // 监听新吉祥物生成事件
  useEffect(() => {
    const handleNewMascot = (event) => {
      const newMascot = event.detail;
      if (newMascot && newMascot._id) {
        // 更新最新吉祥物并重新获取数据
        setLatestMascot(newMascot);
        updateHangingMascots();
      }
    };

    window.addEventListener("newMascotGenerated", handleNewMascot);
    
    // 监听自定义事件：排行榜变化
    const handleRankingChange = () => {
      updateHangingMascots();
    };
    
    window.addEventListener("rankingChanged", handleRankingChange);

    return () => {
      window.removeEventListener("newMascotGenerated", handleNewMascot);
      window.removeEventListener("rankingChanged", handleRankingChange);
    };
  }, []);

  // 监听录音按钮点击和关闭事件
  useEffect(() => {
    if (openGenerate) {
      // 打开录音界面时标记需要刷新
      needsRefreshRef.current = true;
    } else if (needsRefreshRef.current) {
      // 关闭录音界面时刷新数据
      needsRefreshRef.current = false;
      updateHangingMascots();
    }
  }, [openGenerate]);

  // 新增：处理吉祥物点击事件
  const handleMascotClick = (mascot) => {
    if (mascot.isPlaceholder || !mascot.imageUrl) {
      return; // 占位符或没有图片时不处理
    }
    
    setPreviewImage(mascot.imageUrl);
    setPreviewTitle(mascot.isLatest ? "最新吉祥物" : `排行榜第${mascot.displayIndex}名`);
    setPreviewOpen(true);
  };

  // 新增：关闭预览弹窗
  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewImage(null);
    setPreviewTitle("");
  };

  // 添加吉祥物摇摆动画的样式
  const getSwingAnimation = (mascot) => {
    if (!mascot) return {};
    
    return {
      animation: `swing ${mascot.swingDuration || 5}s ease-in-out ${mascot.swingDelay || 0}s infinite alternate`,
      transformOrigin: 'top center', // 以顶部中心为支点
    };
  };

  // 添加摇摆动画的keyframes
  const swingKeyframes = `
    @keyframes swing {
      0% {
        transform: translate(-50%, -50%) rotate(-15deg);
      }
      100% {
        transform: translate(-50%, -50%) rotate(15deg);
      }
    }
  `;

  return (
    <>
      {/* 添加摇摆动画样式 */}
      <style>{swingKeyframes}</style>
      
      {/* ====== Tree 页面主体：GIF 作为背景，无遮罩、无文字 ====== */}
      <Box
        sx={{
          // 关键：将 GIF 作为背景
          backgroundImage: `url(${treeGif})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          // 占满整个滑动页（宽度 100vw，高度 = 外层容器高度）
          width: "100vw",
          minHeight: "92vh", // 必须 >= 外层容器高度（calc(100vh - navbar)）
          position: "relative",
          // 确保内容在背景之上
          zIndex: 0,
          mt: 2,
          overflow: "hidden",
        }}
      >
        {/* ====== 悬挂的吉祥物 ====== */}
        {!loading &&
          hangingMascots.map((mascot, index) => {
            // 生成唯一key，避免重复key错误
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
                  cursor: mascot.isPlaceholder ? "default" : "pointer", // 添加指针样式
                }}
                onClick={() => handleMascotClick(mascot)} // 添加点击事件
              >
                
                {/* 吉祥物头像圆框 - 大小可调整 */}
                <Box
                  sx={{
                    width: 40,  // 调整大小：40px直径
                    height: 40, // 调整大小：40px直径
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
                        objectPosition: "center top", // 优先展示头部
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

        {/* ====== 悬浮按钮（右上角） ====== */}
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

      {/* ====== 新增：图片预览弹窗 ====== */}
      <Modal
        open={previewOpen}
        onClose={handleClosePreview}
        aria-labelledby="image-preview-modal"
        aria-describedby="image-preview-description"
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
          {/* 弹窗标题栏 */}
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
          
          {/* 图片展示区域 */}
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
                  clipPath: "inset(0 0 5% 0)", // 上右下左：顶部0，右侧0，底部20%，左侧0
                }}
              />
            )}
          </Box>
          
          {/* 底部操作栏 */}
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
                "&:hover": {
                  backgroundColor: "#2c7bb6",
                },
              }}
            >
              关闭
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* ====== 弹窗：生成吉祥物 ====== */}
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

      {/* ====== 右侧滑动提示箭头（固定在底部右侧） ====== */}
      {/* 滑动提示按钮 */}
      {onSwipeRight && <SwipeHintButton onClick={onSwipeRight} />}
    </>
  );
}
