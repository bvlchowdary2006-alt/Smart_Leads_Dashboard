import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/common/Button";

export function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <ShieldAlert className="mx-auto mb-4 h-16 w-16 text-destructive" />
        <h1 className="mb-2 text-3xl font-bold">Access Denied</h1>
        <p className="mb-6 text-muted-foreground">You don&apos;t have permission to access this page.</p>
        <Link to="/dashboard">
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
