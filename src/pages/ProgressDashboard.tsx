import { useApp } from "@/context/AppContext";
import { useLeetcode } from "@/hooks/useLeetcode";
import { ProgressBar } from "@/components/ProgressBar";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Link } from "react-router-dom";
import { Code2, Target, Flame } from "lucide-react";
import { LEETCODE_CATEGORIES } from "@/data/leetcodeCategories";

const COLORS = ["hsl(var(--easy))", "hsl(var(--medium))", "hsl(var(--hard))"];

const ProgressDashboard = () => {
  const { topics, questions, completed, progressByTopic, totalDone } = useApp();
  const { items: leetItems } = useLeetcode();
  
  const overall = Math.round((totalDone / (questions.length || 1)) * 100);

  const dist = [
    { name: "Easy",   value: questions.filter((q) => completed[q.id] && q.difficulty === "easy").length },
    { name: "Medium", value: questions.filter((q) => completed[q.id] && q.difficulty === "medium").length },
    { name: "Hard",   value: questions.filter((q) => completed[q.id] && q.difficulty === "hard").length },
  ];
  const totalDist = dist.reduce((s, d) => s + d.value, 0);

  // LeetCode Stats
  const leetStats = {
    total: leetItems.length,
    easy: leetItems.filter(i => i.difficulty === 'easy').length,
    medium: leetItems.filter(i => i.difficulty === 'medium').length,
    hard: leetItems.filter(i => i.difficulty === 'hard').length,
  };

  return (
    <div className="container py-6 sm:py-10 animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Analytics Console</h1>
        <p className="mt-1 text-xs text-muted-foreground uppercase tracking-widest font-bold">Preparation Metrics</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl glass-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-sm font-bold">Overall Mastery</h2>
              <p className="text-[10px] text-muted-foreground">{totalDone} of {questions.length} completed</p>
            </div>
            <span className="font-display text-3xl font-bold text-primary">{overall}%</span>
          </div>
          <ProgressBar value={overall} className="h-2" />

          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {topics.map((t) => {
              const p = progressByTopic[t.id];
              return (
                <Link key={t.id} to={`/topic/${t.id}`} className="block rounded-xl border border-border bg-card/40 p-3 transition-all hover:bg-card hover:-translate-y-0.5">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[11px] font-bold">{t.label}</span>
                    <span className="text-[10px] font-bold text-primary">{p.pct}%</span>
                  </div>
                  <ProgressBar value={p.pct} className="h-1" />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl glass-card p-5 shadow-sm">
          <h2 className="font-display text-sm font-bold">Difficulty Mix</h2>
          <div className="mt-4 h-56">
            {totalDist === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">No Data Points</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dist} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                    {dist.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "none",
                      borderRadius: 12,
                      fontSize: 10,
                      fontWeight: "bold",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 10, fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-sm font-bold uppercase tracking-widest text-muted-foreground">DSA Mastery (LeetCode)</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <LeetStatCard label="Total Solved" value={leetStats.total} icon={<Target className="h-4 w-4" />} />
          <LeetStatCard label="Easy" value={leetStats.easy} icon={<Code2 className="h-4 w-4 text-easy" />} />
          <LeetStatCard label="Medium" value={leetStats.medium} icon={<Code2 className="h-4 w-4 text-medium" />} />
          <LeetStatCard label="Hard" value={leetStats.hard} icon={<Code2 className="h-4 w-4 text-hard" />} />
        </div>
      </div>
    </div>
  );
};


const LeetStatCard = ({ label, value, icon }: { label: string, value: number, icon: React.ReactNode }) => (
  <div className="rounded-2xl glass-card p-4 shadow-sm border border-border/50">
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="rounded-lg bg-muted p-1.5">{icon}</div>
    </div>
    <div className="mt-2 text-2xl font-bold">{value}</div>
  </div>
);


export default ProgressDashboard;
