import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";

interface MarkdownProps {
  children: string;
  className?: string;
  compact?: boolean;
}

/**
 * Professional, themed Markdown renderer.
 * Supports GFM (tables, task lists, strikethrough) + syntax-highlighted code blocks.
 * All styling uses semantic design tokens.
 */
export const Markdown = ({ children, className, compact = false }: MarkdownProps) => {
  return (
    <div
      className={cn(
        "prose-content text-sm leading-relaxed text-foreground/90",
        compact ? "space-y-2" : "space-y-3",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="font-display text-xl font-bold text-foreground mt-4 mb-2" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="font-display text-lg font-bold text-foreground mt-4 mb-2" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="font-display text-base font-semibold text-foreground mt-3 mb-1.5" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="font-semibold text-foreground mt-2 mb-1" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="leading-relaxed text-foreground/90" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc space-y-1 pl-5 marker:text-primary" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal space-y-1 pl-5 marker:font-semibold marker:text-primary" {...props} />
          ),
          li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
          a: ({ node, ...props }) => (
            <a
              className="font-medium text-primary underline-offset-4 hover:underline"
              target="_blank"
              rel="noreferrer"
              {...props}
            />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-primary/40 bg-primary/5 px-4 py-2 italic text-foreground/80"
              {...props}
            />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-foreground" {...props} />
          ),
          em: ({ node, ...props }) => <em className="italic text-foreground/85" {...props} />,
          hr: () => <hr className="my-4 border-border" />,
          table: ({ node, ...props }) => (
            <div className="my-3 overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead className="bg-muted/60" {...props} />,
          th: ({ node, ...props }) => (
            <th className="border-b border-border px-3 py-2 text-left font-semibold" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border-b border-border/60 px-3 py-2" {...props} />
          ),
          code: ({ node, className: cls, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(cls || "");
            const inline = !match;
            if (inline) {
              return (
                <code
                  className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-primary"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <div className="my-3 overflow-hidden rounded-lg border border-border">
                <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-1.5">
                  <span className="font-mono text-xs text-muted-foreground">{match[1]}</span>
                </div>
                <SyntaxHighlighter
                  language={match[1]}
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    fontSize: 13,
                    padding: "12px 16px",
                    background: "#1e1e1e",
                  }}
                  PreTag="div"
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};
