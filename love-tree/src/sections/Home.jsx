// src/pages/MapSection.jsx
import React from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Alert,
  Snackbar
} from "@mui/material";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";
import { DivIcon } from "leaflet";

import AddLocationDialog from "../components/AddLocationDialog";
import { addLocation, getAllPoints } from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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

// 🔧 修复 Leaflet 默认 marker 图标 404 问题
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// 自定义红点图标
const createMarkerIcon = (count) => {
  return new DivIcon({
    className: "",
    html: `
      <div style="
        background: #ff3366;
        color: white;
        border: 2px solid white;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 14px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        cursor: pointer;
      ">${count}</div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

// 🗝️ 替换为你自己的高德 Web 服务 Key（从 https://lbs.amap.com/ 获取）
const AMAP_KEY = "5f9a71b4afc51ab425cb283af718a26e"; // 👈 请务必替换成你的真实 Key！

export default function MapSection() {
  const [open, setOpen] = React.useState(false);
  const [points, setPoints] = React.useState([]);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: "", severity: "info" });

  React.useEffect(() => {
    getAllPoints()
      .then((data) => {
        const normalized = data.map(p => ({
          ...p,
          lat: Number(p.lat),
          lng: Number(p.lng)
        })).filter(p => !isNaN(p.lat) && !isNaN(p.lng));
        setPoints(normalized);
      })
      .catch((err) => {
        console.error("Failed to load points:", err);
        setSnackbar({ open: true, message: "加载地图数据失败", severity: "error" });
      });
  }, []);

  const handleSubmit = async (data) => {
    try {
      const updatedPoints = await addLocation(data);
      const normalized = updatedPoints.map(p => ({
        ...p,
        lat: Number(p.lat),
        lng: Number(p.lng)
      })).filter(p => !isNaN(p.lat) && !isNaN(p.lng));
      setPoints(normalized);
      setOpen(false);
      setSnackbar({ open: true, message: "位置添加成功！", severity: "success" });
    } catch (err) {
      console.error("Add location error:", err);
      const msg = err?.response?.data?.error || "添加位置失败，请检查国家/省份名称是否正确";
      setSnackbar({ open: true, message: msg, severity: "error" });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6,mt:7 }}>
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
              微光地图
            </Typography>
      <Typography align="center" color="text.secondary" sx={{ mb: 3 }}>
        每个病友家庭形成一个发光热点，连接全球抗癌力量
      </Typography>

      <Paper sx={{ height: 420, overflow: "hidden", borderRadius: 2 }}>
        <MapContainer
          center={[35, 105]}   // 中国中心（更适合中文地图）
          zoom={3}             // 初始缩放级别（3~4 适合全国+周边）
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          {/* 🌏 高德地图 - 中文街道图（带你的 Key） */}
          <TileLayer
            url={`https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}&key=${AMAP_KEY}`}
            attribution='地图数据 &copy; <a href="https://lbs.amap.com/" target="_blank">高德地图</a>'
            subdomains={['1', '2', '3', '4']}
            maxZoom={18}
          />

          {points.map((p) => (
            <Marker
              key={`${p.country}-${p.province}-${p._id || Math.random()}`}
              position={[p.lat, p.lng]}
              icon={createMarkerIcon(p.count)}
            >
              <Popup>
                {p.country} · {p.province} <br />
                点亮：{p.count} 次
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Paper>

      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          startIcon={<FontAwesomeIcon icon={faLocationDot} color="#fff" />}
          sx={{
            backgroundColor: "#d8315b",
            color: "#fff",
            borderRadius: "999px",
            px: 4,
            py: 1.5,
            fontWeight: 600,
            "&:hover": { backgroundColor: "#b5254a" }
          }}
        >
          添加我的位置
        </Button>
      </Box>

      <AddLocationDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
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
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {recording ? '正在录音中... 点击停止' : '点击按钮开始录音'}
                      </Typography>
    </Container>
  );
}