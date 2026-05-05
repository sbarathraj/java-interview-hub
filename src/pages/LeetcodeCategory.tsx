import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLeetcode } from "@/hooks/useLeetcode";
import { LEETCODE_CATEGORIES, getCategory } from "@/data/leetcodeCategories";
import { LeetSolutionRow } from "@/components/LeetSolutionRow";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function LeetcodeCategory() {
  const { categoryId = "" } = useParams();
  const cat = getCategory(categoryId);
  const { items, loading } = useLeetcode();
  const [q, setQ] = useState("");
  const [diff, setDiff] = useState<"all" | "easy" | "medium" | "hard">("all");

  const list = useMemo(() => {
    return items
      .filter((s) => s.category === categoryId)
      .filter((s) => diff === "all" || s.difficulty === diff)
      .filter((s) => {
        if (!q) return true;
        const t = q.toLowerCase();
        return s.title.toLowerCase().includes(t)
          || String(s.problem_number).includes(t)
          || s.tags.some((tag) => tag.toLowerCase().includes(t));
      });
  }, [items, categoryId, q, diff]);

  if (!cat) return (
    <div className="container py-10">
      <p className="text-muted-foreground">Unknown category.</p>
      <Link to="/leetcode" className="text-primary">Back to dashboard</Link>
    </div>
  );

  return (
    <div className="container py-8">
      <Link to="/leetcode" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>

      <header className="rounded-2xl border border-border bg-gradient-card p-6 shadow-card">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">{cat.emoji} {cat.name}</h1>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {cat.subtopics.map((t) => (
                <span key={t} className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs text-muted-foreground">{t}</span>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-background px-5 py-3 text-center">
            <div className="text-xs uppercase text-muted-foreground">Solved</div>
            <div className="font-display text-3xl font-bold text-primary">{list.length}</div>
          </div>
        </div>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by title, number or tag…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select value={diff} onChange={(e) => setDiff(e.target.value as any)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm">
          <option value="all">All difficulty</option>
          <option value="easy">🟢 Easy</option>
          <option value="medium">🟡 Medium</option>
          <option value="hard">🔴 Hard</option>
        </select>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {loading ? <div className="text-sm text-muted-foreground">Loading…</div> :
          list.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No problems yet in this category. <Link to="/leetcode/add" className="text-primary">Add one →</Link>
            </div>
          ) : list.map((s) => <LeetSolutionRow key={s.id} s={s} />)
        }
      </div>

      <div className="mt-10">
        <h3 className="font-display text-lg font-semibold">Other categories</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {LEETCODE_CATEGORIES.filter((c) => c.id !== categoryId).map((c) => (
            <Link key={c.id} to={`/leetcode/category/${c.id}`}
              className="rounded-full border border-border bg-background px-3 py-1 text-xs hover:border-primary/40 hover:text-primary">
              {c.emoji} {c.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
