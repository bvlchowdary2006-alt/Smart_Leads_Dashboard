import type { Request, Response } from "express";
import * as leadService from "../services/leadService";
import { createApiResponse, asyncHandler, AppError } from "../utils/helpers";
import type { CreateLeadInput, UpdateLeadInput } from "../validators/lead";
import type { LeadFilters, LeadStatus, LeadSource } from "../types";
import { DEFAULT_PAGINATION, LEAD_STATUS, LEAD_SOURCE } from "../constants";

const isLeadStatus = (value: unknown): value is LeadStatus => {
  return typeof value === "string" && Object.values(LEAD_STATUS).includes(value as LeadStatus);
};

const isLeadSource = (value: unknown): value is LeadSource => {
  return typeof value === "string" && Object.values(LEAD_SOURCE).includes(value as LeadSource);
};

export const createLead = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Authentication required.", 401);
  }

  const input = req.body as CreateLeadInput;
  const lead = await leadService.createLead(input, req.user.id);

  res.status(201).json(createApiResponse(true, "Lead created successfully.", lead));
});

export const getLeads = asyncHandler(async (req: Request, res: Response) => {
  const page = typeof req.query.page === "string" ? parseInt(req.query.page, 10) : DEFAULT_PAGINATION.PAGE;
  const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit, 10) : DEFAULT_PAGINATION.LIMIT;
  const search = typeof req.query.search === "string" ? req.query.search : undefined;
  const status = isLeadStatus(req.query.status) ? req.query.status : undefined;
  const source = isLeadSource(req.query.source) ? req.query.source : undefined;
  const sort = req.query.sort === "oldest" ? "oldest" : "latest" as const;

  const filters: LeadFilters = { search, status, source, sort };

  const { leads, meta } = await leadService.getLeads(filters, page, limit);

  res.status(200).json(createApiResponse(true, "Leads fetched successfully.", leads, meta));
});

export const getLeadById = asyncHandler(async (req: Request, res: Response) => {
  const lead = await leadService.getLeadById(req.params.id);
  res.status(200).json(createApiResponse(true, "Lead fetched successfully.", lead));
});

export const updateLead = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as UpdateLeadInput;
  const lead = await leadService.updateLead(req.params.id, input);
  res.status(200).json(createApiResponse(true, "Lead updated successfully.", lead));
});

export const deleteLead = asyncHandler(async (req: Request, res: Response) => {
  await leadService.deleteLead(req.params.id);
  res.status(200).json(createApiResponse(true, "Lead deleted successfully."));
});

export const exportCsv = asyncHandler(async (req: Request, res: Response) => {
  const search = typeof req.query.search === "string" ? req.query.search : undefined;
  const status = isLeadStatus(req.query.status) ? req.query.status : undefined;
  const source = isLeadSource(req.query.source) ? req.query.source : undefined;

  const filters: LeadFilters = { search, status, source };
  const leads = await leadService.exportLeads(filters);

  const headers = ["Name", "Email", "Status", "Source", "Created By", "Created At"];
  const csvRows = [headers.join(",")];

  leads.forEach((lead) => {
    const createdByObj = lead.createdBy as { name?: string } | undefined;
    const row = [
      `"${lead.name}"`,
      `"${lead.email}"`,
      `"${lead.status}"`,
      `"${lead.source}"`,
      `"${createdByObj?.name || "Unknown"}"`,
      `"${new Date(lead.createdAt).toISOString()}"`,
    ];
    csvRows.push(row.join(","));
  });

  const csvContent = csvRows.join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=leads.csv");
  res.status(200).send(csvContent);
});

export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await leadService.getDashboardStats();
  res.status(200).json(createApiResponse(true, "Dashboard stats fetched successfully.", stats));
});
