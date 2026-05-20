import api from "../api/client";
import type { ApiResponse, AuthResponse, User, LoginFormData, RegisterFormData } from "@/types";

export const authApi = {
  register: async (data: RegisterFormData): Promise<ApiResponse<AuthResponse>> => {
    const { confirmPassword, ...registerData } = data;
    const response = await api.post<ApiResponse<AuthResponse>>("/auth/register", registerData);
    return response.data;
  },

  login: async (data: LoginFormData): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post<ApiResponse<AuthResponse>>("/auth/login", data);
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>("/auth/logout");
    return response.data;
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>("/auth/me");
    return response.data;
  },
};
