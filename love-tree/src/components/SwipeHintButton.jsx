// FILE: src/components/SwipeHintButton.jsx
import React from "react";
import { Box } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function SwipeHintButton({ onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: "absolute",
        bottom: 6,
        right: 18,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 52,
        height: 52,
        borderRadius: "50%",
        backgroundColor: "#3e92cc", // 👈 改为蓝色（也可用 #64b464 换成绿色）
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)", // Safari 兼容
        border: "none", // 去掉白边，更干净
        color: "#ffffff",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
        "&:hover": {
          backgroundColor: "#2c7bb6", // 蓝色加深（hover 状态）
          transform: "translateX(4px) scale(1.08)",
          boxShadow: "0 4px 20px rgba(62, 146, 204, 0.4)", // 蓝色光晕
        },
        "& svg": {
          fontSize: "1.4rem",
          fontWeight: "bold",
        },
      }}
    >
      <FontAwesomeIcon icon={faArrowRight} />
    </Box>
  );
}