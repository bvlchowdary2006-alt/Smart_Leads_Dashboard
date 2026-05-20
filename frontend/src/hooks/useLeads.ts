import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { leadsApi } from "@/api/leadsApi";
import type { LeadFilters, LeadFormData } from "@/types";

export function useLeads(filters: LeadFilters) {
  return useQuery({
    queryKey: ["leads", filters],
    queryFn: () => leadsApi.getLeads(filters),
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: ["lead", id],
    queryFn: () => leadsApi.getLead(id),
    enabled: !!id,
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LeadFormData) => leadsApi.createLead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LeadFormData> }) =>
      leadsApi.updateLead(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["lead", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => leadsApi.deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: leadsApi.getDashboardStats,
  });
}

export function useExportCsv() {
  return useMutation({
    mutationFn: (filters: LeadFilters) => leadsApi.exportCsv(filters),
  });
}
