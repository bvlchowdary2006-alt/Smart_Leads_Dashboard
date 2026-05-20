import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLead, useCreateLead, useUpdateLead } from "@/hooks/useLeads";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/common/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { LeadForm, type LeadFormValues } from "@/components/forms/LeadForm";
import { TableSkeleton } from "@/components/common/Skeleton";

export function LeadFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const isEditing = !!id;

  const { data: leadData, isLoading: isLoadingLead } = useLead(id || "");
  const createMutation = useCreateLead();
  const updateMutation = useUpdateLead();

  const handleSubmit = async (formData: LeadFormValues) => {
    try {
      if (isEditing && id) {
        await updateMutation.mutateAsync({ id, data: formData });
        addToast("Lead updated successfully", "success");
      } else {
        await createMutation.mutateAsync(formData);
        addToast("Lead created successfully", "success");
      }
      navigate("/leads");
    } catch {
      addToast(isEditing ? "Failed to update lead" : "Failed to create lead", "error");
    }
  };

  if (isEditing && isLoadingLead) {
    return <TableSkeleton />;
  }

  const initialData = isEditing && leadData?.data ? {
    name: leadData.data.name,
    email: leadData.data.email,
    status: leadData.data.status,
    source: leadData.data.source,
  } : undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/leads")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{isEditing ? "Edit Lead" : "Create Lead"}</h1>
          <p className="text-muted-foreground">{isEditing ? "Update lead information" : "Add a new lead to your pipeline"}</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{isEditing ? "Lead Details" : "New Lead"}</CardTitle>
        </CardHeader>
        <CardContent>
          <LeadForm
            initialData={initialData}
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending || updateMutation.isPending}
            submitLabel={isEditing ? "Update Lead" : "Create Lead"}
          />
        </CardContent>
      </Card>
    </div>
  );
}
