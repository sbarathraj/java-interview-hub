import { Link, NavLink, useNavigate } from "react-router-dom";
import { Coffee, BookmarkCheck, BarChart3, Brain, Menu, X, ChevronDown, Sparkles, LogOut } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
    isActive ? "bg-primary/10 text-primary" : "text-foreground/80 hover:bg-muted hover:text-foreground"
  );

export const Navbar = () => {
  const { topics } = useApp();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [topicsOpen, setTopicsOpen] = useState(false);
  const nav = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    nav("/auth", { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-elegant">
            <Coffee className="h-5 w-5" />
          </span>
          <span className="hidden sm:inline">Barath's Refresh Portal</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/" end className={linkClass}>Home</NavLink>

          <div className="relative" onMouseLeave={() => setTopicsOpen(false)}>
            <button
              onClick={() => setTopicsOpen((o) => !o)}
              onMouseEnter={() => setTopicsOpen(true)}
              className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-muted hover:text-foreground"
            >
              Topics <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {topicsOpen && (
              <div className="absolute left-0 top-full mt-1 w-72 animate-fade-in rounded-xl border border-border bg-popover p-2 shadow-elegant">
                {topics.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { nav(`/topic/${t.id}`); setTopicsOpen(false); }}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <NavLink to="/ai" className={linkClass}><span className="inline-flex items-center gap-1.5"><Sparkles className="h-4 w-4" />AI Studio</span></NavLink>
          <NavLink to="/quiz" className={linkClass}><span className="inline-flex items-center gap-1.5"><Brain className="h-4 w-4" />Quiz</span></NavLink>
          <NavLink to="/bookmarks" className={linkClass}><span className="inline-flex items-center gap-1.5"><BookmarkCheck className="h-4 w-4" />Bookmarks</span></NavLink>
          <NavLink to="/progress" className={linkClass}><span className="inline-flex items-center gap-1.5"><BarChart3 className="h-4 w-4" />Progress</span></NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user && (
            <button
              onClick={handleSignOut}
              title={user.email ?? "Sign out"}
              className="hidden h-9 items-center gap-1.5 rounded-md border border-border px-3 text-xs font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground md:inline-flex"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          )}
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="animate-accordion-down border-t border-border bg-background md:hidden">
          <div className="container flex flex-col gap-1 py-3">
            <NavLink to="/" end onClick={() => setMobileOpen(false)} className={linkClass}>Home</NavLink>
            <NavLink to="/ai" onClick={() => setMobileOpen(false)} className={linkClass}>AI Studio</NavLink>
            <NavLink to="/quiz" onClick={() => setMobileOpen(false)} className={linkClass}>Quiz</NavLink>
            <NavLink to="/bookmarks" onClick={() => setMobileOpen(false)} className={linkClass}>Bookmarks</NavLink>
            <NavLink to="/progress" onClick={() => setMobileOpen(false)} className={linkClass}>Progress</NavLink>
            <div className="my-2 border-t border-border" />
            <div className="px-3 text-xs font-semibold uppercase text-muted-foreground">Topics</div>
            {topics.map((t) => (
              <NavLink key={t.id} to={`/topic/${t.id}`} onClick={() => setMobileOpen(false)} className={linkClass}>
                {t.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
