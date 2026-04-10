import axios from "axios";

// Use relative URL so Vite proxy handles it in dev.
// In production, set VITE_API_URL to your deployed backend URL.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  timeout: 60000, // 60s — Gemini can be slow for career analysis
});

// Attach token from storage on every request
api.interceptors.request.use((config) => {
  try {
    const token =
      localStorage.getItem("ah_token") || sessionStorage.getItem("ah_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {}
  return config;
});

// ── Auth ─────────────────────────────────────────────────────────────────────
export const registerRequest = (data) => api.post("/auth/register", data);
export const loginRequest = (data) => api.post("/auth/login", data);
export const demoLoginRequest = () => api.post("/auth/demo-login");
export const getMeRequest = () => api.get("/auth/me");
export const forgotPasswordRequest = (data) => api.post("/auth/forgot-password", data);
export const resetPasswordRequest = (data) => api.post("/auth/reset-password", data);

// ── Mentor Chat ──────────────────────────────────────────────────────────────
export const mentorChatRequest = (data) => api.post("/mentor/chat", data);

// ── Career Analysis ──────────────────────────────────────────────────────────
export const careerAnalyzeRequest = (data) => api.post("/career/analyze", data);

export default api;
