import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useLeetcode, updateSolution, LeetSolution } from "@/hooks/useLeetcode";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { getCategoryName } from "@/data/leetcodeCategories";
import { ArrowLeft, CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LeetcodeRevisit() {
  const { items, loading, refresh } = useLeetcode();

  const queue = useMemo(
    () => items
      .filter((s) => s.status === "revisit" || s.status === "unsolved")
      .sort((a, b) => a.date_solved.localeCompare(b.date_solved)),
    [items]
  );

  const markSolved = async (s: LeetSolution) => {
    const { error } = await updateSolution(s.id, { status: "solved", date_solved: new Date().toISOString().slice(0, 10) });
    if (error) toast.error("Failed");
    else { toast.success(`${s.title} marked solved`); refresh(); }
  };

  return (
    <div className="container max-w-4xl py-8">
      <Link to="/leetcode" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>
      <header className="rounded-2xl border border-border bg-gradient-card p-6 shadow-card">
        <h1 className="font-display text-3xl font-bold">🔁 Revisit Queue</h1>
        <p className="mt-1 text-muted-foreground">
          Spaced-repetition style — oldest first. Quickly mark as solved after re-practicing.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          {queue.length} problem{queue.length !== 1 ? "s" : ""} pending
        </div>
      </header>

      <div className="mt-6 flex flex-col gap-2">
        {loading ? <div className="text-sm text-muted-foreground">Loading…</div> :
          queue.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              🎉 Inbox zero! No problems to revisit.
            </div>
          ) : queue.map((s) => (
            <div key={s.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted font-mono text-xs font-bold">
                {s.problem_number}
              </div>
              <Link to={`/leetcode/problem/${s.id}`} className="min-w-0 flex-1 hover:text-primary">
                <div className="truncate font-semibold">{s.title}</div>
                <div className="text-xs text-muted-foreground">
                  {getCategoryName(s.category)} • last seen {new Date(s.date_solved).toLocaleDateString()}
                </div>
              </Link>
              <DifficultyBadge difficulty={s.difficulty} />
              <span className="inline-flex items-center gap-1 rounded-full bg-medium/15 px-2 py-0.5 text-xs font-medium text-medium">
                <RotateCcw className="h-3 w-3" /> {s.status}
              </span>
              <Button size="sm" variant="outline" onClick={() => markSolved(s)}>
                <CheckCircle2 className="h-4 w-4" /> Solved
              </Button>
            </div>
          ))
        }
      </div>
    </div>
  );
}
