// src/pages/MapSection.jsx

import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Alert,
  Snackbar,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select
} from "@mui/material";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
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
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// 🌟 获取随机金色
const getRandomGoldColor = () => {
  const colors = ["#FF8C00", "#FFA500", "#FFB347", "#FFD700", "#FFEC8B", "#FFFACD", "#FFFF00", "#FFE135"];
  return colors[Math.floor(Math.random() * colors.length)];
};

// 🌟 创建星光图标
const createStarIcon = (size = "small", isUserAdded = false) => {
  const sizeMap = { tiny: 16, small: 20, medium: 24, large: 28 };
  const width = sizeMap[size] || 20;
  const height = width;
  const starColor = getRandomGoldColor();
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

// 🌌 星空背景样式
const starStyles = `
  .leaflet-container {
    background: linear-gradient(135deg, #050517 0%, #0a0a2a 50%, #101035 100%) !important;
    position: relative;
    overflow: hidden;
    background-image: 
      radial-gradient(circle, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
      radial-gradient(circle, rgba(255, 255, 255, 0.01) 1px, transparent 1px);
    background-size: 50px 50px, 100px 100px;
    background-position: 0 0, 25px 25px;
  }

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
  
  @keyframes tinyTwinkle { 0% { opacity: 0.2; transform: scale(0.8); } 100% { opacity: 0.8; transform: scale(1.2); } }
  @keyframes backgroundDrift { 0% { transform: translate(0, 0); } 100% { transform: translate(50px, 50px); } }
  @keyframes simpleTwinkle { 
    0% { transform: scale(0.9); opacity: 0.7; box-shadow: 0 0 8px currentColor, 0 0 16px currentColor; }
    100% { transform: scale(1.1); opacity: 1; box-shadow: 0 0 12px currentColor, 0 0 24px currentColor, 0 0 36px currentColor; }
  }
  @keyframes simpleGlow {
    0% { transform: scale(0.8); opacity: 0.2; }
    100% { transform: scale(1.1); opacity: 0.4; }
  }
  
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
  
  .leaflet-control-zoom a:last-child { border-bottom: none !important; }
  .leaflet-control-zoom a:hover { background: rgba(255, 215, 0, 0.3) !important; color: #FFF !important; }
  
  .leaflet-popup-content-wrapper {
    background: rgba(26, 26, 64, 0.95) !important;
    border: 1px solid rgba(255, 215, 0, 0.3) !important;
    border-radius: 6px !important;
    backdrop-filter: blur(10px);
  }
  
  .leaflet-popup-tip { background: rgba(26, 26, 64, 0.95) !important; }
  .leaflet-control-attribution { display: none !important; }
  
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;

// 🇨🇳 中国省份虚拟星空坐标（x=经度方向, y=纬度方向，在 L.CRS.Simple 中为平面坐标）
const PROVINCE_COORDINATES = {
  "北京市": [0, 0],
  "天津市": [3, 0],
  "河北省": [0, 5],
  "山西省": [-3, 3],
  "内蒙古自治区": [0, 10],
  "辽宁省": [8, 8],
  "吉林省": [12, 12],
  "黑龙江省": [15, 15],
  "上海市": [5, -2],
  "江苏省": [7, -3],
  "浙江省": [10, -5],
  "安徽省": [5, -5],
  "福建省": [12, -8],
  "江西省": [8, -8],
  "山东省": [5, 2],
  "河南省": [2, -2],
  "湖北省": [0, -5],
  "湖南省": [-2, -8],
  "广东省": [10, -12],
  "广西壮族自治区": [5, -12],
  "海南省": [12, -15],
  "重庆市": [-3, -10],
  "四川省": [-5, -8],
  "贵州省": [-8, -10],
  "云南省": [-10, -12],
  "西藏自治区": [-15, 0],
  "陕西省": [-5, 0],
  "甘肃省": [-10, 5],
  "青海省": [-12, 8],
  "宁夏回族自治区": [-8, 3],
  "新疆维吾尔自治区": [-20, 5],
  "香港特别行政区": [13, -14],
  "澳门特别行政区": [12.5, -14.5],
  "台湾省": [15, -10]
};

const provincesList = Object.keys(PROVINCE_COORDINATES);

export default function MapSection() {
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [userStars, setUserStars] = useState([]); // 现在从 API 加载
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [city, setCity] = useState("");

  const mapRef = useRef(null);

  // ✅ 从后端加载所有星星（替代 localStorage）
  useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch(`https://buz-love-tree.onrender.com/api/stars`);
        if (response.ok) {
          const data = await response.json();
          setUserStars(data);
        } else {
          console.error("Failed to load stars from server");
        }
      } catch (err) {
        console.error("Network error when fetching stars:", err);
      }
    };

    fetchStars();
  }, []);

  // 注入 CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = starStyles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProvince("");
    setCity("");
  };

  const handleConfirm = async () => {
    if (!selectedProvince) {
      setSnackbar({ open: true, message: "请选择省份", severity: "warning" });
      return;
    }

    const baseCoord = PROVINCE_COORDINATES[selectedProvince];
    if (!baseCoord) {
      setSnackbar({ open: true, message: "未知省份", severity: "error" });
      return;
    }

    const randomOffsetX = (Math.random() - 0.5) * 32;
    const randomOffsetY = (Math.random() - 0.5) * 32;
    const lat = baseCoord[1] + randomOffsetY;
    const lng = baseCoord[0] + randomOffsetX;

    const newStarData = {
      province: selectedProvince,
      city: city.trim() || null,
      lat,
      lng,
      size: ["small", "medium"][Math.floor(Math.random() * 2)]
    };

    try {
      const response = await fetch(`https://buz-love-tree.onrender.com/api/stars`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newStarData)
      });

      if (response.ok) {
        const savedStar = await response.json();
        setUserStars(prev => [...prev, savedStar]); // 局部更新，体验更流畅

        setSnackbar({
          open: true,
          message: `✨ 已在【${selectedProvince}${city ? `·${city}` : ""}】点亮星光！`,
          severity: "success"
        });

        if (mapRef.current) {
          const currentZoom = mapRef.current.getZoom();
          const targetZoom = Math.max(currentZoom, 3);
          mapRef.current.flyTo([lat, lng], targetZoom, {
            duration: 1.2,
            easeLinearity: 0.8
          });
        }
      } else {
        const error = await response.json();
        setSnackbar({ open: true, message: error.error || "点亮失败", severity: "error" });
      }
    } catch (err) {
      console.error("Network error:", err);
      setSnackbar({ open: true, message: "网络错误，请检查连接", severity: "error" });
    }

    handleCloseDialog();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6, mt: -8 }}>
      {/* 点亮按钮 */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<FontAwesomeIcon icon={faStar} />}
          onClick={handleOpenDialog}
          sx={{
            background: 'linear-gradient(45deg, #FFD700, #FF8C00)',
            color: '#000',
            fontWeight: 'bold',
            px: 4,
            py: 1.5,
            boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)'
          }}
        >
          点亮星光
        </Button>
      </Box>

      {/* 🌌 星空地图 */}
      <Paper sx={{ 
        height: 530,
        overflow: "hidden", 
        borderRadius: 2,
        background: "#050517",
        position: "relative"
      }}>
        <MapContainer
          center={[0, 0]}
          zoom={2}
          minZoom={1}
          maxZoom={6}
          style={{ height: "100%", width: "100%" }}
          crs={L.CRS.Simple}
          maxBounds={[[-30, -30], [30, 30]]}
          attributionControl={false}
          zoomControl={true}
          ref={mapRef}
        >
          <TileLayer url="" opacity={0} />
          
          {/* 所有用户星光（包括自己刚点的） */}
          {userStars.map(star => (
            <Marker
              key={star._id || star.id} // 使用 MongoDB 的 _id
              position={[star.lat, star.lng]}
              icon={createStarIcon(star.size, true)}
            >
              <Popup>
                <Box sx={{ p: 1, textAlign: "center" }}>
                  <Typography variant="subtitle1" sx={{ color: "#FFD700", fontWeight: "bold", fontSize: "0.9rem" }}>
                    ✨ {star.province}{star.city && `·${star.city}`}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#aaa", mt: 1, fontSize: "0.8rem" }}>
                    坐标: ({star.lat.toFixed(2)}, {star.lng.toFixed(2)})
                  </Typography>
                </Box>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* 指南提示 */}
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
              使用说明
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "#e0e0e0", lineHeight: 1.5 }}>
            1. 点击上方<strong>“点亮星光”</strong>按钮<br/>
            2. 选择<strong>省份</strong>，可选填<strong>城市</strong><br/>
            3. 同一省份的星光会聚集在同一区域<br/>
            4. 使用左上角缩放按钮查看全局
          </Typography>
        </Box>
      </Paper>

      {/* 点亮表单弹窗 */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>点亮属于你的星光</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>选择省份 *</InputLabel>
            <Select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              label="选择省份 *"
            >
              {provincesList.map(p => (
                <MenuItem key={p} value={p}>{p}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="城市（可选）"
            fullWidth
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="例如：杭州、成都..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>取消</Button>
          <Button onClick={handleConfirm} variant="contained" color="primary">确认点亮</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}