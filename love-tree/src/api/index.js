export const API_BASE = "https://buz-love-tree.onrender.com/api/map";

export const getAllPoints = () => fetch(`${API_BASE}/all`).then(res => res.json());

export const addLocation = (data) =>
  fetch(`${API_BASE}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(res => res.json());
