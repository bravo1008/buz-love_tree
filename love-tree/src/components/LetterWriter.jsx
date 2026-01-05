import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const LetterWriter = ({ onSealLetter }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState('#f59e0b'); // amber-600

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSealLetter = async () => {
    if (!title.trim()) {
      toast.error('请输入信件主题');
      return;
    }
    if (!content.trim()) {
      toast.error('请输入信件内容');
      return;
    }

    const newLetter = {
      date: getCurrentDate(),
      title,
      content,
      color: selectedColor
    };

    onSealLetter(newLetter);
    setTitle('');
    setContent('');
  };

  // 暖色系配色：amber/orange/yellow
  const colors = ['#f59e0b', '#f97316', '#fb923c', '#fbbf24', '#fcd34d'];

  return (
    <motion.div 
      style={{
        background: 'linear-gradient(to bottom right, white, #fffbeb)',
        borderRadius: '0.75rem',
        boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.15)',
        padding: '1rem',
        display: 'flex',
        width: '100%',
        boxSizing: 'border-box',
        flexDirection: 'column',
        height: '100%',
        border: '1px solid #fed7aa'
      }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        background: 'linear-gradient(to right, #d97706, #ea580c)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center'
      }}>
        <i className="fa-solid fa-feather-alt mr-2"></i>
        写一封信
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#d97706',
            marginBottom: '0.25rem'
          }}>主题</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="给这封信起个名字..."
            style={{
              width: '100%',
              padding: '0.5rem 1rem',
              border: '1px solid #fed7aa',
              borderRadius: '0.5rem',
              outline: 'none',
              background: '#ffffff'
            }}
          />
        </div>
        
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#d97706',
            marginBottom: '0.25rem'
          }}>日期</label>
          <input
            type="text"
            value={getCurrentDate()}
            readOnly
            style={{
              width: '100%',
              padding: '0.5rem 1rem',
              background: '#ffffff',
              border: '1px solid #fed7aa',
              borderRadius: '0.5rem',
              color: '#b45309',
              cursor: 'not-allowed'
            }}
          />
        </div>
        
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#d97706',
            marginBottom: '0.25rem'
          }}>信件内容</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="在这里写下你的心声..."
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '1px solid #fed7aa',
              borderRadius: '0.5rem',
              outline: 'none',
              height: '9rem',
              resize: 'none',
              background: '#ffffff'
            }}
          ></textarea>
        </div>
        
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#d97706',
            marginBottom: '0.25rem'
          }}>选择信封颜色</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {colors.map((color) => (
              <button
                key={color}
                style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '9999px',
                  backgroundColor: color,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  border: 'none',
                  outline: 'none',
                  ...(selectedColor === color ? {
                    boxShadow: '0 0 0 2px #f97316, 0 0 0 4px white',
                    transform: 'scale(1.1)'
                  } : {})
                }}
                onClick={() => setSelectedColor(color)}
                aria-label={`选择颜色 ${color}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
      
      <motion.button
        style={{
          marginTop: '1.5rem',
          width: '100%',
          background: 'linear-gradient(to right, #f59e0b, #f97316)',
          color: 'white',
          fontWeight: '600',
          padding: '0.75rem 1rem',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px -1px rgba(245, 158, 11, 0.2)',
          border: 'none',
          outline: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)' }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSealLetter}
      >
        <i className="fa-solid fa-lock mr-2"></i>
        密封信件
      </motion.button>
    </motion.div>
  );
};

export default LetterWriter;