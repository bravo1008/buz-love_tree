// src/pages/MapSection.jsx

import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Alert,
  Snackbar
} from "@mui/material";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  ZoomControl
} from "react-leaflet";
import { DivIcon } from "leaflet";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 🔧 修复 Leaflet 默认 marker 图标 404 问题
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: " https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png ",
  iconUrl: " https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png ",
  shadowUrl: " https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png ",
});

// 生成橙色到黄色的随机颜色
const getRandomGoldColor = () => {
  const colors = [
    "#FF8C00", // 深橙色
    "#FFA500", // 橙色
    "#FFB347", // 浅橙色
    "#FFD700", // 金色
    "#FFEC8B", // 浅金色
    "#FFFACD", // 柠檬绸色
    "#FFFF00", // 黄色
    "#FFE135", // 香蕉黄
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// 创建星光图标 - 简化闪动效果
const createStarIcon = (size = "small", isUserAdded = false) => {
  const sizeMap = {
    tiny: { width: 16, height: 16 },
    small: { width: 20, height: 20 },
    medium: { width: 24, height: 24 },
    large: { width: 28, height: 28 }
  };
  
  const { width, height } = sizeMap[size] || sizeMap.small;
  
  // 随机选择橙色到黄色之间的颜色
  const starColor = getRandomGoldColor();
  
  // 创建渐变颜色
  const gradient = `radial-gradient(circle, ${starColor} 0%, ${starColor}BB 50%, ${starColor}88 100%)`;
  
  return new DivIcon({
    className: "custom-star-icon",
    html: `
      <div class="star-container ${isUserAdded ? 'user-star' : ''}" 
           style="width: ${width}px; height: ${height}px;">
        <div class="star-core" style="background: ${gradient};"></div>
        <div class="star-glow"></div>
      </div>
    `,
    iconSize: [width, height],
    iconAnchor: [width / 2, height / 2],
    popupAnchor: [0, -height / 2]
  });
};

// 创建极小白色星点（优化版）
const createTinyStarIcon = (type = "default") => {
  // 三种不同类型的极小星点，增加层次感
  const starTypes = {
    default: {
      size: Math.random() * 1.5 + 0.5, // 0.5-2px
      opacity: Math.random() * 0.3 + 0.1, // 0.1-0.4
      twinkleSpeed: Math.random() * 4 + 3 // 3-7秒
    },
    bright: {
      size: Math.random() * 2 + 1, // 1-3px
      opacity: Math.random() * 0.4 + 0.2, // 0.2-0.6
      twinkleSpeed: Math.random() * 3 + 2 // 2-5秒
    },
    faint: {
      size: Math.random() * 1 + 0.3, // 0.3-1.3px
      opacity: Math.random() * 0.2 + 0.05, // 0.05-0.25
      twinkleSpeed: Math.random() * 6 + 4 // 4-10秒
    }
  };
  
  const config = starTypes[type] || starTypes.default;
  
  return new DivIcon({
    className: "tiny-star-icon",
    html: `
      <div style="
        width: ${config.size}px;
        height: ${config.size}px;
        background: radial-gradient(circle, rgba(255, 255, 255, ${config.opacity}) 0%, transparent 70%);
        border-radius: 50%;
        box-shadow: 0 0 ${config.size * 2}px rgba(255, 255, 255, ${config.opacity * 0.5});
        animation: tinyTwinkle ${config.twinkleSpeed}s infinite alternate ease-in-out;
        position: absolute;
      "></div>
    `,
    iconSize: [config.size, config.size],
    iconAnchor: [config.size / 2, config.size / 2]
  });
};

// 点击添加星光的组件
const ClickToAddStar = ({ onAddStar }) => {
  const map = useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      
      // 使用更小的尺寸
      const sizes = ["tiny", "small", "medium"];
      const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
      
      // 创建星光标记
      const starMarker = L.marker([lat, lng], {
        icon: createStarIcon(randomSize, true),
        interactive: true,
        bubblingMouseEvents: true
      }).addTo(map);
      
      // 添加弹窗
      starMarker.bindPopup(`
        <div style="text-align: center; padding: 8px; min-width: 150px;">
          <h4 style="margin: 0 0 6px 0; color: #FFD700; font-size: 14px;">
            ✨ 新星光 ✨
          </h4>
          <div style="display: flex; flex-direction: column; gap: 3px; font-size: 11px;">
            <div style="color: #aaa;">
              <strong>位置:</strong><br/>
              纬度: ${lat.toFixed(4)}<br/>
              经度: ${lng.toFixed(4)}
            </div>
          </div>
        </div>
      `);
      
      // 自动打开弹窗
      starMarker.openPopup();
      
      // 触发回调
      if (onAddStar) {
        onAddStar({ lat, lng, size: randomSize });
      }
    }
  });

  return null;
};

