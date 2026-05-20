import Lead from "../models/Lead";
import { AppError } from "../utils/helpers";
import type { CreateLeadInput, UpdateLeadInput } from "../validators/lead";
import type { LeadFilters, PaginationMeta } from "../types";
import { DEFAULT_PAGINATION } from "../constants";

export const createLead = async (input: CreateLeadInput, userId: string) => {
  const lead = await Lead.create({
    ...input,
    createdBy: userId,
  });
  return lead;
};

export const getLeads = async (
  filters: LeadFilters,
  page: number = DEFAULT_PAGINATION.PAGE,
  limit: number = DEFAULT_PAGINATION.LIMIT
) => {
  const query: Record<string, unknown> = {};

  if (filters.search) {
    const searchRegex = new RegExp(filters.search, "i");
    query.$or = [
      { name: searchRegex },
      { email: searchRegex },
    ];
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.source) {
    query.source = filters.source;
  }

  const sortField = filters.sort === "oldest" ? { createdAt: 1 as const } : { createdAt: -1 as const };

  const total = await Lead.countDocuments(query);
  const leads = await Lead.find(query)
    .populate("createdBy", "name email")
    .sort(sortField)
    .skip((page - 1) * limit)
    .limit(limit);

  const totalPages = Math.ceil(total / limit);

  const meta: PaginationMeta = {
    total,
    page,
    pages: totalPages,
    limit,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };

  return { leads, meta };
};

export const getLeadById = async (leadId: string) => {
  const lead = await Lead.findById(leadId).populate("createdBy", "name email");
  if (!lead) {
    throw new AppError("Lead not found.", 404);
  }
  return lead;
};

export const updateLead = async (leadId: string, input: UpdateLeadInput) => {
  const lead = await Lead.findByIdAndUpdate(leadId, input, {
    new: true,
    runValidators: true,
  }).populate("createdBy", "name email");

  if (!lead) {
    throw new AppError("Lead not found.", 404);
  }
  return lead;
};

export const deleteLead = async (leadId: string): Promise<void> => {
  const lead = await Lead.findByIdAndDelete(leadId);
  if (!lead) {
    throw new AppError("Lead not found.", 404);
  }
};

export const exportLeads = async (filters: LeadFilters) => {
  const query: Record<string, unknown> = {};

  if (filters.search) {
    const searchRegex = new RegExp(filters.search, "i");
    query.$or = [
      { name: searchRegex },
      { email: searchRegex },
    ];
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.source) {
    query.source = filters.source;
  }

  return Lead.find(query).populate("createdBy", "name email").sort({ createdAt: -1 as const }).lean();
};

export const getDashboardStats = async () => {
  const totalLeads = await Lead.countDocuments();

  const leadsByStatus = await Lead.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  const leadsBySource = await Lead.aggregate([
    { $group: { _id: "$source", count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  const recentLeads = await Lead.find()
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 as const })
    .limit(5)
    .lean();

  return {
    totalLeads,
    leadsByStatus,
    leadsBySource,
    recentLeads,
  };
};
