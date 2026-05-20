import { useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api/authApi";
import { useAuthStore } from "@/store/authStore";
import type { LoginFormData, RegisterFormData } from "@/types";

export function useAuth() {
  const { setUser, setAccessToken, logout } = useAuthStore();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      if (data.data) {
        setUser(data.data.user);
        setAccessToken(data.data.accessToken);
        queryClient.invalidateQueries({ queryKey: ["leads"] });
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      if (data.data) {
        setUser(data.data.user);
        setAccessToken(data.data.accessToken);
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
  });

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.getMe,
    enabled: !!localStorage.getItem("accessToken"),
    retry: false,
  });

  return {
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    user: user?.data || null,
    isLoading,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error?.message,
    registerError: registerMutation.error?.message,
  };
}
