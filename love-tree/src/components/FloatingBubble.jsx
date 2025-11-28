// FILE: src/components/FloatingBubble.jsx
import React, { useEffect, useState } from 'react';

export default function FloatingBubble({ count = 12 }) {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const arr = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,           // 横向百分比
      size: 10 + Math.random() * 20,       // 泡泡大小
      delay: Math.random() * 5,            // 动画延迟
      duration: 5 + Math.random() * 5,     // 上升/下降速度
      direction: Math.random() > 0.5 ? 'up' : 'down', // 上升或下降
      color: `hsla(${Math.random() * 360}, 80%, 70%, 0.7)` // 渐变颜色
    }));
    setBubbles(arr);
  }, [count]);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '2px',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 1,
    }}>
      {bubbles.map(b => (
        <div
          key={b.id}
          style={{
            position: 'absolute',
            bottom: b.direction === 'up' ? '-20px' : '100%',
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            borderRadius: '50%',
            background: b.color,
            boxShadow: `0 0 ${b.size/2}px ${b.color}`,
            animation: `${b.direction === 'up' ? 'bubbleUp' : 'bubbleDown'} ${b.duration}s linear ${b.delay}s infinite`
          }}
        />
      ))}
      <style>
        {`
          @keyframes bubbleUp {
            0% { transform: translateY(0) scale(1); opacity: 0.8; }
            45% { transform: translateY(-50vh) scale(1.2); opacity: 1; }
            50% { transform: translateY(-50vh) scale(1.5); opacity: 0; } /* 中间炸开 */
            100% { transform: translateY(-100vh) scale(1); opacity: 0; }
          }

          @keyframes bubbleDown {
            0% { transform: translateY(0) scale(1); opacity: 0.8; }
            45% { transform: translateY(50vh) scale(1.2); opacity: 1; }
            50% { transform: translateY(50vh) scale(1.5); opacity: 0; } /* 中间炸开 */
            100% { transform: translateY(100vh) scale(1); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
}
