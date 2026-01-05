import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const isWechatBrowser = () => {
  const ua = navigator.userAgent.toLowerCase();
  return /micromessenger/.test(ua);
};

const LetterModal = ({ letter, onClose }) => {
  if (!letter) return null;

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/letter/${letter._id}`;
    const shareTitle = letter.title;
    const shareText = `${letter.date}\n\n${letter.content}`;

    if (isWechatBrowser()) {
      toast.info('请点击右上角 ··· 分享给朋友', { duration: 5000, icon: 'ℹ️' });
      return;
    }

    try {
      if (navigator.share) {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
        toast.success('已分享！');
        return;
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
    }

    try {
      await navigator.clipboard.writeText(
        `💌 ${shareTitle}\n${shareText}\n\n点击查看这封温暖来信 👉 ${shareUrl}`
      );
      toast.success('专属链接已复制！快去微信发送吧～');
    } catch (err) {
      toast.error('复制失败');
    }
  };

  // 使用 letter.color，兜底为 amber
  const barColor = letter.color || '#f59e0b';

  return (
    <AnimatePresence>
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom right, rgba(245, 158, 11, 0.2), rgba(251, 146, 60, 0.2))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '1rem',
          backdropFilter: 'blur(8px)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          style={{
            background: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
            maxWidth: '32rem',
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto',
            border: '1px solid #ffedd5'
          }}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 信封顶部 —— 使用动态颜色 */}
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
                backgroundColor: barColor // ✅ 动态颜色
              }}
            ></div>
            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '0.5rem',
                backgroundColor: barColor // ✅ 动态颜色
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
              background: 'linear-gradient(to bottom, white, #fef3c7)'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#b45309' }}>
                  {letter.title}
                </h2>
                <p style={{ color: '#d97706', marginTop: '0.25rem' }}>
                  {letter.date}
                </p>
              </div>
              <motion.button
                style={{
                  padding: '0.5rem',
                  borderRadius: '9999px',
                  background: '#ffedd5',
                  color: '#d97706',
                  transition: 'background-color 0.2s',
                  border: 'none',
                  outline: 'none'
                }}
                whileHover={{ scale: 1.1, backgroundColor: '#fed7aa' }}
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
              >
                <i className="fa-solid fa-share-alt"></i>
              </motion.button>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: '2rem', width: '0.5px', background: '#ffedd5' }}></div>
              <p style={{ color: '#92400e', lineHeight: '1.6', marginLeft: '3rem', whiteSpace: 'pre-line' }}>
                {letter.content}
              </p>
            </div>
          </motion.div>

          {/* 底部按钮 */}
          <motion.div
            style={{
              padding: '1.5rem',
              background: 'white',
              borderTop: '1px solid #ffedd5',
              display: 'flex',
              justifyContent: 'flex-end'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <motion.button
              style={{
                padding: '0.5rem 1.5rem',
                background: 'linear-gradient(to right, #f59e0b, #fb923c)',
                color: 'white',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: 'none',
                outline: 'none'
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(251, 146, 60, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
            >
              关闭
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LetterModal;