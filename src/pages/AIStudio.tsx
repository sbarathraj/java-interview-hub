import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles, Loader2, Wand2, Trash2, MessageSquare, Send, Brain, FileText, Lightbulb,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/context/AppContext";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
const ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const AIStudio = () => {
  const { topics } = useApp();
  const [topicId, setTopicId] = useState(topics[0]?.id ?? "core-java");
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<AiQuestion[]>([]);
  const [tab, setTab] = useState<"generate" | "chat">("generate");

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

  const generate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-generate-questions", {
        body: { topic: topic.id, topicLabel: topic.label, count },
      });
      if (error) throw error;
      const n = data?.count ?? 0;
      toast.success(`Generated ${n} questions`);
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
    // Optimistic local removal (RLS forbids client delete; this hides it locally)
    setItems((p) => p.filter((q) => q.id !== id));
  };

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold sm:text-4xl flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-primary" /> AI Studio
          </h1>
          <p className="mt-1 text-muted-foreground">
            Generate fresh interview questions, get deep explanations, and practice with an AI mock interviewer.
          </p>
        </div>
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Home</Link>
      </div>

      <div className="mb-6 inline-flex rounded-full border border-border bg-card p-1">
        <button
          onClick={() => setTab("generate")}
          className={cn("rounded-full px-4 py-1.5 text-sm font-semibold",
            tab === "generate" ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
        >
          <Wand2 className="mr-1 inline h-4 w-4" /> Question Generator
        </button>
        <button
          onClick={() => setTab("chat")}
          className={cn("rounded-full px-4 py-1.5 text-sm font-semibold",
            tab === "chat" ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
        >
          <MessageSquare className="mr-1 inline h-4 w-4" /> Mock Interviewer
        </button>
      </div>

      {tab === "generate" ? (
        <>
          <section className="rounded-2xl border border-border bg-gradient-card p-5 shadow-card">
            <div className="grid gap-4 sm:grid-cols-[1fr_140px_auto]">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Topic</label>
                <select
                  value={topicId}
                  onChange={(e) => setTopicId(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                >
                  {topics.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">How many</label>
                <input
                  type="number" min={1} max={20} value={count}
                  onChange={(e) => setCount(Math.min(20, Math.max(1, Number(e.target.value) || 1)))}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
              </div>
              <button
                onClick={generate}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 self-end rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-elegant transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {loading ? "Generating…" : "Generate"}
              </button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Tip: 10–20 fresh questions per click. Tied to your resume — KUWY, BarathAI Chat, AI English Tutor.
            </p>
          </section>

          <div className="mt-6 mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">AI-generated bank ({items.length})</h2>
          </div>

          <div className="space-y-3">
            {items.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
                Nothing yet — pick a topic and click Generate.
              </div>
            ) : items.map((q) => (
              <AiQuestionCard key={q.id} q={q} onHide={() => remove(q.id)} />
            ))}
          </div>
        </>
      ) : (
        <MockInterviewer />
      )}
    </div>
  );
};

const AiQuestionCard = ({ q, onHide }: { q: AiQuestion; onHide: () => void }) => {
  const [open, setOpen] = useState(false);
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

  return (
    <article className="rounded-xl border border-border bg-card shadow-card transition-all hover:shadow-elegant">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-start gap-3 p-4 text-left sm:p-5">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <DifficultyBadge difficulty={q.difficulty} />
            <span className="rounded-full bg-secondary/15 px-2 py-0.5 text-xs font-medium">{q.topic_label}</span>
            <span className="text-xs text-muted-foreground">AI · {q.model?.split("/")[0]}</span>
          </div>
          <h3 className="font-display text-base font-semibold sm:text-lg">{q.question}</h3>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onHide(); }} title="Hide" className="text-muted-foreground hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </button>
      </button>

      {open && (
        <div className="border-t border-border px-4 pb-5 pt-4 sm:px-5">
          <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">{q.answer}</p>

          {q.code_snippet && (
            <div className="mt-4 overflow-hidden rounded-lg border border-border">
              <SyntaxHighlighter language="java" style={vscDarkPlus}
                customStyle={{ margin: 0, fontSize: 13, padding: "12px 16px", background: "#1e1e1e" }}>
                {q.code_snippet}
              </SyntaxHighlighter>
            </div>
          )}

          {q.pro_tip && (
            <div className="mt-4 flex gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <div className="text-xs font-semibold uppercase text-primary">Pro Tip</div>
                <p className="mt-1 text-sm">{q.pro_tip}</p>
              </div>
            </div>
          )}

          {q.resume_link && (
            <div className="mt-4 flex gap-3 rounded-lg border border-accent/30 bg-accent/5 p-3">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <div>
                <div className="text-xs font-semibold uppercase text-accent">Resume Link</div>
                <p className="mt-1 text-sm">{q.resume_link}</p>
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={askDeeper} disabled={loadingExplain}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary disabled:opacity-60"
            >
              {loadingExplain ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Brain className="h-3.5 w-3.5" />}
              Explain Deeper
            </button>
          </div>

          {explain && (
            <div className="mt-3 rounded-lg border border-border bg-muted/30 p-3">
              <div className="mb-1 text-xs font-semibold uppercase text-muted-foreground">AI Explanation</div>
              <pre className="whitespace-pre-wrap break-words text-sm leading-relaxed">{explain}</pre>
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
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="font-display font-semibold">AI Mock Interviewer</h2>
        </div>
        <button onClick={start} disabled={busy}
          className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-60">
          {messages.length === 0 ? "Start Interview" : "Restart"}
        </button>
      </div>

      <div ref={scroller} className="h-[480px] space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
            Click "Start Interview" — the AI interviewer will ask one question at a time based on your resume.
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div className={cn(
              "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
              m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
            )}>
              {m.content || (busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "")}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-t border-border p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Type your answer…"
          disabled={busy || messages.length === 0}
          className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary"
        />
        <button onClick={send} disabled={busy || !input.trim()}
          className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-primary-foreground disabled:opacity-60">
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

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
