import { Link } from "react-router-dom";
import { ArrowRight, Brain, Sparkles, Wand2, Trophy, Target, Flame, BookOpen, Zap, Code2, Heart } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useLeetcode } from "@/hooks/useLeetcode";
import { TopicCard } from "@/components/TopicCard";
import { ProgressBar } from "@/components/ProgressBar";
import { cn } from "@/lib/utils";

const Home = () => {
  const { topics, questions, progressByTopic, totalDone } = useApp();
  const { items: leetItems } = useLeetcode();

  // Interview Stats
  const overall = Math.round((totalDone / (questions.length || 1)) * 100);
  const easyDone = questions.filter(q => q.difficulty === "easy").length;
  const medDone  = questions.filter(q => q.difficulty === "medium").length;
  const hardDone = questions.filter(q => q.difficulty === "hard").length;

  // Leetcode Stats
  const leetSolved = leetItems.filter(i => i.status === "solved");
  const leetEasy = leetSolved.filter(i => i.difficulty === "easy").length;
  const leetMed = leetSolved.filter(i => i.difficulty === "medium").length;
  const leetHard = leetSolved.filter(i => i.difficulty === "hard").length;
  const leetRevisit = leetItems.filter(i => i.status === "revisit").length;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="container flex-1 py-6 sm:py-10 animate-fade-in space-y-8">

        {/* ───── HERO BANNER ───── */}
        <section className="relative overflow-hidden rounded-[2.5rem] p-8 sm:p-12 text-white"
          style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 40%, #0ea5e9 100%)" }}>

          {/* Animated glows */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -left-20 -top-20 h-80 w-80 animate-pulse rounded-full bg-white/10 blur-[100px]" />
            <div className="absolute -right-20 -bottom-20 h-80 w-80 animate-pulse rounded-full bg-cyan-400/20 blur-[100px] [animation-delay:1.5s]" />
            <div className="absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 animate-pulse rounded-full bg-purple-400/10 blur-[80px] [animation-delay:3s]" />
            <div className="absolute inset-0 opacity-[0.06]"
              style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />
          </div>

          <div className="relative z-10 grid gap-8 xl:grid-cols-12 xl:items-start">
            {/* Left: Title + CTA */}
            <div className="xl:col-span-5 pt-4">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-sm">
                <Sparkles className="h-3 w-3" />
                <span>Created by Barathraj</span>
              </div>

              <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
                Master Your <br />
                <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
                  Java Career.
                </span>
              </h1>

              <p className="mt-5 max-w-lg text-sm font-medium leading-relaxed text-white/75 sm:text-base">
                80+ curated interview topics, AI mock interviews, quiz drills, and live analytics — all in one place.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/ai"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-xs font-bold text-indigo-700 shadow-xl transition-all hover:scale-105 hover:shadow-indigo-200/50">
                  <Wand2 className="h-4 w-4" />
                  AI Interviewer
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link to="/quiz"
                  className="inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-xs font-bold backdrop-blur-sm transition-all hover:bg-white/20">
                  <Brain className="h-4 w-4" />
                  Start Quiz Drill
                </Link>
              </div>
            </div>

            {/* Right: Global Stats Panel (Dual Column) */}
            <div className="xl:col-span-7 grid gap-4 sm:grid-cols-2">
              {/* Interview Panel */}
              <div className="rounded-[1.75rem] border border-white/20 bg-white/10 p-6 backdrop-blur-md shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="h-4 w-4 text-pink-300" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Interview Mastery</span>
                  </div>
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Overall</span>
                    <span className="text-3xl font-extrabold leading-none">{overall}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/20 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-pink-400 transition-all duration-700"
                      style={{ width: `${overall}%` }}
                    />
                  </div>
                  <div className="mt-1.5 mb-6 text-[10px] text-white/50 text-right">{totalDone} / {questions.length} solved</div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <MiniStat label="Topics" value={topics.length} color="from-pink-400 to-rose-500" />
                  <MiniStat label="Solved" value={totalDone} color="from-emerald-400 to-teal-500" />
                </div>
              </div>

              {/* LeetCode Panel */}
              <div className="rounded-[1.75rem] border border-white/20 bg-white/10 p-6 backdrop-blur-md shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Code2 className="h-4 w-4 text-cyan-300" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">LeetCode Tracker</span>
                    </div>
                    <Link to="/leetcode" className="text-[10px] font-bold text-cyan-300 hover:text-white transition-colors">View Hub &rarr;</Link>
                  </div>
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Total Solved</span>
                    <span className="text-3xl font-extrabold leading-none">{leetSolved.length}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/20 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-blue-500 transition-all duration-700"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div className="mt-1.5 mb-6 text-[10px] text-white/50 text-right">{leetItems.length} total tracked</div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <MiniStat label="Easy" value={leetEasy} color="from-green-300 to-emerald-400" />
                  <MiniStat label="Medium" value={leetMed} color="from-yellow-300 to-orange-400" />
                  <MiniStat label="Hard" value={leetHard} color="from-red-400 to-rose-500" />
                  <MiniStat label="Revisit" value={leetRevisit} color="from-purple-400 to-indigo-500" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───── TOPIC CARDS ───── */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl text-slate-800">Technical Domains</h2>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                {topics.length} Specialized Knowledge Paths
              </p>
            </div>
            <Link to="/progress"
              className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-[10px] font-bold text-indigo-600 transition-all hover:bg-indigo-100">
              <Zap className="h-3 w-3" /> Full Analytics
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((t, idx) => {
              const p = progressByTopic[t.id];
              return (
                <div key={t.id} className="animate-slide-up" style={{ animationDelay: `${idx * 35}ms` }}>
                  <TopicCard topic={t} total={p.total} done={p.done} pct={p.pct} />
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/50 py-6 backdrop-blur-sm mt-12">
        <div className="container flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
          Built with <Heart className="h-3 w-3 text-rose-500" /> by 
          <span className="font-bold text-indigo-600">Barathraj</span>
        </div>
      </footer>
    </div>
  );
};

const MiniStat = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col justify-between">
    <div className={`mb-2 inline-flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br ${color}`}>
      <span className="text-[9px] font-extrabold text-white">{value > 99 ? "99+" : value}</span>
    </div>
    <div>
      <div className="text-[18px] font-extrabold leading-none">{value}</div>
      <div className="mt-0.5 text-[9px] font-bold uppercase tracking-widest text-white/50">{label}</div>
    </div>
  </div>
);

export default Home;
