import { useState } from "react";
import { Question } from "@/data/questions";
import { DifficultyBadge } from "./DifficultyBadge";
import { BookmarkButton } from "./BookmarkButton";
import { useApp } from "@/context/AppContext";
import { ChevronDown, CheckCircle2, Circle, Lightbulb } from "lucide-react";
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
        "group rounded-xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-elegant",
        done && "border-easy/40"
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
          className="mt-0.5 inline-flex shrink-0 cursor-pointer"
          title={done ? "Mark as not done" : "Mark as done"}
        >
          {done ? (
            <CheckCircle2 className="h-5 w-5 text-easy" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <DifficultyBadge difficulty={question.difficulty} />
            <span className="text-xs text-muted-foreground">{question.subtopic}</span>
            {showTopic && (
              <span className="rounded-full bg-secondary/15 px-2 py-0.5 text-xs font-medium text-secondary-foreground/80">
                {question.topicLabel}
              </span>
            )}
          </div>
          <h3 className="font-display text-base font-semibold leading-snug sm:text-lg">
            {question.question}
          </h3>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <BookmarkButton id={question.id} />
          <ChevronDown
            className={cn(
              "h-5 w-5 text-muted-foreground transition-transform duration-300",
              open && "rotate-180"
            )}
          />
        </div>
      </button>

      {open && (
        <div className="animate-accordion-down border-t border-border px-4 pb-5 pt-4 sm:px-5">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
              {question.answer}
            </p>
          </div>

          {question.codeSnippet && (
            <div className="mt-4 overflow-hidden rounded-lg border border-border">
              <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-1.5">
                <span className="font-mono text-xs text-muted-foreground">Java</span>
              </div>
              <SyntaxHighlighter
                language="java"
                style={vscDarkPlus}
                customStyle={{ margin: 0, fontSize: 13, padding: "12px 16px", background: "#1e1e1e" }}
              >
                {question.codeSnippet}
              </SyntaxHighlighter>
            </div>
          )}

          {question.proTip && (
            <div className="mt-4 flex gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-primary">Pro Tip</div>
                <p className="mt-1 text-sm text-foreground/85">{question.proTip}</p>
              </div>
            </div>
          )}

          {question.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {question.tags.map((t) => (
                <span key={t} className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
};
