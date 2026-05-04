import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles, Loader2, Wand2, Trash2, MessageSquare, Send, Brain, FileText, Lightbulb,
  Eye, EyeOff, Search, Filter, Clock, ChevronRight, Bot, User as UserIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/context/AppContext";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Markdown } from "@/components/Markdown";

interface AiQuestion {
  id: string;
  topic: string;
  topic_label: string;
  difficulty: "easy" | "medium" | "hard";
  question: string;
  answer: string;
  pro_tip: string | null;
  code_snippet: string | null;
  resume_link: string | null;
  tags: string[];
  model: string | null;
  created_at: string;
}

type ChatMsg = { role: "user" | "assistant"; content: string };
type DiffFilter = "all" | "easy" | "medium" | "hard";

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
const ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const AIStudio = () => {
  const { topics } = useApp();
  const [topicId, setTopicId] = useState(topics[0]?.id ?? "core-java");
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<AiQuestion[]>([]);
  const [tab, setTab] = useState<"generate" | "chat">("generate");
  const [search, setSearch] = useState("");
  const [diff, setDiff] = useState<DiffFilter>("all");
  const [topicFilter, setTopicFilter] = useState<string>("all");

  const topic = useMemo(() => topics.find((t) => t.id === topicId), [topics, topicId]);

  const load = async () => {
    const { data, error } = await supabase
      .from("ai_questions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) { toast.error(error.message); return; }
    setItems((data ?? []) as AiQuestion[]);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return items.filter((q) => {
      if (diff !== "all" && q.difficulty !== diff) return false;
      if (topicFilter !== "all" && q.topic !== topicFilter) return false;
      if (search && !q.question.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [items, diff, topicFilter, search]);

  const generate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-generate-questions", {
        body: { topic: topic.id, topicLabel: topic.label, count },
      });
      if (error) throw error;
      const n = data?.count ?? 0;
      toast.success(`Generated ${n} fresh questions`);
      await load();
    } catch (e: any) {
      const msg = e?.message ?? "Failed to generate";
      if (msg.includes("429")) toast.error("Rate limited. Try again in a moment.");
      else if (msg.includes("402")) toast.error("AI credits exhausted.");
      else toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    setItems((p) => p.filter((q) => q.id !== id));
  };

  const stats = useMemo(() => ({
    total: items.length,
    easy: items.filter(i => i.difficulty === "easy").length,
    medium: items.filter(i => i.difficulty === "medium").length,
    hard: items.filter(i => i.difficulty === "hard").length,
  }), [items]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" /> AI-Powered Studio
            </div>
            <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
              Interview Prep, supercharged.
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
              Generate fresh interview questions, reveal in-depth answers on demand, and rehearse with an AI mock interviewer tuned to your resume.
            </p>
          </div>
          <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            ← Back to Home
          </Link>
        </div>

        {/* Tab switch */}
        <div className="mb-6 inline-flex rounded-full border border-border bg-card p-1 shadow-sm">
          <button
            onClick={() => setTab("generate")}
            className={cn("rounded-full px-5 py-2 text-sm font-semibold transition-all",
              tab === "generate" ? "bg-primary text-primary-foreground shadow-elegant" : "text-muted-foreground hover:text-foreground")}
          >
            <Wand2 className="mr-1.5 inline h-4 w-4" /> Question Generator
          </button>
          <button
            onClick={() => setTab("chat")}
            className={cn("rounded-full px-5 py-2 text-sm font-semibold transition-all",
              tab === "chat" ? "bg-primary text-primary-foreground shadow-elegant" : "text-muted-foreground hover:text-foreground")}
          >
            <MessageSquare className="mr-1.5 inline h-4 w-4" /> Mock Interviewer
          </button>
        </div>

        {tab === "generate" ? (
          <>
            {/* Generator panel */}
            <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="mb-4 flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Wand2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-base font-semibold">Generate new questions</h2>
                  <p className="text-xs text-muted-foreground">Pick a topic and let AI craft fresh interview Qs with model answers.</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-[1fr_140px_auto]">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Topic</label>
                  <select
                    value={topicId}
                    onChange={(e) => setTopicId(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none"
                  >
                    {topics.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Count</label>
                  <input
                    type="number" min={1} max={20} value={count}
                    onChange={(e) => setCount(Math.min(20, Math.max(1, Number(e.target.value) || 1)))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none"
                  />
                </div>
                <button
                  onClick={generate}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 self-end rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:translate-y-0 disabled:opacity-60"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {loading ? "Generating…" : "Generate"}
                </button>
              </div>
            </section>

            {/* Stats strip */}
            {items.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="Total" value={stats.total} tone="primary" />
                <StatCard label="Easy" value={stats.easy} tone="easy" />
                <StatCard label="Medium" value={stats.medium} tone="medium" />
                <StatCard label="Hard" value={stats.hard} tone="hard" />
              </div>
            )}

            {/* Filter bar */}
            {items.length > 0 && (
              <div className="mt-6 flex flex-col gap-3 rounded-xl border border-border bg-card/60 p-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search questions…"
                    className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={topicFilter}
                    onChange={(e) => setTopicFilter(e.target.value)}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium"
                  >
                    <option value="all">All topics</option>
                    {topics.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                  <div className="inline-flex rounded-lg border border-border bg-background p-0.5">
                    {(["all", "easy", "medium", "hard"] as DiffFilter[]).map((d) => (
                      <button
                        key={d}
                        onClick={() => setDiff(d)}
                        className={cn(
                          "rounded-md px-2.5 py-1 text-xs font-semibold capitalize transition-colors",
                          diff === d ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* List */}
            <div className="mt-6 mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">
                Question Bank <span className="text-muted-foreground">({filtered.length})</span>
              </h2>
            </div>

            <div className="space-y-3">
              {items.length === 0 ? (
                <EmptyState />
              ) : filtered.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                  No questions match your filters.
                </div>
              ) : filtered.map((q) => (
                <AiQuestionCard key={q.id} q={q} onHide={() => remove(q.id)} />
              ))}
            </div>
          </>
        ) : (
          <MockInterviewer />
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, tone }: { label: string; value: number; tone: "primary" | "easy" | "medium" | "hard" }) => {
  const toneMap = {
    primary: "border-primary/30 bg-primary/5 text-primary",
    easy: "border-easy/30 bg-easy/5 text-easy",
    medium: "border-medium/30 bg-medium/5 text-medium",
    hard: "border-hard/30 bg-hard/5 text-hard",
  } as const;
  return (
    <div className={cn("rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-card", toneMap[tone])}>
      <div className="text-xs font-semibold uppercase tracking-wider opacity-80">{label}</div>
      <div className="mt-1 font-display text-2xl font-bold text-foreground">{value}</div>
    </div>
  );
};

const EmptyState = () => (
  <div className="rounded-2xl border border-dashed border-border bg-gradient-to-br from-card to-muted/30 p-12 text-center">
    <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
      <Sparkles className="h-6 w-6" />
    </div>
    <h3 className="font-display text-lg font-semibold">Your AI question bank is empty</h3>
    <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
      Pick a topic above and click <span className="font-semibold text-foreground">Generate</span> to create fresh, resume-aware interview questions.
    </p>
  </div>
);

const AiQuestionCard = ({ q, onHide }: { q: AiQuestion; onHide: () => void }) => {
  const [open, setOpen] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [explain, setExplain] = useState<string>("");
  const [loadingExplain, setLoadingExplain] = useState(false);

  const askDeeper = async () => {
    setExplain("");
    setLoadingExplain(true);
    try {
      const res = await fetch(`${FUNCTIONS_URL}/ai-explain`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${ANON}` },
        body: JSON.stringify({ question: q.question, mode: "explain" }),
      });
      if (!res.ok || !res.body) {
        const t = await res.text();
        toast.error(`AI error: ${t.slice(0, 120)}`);
        return;
      }
      await streamSSE(res.body, (chunk) => setExplain((p) => p + chunk));
    } finally {
      setLoadingExplain(false);
    }
  };

  const created = new Date(q.created_at);
  const timeAgo = formatTimeAgo(created);

  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:border-primary/40 hover:shadow-elegant">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-start gap-3 p-4 text-left sm:p-5">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <DifficultyBadge difficulty={q.difficulty} />
            <span className="rounded-full bg-secondary/15 px-2 py-0.5 text-xs font-medium text-secondary-foreground/80">{q.topic_label}</span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3" /> AI · {q.model?.split("/")[0] ?? "ai"}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" /> {timeAgo}
            </span>
          </div>
          <h3 className="font-display text-base font-semibold leading-snug sm:text-lg">{q.question}</h3>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span
            role="button"
            onClick={(e) => { e.stopPropagation(); onHide(); }}
            title="Hide"
            className="rounded-md p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
          >
            <Trash2 className="h-4 w-4" />
          </span>
          <ChevronRight className={cn("h-5 w-5 text-muted-foreground transition-transform", open && "rotate-90")} />
        </div>
      </button>

      {open && (
        <div className="border-t border-border bg-muted/20 px-4 pb-5 pt-4 sm:px-5">
          {/* Show Answer toggle */}
          {!showAnswer ? (
            <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-border bg-card/60 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <EyeOff className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Answer is hidden</div>
                  <p className="text-xs text-muted-foreground">Try answering it yourself first, then reveal the model answer.</p>
                </div>
              </div>
              <button
                onClick={() => setShowAnswer(true)}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-elegant transition-all hover:-translate-y-0.5"
              >
                <Eye className="h-3.5 w-3.5" /> Show Answer
              </button>
            </div>
          ) : (
            <div className="animate-accordion-down">
              <div className="mb-2 flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                  <Eye className="h-3.5 w-3.5" /> Model Answer
                </div>
                <button
                  onClick={() => setShowAnswer(false)}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <EyeOff className="h-3 w-3" /> Hide
                </button>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <Markdown>{q.answer}</Markdown>
              </div>

              {q.code_snippet && (
                <div className="mt-3 overflow-hidden rounded-lg border border-border">
                  <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-1.5">
                    <span className="font-mono text-xs text-muted-foreground">Java</span>
                  </div>
                  <SyntaxHighlighter language="java" style={vscDarkPlus}
                    customStyle={{ margin: 0, fontSize: 13, padding: "12px 16px", background: "#1e1e1e" }}>
                    {q.code_snippet}
                  </SyntaxHighlighter>
                </div>
              )}

              {q.pro_tip && (
                <div className="mt-3 flex gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-primary">Pro Tip</div>
                    <p className="mt-1 text-sm text-foreground/85">{q.pro_tip}</p>
                  </div>
                </div>
              )}

              {q.resume_link && (
                <div className="mt-3 flex gap-3 rounded-lg border border-accent/30 bg-accent/5 p-3">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-accent">Resume Link</div>
                    <p className="mt-1 text-sm text-foreground/85">{q.resume_link}</p>
                  </div>
                </div>
              )}

              {q.tags?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {q.tags.map((t) => (
                    <span key={t} className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={askDeeper} disabled={loadingExplain}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary/20 disabled:opacity-60"
                >
                  {loadingExplain ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Brain className="h-3.5 w-3.5" />}
                  Explain Deeper
                </button>
              </div>

              {explain && (
                <div className="mt-3 rounded-lg border border-border bg-gradient-to-br from-primary/5 to-card p-4">
                  <div className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                    <Brain className="h-3.5 w-3.5" /> Deep Dive
                  </div>
                  <Markdown>{explain}</Markdown>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
};

const MockInterviewer = () => {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const start = async () => {
    if (busy) return;
    setBusy(true);
    setMessages([]);
    const initial: ChatMsg[] = [{ role: "user", content: "Let's begin the interview." }];
    await stream(initial);
  };

  const send = async () => {
    const t = input.trim();
    if (!t || busy) return;
    setInput("");
    const next: ChatMsg[] = [...messages, { role: "user", content: t }];
    setMessages(next);
    await stream(next);
  };

  const stream = async (history: ChatMsg[]) => {
    setBusy(true);
    let acc = "";
    setMessages((p) => [...history, { role: "assistant", content: "" }]);
    try {
      const res = await fetch(`${FUNCTIONS_URL}/ai-mock-interview`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${ANON}` },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) {
        const t = await res.text();
        toast.error(`AI error: ${t.slice(0, 120)}`);
        setBusy(false);
        return;
      }
      await streamSSE(res.body, (chunk) => {
        acc += chunk;
        setMessages((p) => {
          const copy = [...p];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-primary/5 to-transparent p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display font-semibold">AI Mock Interviewer</h2>
            <p className="text-xs text-muted-foreground">Real-time, resume-aware Q&A practice</p>
          </div>
        </div>
        <button onClick={start} disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-elegant transition-all hover:-translate-y-0.5 disabled:opacity-60">
          {busy && messages.length <= 1 ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          {messages.length === 0 ? "Start Interview" : "Restart"}
        </button>
      </div>

      <div ref={scroller} className="h-[520px] space-y-4 overflow-y-auto bg-muted/20 p-5">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <MessageSquare className="h-6 w-6" />
            </div>
            <p className="font-display text-base font-semibold">Ready when you are.</p>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              Click <span className="font-semibold text-foreground">Start Interview</span> — the AI will ask one question at a time tailored to your resume.
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={cn("flex gap-2.5", m.role === "user" ? "justify-end" : "justify-start")}>
            {m.role === "assistant" && (
              <div className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Bot className="h-3.5 w-3.5" />
              </div>
            )}
            <div className={cn(
              "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
              m.role === "user"
                ? "whitespace-pre-wrap rounded-br-sm bg-primary text-primary-foreground"
                : "rounded-bl-sm border border-border bg-card text-foreground",
            )}>
              {m.role === "assistant"
                ? (m.content
                  ? <Markdown compact>{m.content}</Markdown>
                  : (busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null))
                : m.content}
            </div>
            {m.role === "user" && (
              <div className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <UserIcon className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-t border-border bg-card p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder={messages.length === 0 ? "Start the interview to begin chatting…" : "Type your answer…"}
          disabled={busy || messages.length === 0}
          className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary disabled:opacity-60"
        />
        <button onClick={send} disabled={busy || !input.trim()}
          className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-primary-foreground shadow-elegant transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60">
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

function formatTimeAgo(d: Date) {
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

// SSE stream parser shared
async function streamSSE(body: ReadableStream<Uint8Array>, onDelta: (s: string) => void) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let done = false;
  while (!done) {
    const { done: d, value } = await reader.read();
    if (d) break;
    buf += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buf.indexOf("\n")) !== -1) {
      let line = buf.slice(0, nl);
      buf = buf.slice(nl + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line || line.startsWith(":")) continue;
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") { done = true; break; }
      try {
        const p = JSON.parse(json);
        const c = p.choices?.[0]?.delta?.content;
        if (c) onDelta(c);
      } catch {
        buf = line + "\n" + buf;
        break;
      }
    }
  }
}

export default AIStudio;
