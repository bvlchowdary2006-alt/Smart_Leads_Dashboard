export const USER_ROLES = {
  ADMIN: "admin",
  SALES: "sales",
} as const;

export const LEAD_STATUS = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  LOST: "Lost",
} as const;

export const LEAD_SOURCE = {
  WEBSITE: "Website",
  INSTAGRAM: "Instagram",
  REFERRAL: "Referral",
} as const;

export const SORT_ORDER = {
  LATEST: "-createdAt",
  OLDEST: "createdAt",
} as const;

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
} as const;
