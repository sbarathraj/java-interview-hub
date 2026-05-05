import { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { Brain, RefreshCw, Check, X, Trophy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Question } from "@/data/questions";
import { Markdown } from "@/components/Markdown";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const Quiz = () => {
  const { questions } = useApp();
  const [seed, setSeed] = useState(0);
  const set: Question[] = useMemo(() => shuffle(questions).slice(0, 10), [seed, questions]);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ knew: 0, missed: 0 });
  const [done, setDone] = useState(false);

  const restart = () => {
    setSeed((s) => s + 1);
    setIdx(0); setRevealed(false); setScore({ knew: 0, missed: 0 }); setDone(false);
  };

  const next = (knewIt: boolean) => {
    setScore((s) => ({ knew: s.knew + (knewIt ? 1 : 0), missed: s.missed + (knewIt ? 0 : 1) }));
    if (idx + 1 >= set.length) {
      setDone(true);
    } else {
      setIdx((i) => i + 1);
      setRevealed(false);
    }
  };

  if (done) {
    const total = score.knew + score.missed;
    const pct = total ? Math.round((score.knew / total) * 100) : 0;
    return (
      <div className="container max-w-lg py-12 text-center animate-scale-in">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Trophy className="h-6 w-6" />
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold tracking-tight">Session Complete</h1>
        <div className="mt-2 font-display text-5xl font-bold text-primary">{pct}%</div>
        <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{score.knew} of {total} Confidently Mastered</p>
        <button
          onClick={restart}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2 text-xs font-bold text-primary-foreground shadow-sm transition-all hover:scale-105"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Start New Session
        </button>
      </div>
    );
  }

  const q = set[idx];

  return (
    <div className="container max-w-2xl py-6 sm:py-10 animate-fade-in">
      <div className="mb-3 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <Brain className="h-3.5 w-3.5 text-primary" /> Training: {idx + 1} / {set.length}
        </span>
        <button onClick={restart} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
          Restart
        </button>
      </div>

      <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((idx) / set.length) * 100}%` }} />
      </div>

      <article className="mt-4 rounded-2xl glass-card p-5 shadow-sm animate-fade-in">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <DifficultyBadge difficulty={q.difficulty} className="scale-90 origin-left" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">{q.topicLabel}</span>
        </div>
        <h2 className="font-display text-lg font-bold leading-tight tracking-tight sm:text-xl">{q.question}</h2>

        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="mt-6 w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-sm transition-all hover:scale-[1.01]"
          >
            Synthesize Answer
          </button>
        ) : (
          <div className="mt-4 space-y-3 animate-fade-in">
            <div className="prose prose-xs max-w-none dark:prose-invert">
              <Markdown>{q.answer}</Markdown>
            </div>
            {q.codeSnippet && (
              <div className="overflow-hidden rounded-xl border border-border/50">
                <SyntaxHighlighter
                  language="java"
                  style={vscDarkPlus}
                  customStyle={{ margin: 0, fontSize: 11, padding: "10px" }}
                >
                  {q.codeSnippet}
                </SyntaxHighlighter>
              </div>
            )}
            
            <div className="grid gap-2 pt-2 sm:grid-cols-2">
              <button
                onClick={() => next(false)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-hard/30 bg-hard/5 py-2 text-[10px] font-bold uppercase tracking-widest text-hard transition-colors hover:bg-hard/10"
              >
                <X className="h-3.5 w-3.5" /> Revisit
              </button>
              <button
                onClick={() => next(true)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-easy/30 bg-easy/5 py-2 text-[10px] font-bold uppercase tracking-widest text-easy transition-colors hover:bg-easy/10"
              >
                <Check className="h-3.5 w-3.5" /> Mastered
              </button>
            </div>
          </div>
        )}
      </article>
    </div>
  );
};


export default Quiz;
