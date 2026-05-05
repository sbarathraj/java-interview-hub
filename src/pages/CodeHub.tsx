import { useLeetcode } from "@/hooks/useLeetcode";
import { getCategory } from "@/data/leetcodeCategories";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { CodeBlock } from "@/components/CodeBlock";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileCode2, Clock, Inbox, Hash } from "lucide-react";
import { useMemo } from "react";
import { Difficulty } from "@/data/questions";

export default function CodeHub() {
  const { items, loading } = useLeetcode();

  // Sort by date_solved descending so newest are first
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => b.date_solved.localeCompare(a.date_solved));
  }, [items]);

  return (
    <div className="container max-w-6xl py-12 animate-fade-in">
      <header className="mb-12 glass-card p-10 rounded-[2.5rem] shadow-elegant relative overflow-hidden">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        
        <div className="relative">
          <div className="flex items-center gap-4 mb-6">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-elegant transition-transform duration-500 hover:rotate-6">
              <FileCode2 className="h-8 w-8" />
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">Code Revision Hub</h1>
              <p className="mt-1 text-muted-foreground font-medium uppercase tracking-[0.2em] text-[10px]">Strategic Review Module</p>
            </div>
          </div>
          <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">
            A specialized environment for rapid iteration and revision of your technical solutions. 
            Review complex algorithms and design patterns at scale.
          </p>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 glass-card rounded-[2rem]">
          <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <p className="mt-6 text-sm font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Initializing Hub...</p>
        </div>
      ) : sortedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[2.5rem] glass-card py-24 shadow-card">
          <div className="h-20 w-20 flex items-center justify-center rounded-full bg-muted/50 text-muted-foreground/30 mb-6">
            <Inbox className="h-10 w-10" />
          </div>
          <h3 className="font-display text-2xl font-bold">No solutions cataloged</h3>
          <p className="mt-2 text-muted-foreground">Your code repository is currently empty. Start solving to build your hub.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[2.5rem] glass-card shadow-card">
          <Accordion type="multiple" className="w-full">
            {sortedItems.map((item, idx) => {
              const category = getCategory(item.category);
              return (
                <AccordionItem 
                  key={item.id} 
                  value={item.id} 
                  className="border-b border-border/50 last:border-b-0 animate-slide-up"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  <AccordionTrigger className="px-8 py-6 hover:bg-primary/5 transition-all data-[state=open]:bg-primary/5 group">
                    <div className="flex flex-1 flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between pr-6">
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="font-display text-xl font-bold tracking-tight group-hover:text-primary transition-colors text-left">{item.title}</span>
                        <DifficultyBadge difficulty={item.difficulty as Difficulty} className="shadow-sm" />
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                        {category && (
                          <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1 text-secondary-foreground/80 border border-secondary/20">
                            {category.emoji} {category.name}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/50 px-3 py-1">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(item.date_solved).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-8 pb-8 pt-4">
                    {item.notes && (
                      <div className="mb-6 glass rounded-2xl border-l-4 border-l-primary p-5 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Hash className="h-4 w-4 text-primary opacity-50" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Developer Insights</span>
                        </div>
                        <p className="text-sm leading-relaxed text-foreground/80 font-medium">{item.notes}</p>
                      </div>
                    )}
                    <div className="rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
                      <CodeBlock 
                        code={item.code} 
                        language="java" 
                        filename={`${item.title.replace(/\s+/g, "")}.java`} 
                      />
                    </div>
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

