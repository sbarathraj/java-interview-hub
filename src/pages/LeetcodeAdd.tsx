import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { createSolution } from "@/hooks/useLeetcode";
import { LEETCODE_CATEGORIES, COMMON_TAGS } from "@/data/leetcodeCategories";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Save, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function LeetcodeAdd() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [form, setForm] = useState({
    problem_number: "" as string | number,
    title: "",
    leetcode_url: "",
    difficulty: "easy" as "easy" | "medium" | "hard",
    category: "arrays",
    tags: [] as string[],
    code: "",
    approach: "",
    time_complexity: "",
    space_complexity: "",
    status: "solved" as "solved" | "revisit" | "unsolved",
    date_solved: new Date().toISOString().slice(0, 10),
    notes: "",
  });

  const update = (k: keyof typeof form, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const toggleTag = (t: string) => {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(t) ? f.tags.filter((x) => x !== t) : [...f.tags, t],
    }));
  };

  const aiAnalyze = async () => {
    if (!form.code.trim()) { toast.error("Paste your code first"); return; }
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("leetcode-ai-analyze", {
        body: { title: form.title, problemNumber: form.problem_number, code: form.code, language: "java" },
      });
      if (error) throw error;
      setForm((f) => ({
        ...f,
        approach: data.approach ?? f.approach,
        time_complexity: data.time_complexity ?? f.time_complexity,
        space_complexity: data.space_complexity ?? f.space_complexity,
        notes: data.notes ?? f.notes,
        tags: Array.from(new Set([...(f.tags ?? []), ...((data.tags as string[]) ?? [])])),
      }));
      toast.success("AI analysis complete");
    } catch (e: any) {
      toast.error("AI failed", { description: e.message });
    } finally {
      setAnalyzing(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.title || !form.problem_number) { toast.error("Title and number required"); return; }
    setSaving(true);
    const { data, error } = await createSolution({
      user_id: user.id,
      problem_number: Number(form.problem_number),
      title: form.title,
      leetcode_url: form.leetcode_url || null,
      difficulty: form.difficulty,
      category: form.category,
      tags: form.tags,
      status: form.status,
      date_solved: form.date_solved,
      code: form.code,
      approach: form.approach || null,
      time_complexity: form.time_complexity || null,
      space_complexity: form.space_complexity || null,
      notes: form.notes || null,
    } as any);
    setSaving(false);
    if (error) { toast.error("Failed to save", { description: error.message }); return; }
    toast.success("Solution saved");
    nav(`/leetcode/problem/${data!.id}`);
  };

  return (
    <div className="container max-w-4xl py-8">
      <Link to="/leetcode" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>
      <h1 className="font-display text-3xl font-bold">Add LeetCode Solution</h1>
      <p className="mt-1 text-muted-foreground">Save your solved problems with code, complexity and notes.</p>

      <form onSubmit={submit} className="mt-6 grid gap-5 rounded-xl border border-border bg-card p-6 shadow-card">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground">Problem #</label>
            <Input type="number" min={1} value={form.problem_number} onChange={(e) => update("problem_number", e.target.value)} required />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold uppercase text-muted-foreground">Title</label>
            <Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Two Sum" required />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase text-muted-foreground">LeetCode URL</label>
          <Input type="url" value={form.leetcode_url} onChange={(e) => update("leetcode_url", e.target.value)} placeholder="https://leetcode.com/problems/..." />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground">Difficulty</label>
            <select value={form.difficulty} onChange={(e) => update("difficulty", e.target.value)}
              className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
              <option value="easy">🟢 Easy</option>
              <option value="medium">🟡 Medium</option>
              <option value="hard">🔴 Hard</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground">Category</label>
            <select value={form.category} onChange={(e) => update("category", e.target.value)}
              className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
              {LEETCODE_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground">Status</label>
            <select value={form.status} onChange={(e) => update("status", e.target.value)}
              className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
              <option value="solved">✅ Solved</option>
              <option value="revisit">🔁 Need to Revisit</option>
              <option value="unsolved">❌ Couldn't Solve</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase text-muted-foreground">Tags</label>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {COMMON_TAGS.map((t) => {
              const on = form.tags.includes(t);
              return (
                <button type="button" key={t} onClick={() => toggleTag(t)}
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                    on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-muted"
                  }`}>{t}</button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-xs font-semibold uppercase text-muted-foreground">Solution Code (Java)</label>
            <Button type="button" variant="outline" size="sm" onClick={aiAnalyze} disabled={analyzing}>
              {analyzing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              {analyzing ? "Analyzing…" : "AI Analyze"}
            </Button>
          </div>
          <Textarea value={form.code} onChange={(e) => update("code", e.target.value)} rows={14}
            className="font-mono text-xs" placeholder="class Solution { ... }" />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase text-muted-foreground">Approach / Explanation</label>
          <Textarea value={form.approach} onChange={(e) => update("approach", e.target.value)} rows={3} />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground">Time Complexity</label>
            <Input value={form.time_complexity} onChange={(e) => update("time_complexity", e.target.value)} placeholder="O(n)" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground">Space Complexity</label>
            <Input value={form.space_complexity} onChange={(e) => update("space_complexity", e.target.value)} placeholder="O(1)" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground">Date Solved</label>
            <Input type="date" value={form.date_solved} onChange={(e) => update("date_solved", e.target.value)} />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase text-muted-foreground">Notes</label>
          <Textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} rows={2}
            placeholder="Edge cases, mistakes you made, gotchas…" />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => nav(-1)}>Cancel</Button>
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Solution
          </Button>
        </div>
      </form>
    </div>
  );
}
