export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "sales";
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: "New" | "Contacted" | "Qualified" | "Lost";
  source: "Website" | "Instagram" | "Referral";
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pages: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
}

export interface LeadFilters {
  search?: string;
  status?: string;
  source?: string;
  sort?: "latest" | "oldest";
  page?: number;
}

export interface DashboardStats {
  totalLeads: number;
  leadsByStatus: { _id: string; count: number }[];
  leadsBySource: { _id: string; count: number }[];
  recentLeads: Lead[];
}

export type LeadFormData = Omit<Lead, "_id" | "createdBy" | "createdAt" | "updatedAt">;

export type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginFormData = {
  email: string;
  password: string;
};
