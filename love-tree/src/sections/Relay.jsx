// src/sections/Relay.jsx
import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Alert,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonIcon from "@mui/icons-material/Person";
import SwipeHintButton from "../components/SwipeHintButton"; 
import axios from "axios";

// ==================== 配置 ====================
const API_BASE = "https://buz-love-tree.onrender.com/api";

// ==================== 动画 ====================
const marquee = keyframes`
  0%   { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
`;

const MarqueeContainer = styled("div")({
  overflow: "hidden",
  position: "relative",
  padding: "40px 0",
  width: "100vw",
  maxWidth: "100%",
  boxSizing: "border-box",
  minHeight: "160px",
});

const MarqueeContent = styled("div")({
  display: "inline-flex",
  whiteSpace: "nowrap",
  animation: `${marquee} 20s linear infinite`,
  minWidth: "200%",
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(12px)",
  borderRadius: "16px",
  border: "1px solid rgba(255, 255, 255, 0.25)",
  padding: theme.spacing(3),
  width: 260,
  margin: "0 26px",
  transform: `rotate(${(Math.random() * 8 - 4).toFixed(2)}deg)`,
  transition: "transform .35s ease, box-shadow .35s ease",
  display: "flex",
  flexDirection: "column",
  "&:hover": {
    transform: "translateY(-14px) scale(1.03) rotate(0deg)",
    boxShadow: "0 12px 28px rgba(0,0,0,0.26)",
  },
}));

const randomColor = () => {
  const colors = ["#7e57c2", "#d81b60", "#6a1b9a", "#42a5f5", "#ff7043"];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function Relay({ onSwipeRight }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    surname: "",
    gender: "先生",
    identity: "康复者",
    disease: "",
    text: "",
  });

  const loadMessages = async () => {
    try {
      const res = await axios.get(`${API_BASE}/relay`);
      setItems(res.data);
      setError("");
    } catch (err) {
      console.error("拉取寄语失败", err);
      setError("暂时无法加载寄语，请稍后再试");
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleChange = (key, val) => {
    setForm({ ...form, [key]: val });
  };

  const publish = async () => {
    if (!form.surname.trim() || !form.text.trim()) {
      setError("请填写姓氏和寄语内容");
      return;
    }

    const newMsg = {
      name: form.surname + form.gender,
      years: "—",
      disease: form.disease,
      text: form.text,
      date: new Date().toLocaleDateString(),
      likes: 0,
      color: randomColor(),
      identity: form.identity,
    };

    try {
      // ✅ 修复：使用完整 API 地址，不再用相对路径
      await axios.post(`${API_BASE}/relay`, newMsg);
      loadMessages();
      setForm({
        surname: "",
        gender: "先生",
        identity: "康复者",
        disease: "",
        text: "",
      });
      setError("");
    } catch (err) {
      console.error("发布失败", err);
      setError("寄语发布失败，请检查网络或稍后再试");
    }

    setOpen(false);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
        overflow: "hidden",
      }}
    >
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
          lineHeight: 1.2,
          mt: -3,
        }}
      >
        温暖寄语墙
      </Typography>

      <Typography align="center" color="text.secondary" sx={{ mb: 3 }}>
        已康复病友写下寄语，生成抗癌卡片送给新的病友
      </Typography>

      {/* 错误提示 */}
      {error && (
        <Alert severity="error" sx={{ mb: 2, maxWidth: 500 }}>
          {error}
        </Alert>
      )}

      {items.length === 0 ? (
        <Box
          sx={{
            py: 6,
            color: "#666",
            fontSize: 18,
            fontStyle: "italic",
            opacity: 0.8,
            textAlign: "center",
          }}
        >
          暂无寄语，欢迎你成为第一位留言者！
        </Box>
      ) : (
        <MarqueeContainer>
          <MarqueeContent>
            {[...items, ...items].map((it, idx) => (
              <StyledPaper key={`${it._id || it.date}-${idx}`}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 1.5 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      bgcolor: it.color || "#7e57c2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    <PersonIcon />
                  </Box>
                  <Box sx={{ textAlign: "left", flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                      {it.name}
                    </Typography>
                    <Typography sx={{ color: "#666", fontSize: 13, mt: 0.5 }}>
                      {it.identity} | {it.disease}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    flex: 1,
                    fontStyle: "italic",
                    wordBreak: "break-word",
                    whiteSpace: "normal",
                    overflowY: "auto",
                    maxHeight: 100,
                    pr: 1,
                    lineHeight: 1.5,
                    "&::-webkit-scrollbar": {
                      width: "6px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#ccc",
                      borderRadius: "3px",
                    },
                  }}
                >
                  “{it.text}”
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1.5 }}>
                  <Typography sx={{ fontSize: 13, color: "#555" }}>
                    {it.date}
                  </Typography>
                </Box>
              </StyledPaper>
            ))}
          </MarqueeContent>
        </MarqueeContainer>
      )}

      <Button
        variant="contained"
        color="primary"
        sx={{
          mt: 3,
          mb: 4,
          px: 4,
          py: 1.5,
          fontSize: 14,
          borderRadius: 20,
        }}
        onClick={() => setOpen(true)}
      >
        写下你的寄语
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>发布你的寄语</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <TextField
            fullWidth
            label="姓氏（例如：张）"
            sx={{ mb: 2 }}
            value={form.surname}
            onChange={(e) => handleChange("surname", e.target.value)}
          />
          <Typography sx={{ fontSize: 14, mb: 1 }}>称谓</Typography>
          <RadioGroup
            row
            value={form.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
          >
            <FormControlLabel value="先生" control={<Radio />} label="先生" />
            <FormControlLabel value="女士" control={<Radio />} label="女士" />
          </RadioGroup>
          <TextField
            select
            fullWidth
            label="身份"
            sx={{ mb: 2, mt: 2 }}
            value={form.identity}
            onChange={(e) => handleChange("identity", e.target.value)}
          >
            <MenuItem value="康复者">康复者</MenuItem>
            <MenuItem value="陪护者">陪护者</MenuItem>
            <MenuItem value="家属">家属</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="疾病（例如：乳腺癌）"
            sx={{ mb: 2 }}
            value={form.disease}
            onChange={(e) => handleChange("disease", e.target.value)}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="寄语内容"
            value={form.text}
            onChange={(e) => handleChange("text", e.target.value)}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>取消</Button>
          <Button variant="contained" onClick={publish}>
            发布
          </Button>
        </DialogActions>
      </Dialog>

      {onSwipeRight && <SwipeHintButton onClick={onSwipeRight} />} 
    </Box>
  );
}