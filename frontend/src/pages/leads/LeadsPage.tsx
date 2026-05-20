import { useState, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Search, Download, Filter } from "lucide-react";
import { useLeads, useDeleteLead, useExportCsv } from "@/hooks/useLeads";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Pagination } from "@/components/common/Pagination";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { TableSkeleton } from "@/components/common/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { getStatusColor, getSourceColor, formatDate, debounce } from "@/utils";
import type { LeadFilters } from "@/types";

export function LeadsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<LeadFilters>({
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || undefined,
    source: searchParams.get("source") || undefined,
    sort: (searchParams.get("sort") as "latest" | "oldest") || "latest",
    page: parseInt(searchParams.get("page") || "1", 10),
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const { data, isLoading } = useLeads(filters);
  const deleteMutation = useDeleteLead();
  const exportMutation = useExportCsv();

  useEffect(() => {
    const params: Record<string, string> = {};
    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;
    if (filters.source) params.source = filters.source;
    if (filters.sort) params.sort = filters.sort;
    if (filters.page && filters.page > 1) params.page = filters.page.toString();
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleSearch = useCallback(
    debounce((value: string) => {
      setFilters((prev) => ({ ...prev, search: value, page: 1 }));
    }, 300),
    []
  );

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      addToast("Lead deleted successfully", "success");
      setDeleteId(null);
    } catch {
      addToast("Failed to delete lead", "error");
    }
  };

  const handleExport = async () => {
    try {
      await exportMutation.mutateAsync(filters);
      addToast("CSV exported successfully", "success");
    } catch {
      addToast("Failed to export CSV", "error");
    }
  };

  const meta = data?.meta;
  const leads = data?.data || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Leads</h1>
            <p className="text-muted-foreground">Manage and track your leads</p>
          </div>
        </div>
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leads</h1>
          <p className="text-muted-foreground">Manage and track your leads</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} isLoading={exportMutation.isPending}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          {user && (
            <Button onClick={() => navigate("/leads/new")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Lead
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border bg-card p-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex-1">
            <Input
              placeholder="Search by name or email..."
              onChange={(e) => handleSearch(e.target.value)}
              defaultValue={filters.search}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select
              options={[
                { value: "", label: "All Status" },
                { value: "New", label: "New" },
                { value: "Contacted", label: "Contacted" },
                { value: "Qualified", label: "Qualified" },
                { value: "Lost", label: "Lost" },
              ]}
              value={filters.status || ""}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value || undefined, page: 1 }))}
              className="w-36"
            />
            <Select
              options={[
                { value: "", label: "All Sources" },
                { value: "Website", label: "Website" },
                { value: "Instagram", label: "Instagram" },
                { value: "Referral", label: "Referral" },
              ]}
              value={filters.source || ""}
              onChange={(e) => setFilters((prev) => ({ ...prev, source: e.target.value || undefined, page: 1 }))}
              className="w-36"
            />
            <Select
              options={[
                { value: "latest", label: "Latest" },
                { value: "oldest", label: "Oldest" },
              ]}
              value={filters.sort || "latest"}
              onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value as "latest" | "oldest", page: 1 }))}
              className="w-32"
            />
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Source</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Created</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {leads.length > 0 ? (
                leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">{lead.name}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{lead.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getSourceColor(lead.source)}`}>
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(lead.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/leads/${lead._id}`)}>
                          View
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/leads/${lead._id}/edit`)}>
                          Edit
                        </Button>
                        {user?.role === "admin" && (
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteId(lead._id)}>
                            Delete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      title="No leads found"
                      description="Try adjusting your filters or add a new lead"
                      action={
                        <Button onClick={() => navigate("/leads/new")}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Lead
                        </Button>
                      }
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {meta && meta.pages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Showing {(meta.page - 1) * meta.limit + 1} to{" "}
              {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} results
            </p>
            <Pagination currentPage={meta.page} totalPages={meta.pages} onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))} />
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Lead"
        description="Are you sure you want to delete this lead? This action cannot be undone."
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
