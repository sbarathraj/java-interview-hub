import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Coffee, BookmarkCheck, BarChart3, Brain, Menu, X, ChevronDown,
  Sparkles, LogOut, Code2, FileCode2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/ai", label: "AI Studio", icon: <Sparkles className="h-3 w-3" /> },
  { to: "/leetcode", label: "LeetCode", icon: <Code2 className="h-3 w-3" /> },
  { to: "/code", label: "Code", icon: <FileCode2 className="h-3 w-3" /> },
  { to: "/quiz", label: "Quiz", icon: <Brain className="h-3 w-3" /> },
  { to: "/bookmarks", label: "Bookmarks", icon: <BookmarkCheck className="h-3 w-3" /> },
  { to: "/progress", label: "Progress", icon: <BarChart3 className="h-3 w-3" /> },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all duration-200",
    isActive
      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  );

export const Navbar = () => {
  const { topics } = useApp();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    nav("/auth", { replace: true });
  };

  return (
    <header className={cn("sticky top-0 z-50 transition-all duration-300", scrolled ? "py-2" : "py-3")}>
      <div className="container max-w-7xl">
        <div className={cn(
          "flex h-12 items-center justify-between rounded-full px-3 transition-all duration-500",
          "border border-white/80 bg-white/80 backdrop-blur-xl shadow-sm shadow-slate-200/60"
        )}>

          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 font-display text-sm font-bold group shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              <Coffee className="h-4 w-4" />
            </div>
            <span className="hidden font-extrabold text-slate-800 sm:inline">Interview<span className="text-indigo-600">Hub</span></span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-0.5 md:flex">
            {NAV_ITEMS.map(item => (
              <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                {item.icon}{item.label}
              </NavLink>
            ))}

            {/* Topics dropdown */}
            <div className="relative" onMouseLeave={() => setTopicsOpen(false)}>
              <button
                onClick={() => setTopicsOpen(o => !o)}
                onMouseEnter={() => setTopicsOpen(true)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all",
                  topicsOpen ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                Topics <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", topicsOpen && "rotate-180")} />
              </button>

              {topicsOpen && (
                <div className="absolute left-1/2 top-full mt-2 w-72 -translate-x-1/2 animate-scale-in">
                  <div className="rounded-2xl border border-slate-100 bg-white p-2 shadow-xl shadow-slate-200/80 backdrop-blur-xl">
                    <div className="grid grid-cols-1 gap-0.5 max-h-80 overflow-y-auto">
                      {topics.map(t => (
                        <button
                          key={t.id}
                          onClick={() => { nav(`/topic/${t.id}`); setTopicsOpen(false); }}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[11px] font-semibold text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
                        >
                          <div className={`h-6 w-6 shrink-0 flex items-center justify-center rounded-lg bg-gradient-to-br ${t.accent} text-white shadow-sm`}>
                            <Sparkles className="h-3 w-3" />
                          </div>
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {user && (
              <button
                onClick={handleSignOut}
                className="hidden h-8 items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 text-[10px] font-bold text-slate-600 transition-all hover:bg-red-50 hover:text-red-600 hover:border-red-200 md:inline-flex"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            )}
            <button
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 md:hidden"
              onClick={() => setMobileOpen(o => !o)}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="container mt-2 animate-slide-up md:hidden">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-4 shadow-xl">
            <div className="grid grid-cols-2 gap-1 mb-4">
              {NAV_ITEMS.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => cn(
                    "flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-bold transition-all",
                    isActive ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  {item.icon}{item.label}
                </NavLink>
              ))}
              {user && (
                <button
                  onClick={() => { setMobileOpen(false); handleSignOut(); }}
                  className="flex items-center justify-center gap-1 rounded-full bg-red-50 py-2 text-[11px] font-bold text-red-600"
                >
                  <LogOut className="h-3 w-3" /> Sign out
                </button>
              )}
            </div>

            <div className="border-t border-slate-100 pt-3">
              <p className="mb-2 px-2 text-[9px] font-bold uppercase tracking-widest text-slate-400">Topics</p>
              <div className="grid grid-cols-2 gap-1">
                {topics.map(t => (
                  <button
                    key={t.id}
                    onClick={() => { nav(`/topic/${t.id}`); setMobileOpen(false); }}
                    className="flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-left text-[10px] font-semibold text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    <div className={`h-5 w-5 shrink-0 flex items-center justify-center rounded-md bg-gradient-to-br ${t.accent} text-white`}>
                      <span className="text-[7px] font-black">{t.label[0]}</span>
                    </div>
                    <span className="truncate">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
