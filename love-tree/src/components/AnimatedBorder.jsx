// FILE: src/components/AnimatedBorder.jsx
import React from "react";
import { motion } from "framer-motion";

const EMOJIS = ["🌳", "🌲", "🌿", "🍃", "🌱", "🍀"];

export default function AnimatedBorder() {
  const total = 24;
  const doubled = [...Array(total)].map((_, i) => EMOJIS[i % EMOJIS.length]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
    >
      {/* Top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 24,
          overflow: "hidden",
        }}
      >
        <motion.div
          style={{ display: "flex" }}
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
        >
          {[...doubled, ...doubled].map((e, i) => (
            <span key={i} style={{ margin: "0 6px", fontSize: 20 }}>
              {e}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Right */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          width: 24,
          overflow: "hidden",
        }}
      >
        <motion.div
          style={{ display: "flex", flexDirection: "column" }}
          animate={{ y: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
        >
          {[...doubled, ...doubled].map((e, i) => (
            <span key={i} style={{ margin: "6px 0", fontSize: 20 }}>
              {e}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 24,
          overflow: "hidden",
        }}
      >
        <motion.div
          style={{ display: "flex" }}
          animate={{ x: ["-50%", "0%"] }}
          transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
        >
          {[...doubled, ...doubled].map((e, i) => (
            <span key={i} style={{ margin: "0 6px", fontSize: 20 }}>
              {e}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Left */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: 24,
          overflow: "hidden",
        }}
      >
        <motion.div
          style={{ display: "flex", flexDirection: "column" }}
          animate={{ y: ["-50%", "0%"] }}
          transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
        >
          {[...doubled, ...doubled].map((e, i) => (
            <span key={i} style={{ margin: "6px 0", fontSize: 20 }}>
              {e}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
