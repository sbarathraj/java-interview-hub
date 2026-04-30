import { createContext, ReactNode, useContext, useEffect, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { questions, topics, Question } from "@/data/questions";

type Theme = "light" | "dark";

interface AppContextValue {
  completed: Record<number, boolean>;
  bookmarks: Record<number, boolean>;
  toggleCompleted: (id: number) => void;
  toggleBookmark: (id: number) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  questions: Question[];
  topics: typeof topics;
  progressByTopic: Record<string, { total: number; done: number; pct: number }>;
  totalDone: number;
}

const Ctx = createContext<AppContextValue | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [completed, setCompleted] = useLocalStorage<Record<number, boolean>>("irp.completed", {});
  const [bookmarks, setBookmarks] = useLocalStorage<Record<number, boolean>>("irp.bookmarks", {});
  const [theme, setTheme] = useLocalStorage<Theme>("irp.theme", "light");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  const toggleCompleted = (id: number) =>
    setCompleted((p) => ({ ...p, [id]: !p[id] }));
  const toggleBookmark = (id: number) =>
    setBookmarks((p) => ({ ...p, [id]: !p[id] }));

  const { progressByTopic, totalDone } = useMemo(() => {
    const map: Record<string, { total: number; done: number; pct: number }> = {};
    topics.forEach((t) => (map[t.id] = { total: 0, done: 0, pct: 0 }));
    let total = 0;
    questions.forEach((q) => {
      map[q.topic].total++;
      if (completed[q.id]) {
        map[q.topic].done++;
        total++;
      }
    });
    Object.values(map).forEach((m) => {
      m.pct = m.total ? Math.round((m.done / m.total) * 100) : 0;
    });
    return { progressByTopic: map, totalDone: total };
  }, [completed]);

  const value: AppContextValue = {
    completed,
    bookmarks,
    toggleCompleted,
    toggleBookmark,
    theme,
    setTheme,
    questions,
    topics,
    progressByTopic,
    totalDone,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useApp = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used within AppProvider");
  return v;
};
