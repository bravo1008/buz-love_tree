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
        backgroundColor: "rgba(255, 255, 255, 0.25)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)", // Safari 兼容
        border: "1px solid rgba(255, 255, 255, 0.3)",
        color: "#ffffff",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.35)",
          transform: "translateX(4px) scale(1.08)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
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