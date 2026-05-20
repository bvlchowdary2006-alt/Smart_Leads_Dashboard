import api from "../api/client";
import type { ApiResponse, Lead, LeadFilters, PaginationMeta, DashboardStats, LeadFormData } from "@/types";

export const leadsApi = {
  getLeads: async (filters: LeadFilters): Promise<ApiResponse<Lead[]>> => {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.status) params.append("status", filters.status);
    if (filters.source) params.append("source", filters.source);
    if (filters.sort) params.append("sort", filters.sort);
    if (filters.page) params.append("page", filters.page.toString());

    const response = await api.get<ApiResponse<Lead[]>>(`/leads?${params.toString()}`);
    return response.data;
  },

  getLead: async (id: string): Promise<ApiResponse<Lead>> => {
    const response = await api.get<ApiResponse<Lead>>(`/leads/${id}`);
    return response.data;
  },

  createLead: async (data: LeadFormData): Promise<ApiResponse<Lead>> => {
    const response = await api.post<ApiResponse<Lead>>("/leads", data);
    return response.data;
  },

  updateLead: async (id: string, data: Partial<LeadFormData>): Promise<ApiResponse<Lead>> => {
    const response = await api.put<ApiResponse<Lead>>(`/leads/${id}`, data);
    return response.data;
  },

  deleteLead: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/leads/${id}`);
    return response.data;
  },

  exportCsv: async (filters: LeadFilters): Promise<void> => {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.status) params.append("status", filters.status);
    if (filters.source) params.append("source", filters.source);

    const response = await api.get(`/leads/export/csv?${params.toString()}`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `leads_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await api.get<ApiResponse<DashboardStats>>("/leads/stats");
    return response.data;
  },
};

export const getPaginationMeta = (response: { data: { meta?: PaginationMeta } }): PaginationMeta | undefined => {
  return response.data.meta;
};
