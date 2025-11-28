// components/AddLocationDialog.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography
} from "@mui/material";
import { getCountries, getProvinces } from "../utils/locationData";

export default function AddLocationDialog({ open, onClose, onSubmit }) {
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [provinces, setProvinces] = useState([]);

  // 国家变化时更新省份
  useEffect(() => {
    if (country) {
      setProvinces(getProvinces(country));
      setProvince(""); // 清空省份
    } else {
      setProvinces([]);
      setProvince("");
    }
  }, [country]);

  // 👇 关键：当对话框关闭时，重置所有表单字段
  useEffect(() => {
    if (!open) {
      // 对话框关闭后重置
      setCountry("");
      setProvince("");
      setProvinces([]);
    }
  }, [open]); // 监听 open 变化

  const handleSubmit = () => {
    if (country && province) {
      onSubmit({ country, province });
      // 注意：不要在这里重置！因为 onClose 可能异步调用
      // 重置交给上面的 useEffect 处理（在 open 变 false 时触发）
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>添加我的位置</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          请选择您所在的国家和地区（精确到省/州/直辖市）
        </Typography>

        <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
          <FormControl fullWidth required>
            <InputLabel>国家</InputLabel>
            <Select
              value={country}
              label="国家"
              onChange={(e) => setCountry(e.target.value)}
            >
              {getCountries().map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth required disabled={!country}>
            <InputLabel>省份/地区</InputLabel>
            <Select
              value={province}
              label="省份/地区"
              onChange={(e) => setProvince(e.target.value)}
              disabled={!country}
            >
              {provinces.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>取消</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!country || !province}
          sx={{ backgroundColor: "#d8315b", "&:hover": { backgroundColor: "#b5254a" } }}
        >
          确认点亮
        </Button>
      </DialogActions>
    </Dialog>
  );
}