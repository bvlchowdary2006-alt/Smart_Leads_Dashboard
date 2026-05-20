import { FileQuestion } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/common/Button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <FileQuestion className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
        <h1 className="mb-2 text-3xl font-bold">404 - Page Not Found</h1>
        <p className="mb-6 text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link to="/dashboard">
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
