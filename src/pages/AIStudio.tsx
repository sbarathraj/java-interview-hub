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
      <div className="container py-6 sm:py-10 animate-fade-in">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-primary">
              <Sparkles className="h-3 w-3" /> AI Studio
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Interview Prep, <span className="text-primary">Supercharged</span>.
            </h1>
            <p className="mt-2 max-w-xl text-xs text-muted-foreground leading-relaxed sm:text-sm">
              Generate questions on demand and rehearse with a resume-tuned AI interviewer.
            </p>
          </div>
          <Link to="/" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary">
            ← Dashboard
          </Link>
        </div>

        {/* Tab switch */}
        <div className="mb-6 inline-flex rounded-full border border-border bg-card p-1 shadow-sm">
          <button
            onClick={() => setTab("generate")}
            className={cn("rounded-full px-4 py-1.5 text-xs font-bold transition-all",
              tab === "generate" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
          >
            <Wand2 className="mr-1.5 inline h-3 w-3" /> Generator
          </button>
          <button
            onClick={() => setTab("chat")}
            className={cn("rounded-full px-4 py-1.5 text-xs font-bold transition-all",
              tab === "chat" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
          >
            <MessageSquare className="mr-1.5 inline h-3 w-3" /> Interviewer
          </button>
        </div>

        {tab === "generate" ? (
          <>
            {/* Generator panel */}
            <section className="rounded-2xl glass-card p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
                  <Wand2 className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-display text-sm font-bold">Question Forge</h2>
                  <p className="text-[10px] text-muted-foreground">Select parameters to synthesize fresh technical questions.</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-[1fr_100px_auto]">
                <div>
                  <label className="mb-1 block text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Topic</label>
                  <select
                    value={topicId}
                    onChange={(e) => setTopicId(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium focus:border-primary outline-none"
                  >
                    {topics.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Count</label>
                  <input
                    type="number" min={1} max={20} value={count}
                    onChange={(e) => setCount(Math.min(20, Math.max(1, Number(e.target.value) || 1)))}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium focus:border-primary outline-none"
                  />
                </div>
                <button
                  onClick={generate}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 self-end rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-sm transition-all hover:scale-[1.02] disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                  {loading ? "Forging..." : "Synthesize"}
                </button>
              </div>
            </section>

            {/* Filter bar */}
            {items.length > 0 && (
              <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-border bg-card/60 p-2 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search Q bank..."
                    className="w-full rounded-xl border border-border bg-background py-1.5 pl-9 pr-3 text-[11px] font-medium outline-none"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={topicFilter}
                    onChange={(e) => setTopicFilter(e.target.value)}
                    className="rounded-lg border border-border bg-background px-2 py-1.5 text-[10px] font-bold"
                  >
                    <option value="all">All Topics</option>
                    {topics.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                  <div className="inline-flex rounded-lg border border-border bg-background p-0.5">
                    {(["all", "easy", "medium", "hard"] as DiffFilter[]).map((d) => (
                      <button
                        key={d}
                        onClick={() => setDiff(d)}
                        className={cn(
                          "rounded-md px-2 py-1 text-[10px] font-bold capitalize transition-colors",
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

            <div className="mt-6 mb-3 flex items-center justify-between">
              <h2 className="font-display text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Question Bank <span className="text-primary">[{filtered.length}]</span>
              </h2>
            </div>

            <div className="space-y-3">
              {items.length === 0 ? (
                <EmptyState />
              ) : filtered.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border p-10 text-center text-xs text-muted-foreground">
                  Empty result set.
                </div>
              ) : filtered.map((q, idx) => (
                <div key={q.id} className="animate-slide-up" style={{ animationDelay: `${idx * 20}ms` }}>
                  <AiQuestionCard q={q} onHide={() => remove(q.id)} />
                </div>
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
    primary: "border-primary/20 bg-primary/5 text-primary",
    easy: "border-easy/20 bg-easy/5 text-easy",
    medium: "border-medium/20 bg-medium/5 text-medium",
    hard: "border-hard/20 bg-hard/5 text-hard",
  } as const;
  return (
    <div className={cn("rounded-xl border bg-card p-3 shadow-sm transition-all", toneMap[tone])}>
      <div className="text-[9px] font-bold uppercase tracking-widest opacity-80">{label}</div>
      <div className="mt-0.5 font-display text-xl font-bold text-foreground">{value}</div>
    </div>
  );
};

const EmptyState = () => (
  <div className="rounded-2xl border border-dashed border-border/60 bg-card/30 p-12 text-center">
    <Sparkles className="mx-auto h-8 w-8 text-primary/30 mb-3" />
    <h3 className="font-display text-base font-bold">Synthesis Engine Idle</h3>
    <p className="mx-auto mt-1 max-w-sm text-[11px] text-muted-foreground leading-relaxed">
      Initialize generation to populate your technical knowledge bank.
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
    <article className="group overflow-hidden rounded-xl border border-border bg-card/50 transition-all hover:bg-card hover:-translate-y-0.5 shadow-sm">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-start gap-3 p-4 text-left">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <DifficultyBadge difficulty={q.difficulty} className="scale-90 origin-left" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">{q.topic_label}</span>
            <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-primary/60">
              <Sparkles className="h-2.5 w-2.5" /> AI
            </span>
          </div>
          <h3 className="font-display text-sm font-bold leading-tight">{q.question}</h3>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 self-center">
          <span
            role="button"
            onClick={(e) => { e.stopPropagation(); onHide(); }}
            className="rounded-md p-1.5 text-muted-foreground/40 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </span>
          <ChevronRight className={cn("h-4 w-4 text-muted-foreground/60 transition-transform", open && "rotate-90")} />
        </div>
      </button>

      {open && (
        <div className="border-t border-border/50 bg-muted/5 px-4 pb-5 pt-4">
          {!showAnswer ? (
            <div className="flex items-center justify-between rounded-xl border border-dashed border-border bg-card/40 p-3">
              <div className="text-[10px] font-medium text-muted-foreground">Answer remains obscured...</div>
              <button
                onClick={() => setShowAnswer(true)}
                className="rounded-full bg-primary px-4 py-1.5 text-[10px] font-bold text-primary-foreground shadow-sm"
              >
                Reveal
              </button>
            </div>
          ) : (
            <div className="animate-accordion-down">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[9px] font-bold uppercase tracking-widest text-primary">Synthesis Result</div>
                <button onClick={() => setShowAnswer(false)} className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">Hide</button>
              </div>

              <div className="prose prose-xs max-w-none dark:prose-invert">
                <Markdown>{q.answer}</Markdown>
              </div>

              {q.code_snippet && (
                <div className="mt-4 overflow-hidden rounded-xl border border-border/50">
                  <SyntaxHighlighter language="java" style={vscDarkPlus}
                    customStyle={{ margin: 0, fontSize: 11, padding: "10px", background: "#0f172a" }}>
                    {q.code_snippet}
                  </SyntaxHighlighter>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={askDeeper} disabled={loadingExplain}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary border border-primary/20"
                >
                  {loadingExplain ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : <Brain className="h-2.5 w-2.5" />}
                  Deep Dive
                </button>
              </div>

              {explain && (
                <div className="mt-4 rounded-xl border border-border/50 bg-primary/5 p-4 prose prose-xs dark:prose-invert">
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
    <div className="overflow-hidden rounded-2xl glass-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border/50 bg-primary/5 p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-display text-sm font-bold">Mock Interview</h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Active Simulation</p>
          </div>
        </div>
        <button onClick={start} disabled={busy}
          className="rounded-full bg-primary px-5 py-1.5 text-[10px] font-bold text-primary-foreground shadow-sm transition-all hover:scale-105 disabled:opacity-50">
          {messages.length === 0 ? "Initiate" : "Reset"}
        </button>
      </div>

      <div ref={scroller} className="h-[400px] space-y-3 overflow-y-auto bg-muted/5 p-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center opacity-40">
            <Bot className="h-10 w-10 mb-3" />
            <p className="text-xs font-bold uppercase tracking-widest">Ready for Session</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={cn("flex gap-2", m.role === "user" ? "justify-end" : "justify-start")}>
            <div className={cn(
              "max-w-[85%] rounded-2xl px-3 py-2 text-[12px] leading-relaxed shadow-sm",
              m.role === "user"
                ? "bg-primary text-primary-foreground rounded-br-sm"
                : "border border-border/50 bg-card text-foreground rounded-bl-sm",
            )}>
              {m.role === "assistant"
                ? (m.content
                  ? <Markdown compact>{m.content}</Markdown>
                  : (busy ? <Loader2 className="h-3 w-3 animate-spin" /> : null))
                : m.content}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-t border-border/50 bg-card p-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Type your response..."
          disabled={busy || messages.length === 0}
          className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-xs outline-none focus:border-primary disabled:opacity-50"
        />
        <button onClick={send} disabled={busy || !input.trim()}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm disabled:opacity-50">
          <Send className="h-3.5 w-3.5" />
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
