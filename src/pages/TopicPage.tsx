import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
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
      <div className="container py-16 text-center">
        <h1 className="font-display text-2xl font-bold">Topic not found</h1>
        <Link to="/" className="mt-4 inline-block text-primary hover:underline">← Back home</Link>
      </div>
    );
  }

  const p = progressByTopic[topic.id];

  return (
    <div className="container py-8">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All topics
      </Link>

      <header className="mt-4 rounded-2xl border border-border bg-gradient-card p-6 shadow-card">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">{topic.label}</h1>
        <p className="mt-1 text-muted-foreground">{topic.description}</p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{p.done} of {p.total} completed</span>
          <span className="font-semibold text-primary">{p.pct}%</span>
        </div>
        <ProgressBar value={p.pct} className="mt-2" />
      </header>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions, answers, tags…"
            className="w-full rounded-full border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition-colors",
                filter === f
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:bg-muted"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {list.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
            No questions match your filters.
          </div>
        ) : (
          list.map((q) => <QuestionCard key={q.id} question={q} />)
        )}
      </div>
    </div>
  );
};

export default TopicPage;
