import { useApp } from "@/context/AppContext";
import { ProgressBar } from "@/components/ProgressBar";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Link } from "react-router-dom";

const COLORS = ["hsl(var(--easy))", "hsl(var(--medium))", "hsl(var(--hard))"];

const ProgressDashboard = () => {
  const { topics, questions, completed, progressByTopic, totalDone } = useApp();
  const overall = Math.round((totalDone / questions.length) * 100);

  const dist = [
    { name: "Easy",   value: questions.filter((q) => completed[q.id] && q.difficulty === "easy").length },
    { name: "Medium", value: questions.filter((q) => completed[q.id] && q.difficulty === "medium").length },
    { name: "Hard",   value: questions.filter((q) => completed[q.id] && q.difficulty === "hard").length },
  ];
  const totalDist = dist.reduce((s, d) => s + d.value, 0);

  return (
    <div className="container py-8">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">Progress Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Track how prepared you are for your next interview.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Overall</h2>
            <span className="font-display text-3xl font-bold text-primary">{overall}%</span>
          </div>
          <ProgressBar value={overall} />
          <p className="mt-2 text-sm text-muted-foreground">{totalDone} of {questions.length} questions completed</p>

          <div className="mt-6 space-y-4">
            {topics.map((t) => {
              const p = progressByTopic[t.id];
              return (
                <Link key={t.id} to={`/topic/${t.id}`} className="block rounded-xl border border-border p-4 transition-colors hover:bg-muted/40">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-semibold">{t.label}</span>
                    <span className="text-sm font-bold text-primary">{p.pct}%</span>
                  </div>
                  <ProgressBar value={p.pct} />
                  <div className="mt-1 text-xs text-muted-foreground">{p.done} / {p.total} done</div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-display text-lg font-semibold">Difficulty Mix</h2>
          <p className="text-xs text-muted-foreground">Of completed questions</p>
          <div className="mt-4 h-64">
            {totalDist === 0 ? (
              <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
                Complete some questions to see your difficulty mix.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dist} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                    {dist.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;
