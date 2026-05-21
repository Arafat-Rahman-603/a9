import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});


api.interceptors.request.use(async (config) => {
  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("auth-token")
        : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Error setting Authorization token:", error);
  }
  return config;
});

export default api;