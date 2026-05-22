import axios from "axios";
import { syncAuthToken } from "./auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});


api.interceptors.request.use(async (config) => {
  try {
    if (typeof window === "undefined") return config;

    let token = localStorage.getItem("auth-token");
    if (!token) {
      await syncAuthToken();
      token = localStorage.getItem("auth-token");
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Error setting Authorization token:", error);
  }
  return config;
});

export default api;