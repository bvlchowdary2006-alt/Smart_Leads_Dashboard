import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/context/ToastContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastContainer } from "@/components/common/ToastContainer";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { UnauthorizedPage } from "@/pages/auth/UnauthorizedPage";
import { NotFoundPage } from "@/pages/auth/NotFoundPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { LeadsPage } from "@/pages/leads/LeadsPage";
import { LeadDetailPage } from "@/pages/leads/LeadDetailPage";
import { LeadFormPage } from "@/pages/leads/LeadFormPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route
                  path="/"
                  element={
                    <DashboardLayout>
                      <Navigate to="/dashboard" replace />
                    </DashboardLayout>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <DashboardLayout>
                      <DashboardPage />
                    </DashboardLayout>
                  }
                />
                <Route
                  path="/leads"
                  element={
                    <DashboardLayout>
                      <LeadsPage />
                    </DashboardLayout>
                  }
                />
                <Route
                  path="/leads/new"
                  element={
                    <DashboardLayout>
                      <LeadFormPage />
                    </DashboardLayout>
                  }
                />
                <Route
                  path="/leads/:id"
                  element={
                    <DashboardLayout>
                      <LeadDetailPage />
                    </DashboardLayout>
                  }
                />
                <Route
                  path="/leads/:id/edit"
                  element={
                    <DashboardLayout>
                      <LeadFormPage />
                    </DashboardLayout>
                  }
                />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
          <ToastContainer />
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
