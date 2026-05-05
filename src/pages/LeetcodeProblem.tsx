import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LeetSolution, deleteSolution, getSolution, updateSolution } from "@/hooks/useLeetcode";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { CodeBlock } from "@/components/CodeBlock";
import { getCategoryName } from "@/data/leetcodeCategories";
import { ArrowLeft, ExternalLink, Pencil, Save, Trash2, RotateCcw, CheckCircle2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function LeetcodeProblem() {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const [sol, setSol] = useState<LeetSolution | null>(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState<Partial<LeetSolution>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    getSolution(id).then(({ data }) => {
      if (!mounted) return;
      setSol(data as any); setLoading(false);
    });
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div className="container py-10 text-muted-foreground">Loading…</div>;
  if (!sol) return (
    <div className="container py-10">
      <p>Solution not found.</p>
      <Link to="/leetcode" className="text-primary">Back to dashboard</Link>
    </div>
  );

  const startEdit = () => {
    setDraft({
      title: sol.title, code: sol.code, approach: sol.approach, notes: sol.notes,
      time_complexity: sol.time_complexity, space_complexity: sol.space_complexity,
      tags: sol.tags, leetcode_url: sol.leetcode_url,
    });
    setEdit(true);
  };

  const saveEdit = async () => {
    setSaving(true);
    const { data, error } = await updateSolution(sol.id, draft);
    setSaving(false);
    if (error) { toast.error("Save failed", { description: error.message }); return; }
    setSol(data as any); setEdit(false); toast.success("Updated");
  };

  const toggleRevisit = async () => {
    const next = sol.status === "revisit" ? "solved" : "revisit";
    const { data } = await updateSolution(sol.id, { status: next });
    if (data) { setSol(data as any); toast.success(next === "revisit" ? "Marked for revisit" : "Marked as solved"); }
  };

  const remove = async () => {
    if (!confirm("Delete this solution?")) return;
    const { error } = await deleteSolution(sol.id);
    if (error) { toast.error("Delete failed"); return; }
    toast.success("Deleted"); nav("/leetcode");
  };

  return (
    <div className="container max-w-5xl py-8">
      <Link to="/leetcode" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <header className="rounded-2xl border border-border bg-gradient-card p-6 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="rounded-md bg-muted px-2 py-0.5 font-mono">#{sol.problem_number}</span>
              <Link to={`/leetcode/category/${sol.category}`} className="hover:text-primary">{getCategoryName(sol.category)}</Link>
              <span>•</span>
              <span>{new Date(sol.date_solved).toLocaleDateString()}</span>
            </div>
            {edit ? (
              <Input className="mt-2 text-2xl font-bold" value={draft.title ?? ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            ) : (
              <h1 className="mt-1 font-display text-3xl font-bold">{sol.title}</h1>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <DifficultyBadge difficulty={sol.difficulty} />
              {sol.leetcode_url && (
                <a href={sol.leetcode_url} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-0.5 text-xs hover:bg-muted">
                  <ExternalLink className="h-3 w-3" /> LeetCode
                </a>
              )}
              {sol.tags.map((t) => (
                <span key={t} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{t}</span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={toggleRevisit}>
              {sol.status === "revisit" ? <><CheckCircle2 className="h-4 w-4" /> Mark Solved</> : <><RotateCcw className="h-4 w-4" /> Revisit</>}
            </Button>
            {edit ? (
              <>
                <Button size="sm" onClick={saveEdit} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setEdit(false)}><X className="h-4 w-4" /> Cancel</Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={startEdit}><Pencil className="h-4 w-4" /> Edit</Button>
            )}
            <Button variant="destructive" size="sm" onClick={remove}><Trash2 className="h-4 w-4" /> Delete</Button>
          </div>
        </div>
      </header>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs font-semibold uppercase text-muted-foreground">Time Complexity</div>
          {edit ? <Input value={draft.time_complexity ?? ""} onChange={(e) => setDraft({ ...draft, time_complexity: e.target.value })} /> :
            <div className="mt-1 font-mono text-xl text-primary">{sol.time_complexity ?? "—"}</div>}
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs font-semibold uppercase text-muted-foreground">Space Complexity</div>
          {edit ? <Input value={draft.space_complexity ?? ""} onChange={(e) => setDraft({ ...draft, space_complexity: e.target.value })} /> :
            <div className="mt-1 font-mono text-xl text-primary">{sol.space_complexity ?? "—"}</div>}
        </div>
      </section>

      <section className="mt-6">
        <h3 className="mb-2 font-display text-lg font-semibold">Solution</h3>
        {edit ? (
          <Textarea rows={16} className="font-mono text-xs" value={draft.code ?? ""} onChange={(e) => setDraft({ ...draft, code: e.target.value })} />
        ) : (
          <CodeBlock code={sol.code} language="java" filename={`${sol.title}.java`} />
        )}
      </section>

      <section className="mt-6 grid gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-display text-lg font-semibold">Approach</h3>
          {edit ? (
            <Textarea rows={4} className="mt-2" value={draft.approach ?? ""} onChange={(e) => setDraft({ ...draft, approach: e.target.value })} />
          ) : (
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{sol.approach || "—"}</p>
          )}
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-display text-lg font-semibold">Notes</h3>
          {edit ? (
            <Textarea rows={3} className="mt-2" value={draft.notes ?? ""} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} />
          ) : (
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{sol.notes || "—"}</p>
          )}
        </div>
      </section>
    </div>
  );
}
