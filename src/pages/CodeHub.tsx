import { useLeetcode } from "@/hooks/useLeetcode";
import { getCategory, LEETCODE_CATEGORIES } from "@/data/leetcodeCategories";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { CodeBlock } from "@/components/CodeBlock";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { FileCode2, Clock, Inbox, Hash, Pin, PinOff, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Difficulty } from "@/data/questions";

type SortKey = "pinned" | "newest" | "oldest" | "difficulty" | "title";

export default function CodeHub() {
  const { items, loading, pinnedId, setPinnedId } = useLeetcode();
  const [topic, setTopic] = useState<string>("all");
  const [diff, setDiff] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortKey>("pinned");
  const [q, setQ] = useState("");

  // Distinct topics actually present in the user's items.
  const availableTopics = useMemo(() => {
    const ids = new Set(items.map((i) => i.category));
    return LEETCODE_CATEGORIES.filter((c) => ids.has(c.id));
  }, [items]);

  const sortedItems = useMemo(() => {
    const diffRank: Record<string, number> = { easy: 0, medium: 1, hard: 2 };
    let list = items.filter((i) => topic === "all" || i.category === topic)
      .filter((i) => diff === "all" || i.difficulty === diff)
      .filter((i) => {
        if (!q.trim()) return true;
        const t = q.toLowerCase();
        return i.title.toLowerCase().includes(t)
          || String(i.problem_number).includes(t)
          || i.tags.some((tag) => tag.toLowerCase().includes(t));
      });

    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case "newest": return b.date_solved.localeCompare(a.date_solved);
        case "oldest": return a.date_solved.localeCompare(b.date_solved);
        case "difficulty": return (diffRank[a.difficulty] ?? 9) - (diffRank[b.difficulty] ?? 9);
        case "title": return a.title.localeCompare(b.title);
        default: return b.date_solved.localeCompare(a.date_solved);
      }
    });

    if (sortBy === "pinned" && pinnedId) {
      const idx = list.findIndex((i) => i.id === pinnedId);
      if (idx !== -1) {
        const [pinned] = list.splice(idx, 1);
        list = [pinned, ...list];
      }
    }
    return list;
  }, [items, pinnedId, topic, diff, sortBy, q]);

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
              const isPinned = pinnedId === item.id;
              return (
                <AccordionItem 
                  key={item.id} 
                  value={item.id} 
                  className="border-b border-border/50 last:border-b-0 animate-slide-up"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  <div className={`relative flex items-stretch ${isPinned ? "bg-primary/5" : ""}`}>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setPinnedId(isPinned ? null : item.id); }}
                      title={isPinned ? "Unpin from top" : "Pin to top"}
                      className={`group/pin shrink-0 flex items-center justify-center w-12 transition-colors ${isPinned ? "text-primary" : "text-muted-foreground/40 hover:text-primary"}`}
                    >
                      {isPinned ? <Pin className="h-4 w-4 fill-current" /> : <PinOff className="h-4 w-4" />}
                    </button>
                    <AccordionTrigger className="flex-1 px-4 py-6 hover:bg-primary/5 transition-all data-[state=open]:bg-primary/5 group">
                      <div className="flex flex-1 flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between pr-6">
                        <div className="flex flex-wrap items-center gap-4">
                          {isPinned && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                              <Pin className="h-3 w-3" /> Pinned
                            </span>
                          )}
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
                  </div>
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

      {/* Filter & sort toolbar */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search title, number or tag…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select value={topic} onChange={(e) => setTopic(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm">
          <option value="all">All topics</option>
          {availableTopics.map((c) => (
            <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
          ))}
        </select>
        <select value={diff} onChange={(e) => setDiff(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm">
          <option value="all">All difficulty</option>
          <option value="easy">🟢 Easy</option>
          <option value="medium">🟡 Medium</option>
          <option value="hard">🔴 Hard</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortKey)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm">
          <option value="pinned">Sort: Pinned first</option>
          <option value="newest">Sort: Newest</option>
          <option value="oldest">Sort: Oldest</option>
          <option value="difficulty">Sort: Difficulty</option>
          <option value="title">Sort: Title (A–Z)</option>
        </select>
      </div>
