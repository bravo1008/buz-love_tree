// api/ai.js
import { getDeviceId } from '../utils/deviceId'; // 👈 确保你有这个工具函数

export async function generateMascotFromAudio(audioBlob) {
  const form = new FormData();
  form.append("audio", audioBlob, "voice.webm");

  const res = await fetch("https://buz-love-tree.onrender.com/api/mascot/from-audio", {
    method: "POST",
    body: form
  });

  return await res.json();
}

export async function getLatestMascot() {
  const deviceId = getDeviceId();
  const res = await fetch('https://buz-love-tree.onrender.com/api/mascot/latest', {
    headers: {
      'x-device-id': deviceId,
    },
  });
  if (!res.ok) throw new Error('获取失败');
  return res.json();
}