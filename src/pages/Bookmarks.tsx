import { Link } from "react-router-dom";
import { BookmarkCheck } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { QuestionCard } from "@/components/QuestionCard";

const Bookmarks = () => {
  const { questions, bookmarks } = useApp();
  const list = questions.filter((q) => bookmarks[q.id]);

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant">
          <BookmarkCheck className="h-6 w-6" />
        </span>
        <div>
          <h1 className="font-display text-3xl font-bold">Your Bookmarks</h1>
          <p className="text-sm text-muted-foreground">{list.length} saved {list.length === 1 ? "question" : "questions"}</p>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">No bookmarks yet. Tap the bookmark icon on any question to save it for later.</p>
          <Link to="/" className="mt-4 inline-block font-semibold text-primary hover:underline">Browse topics →</Link>
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
