export async function generateMascotFromAudio(audioBlob) {
  const form = new FormData();
  form.append("audio", audioBlob, "voice.webm");

  const res = await fetch("http://localhost:5000/api/mascot/from-audio", {
    method: "POST",
    body: form
  });

  return await res.json();
}

// api/ai.js
export async function getLatestMascot() {
  const res = await fetch('http://localhost:5000/api/mascot/latest'); // 或你定义的路径
  if (!res.ok) throw new Error('获取失败');
  return res.json();
}