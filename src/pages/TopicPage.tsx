import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Search, Filter, BookOpen } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { QuestionCard } from "@/components/QuestionCard";
import { Difficulty } from "@/data/questions";
import { ProgressBar } from "@/components/ProgressBar";
import { cn } from "@/lib/utils";

const filters: ("all" | Difficulty)[] = ["all", "easy", "medium", "hard"];

const TopicPage = () => {
  const { topicId } = useParams();
  const { topics, questions, progressByTopic } = useApp();
  const topic = topics.find((t) => t.id === topicId);
  const [filter, setFilter] = useState<"all" | Difficulty>("all");
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    return questions
      .filter((q) => q.topic === topicId)
      .filter((q) => filter === "all" || q.difficulty === filter)
      .filter((q) => {
        if (!query.trim()) return true;
        const s = query.toLowerCase();
        return (
          q.question.toLowerCase().includes(s) ||
          q.answer.toLowerCase().includes(s) ||
          q.tags.some((t) => t.toLowerCase().includes(s))
        );
      });
  }, [questions, topicId, filter, query]);

  if (!topic) {
    return (
      <div className="container py-20 text-center glass-card mt-10 rounded-3xl">
        <h1 className="font-display text-2xl font-bold">Topic not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">The knowledge path you are looking for does not exist.</p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const p = progressByTopic[topic.id];

  return (
    <div className="container py-6 sm:py-10 animate-fade-in">
      <Link to="/" className="group inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
        <span>Back to Dashboard</span>
      </Link>

      <header className="mt-4 overflow-hidden rounded-3xl glass-card p-6 sm:p-10 shadow-sm relative">
        <div className={`absolute -right-20 -top-20 h-48 w-48 rounded-full bg-gradient-to-br ${topic.accent} opacity-10 blur-3xl`} />
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <div className={`h-8 w-8 flex items-center justify-center rounded-lg bg-gradient-to-br ${topic.accent} text-white`}>
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Knowledge Path</span>
          </div>
          
          <h1 className="font-display text-3xl font-bold sm:text-4xl tracking-tight">{topic.label}</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground leading-relaxed sm:text-base">{topic.description}</p>
          
          <div className="mt-6 max-w-sm">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-display text-xl font-bold text-primary">{p.pct}%</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Mastered</span>
              </div>
              <span className="text-[10px] font-bold text-muted-foreground">{p.done} / {p.total} Qs</span>
            </div>
            <ProgressBar value={p.pct} className="h-2 rounded-full" />
          </div>
        </div>
      </header>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topic..."
            className="w-full rounded-xl border border-border bg-card/50 py-3 pl-11 pr-5 text-xs font-medium outline-none focus:bg-card focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-1.5 rounded-xl border border-border bg-card/50 p-1 shadow-sm">
          <div className="flex flex-wrap gap-0.5">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all",
                  filter === f
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {list.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border/60 bg-card/30 p-12 text-center">
            <Search className="mx-auto h-8 w-8 text-muted-foreground/20 mb-3" />
            <h3 className="text-base font-bold">No results found</h3>
            <p className="mt-1 text-xs text-muted-foreground">Try adjusting your filters.</p>
          </div>
        ) : (
          list.map((q, idx) => (
            <div key={q.id} className="animate-slide-up" style={{ animationDelay: `${idx * 30}ms` }}>
              <QuestionCard question={q} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};


export default TopicPage;

