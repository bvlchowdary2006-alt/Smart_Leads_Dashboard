import { NavLink } from "react-router-dom";
import { cn } from "@/utils";
import { LayoutDashboard, Users, LogOut, type LucideIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
  roles?: string[];
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Leads", path: "/leads" },
];

export function Sidebar({ className }: { className?: string }) {
  const { user, logout } = useAuth();

  return (
    <aside className={cn("flex h-full w-64 flex-col border-r bg-card", className)}>
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Users className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">GigFlow</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems
          .filter((item) => !item.roles || (user && item.roles.includes(user.role)))
          .map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
      </nav>

      <div className="border-t p-4">
        <div className="mb-3 rounded-lg bg-muted p-3">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
          <span className="mt-1 inline-block rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize">
            {user?.role}
          </span>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
