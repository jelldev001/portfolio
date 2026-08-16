import axios from "axios";

const BACKEND_ORIGIN = import.meta.env.VITE_BACKEND_ORIGIN;
const api = axios.create({
  baseURL: `${BACKEND_ORIGIN}/api`,
});

export function assetUrl(path) {
  if (!path) return path;
  if (path.startsWith("http")) return path;
  return `${BACKEND_ORIGIN}${path}`;
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;