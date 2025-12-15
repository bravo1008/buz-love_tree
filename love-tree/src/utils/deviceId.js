// utils/deviceId.js
export const getDeviceId = () => {
  let id = localStorage.getItem("deviceId");
  if (!id) {
    // 生成简单 UUID（生产环境建议用 crypto.randomUUID()）
    id = "device_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("deviceId", id);
  }
  return id;
};