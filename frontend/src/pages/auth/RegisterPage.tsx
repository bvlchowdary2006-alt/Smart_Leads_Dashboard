import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { AuthForm, type RegisterValues } from "@/components/forms/AuthForm";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/context/ToastContext";

export function RegisterPage() {
  const { register, isRegistering } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: RegisterValues) => {
    setError(null);
    try {
      await register(data);
      addToast("Account created successfully!", "success");
      navigate("/dashboard");
    } catch (err: unknown) {
      const message =
        err instanceof Error && "response" in err
          ? ((err as { response?: { data?: { message?: string } } }).response?.data?.message ?? "Registration failed")
          : "Registration failed";
      setError(message);
      addToast(message, "error");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-xl"
      >
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Users className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="mt-2 text-muted-foreground">Get started with Smart Leads</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900 dark:text-red-200">
            {error}
          </div>
        )}

        <AuthForm mode="register" onSubmit={handleSubmit} isLoading={isRegistering} />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
