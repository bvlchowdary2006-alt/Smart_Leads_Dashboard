import { Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/common/Button";
import { useTheme } from "@/context/ThemeContext";

interface NavbarProps {
  onMenuToggle: () => void;
}

export function Navbar({ onMenuToggle }: NavbarProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4 lg:px-6">
      <button onClick={onMenuToggle} className="lg:hidden">
        <Menu className="h-6 w-6" />
      </button>

      <div className="ml-auto flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={toggleTheme} className="h-9 w-9 p-0">
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  );
}
