import { Link } from "react-router-dom";
import { ArrowRight, Brain, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { TopicCard } from "@/components/TopicCard";
import { ProgressBar } from "@/components/ProgressBar";

const Home = () => {
  const { topics, questions, progressByTopic, totalDone } = useApp();
  const overall = Math.round((totalDone / questions.length) * 100);

  return (
    <div className="container py-8 sm:py-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 text-primary-foreground shadow-elegant sm:p-12 animate-slide-up">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="relative max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> {questions.length}+ questions · {topics.length} topics · mapped to my resume
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            Barath's Interview <br className="hidden sm:block" />Refresh Portal
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/90 sm:text-lg">
            A personalized prep app built around my resume — Java, Spring Boot, Microservices, AWS, React, and real project stories from KUWY, BarathAI Chat, and AI English Tutor.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 rounded-full bg-background px-5 py-2.5 font-semibold text-foreground shadow-md transition-transform hover:-translate-y-0.5"
            >
              <Brain className="h-4 w-4" /> Start Quiz
            </Link>
            <Link
              to="/progress"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 font-semibold backdrop-blur transition-colors hover:bg-white/20"
            >
              View Progress <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Questions" value={String(questions.length)} />
        <StatCard label="Topics" value={String(topics.length)} />
        <StatCard label="Completed" value={`${totalDone} / ${questions.length}`} />
      </section>

      {/* Overall progress */}
      <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold">Overall Progress</h2>
          <span className="text-sm font-bold text-primary">{overall}%</span>
        </div>
        <ProgressBar value={overall} />
      </section>

      {/* Topics */}
      <section className="mt-10">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold">Topics</h2>
          <span className="text-sm text-muted-foreground">Pick a topic to dive in</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((t) => {
            const p = progressByTopic[t.id];
            return <TopicCard key={t.id} topic={t} total={p.total} done={p.done} pct={p.pct} />;
          })}
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl border border-border bg-card p-5 shadow-card transition-transform hover:-translate-y-0.5">
    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
    <div className="mt-1 font-display text-3xl font-bold text-primary">{value}</div>
  </div>
);

export default Home;
