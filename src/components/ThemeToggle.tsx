import { Moon, Sun } from "lucide-react";
import { useApp } from "@/context/AppContext";

export const ThemeToggle = () => {
  const { theme, setTheme } = useApp();
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background hover:bg-muted transition-colors"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
};
