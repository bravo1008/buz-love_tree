import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';

const LetterDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [letter, setLetter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLetter = async () => {
      try {
        const res = await fetch(`https://buz-love-tree.onrender.com/api/letters/${id}`);
        const data = await res.json();
        if (data.letter) {
          setLetter(data.letter);
        }
      } catch (err) {
        console.error('加载信件失败', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLetter();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(to bottom right, #fffbeb, #fef3c7)' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{ fontSize: '2rem', color: '#f59e0b' }}>
          💌
        </motion.div>
      </div>
    );
  }

  if (!letter) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
        信件不存在或已删除。
      </div>
    );
  }

  const barColor = letter.color || '#f59e0b';

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, rgba(245, 158, 11, 0.15), rgba(251, 146, 60, 0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={letter._id}
          style={{
            background: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
            maxWidth: '32rem',
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto',
            border: '1px solid #ffedd5',
            display: 'flex',
            flexDirection: 'column'
          }}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', damping: 25 }}
        >
          {/* 信封顶部 —— 动态颜色 */}
          <motion.div
            style={{
              height: '4rem',
              background: 'linear-gradient(to bottom, #fffbeb, #fef3c7)',
              borderRadius: '0.75rem 0.75rem 0 0',
              position: 'relative',
              overflow: 'hidden'
            }}
            initial={{ height: 0 }}
            animate={{ height: '4rem' }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '0.5rem',
                backgroundColor: barColor // ✅
              }}
            ></div>
            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '0.5rem',
                backgroundColor: barColor // ✅
              }}
              initial={{ width: 0, x: '50%' }}
              animate={{ width: '80%', x: '10%' }}
              transition={{ delay: 0.5, duration: 0.3 }}
            ></motion.div>
          </motion.div>

          {/* 信纸内容 */}
          <motion.div
            style={{
              padding: '2rem',
              background: 'linear-gradient(to bottom, white, #fef3c7)',
              flex: 1
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#b45309' }}>{letter.title}</h2>
                <p style={{ color: '#d97706', marginTop: '0.25rem' }}>{letter.date}</p>
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: '2rem', width: '0.5px', background: '#ffedd5' }}></div>
              <p style={{ color: '#92400e', lineHeight: '1.6', marginLeft: '3rem', whiteSpace: 'pre-line' }}>
                {letter.content}
              </p>
            </div>
          </motion.div>

          {/* 返回按钮 */}
          <motion.div
            style={{
              padding: '1.5rem',
              background: 'white',
              borderTop: '1px solid #ffedd5',
              display: 'flex',
              justifyContent: 'center'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <motion.button
              style={{
                padding: '0.5rem 1.5rem',
                background: 'linear-gradient(to right, #fed7aa, #fdba74)',
                color: '#b45309',
                borderRadius: '0.5rem',
                border: 'none',
                outline: 'none',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
              whileHover={{ scale: 1.03, background: 'linear-gradient(to right, #fdba74, #fb923c)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/')}
            >
              ← 返回首页
            </motion.button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LetterDetailPage;