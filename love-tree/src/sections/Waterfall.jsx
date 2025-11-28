// FILE: src/sections/Waterfall.jsx
import React, { useEffect, useRef } from 'react';
import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import Chart from 'chart.js/auto';
import waterImg from '../assets/water.jpg';
import { FaChartLine, FaMicroscope } from 'react-icons/fa';

export default function Waterfall() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['2018','2019','2020','2021','2022','2023'],
        datasets: [
          { label: '5年生存率 (%)', data: [58,60,62,65,67,68], tension:0.3, borderColor:'#57d37a', backgroundColor:'rgba(87,211,122,0.2)' },
          { label: '治疗有效率 (%)', data: [62,64,66,68,70,72], tension:0.3, borderColor:'#b18bff', backgroundColor:'rgba(177,139,255,0.2)' }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio:false,
        plugins:{ legend:{ labels:{ color: 'rgba(255,255,255,0.8)' } } },
        scales:{
          y:{ min:50, max:80, ticks:{ color: 'rgba(255,255,255,0.8)'} },
          x:{ ticks:{ color: 'rgba(255,255,255,0.8)'} }
        }
      }
    });

    return () => chart.destroy();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py:6 }}>
      <Typography variant="h4" align="center" gutterBottom>瀑布数据流</Typography>
      <Typography align="center" color="text.secondary" sx={{ mb:3 }}>
        动态水流从云端倾泻而下，嵌入抗癌里程碑和医学数据
      </Typography>

      <Paper className="card" elevation={2} sx={{ height: { xs: 280, md: 620 }, overflow: 'hidden', mb:4 }}>
        <img
          src={waterImg}
          alt="waterfall"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Paper>

      <Grid container spacing={3} justifyContent='center'>
        {/* 抗癌里程碑 */}
        <Grid item xs={12} md={6}>
          <Paper className="card" sx={{ p:3,minHeight: { xs: 280, md: 400 },minWidth: { xs: 280, md: 510 },
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s', // 动画过渡
                    '&:hover': {
                      transform: 'scale(1.03)', // 放大3%
                      boxShadow: '0 8px 20px rgba(0,0,0,0.4)', // 阴影增强
                    },
                  }}>
            <Box display="flex" alignItems="center" mb={2}>
              <FaChartLine color="#57d37a" size={24} style={{ marginRight: 8 }} />
              <Typography variant="h6">抗癌里程碑</Typography>
            </Box>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Box mb={4}>
                <Box display="flex" justifyContent="space-between">
                  <Typography>5年生存率</Typography>
                  <Typography color="#57d37a">68%</Typography>
                </Box>
                <Box sx={{ bgcolor:'#1f2937', height:8, borderRadius:8 }}>
                  <Box sx={{ width:'68%', height:'100%', bgcolor:'#57d37a', borderRadius:8 }} />
                </Box>
              </Box>

              <Box mb={4}>
                <Box display="flex" justifyContent="space-between">
                  <Typography>3年无复发率</Typography>
                  <Typography color="#5fb0ff">55%</Typography>
                </Box>
                <Box sx={{ bgcolor:'#1f2937', height:8, borderRadius:8 }}>
                  <Box sx={{ width:'55%', height:'100%', bgcolor:'#5fb0ff', borderRadius:8 }} />
                </Box>
              </Box>

              <Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography>治疗有效率</Typography>
                  <Typography color="#b18bff">72%</Typography>
                </Box>
                <Box sx={{ bgcolor:'#1f2937', height:8, borderRadius:8 }}>
                  <Box sx={{ width:'72%', height:'100%', bgcolor:'#b18bff', borderRadius:8 }} />
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* 医学数据可视化折线图 */}
        <Grid item xs={12} md={6}>
          <Paper className="card" sx={{ p:3,minHeight: { xs: 280, md: 400 },minWidth: { xs: 280, md: 500 }, // 与上面一致
                  display: 'flex',
                  flexDirection: 'column', 
                  transition: 'transform 0.3s, box-shadow 0.3s', // 动画过渡
                    '&:hover': {
                      transform: 'scale(1.03)', // 放大3%
                      boxShadow: '0 8px 20px rgba(0,0,0,0.4)', // 阴影增强
                    },}}>
            <Box display="flex" alignItems="center" mb={2}>
              <FaMicroscope color="#b18bff" size={24} style={{ marginRight: 8 }} />
              <Typography variant="h6">医学数据可视化</Typography>
            </Box>
            <Box sx={{ height: 300 }}>
              <canvas ref={canvasRef} style={{ width:'100%', height:'100%' }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>





            {/* ===== 卡片区域 ===== */}
      <Grid container spacing={3} sx={{ mt: 4, justifyContent: 'center' }}>
        <Grid item xs={12} md={4} width="31%">
          <Paper className="card" sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ fontSize: 40, color: '#4dabf5', mb: 2 }}>
              <FaDna />
            </Box>
            <Typography variant="h6">DNA 双螺旋结构</Typography>
            <Typography color="text.secondary">
              树干融入 DNA 双螺旋结构，象征生命的奥秘与韧性。
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4} width="31%">
          <Paper className="card" sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ fontSize: 40, color: '#4caf50', mb: 2 }}>
              <FaLeaf />
            </Box>
            <Typography variant="h6">发光叶片</Typography>
            <Typography color="text.secondary">
              叶片呈现生机盎然的光效，代表希望与生命力。
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4} width="31%">
          <Paper className="card" sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ fontSize: 40, color: '#9c27b0', mb: 2 }}>
              <FaMoon />
            </Box>
            <Typography variant="h6">昼夜变化</Typography>
            <Typography color="text.secondary">
              树体随时间推移产生昼夜变化，象征生命的循环与不息。
            </Typography>
          </Paper>
        </Grid>
      </Grid>

            <Grid container spacing={3} sx={{ mt: 3 ,justifyContent:'center'}}>
              <Grid item xs={12} md={4} lg={4} width="31%">
                <Paper className="card" sx={{p: 3, textAlign: 'center' }}>
                  <Box sx={{ fontSize: 40, color: '#4dabf5', mb: 2 }}>
                    <FaWaveSquare />
                  </Box>
                  <Typography variant="h6">声纹波纹</Typography>
                  <Typography color="text.secondary">
                    录制语音时生成声波扩散特效，将你的声音可视化，成为吉祥物的独特标识。
                  </Typography>
                </Paper>
              </Grid>
      
              <Grid item xs={12} md={4}  width="31%">
                <Paper className="card" sx={{p: 3, textAlign: 'center' }}>
                  <Box sx={{ fontSize: 40, color: '#4caf50', mb: 2 }}>
                    <FaSeedling />
                  </Box>
                  <Typography variant="h6">动态生长</Typography>
                  <Typography color="text.secondary">
                    挂件随互动点赞次数可生长变化，象征生命的成长与希望的传递。
                  </Typography>
                </Paper>
              </Grid>
      
              <Grid item xs={12} md={4}  width="31%">
                <Paper className="card" sx={{ p: 3, textAlign: 'center' }}>
                  <Box sx={{ fontSize: 40, color: '#9c27b0', mb: 2 }}>
                    <FaRobot />
                  </Box>
                  <Typography variant="h6">AI生成</Typography>
                  <Typography color="text.secondary">
                    基于你的声音特征，AI生成200+种吉祥物，每件都有独特的外观和寓意。
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center',  gap: { xs: 2, sm: 8 }}}>
                {/* 点赞按钮 */}
                <Button
                  variant="contained"
                  startIcon={<FontAwesomeIcon icon={faHeart} color="#fff" />}
                  sx={{ borderRadius:5,minWidth: { xs: 80, sm: 120 },
                       fontSize: { xs: '0.6rem', sm: '1rem' },backgroundColor: '#e53935',
                    color: '#fff',
                    '&:hover': { backgroundColor: '#d32f2f' },'& .MuiButton-startIcon svg': {
                        fontSize: { xs: '0.6rem', sm: '1rem' } // 图标响应式大小
                      }}}
                  onClick={() => setLikes(likes + 1)}
                >
                  点赞 {likes}
                </Button>

                {/* 分享按钮 */}
                <Button
                  variant="outlined"
                  startIcon={<FontAwesomeIcon icon={faShareAlt} color="#fff"/>}
                  sx={{borderRadius:5,minWidth: { xs: 80, sm: 120 },
                      fontSize: { xs: '0.6rem', sm: '1rem' },borderColor: '#fff',
                    color: '#fff',
                    '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.1)' },'& .MuiButton-startIcon svg': {
                        fontSize: { xs: '0.8rem', sm: '1rem' } // 图标响应式大小
                      }}}
                  onClick={() => alert('分享功能待实现')}
                >
                  分享
                </Button>
              </Box>
    </Container>
  );
}
