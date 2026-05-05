import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useLeetcode } from "@/hooks/useLeetcode";
import { LEETCODE_CATEGORIES, getCategoryName } from "@/data/leetcodeCategories";
import { LeetSolutionRow } from "@/components/LeetSolutionRow";
import { Plus, Flame, Trophy, RotateCcw, Code2, Target } from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";
import { ProgressBar } from "@/components/ProgressBar";

const DIFF_COLORS: Record<string, string> = {
  easy: "hsl(var(--easy))",
  medium: "hsl(var(--medium))",
  hard: "hsl(var(--hard))",
};

const Stat = ({ icon, label, value, accent }: any) => (
  <div className="rounded-xl border border-border bg-gradient-card p-4 shadow-card">
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold uppercase text-muted-foreground">{label}</span>
      <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${accent}`}>{icon}</span>
    </div>
    <div className="mt-2 font-display text-3xl font-bold">{value}</div>
  </div>
);

export default function LeetcodeDashboard() {
  const { items, loading } = useLeetcode();

  const stats = useMemo(() => {
    const total = items.length;
    const easy = items.filter((i) => i.difficulty === "easy").length;
    const medium = items.filter((i) => i.difficulty === "medium").length;
    const hard = items.filter((i) => i.difficulty === "hard").length;
    const revisit = items.filter((i) => i.status === "revisit" || i.status === "unsolved").length;

    // streak: consecutive days with at least one solve, ending today or yesterday
    const days = new Set(items.map((i) => i.date_solved));
    let streak = 0;
    const d = new Date();
    while (true) {
      const key = d.toISOString().slice(0, 10);
      if (days.has(key)) { streak++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return { total, easy, medium, hard, revisit, streak };
  }, [items]);

  const pieData = [
    { name: "Easy", value: stats.easy, key: "easy" },
    { name: "Medium", value: stats.medium, key: "medium" },
    { name: "Hard", value: stats.hard, key: "hard" },
  ].filter((d) => d.value > 0);

  const lineData = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach((i) => map.set(i.date_solved, (map.get(i.date_solved) ?? 0) + 1));
    const arr = Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date: date.slice(5), count }));
    // cumulative
    let total = 0;
    return arr.map((p) => ({ ...p, total: (total += p.count) }));
  }, [items]);

  const categoryProgress = useMemo(() => {
    return LEETCODE_CATEGORIES
      .map((c) => ({
        ...c,
        count: items.filter((i) => i.category === c.id).length,
      }))
      .sort((a, b) => b.count - a.count);
  }, [items]);

  const recent = items.slice(0, 6);
  const maxCat = Math.max(1, ...categoryProgress.map((c) => c.count));

  return (
    <div className="container py-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold">
            <span className="bg-gradient-primary bg-clip-text text-transparent">LeetCode</span> Tracker
          </h1>
          <p className="mt-1 text-muted-foreground">Track, organize and revisit your DSA solutions.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/leetcode/revisit"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium hover:bg-muted"
          >
            <RotateCcw className="h-4 w-4" /> Revisit Queue
          </Link>
          <Link
            to="/leetcode/add"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-gradient-primary px-4 text-sm font-semibold text-primary-foreground shadow-elegant hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Add Solution
          </Link>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat icon={<Trophy className="h-4 w-4 text-primary" />} label="Total Solved" value={stats.total} accent="bg-primary/10" />
        <Stat icon={<Code2 className="h-4 w-4 text-easy" />} label="Easy" value={stats.easy} accent="bg-easy/15" />
        <Stat icon={<Code2 className="h-4 w-4 text-medium" />} label="Medium" value={stats.medium} accent="bg-medium/15" />
        <Stat icon={<Code2 className="h-4 w-4 text-hard" />} label="Hard" value={stats.hard} accent="bg-hard/15" />
        <Stat icon={<Flame className="h-4 w-4 text-primary" />} label="Streak (days)" value={stats.streak} accent="bg-primary/10" />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card lg:col-span-1">
          <h3 className="font-display text-lg font-semibold">Difficulty Distribution</h3>
          <div className="mt-4 h-64">
            {pieData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No data yet</div>
            ) : (
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                    {pieData.map((d) => (<Cell key={d.key} fill={DIFF_COLORS[d.key]} />))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card lg:col-span-2">
          <h3 className="font-display text-lg font-semibold">Solved Over Time</h3>
          <div className="mt-4 h-64">
            {lineData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No data yet</div>
            ) : (
              <ResponsiveContainer>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="count" name="Per Day" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="total" name="Cumulative" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" /> Category Progress
            </h3>
            <span className="text-xs text-muted-foreground">{LEETCODE_CATEGORIES.length} categories</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {categoryProgress.map((c) => (
              <Link
                key={c.id}
                to={`/leetcode/category/${c.id}`}
                className="group rounded-lg border border-border p-3 transition-colors hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold group-hover:text-primary">{c.emoji} {c.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">{c.count}</span>
                </div>
                <ProgressBar value={(c.count / maxCat) * 100} className="mt-2" />
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="font-display text-lg font-semibold">Recent Solutions</h3>
          <div className="mt-4 flex flex-col gap-2">
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading…</div>
            ) : recent.length === 0 ? (
              <div className="text-sm text-muted-foreground">No solutions yet — add your first!</div>
            ) : (
              recent.map((s) => <LeetSolutionRow key={s.id} s={s} />)
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
