import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;
const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined" && window.Clerk) {
    try {
      const token = await window.Clerk.session?.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error(error);
    }
  }
  return config;
});

export default api;