import { useLeetcode } from "@/hooks/useLeetcode";
import { getCategory } from "@/data/leetcodeCategories";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { CodeBlock } from "@/components/CodeBlock";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileCode2, Clock, Inbox } from "lucide-react";
import { useMemo } from "react";
import { Difficulty } from "@/data/questions";

export default function CodeHub() {
  const { items, loading } = useLeetcode();

  // Sort by date_solved descending so newest are first
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => b.date_solved.localeCompare(a.date_solved));
  }, [items]);

  return (
    <div className="container max-w-5xl py-8">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-bold flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant">
            <FileCode2 className="h-6 w-6" />
          </span>
          Code Revision Hub
        </h1>
        <p className="mt-2 text-muted-foreground">
          Quickly review and revise all your LeetCode solutions in one place.
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-pulse text-muted-foreground">Loading code...</div>
        </div>
      ) : sortedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 shadow-card">
          <Inbox className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 font-display text-xl font-semibold">No code found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            You haven't added any LeetCode solutions yet.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card shadow-card">
          <Accordion type="multiple" className="w-full">
            {sortedItems.map((item) => {
              const category = getCategory(item.category);
              return (
                <AccordionItem key={item.id} value={item.id} className="last:border-b-0">
                  <AccordionTrigger className="px-5 hover:bg-muted/50 data-[state=open]:bg-muted/50">
                    <div className="flex flex-1 flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between pr-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-semibold text-left">{item.title}</span>
                        <DifficultyBadge difficulty={item.difficulty as Difficulty} />
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        {category && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/50 px-2 py-0.5">
                            {category.emoji} {category.name}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(item.date_solved).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5 pt-2">
                    {item.notes && (
                      <div className="mb-4 rounded-md bg-muted/40 p-3 text-sm text-foreground/80">
                        <strong className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                          Notes
                        </strong>
                        {item.notes}
                      </div>
                    )}
                    <CodeBlock code={item.code} language="java" filename={`${item.title.replace(/\s+/g, "")}.java`} />
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      )}
    </div>
  );
}
