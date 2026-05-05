import { Link } from "react-router-dom";
import { BookmarkCheck } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { QuestionCard } from "@/components/QuestionCard";

const Bookmarks = () => {
  const { questions, bookmarks } = useApp();
  const list = questions.filter((q) => bookmarks[q.id]);

  return (
    <div className="container py-6 sm:py-10 animate-fade-in">
      <div className="mb-6 flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <BookmarkCheck className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Curated Library</h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{list.length} saved insights</p>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 bg-card/30 p-12 text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">No bookmarks yet. Tap the icon on any question to save it.</p>
          <Link to="/" className="mt-4 inline-block text-xs font-bold text-primary hover:underline">Explore Modules →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((q) => <QuestionCard key={q.id} question={q} showTopic />)}
        </div>
      )}
    </div>
  );
};


export default Bookmarks;
