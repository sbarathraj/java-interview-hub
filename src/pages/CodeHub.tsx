import { useLeetcode } from "@/hooks/useLeetcode";
import { getCategory, LEETCODE_CATEGORIES } from "@/data/leetcodeCategories";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { CodeBlock } from "@/components/CodeBlock";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileCode2, Clock, Inbox, Hash, Search, GripVertical, ArrowUp, ArrowDown } from "lucide-react";
import { useMemo, useState } from "react";
import { Difficulty } from "@/data/questions";
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { LeetSolution } from "@/hooks/useLeetcode";

type SortKey = "custom" | "newest" | "oldest" | "difficulty" | "title";

function SortableRow({
  item, idx, total, onMove,
}: {
  item: LeetSolution;
  idx: number;
  total: number;
  onMove: (dir: "up" | "down") => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.85 : 1,
  };
  const category = getCategory(item.category);
  return (
    <AccordionItem
      ref={setNodeRef}
      style={style}
      value={item.id}
      className="border-b border-border/50 last:border-b-0 bg-card"
    >
      <div className="relative flex items-stretch">
        {/* drag handle + arrows */}
        <div className="flex shrink-0 flex-col items-center justify-center gap-0.5 px-2 border-r border-border/40 bg-muted/20">
          <button
            type="button"
            {...attributes}
            {...listeners}
            title="Drag to reorder"
            className="p-1 rounded text-muted-foreground/60 hover:text-primary cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={idx === 0}
            onClick={(e) => { e.stopPropagation(); onMove("up"); }}
            title="Move up"
            className="p-1 rounded text-muted-foreground/60 hover:text-primary disabled:opacity-30 disabled:hover:text-muted-foreground/60"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            disabled={idx === total - 1}
            onClick={(e) => { e.stopPropagation(); onMove("down"); }}
            title="Move down"
            className="p-1 rounded text-muted-foreground/60 hover:text-primary disabled:opacity-30 disabled:hover:text-muted-foreground/60"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
        </div>
        <AccordionTrigger className="flex-1 px-4 py-6 hover:bg-primary/5 transition-all data-[state=open]:bg-primary/5 group">
          <div className="flex flex-1 flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between pr-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-mono text-xs font-bold text-muted-foreground/60">#{item.problem_number}</span>
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
        {/* keep handle props referenced to satisfy render signature */}
        <span className="hidden">{children({}).toString?.()}</span>
      </AccordionContent>
    </AccordionItem>
  );
}

export default function CodeHub() {
  const { items, loading, order, setOrder } = useLeetcode();
  const [topic, setTopic] = useState<string>("all");
  const [diff, setDiff] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortKey>("custom");
  const [q, setQ] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const availableTopics = useMemo(() => {
    const ids = new Set(items.map((i) => i.category));
    return LEETCODE_CATEGORIES.filter((c) => ids.has(c.id));
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((i) => topic === "all" || i.category === topic)
      .filter((i) => diff === "all" || i.difficulty === diff)
      .filter((i) => {
        if (!q.trim()) return true;
        const t = q.toLowerCase();
        return i.title.toLowerCase().includes(t)
          || String(i.problem_number).includes(t)
          || i.tags.some((tag) => tag.toLowerCase().includes(t));
      });
  }, [items, topic, diff, q]);

  const sortedItems = useMemo(() => {
    const diffRank: Record<string, number> = { easy: 0, medium: 1, hard: 2 };
    if (sortBy === "newest") return [...filtered].sort((a, b) => b.date_solved.localeCompare(a.date_solved));
    if (sortBy === "oldest") return [...filtered].sort((a, b) => a.date_solved.localeCompare(b.date_solved));
    if (sortBy === "difficulty") return [...filtered].sort((a, b) => (diffRank[a.difficulty] ?? 9) - (diffRank[b.difficulty] ?? 9));
    if (sortBy === "title") return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    // custom
    const idx = new Map(order.map((id, i) => [id, i]));
    return [...filtered].sort((a, b) => {
      const ai = idx.has(a.id) ? (idx.get(a.id) as number) : Number.MAX_SAFE_INTEGER;
      const bi = idx.has(b.id) ? (idx.get(b.id) as number) : Number.MAX_SAFE_INTEGER;
      if (ai !== bi) return ai - bi;
      return b.date_solved.localeCompare(a.date_solved);
    });
  }, [filtered, sortBy, order]);

  const ids = sortedItems.map((i) => i.id);
  const dragDisabled = sortBy !== "custom";

  const persistOrder = (newIds: string[]) => {
    // Merge new visible-id order into the saved order
    const set = new Set(newIds);
    const rest = order.filter((id) => !set.has(id));
    setOrder([...newIds, ...rest]);
  };

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = ids.indexOf(String(active.id));
    const newIdx = ids.indexOf(String(over.id));
    if (oldIdx === -1 || newIdx === -1) return;
    const next = arrayMove(ids, oldIdx, newIdx);
    persistOrder(next);
  };

  const moveById = (id: string, dir: "up" | "down") => {
    const i = ids.indexOf(id);
    if (i === -1) return;
    const j = dir === "up" ? i - 1 : i + 1;
    if (j < 0 || j >= ids.length) return;
    persistOrder(arrayMove(ids, i, j));
  };

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
            Drag rows by the handle, use the up/down arrows, or pick a sort mode to organize your solutions exactly how you study.
          </p>
        </div>
      </header>

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
          <option value="custom">Sort: Custom (drag)</option>
          <option value="newest">Sort: Newest</option>
          <option value="oldest">Sort: Oldest</option>
          <option value="difficulty">Sort: Difficulty</option>
          <option value="title">Sort: Title (A–Z)</option>
        </select>
        {sortBy !== "custom" && (
          <Button size="sm" variant="outline" onClick={() => setSortBy("custom")}>Enable reordering</Button>
        )}
      </div>

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
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={dragDisabled ? undefined : onDragEnd}>
            <SortableContext items={ids} strategy={verticalListSortingStrategy} disabled={dragDisabled}>
              <Accordion type="multiple" className="w-full">
                {sortedItems.map((item, idx) => (
                  <SortableRow
                    key={item.id}
                    item={item}
                    idx={idx}
                    total={sortedItems.length}
                    onMove={(dir) => moveById(item.id, dir)}
                  >
                    {() => null}
                  </SortableRow>
                ))}
              </Accordion>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}
