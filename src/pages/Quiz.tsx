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
      <div className="container max-w-2xl py-16 text-center animate-scale-in">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-elegant">
          <Trophy className="h-8 w-8" />
        </span>
        <h1 className="mt-6 font-display text-4xl font-bold">Quiz complete!</h1>
        <p className="mt-2 text-muted-foreground">You scored</p>
        <div className="mt-2 font-display text-6xl font-bold text-primary">{pct}%</div>
        <p className="mt-2 text-muted-foreground">{score.knew} of {total} confidently known</p>
        <button
          onClick={restart}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 font-semibold text-primary-foreground shadow-elegant transition-transform hover:-translate-y-0.5"
        >
          <RefreshCw className="h-4 w-4" /> New Quiz
        </button>
      </div>
    );
  }

  const q = set[idx];

  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Brain className="h-4 w-4 text-primary" /> Question {idx + 1} of {set.length}
        </span>
        <button onClick={restart} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <RefreshCw className="h-3.5 w-3.5" /> Restart
        </button>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-gradient-primary transition-all duration-500" style={{ width: `${((idx) / set.length) * 100}%` }} />
      </div>

      <article className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card animate-fade-in">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <DifficultyBadge difficulty={q.difficulty} />
          <span className="text-xs text-muted-foreground">{q.topicLabel}</span>
        </div>
        <h2 className="font-display text-xl font-bold sm:text-2xl">{q.question}</h2>

        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="mt-6 w-full rounded-xl bg-gradient-primary py-3 font-semibold text-primary-foreground shadow-elegant transition-transform hover:-translate-y-0.5"
          >
            Show Answer
          </button>
        ) : (
          <div className="mt-5 space-y-4 animate-fade-in">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <Markdown>{q.answer}</Markdown>
            </div>
            {q.codeSnippet && (
              <div className="overflow-hidden rounded-lg border border-border">
                <SyntaxHighlighter
                  language="java"
                  style={vscDarkPlus}
                  customStyle={{ margin: 0, fontSize: 13, padding: "12px 16px" }}
                >
                  {q.codeSnippet}
                </SyntaxHighlighter>
              </div>
            )}
            {q.proTip && (
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm flex gap-2">
                <span className="font-semibold text-primary shrink-0">💡 Pro Tip: </span>
                <div className="flex-1"><Markdown compact>{q.proTip}</Markdown></div>
              </div>
            )}
            {q.resumeLink && (
              <div className="rounded-lg border border-accent/30 bg-accent/5 p-3 text-sm flex gap-2">
                <span className="font-semibold text-accent shrink-0">📄 Resume Link: </span>
                <div className="flex-1"><Markdown compact>{q.resumeLink}</Markdown></div>
              </div>
            )}

            <div className="grid gap-3 pt-2 sm:grid-cols-2">
              <button
                onClick={() => next(false)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-hard/30 bg-hard/10 py-3 font-semibold text-hard transition-colors hover:bg-hard/20"
              >
                <X className="h-4 w-4" /> Need to review
              </button>
              <button
                onClick={() => next(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-easy/30 bg-easy/10 py-3 font-semibold text-easy transition-colors hover:bg-easy/20"
              >
                <Check className="h-4 w-4" /> I knew it
              </button>
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

export default Quiz;
