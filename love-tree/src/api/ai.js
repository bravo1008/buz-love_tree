// api/ai.js
import { getDeviceId } from '../utils/deviceId';

const API_BASE = 'https://buz-love-tree.onrender.com/api/mascot';

export async function generateMascotFromAudio(audioBlob) {
  const deviceId = getDeviceId();

  const form = new FormData();
  form.append("audio", audioBlob, "voice.webm");

  const res = await fetch(`${API_BASE}/from-audio`, {
    method: "POST",
    headers: {
      'x-device-id': deviceId,
    },
    body: form,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`生成失败: ${res.status} - ${errorText}`);
  }

  return await res.json();
}

export async function getLatestMascot() {
  const deviceId = getDeviceId();

  const res = await fetch(`${API_BASE}/latest`, {
    method: 'GET',
    headers: {
      'x-device-id': deviceId,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`获取失败: ${res.status} - ${errorText}`);
  }

  return await res.json();
}

// ✅ 修改：返回所有吉祥物，不排序、不截断
export async function getTopMascots() {
  const deviceId = getDeviceId();
  const res = await fetch(`${API_BASE}`, {
    method: 'GET',
    headers: {
      'x-device-id': deviceId,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`获取排行榜失败: ${res.status} - ${errorText}`);
  }

  const data = await res.json();
  if (data.success && Array.isArray(data.mascots)) {
    return data.mascots; // 返回全部
  }
  return [];
}