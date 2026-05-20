import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Button } from "@/components/common/Button";

const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  status: z.enum(["New", "Contacted", "Qualified", "Lost"]),
  source: z.enum(["Website", "Instagram", "Referral"]),
});

export type LeadFormValues = z.infer<typeof leadSchema>;

interface LeadFormProps {
  initialData?: Partial<LeadFormValues>;
  onSubmit: (data: LeadFormValues) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function LeadForm({ initialData, onSubmit, isLoading, submitLabel = "Submit" }: LeadFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      status: initialData?.status || "New",
      source: initialData?.source || "Website",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Name" {...register("name")} error={errors.name?.message} placeholder="Enter lead name" />
      <Input label="Email" {...register("email")} error={errors.email?.message} placeholder="Enter email address" type="email" />
      <Select
        label="Status"
        {...register("status")}
        error={errors.status?.message}
        options={[
          { value: "New", label: "New" },
          { value: "Contacted", label: "Contacted" },
          { value: "Qualified", label: "Qualified" },
          { value: "Lost", label: "Lost" },
        ]}
      />
      <Select
        label="Source"
        {...register("source")}
        error={errors.source?.message}
        options={[
          { value: "Website", label: "Website" },
          { value: "Instagram", label: "Instagram" },
          { value: "Referral", label: "Referral" },
        ]}
      />
      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" isLoading={isLoading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
