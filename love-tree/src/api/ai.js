export async function generateMascotFromAudio(audioBlob) {
  const form = new FormData();
  form.append("audio", audioBlob, "voice.webm");

  const res = await fetch("https://buz-love-tree.onrender.com/api/mascot/from-audio", {
    method: "POST",
    body: form
  });

  return await res.json();
}

// api/ai.js
export async function getLatestMascot() {
  const res = await fetch('https://buz-love-tree.onrender.com/api/mascot/latest'); // 或你定义的路径
  if (!res.ok) throw new Error('获取失败');
  return res.json();
}