import axios from "axios";
import type { ApiResponse } from "@/types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post<ApiResponse<{ accessToken: string }>>(
          `${import.meta.env.VITE_API_URL || "/api"}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        if (response.data.data?.accessToken) {
          localStorage.setItem("accessToken", response.data.data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
          return api(originalRequest);
        }
      } catch {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
