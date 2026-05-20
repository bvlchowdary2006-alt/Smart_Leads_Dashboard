import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;

interface AuthFormProps {
  mode: "login" | "register";
  onSubmit: (data: LoginValues | RegisterValues) => void;
  isLoading?: boolean;
}

export function AuthForm({ mode, onSubmit, isLoading }: AuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues | RegisterValues>({
    resolver: zodResolver(mode === "login" ? loginSchema : registerSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {mode === "register" && (
        <Input
          label="Name"
          {...register("name")}
          error={errors.name?.message}
          placeholder="Enter your name"
        />
      )}
      <Input
        label="Email"
        {...register("email")}
        error={errors.email?.message}
        placeholder="Enter your email"
        type="email"
      />
      <Input
        label="Password"
        {...register("password")}
        error={errors.password?.message}
        placeholder="Enter your password"
        type="password"
      />
      {mode === "register" && (
        <Input
          label="Confirm Password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
          placeholder="Confirm your password"
          type="password"
        />
      )}
      <Button type="submit" className="w-full" isLoading={isLoading} size="lg">
        {mode === "login" ? "Sign In" : "Create Account"}
      </Button>
    </form>
  );
}
