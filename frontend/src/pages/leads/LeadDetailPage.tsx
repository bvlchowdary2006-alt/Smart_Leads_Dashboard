import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Calendar, User } from "lucide-react";
import { useLead } from "@/hooks/useLeads";
import { Button } from "@/components/common/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { getStatusColor, getSourceColor, formatDate } from "@/utils";
import { TableSkeleton } from "@/components/common/Skeleton";

export function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useLead(id || "");

  if (isLoading) {
    return (
      <div className="space-y-6">
        <TableSkeleton />
      </div>
    );
  }

  const lead = data?.data;
  if (!lead) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate("/leads")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Leads
        </Button>
        <div className="text-center text-muted-foreground">Lead not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/leads")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{lead.name}</h1>
          <p className="text-muted-foreground">Lead details</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lead Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{lead.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{lead.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <span className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(lead.status)}`}>
                  {lead.status}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Source</p>
              <span className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-medium ${getSourceColor(lead.source)}`}>
                {lead.source}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="font-medium">{formatDate(lead.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Updated At</p>
                <p className="font-medium">{formatDate(lead.updatedAt)}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created By</p>
              <p className="font-medium">{lead.createdBy?.name || "Unknown"}</p>
              <p className="text-sm text-muted-foreground">{lead.createdBy?.email || ""}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        <Button onClick={() => navigate(`/leads/${lead._id}/edit`)}>Edit Lead</Button>
      </div>
    </div>
  );
}