// 自定义星空瓦片层 - 实现无限地图
const InfiniteStarTileLayer = () => {
  return (
    <TileLayer
      url="" // 空URL，不使用真实地图
      attribution=""
      noWrap={false} // 允许瓦片重复，实现无限效果
      bounds={[[-180, -360], [180, 360]]} // 扩大边界
      opacity={0}
    />
  );
};

// 添加CSS样式 - 优化星空背景和动画
const starStyles = `
  /* 夜空背景样式 - 不再是纯黑，添加渐变和星点纹理 */
  .leaflet-container {
    background: linear-gradient(135deg, #050517 0%, #0a0a2a 50%, #101035 100%) !important;
    position: relative;
    overflow: hidden;
    /* 添加背景星点纹理 */
    background-image: 
      radial-gradient(circle, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
      radial-gradient(circle, rgba(255, 255, 255, 0.01) 1px, transparent 1px);
    background-size: 50px 50px, 100px 100px;
    background-position: 0 0, 25px 25px;
  }

  /* 给地图容器添加额外的星空背景层 */
  .leaflet-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle, rgba(255, 255, 255, 0.03) 0.5px, transparent 0.5px),
      radial-gradient(circle, rgba(255, 255, 255, 0.01) 0.8px, transparent 0.8px);
    background-size: 80px 80px, 120px 120px;
    background-position: 0 0, 40px 40px;
    z-index: 0;
    pointer-events: none;
    animation: backgroundDrift 60s linear infinite;
  }
  
  .star-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  
  .star-core {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    position: relative;
    z-index: 2;
    animation: simpleTwinkle 1.2s infinite alternate ease-in-out;
  }
  
  .star-glow {
    position: absolute;
    width: 200%;
    height: 200%;
    top: -50%;
    left: -50%;
    background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
    border-radius: 50%;
    z-index: 0;
    animation: simpleGlow 2s infinite alternate;
  }
  
  /* 微小星星的动画 */
  @keyframes tinyTwinkle {
    0% {
      opacity: 0.2;
      transform: scale(0.8);
    }
    100% {
      opacity: 0.8;
      transform: scale(1.2);
    }
  }
  
  /* 背景缓慢漂移动画 */
  @keyframes backgroundDrift {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(50px, 50px);
    }
  }
  
  /* 简化后的闪动动画 */
  @keyframes simpleTwinkle {
    0% {
      transform: scale(0.9);
      opacity: 0.7;
      box-shadow: 
        0 0 8px currentColor,
        0 0 16px currentColor;
    }
    100% {
      transform: scale(1.1);
      opacity: 1;
      box-shadow: 
        0 0 12px currentColor,
        0 0 24px currentColor,
        0 0 36px currentColor;
    }
  }
  
  /* 简化后的光晕动画 */
  @keyframes simpleGlow {
    0% {
      transform: scale(0.8);
      opacity: 0.2;
    }
    100% {
      transform: scale(1.1);
      opacity: 0.4;
    }
  }
  
  /* 缩放控件样式 */
  .leaflet-control-zoom {
    border: 1px solid rgba(255, 215, 0, 0.3) !important;
    background: rgba(26, 26, 64, 0.9) !important;
    border-radius: 4px !important;
    margin-top: 10px !important;
    margin-left: 10px !important;
  }
  
  .leaflet-control-zoom a {
    background: rgba(255, 215, 0, 0.1) !important;
    color: #FFD700 !important;
    border-bottom: 1px solid rgba(255, 215, 0, 0.2) !important;
    width: 30px !important;
    height: 30px !important;
    line-height: 30px !important;
    text-align: center !important;
    font-size: 18px !important;
    font-weight: bold !important;
    transition: all 0.2s ease !important;
  }
  
  .leaflet-control-zoom a:last-child {
    border-bottom: none !important;
  }
  
  .leaflet-control-zoom a:hover {
    background: rgba(255, 215, 0, 0.3) !important;
    color: #FFF !important;
  }
  
  .leaflet-popup-content-wrapper {
    background: rgba(26, 26, 64, 0.95) !important;
    border: 1px solid rgba(255, 215, 0, 0.3) !important;
    border-radius: 6px !important;
    backdrop-filter: blur(10px);
  }
  
  .leaflet-popup-tip {
    background: rgba(26, 26, 64, 0.95) !important;
  }
  
  /* 隐藏右下角的Leaflet图标 */
  .leaflet-control-attribution {
    display: none !important;
  }

  /* 淡入动画 */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

// 生成随机微小星星的组件（优化版 - 更多星点，更多层次）
const TinyStarsLayer = () => {
  const [tinyStars, setTinyStars] = useState([]);
  
  useEffect(() => {
    // 生成800个随机位置的微小星星（增加数量）
    const stars = [];
    const starTypes = ["default", "bright", "faint"];
    
    for (let i = 0; i < 800; i++) {
      const lat = Math.random() * 180 - 90; // -90到90
      const lng = Math.random() * 360 - 180; // -180到180
      const type = starTypes[Math.floor(Math.random() * starTypes.length)];
      stars.push({ lat, lng, id: i, type });
    }
    setTinyStars(stars);
  }, []);
  
  return (
    <>
      {tinyStars.map(star => (
        <Marker
          key={star.id}
          position={[star.lat, star.lng]}
          icon={createTinyStarIcon(star.type)}
          interactive={false} // 微小星星不可交互
        />
      ))}
    </>
  );
};

export default function MapSection() {
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [userStars, setUserStars] = useState([]);
  const mapRef = useRef(null);

  // 从localStorage加载已保存的星光
  useEffect(() => {
    const savedStars = localStorage.getItem('userStars');
    if (savedStars) {
      try {
        setUserStars(JSON.parse(savedStars));
      } catch (error) {
        console.error("Failed to parse saved stars:", error);
      }
    }
  }, []);

  // 保存星光到localStorage
  useEffect(() => {
    if (userStars.length > 0) {
      localStorage.setItem('userStars', JSON.stringify(userStars));
    }
  }, [userStars]);

  // 添加CSS样式
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = starStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const handleAddStar = (starData) => {
    const newStar = { ...starData, id: Date.now() };
    const updatedStars = [...userStars, newStar];
    setUserStars(updatedStars);
    
    setSnackbar({ 
      open: true, 
      message: `✨ 星光已点亮在 (${starData.lat.toFixed(4)}, ${starData.lng.toFixed(4)})`, 
      severity: "success" 
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6, mt: 7 }}>
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
        微光地图
      </Typography>
      <Typography align="center" color="text.secondary" sx={{ mb: 3 }}>
        点击地图任意位置点亮星光，连接全球微光
      </Typography>

      {/* 🌌 星空地图区域 */}
      <Paper sx={{ 
        height: 530,
        overflow: "hidden", 
        borderRadius: 2,
        position: "relative",
        // 给外层容器也添加深色背景
        background: "#050517"
      }}>
        <MapContainer
          center={[0, 0]}
          zoom={2}
          minZoom={1}
          maxZoom={8}
          style={{ height: "100%", width: "100%" }}
          crs={L.CRS.Simple}
          maxBounds={[[-180, -360], [180, 360]]}
          maxBoundsViscosity={0.0}
          zoomControl={true}
          zoomControlProps={{ position: 'topleft' }}
          attributionControl={false}
          ref={mapRef}
        >
          {/* 使用无限星空背景 */}
          <InfiniteStarTileLayer />
          
          {/* 添加微小星星层 - 白色小星星背景（数量增加） */}
          <TinyStarsLayer />
          
          {/* 添加点击事件监听 */}
          <ClickToAddStar onAddStar={handleAddStar} />
          
          {/* 渲染用户点击添加的星光（包括之前保存的） */}
          {userStars.map(star => (
            <Marker
              key={star.id}
              position={[star.lat, star.lng]}
              icon={createStarIcon(star.size, true)}
            >
              <Popup>
                <Box sx={{ p: 1, textAlign: "center" }}>
                  <Typography variant="subtitle1" sx={{ color: "#FFD700", fontWeight: "bold", fontSize: "0.9rem" }}>
                    ✨ 用户点亮 ✨
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#aaa", mt: 1, fontSize: "0.8rem" }}>
                    位置: ({star.lat.toFixed(4)}, {star.lng.toFixed(4)})
                  </Typography>
                </Box>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        {/* 文字提示 - 使用绝对定位在地图右下角 */}
        <Box
          sx={{
            position: "absolute",
            bottom: 20,
            right: 20,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "#FFD700",
            padding: "10px 16px",
            borderRadius: "8px",
            fontSize: "0.85rem",
            zIndex: 1000,
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 215, 0, 0.3)",
            maxWidth: "300px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            animation: "fadeIn 1s ease-out"
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <FontAwesomeIcon icon={faStar} style={{ color: "#FFD700", fontSize: "0.9rem" }} />
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#FFD700" }}>
              点亮星光指南
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "#e0e0e0", lineHeight: 1.5 }}>
            1. <strong>点击地图任意位置</strong>即可点亮一颗星光<br/>
            2. 每个星光都有独特的颜色和闪动效果<br/>
            3. 使用左上角 <strong>+/- 按钮</strong>缩放地图<br/>
            4. 点击已有星光查看详细信息
          </Typography>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert 
          severity={snackbar.severity} 
          sx={{ 
            width: "100%",
            backgroundColor: snackbar.severity === "success" ? "rgba(255, 215, 0, 0.1)" : undefined,
            border: snackbar.severity === "success" ? "1px solid rgba(255, 215, 0, 0.3)" : undefined,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}