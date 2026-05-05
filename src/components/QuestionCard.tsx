import { useState } from "react";
import { Question } from "@/data/questions";
import { DifficultyBadge } from "./DifficultyBadge";
import { BookmarkButton } from "./BookmarkButton";
import { useApp } from "@/context/AppContext";
import { Markdown } from "./Markdown";
import { ChevronDown, CheckCircle2, Circle, Lightbulb, FileText, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
  question: Question;
  defaultOpen?: boolean;
  showTopic?: boolean;
}

export const QuestionCard = ({ question, defaultOpen = false, showTopic }: Props) => {
  const [open, setOpen] = useState(defaultOpen);
  const { completed, toggleCompleted } = useApp();
  const done = !!completed[question.id];

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-xl transition-all duration-300",
        open ? "glass-card shadow-md" : "border border-border bg-card/50 hover:bg-card hover:-translate-y-0.5",
        done && !open && "border-easy/20 bg-easy/5"
      )}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start gap-3 p-4 text-left sm:p-5"
        aria-expanded={open}
      >
        <span
          onClick={(e) => { e.stopPropagation(); toggleCompleted(question.id); }}
          role="checkbox"
          aria-checked={done}
          className="mt-0.5 inline-flex shrink-0 cursor-pointer transition-transform duration-300 active:scale-125"
          title={done ? "Mark as not done" : "Mark as done"}
        >
          {done ? (
            <CheckCircle2 className="h-5 w-5 text-easy drop-shadow-[0_0_4px_rgba(34,197,94,0.3)]" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground/50 transition-colors group-hover:text-primary" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <DifficultyBadge difficulty={question.difficulty} className="scale-90 origin-left" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">{question.subtopic}</span>
            {showTopic && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-primary">
                {question.topicLabel}
              </span>
            )}
          </div>
          <h3 className={cn(
            "font-display text-base font-bold leading-tight transition-colors",
            open ? "text-primary" : "text-foreground group-hover:text-primary/90"
          )}>
            {question.question}
          </h3>
        </div>

        <div className="flex shrink-0 items-center gap-2 self-center sm:self-start">
          <BookmarkButton id={question.id} />
          <div className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full bg-muted/50 text-muted-foreground transition-all duration-300",
            open && "rotate-180 bg-primary text-primary-foreground shadow-sm"
          )}>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </button>

      {open && (
        <div className="animate-accordion-down overflow-hidden">
          <div className="border-t border-border/50 bg-white/20 dark:bg-slate-950/10 px-4 pb-5 pt-5 sm:px-6">
            <div className="prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed">
              <Markdown>{question.answer}</Markdown>
            </div>

            {question.codeSnippet && (
              <div className="mt-6 overflow-hidden rounded-xl border border-border/50">
                <div className="flex items-center justify-between bg-muted/40 px-3 py-1.5">
                  <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Java</span>
                  <div className="flex gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-400/30" />
                    <div className="h-1.5 w-1.5 rounded-full bg-yellow-400/30" />
                    <div className="h-1.5 w-1.5 rounded-full bg-green-400/30" />
                  </div>
                </div>
                <SyntaxHighlighter
                  language="java"
                  style={vscDarkPlus}
                  customStyle={{ margin: 0, fontSize: 12, padding: "12px", background: "#0f172a" }}
                >
                  {question.codeSnippet}
                </SyntaxHighlighter>
              </div>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {question.proTip && (
                <div className="glass rounded-xl border-l-2 border-l-primary p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Lightbulb className="h-3.5 w-3.5 text-primary" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-primary">Pro Insight</span>
                  </div>
                  <div className="text-[12px] leading-relaxed text-foreground/80 font-medium">
                    <Markdown compact>{question.proTip}</Markdown>
                  </div>
                </div>
              )}

              {question.resumeLink && (
                <div className="glass rounded-xl border-l-2 border-l-blue-500 p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <FileText className="h-3.5 w-3.5 text-blue-500" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-blue-500">Context</span>
                  </div>
                  <div className="text-[12px] leading-relaxed text-foreground/80 font-medium">
                    <Markdown compact>{question.resumeLink}</Markdown>
                  </div>
                </div>
              )}
            </div>

            {question.tags?.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-1.5 pt-4 border-t border-border/50">
                {question.tags.map((t) => (
                  <span key={t} className="flex items-center gap-1 rounded-full bg-secondary/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-secondary-foreground/60 border border-secondary/10">
                    <Hash className="h-2.5 w-2.5 opacity-40" />
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
};


