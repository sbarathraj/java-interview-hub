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
  <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant">
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
      <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}>{icon}</span>
    </div>
    <div className="mt-3 font-display text-3xl font-extrabold text-slate-800">{value}</div>
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
    <div className="container py-8 animate-fade-in">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4 glass-card p-8 shadow-elegant">
        <div>
          <h1 className="font-display text-4xl font-extrabold text-slate-800">
            <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">LeetCode</span> Tracker
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">Track, organize and revisit your DSA solutions in a premium environment.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/leetcode/revisit"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 hover:shadow"
          >
            <RotateCcw className="h-4 w-4 text-indigo-500" /> Revisit Queue
          </Link>
          <Link
            to="/leetcode/add"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 px-5 text-sm font-bold text-white shadow-elegant transition-all hover:scale-105 hover:shadow-indigo-500/30"
          >
            <Plus className="h-4 w-4" /> Add Solution
          </Link>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat icon={<Trophy className="h-5 w-5 text-indigo-600" />} label="Total Solved" value={stats.total} accent="bg-indigo-50 border border-indigo-100" />
        <Stat icon={<Code2 className="h-5 w-5 text-emerald-600" />} label="Easy" value={stats.easy} accent="bg-emerald-50 border border-emerald-100" />
        <Stat icon={<Code2 className="h-5 w-5 text-amber-600" />} label="Medium" value={stats.medium} accent="bg-amber-50 border border-amber-100" />
        <Stat icon={<Code2 className="h-5 w-5 text-rose-600" />} label="Hard" value={stats.hard} accent="bg-rose-50 border border-rose-100" />
        <Stat icon={<Flame className="h-5 w-5 text-orange-500" />} label="Streak (days)" value={stats.streak} accent="bg-orange-50 border border-orange-100" />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="glass-card p-6 lg:col-span-1">
          <h3 className="font-display text-lg font-bold text-slate-800">Difficulty Distribution</h3>
          <div className="mt-4 h-64">
            {pieData.length === 0 ? (
               <div className="flex h-full items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-sm font-medium text-slate-400">No data yet</div>
            ) : (
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={4}>
                    {pieData.map((d) => (<Cell key={d.key} fill={DIFF_COLORS[d.key]} />))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} />
                  <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 600, color: '#475569' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="font-display text-lg font-bold text-slate-800">Solved Over Time</h3>
          <div className="mt-4 h-64">
            {lineData.length === 0 ? (
               <div className="flex h-full items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-sm font-medium text-slate-400">No data yet</div>
            ) : (
              <ResponsiveContainer>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                  <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} />
                  <Line type="monotone" dataKey="count" name="Per Day" stroke="#0ea5e9" strokeWidth={3} dot={{ fill: '#0ea5e9', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="total" name="Cumulative" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
              <Target className="h-5 w-5 text-indigo-500" /> Category Progress
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{LEETCODE_CATEGORIES.length} categories</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {categoryProgress.map((c) => (
              <Link
                key={c.id}
                to={`/leetcode/category/${c.id}`}
                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-white hover:shadow-md hover:border-indigo-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{c.emoji} {c.name}</span>
                  <span className="font-mono text-xs font-bold text-slate-400 bg-slate-200/50 px-2 py-0.5 rounded-md">{c.count}</span>
                </div>
                <ProgressBar value={(c.count / maxCat) * 100} className="h-1.5" />
              </Link>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-display text-lg font-bold text-slate-800 mb-6">Recent Solutions</h3>
          <div className="flex flex-col gap-3">
            {loading ? (
              <div className="text-sm font-medium text-slate-400 animate-pulse">Loading…</div>
            ) : recent.length === 0 ? (
              <div className="flex h-32 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm font-medium text-slate-400">
                No solutions yet
              </div>
            ) : (
              recent.map((s) => <LeetSolutionRow key={s.id} s={s} />)
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
