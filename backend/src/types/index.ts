import { USER_ROLES, LEAD_STATUS, LEAD_SOURCE } from "../constants";

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export type LeadStatus = (typeof LEAD_STATUS)[keyof typeof LEAD_STATUS];

export type LeadSource = (typeof LEAD_SOURCE)[keyof typeof LEAD_SOURCE];

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
  stack?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: LeadStatus;
  source?: LeadSource;
  sort?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pages: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
}

export interface LeadFilters {
  search?: string;
  status?: LeadStatus;
  source?: LeadSource;
  sort?: "latest" | "oldest";
}
