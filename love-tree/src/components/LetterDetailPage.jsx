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
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(to bottom right, #ecfdf5, #f0fdfa)'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ fontSize: '2rem', color: '#10b981' }}
        >
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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, rgba(16, 185, 129, 0.15), rgba(34, 211, 238, 0.15))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
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
            border: '1px solid #ccfbf1',
            display: 'flex',
            flexDirection: 'column'
          }}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', damping: 25 }}
        >
          {/* 信封顶部 */}
          <motion.div
            style={{
              height: '4rem',
              background: 'linear-gradient(to bottom, #ecfdf5, #f0fdfa)',
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
                backgroundColor: letter.color || '#10b981'
              }}
            ></div>
            
            <motion.div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '0.5rem',
                backgroundColor: letter.color || '#10b981'
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
              background: 'linear-gradient(to bottom, white, #f0fdfa)',
              flex: 1
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1.5rem'
              }}>
              <div>
                <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#065f46'
                  }}>{letter.title}</h2>
                <p style={{
                    color: '#0d9488',
                    marginTop: '0.25rem'
                  }}>{letter.date}</p>
              </div>
            </div>
            
            <div style={{ position: 'relative' }}>
              <div style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: '2rem',
                  width: '0.5px',
                  background: '#ccfbf1'
                }}></div>
              <p style={{
                  color: '#064e3b',
                  lineHeight: '1.6',
                  marginLeft: '3rem',
                  whiteSpace: 'pre-line'
                }}>
                {letter.content}
              </p>
            </div>
          </motion.div>

          {/* 返回按钮 */}
          <motion.div
            style={{
              padding: '1.5rem',
              background: 'white',
              borderTop: '1px solid #ccfbf1',
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
                background: 'linear-gradient(to right, #a7f3d0, #6ee7b7)',
                color: '#065f46',
                borderRadius: '0.5rem',
                border: 'none',
                outline: 'none',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
              whileHover={{ 
                scale: 1.03, 
                background: 'linear-gradient(to right, #6ee7b7, #34d399)' 
              }}
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