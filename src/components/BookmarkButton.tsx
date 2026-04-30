import { Bookmark, BookmarkCheck } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

export const BookmarkButton = ({ id, className }: { id: number; className?: string }) => {
  const { bookmarks, toggleBookmark } = useApp();
  const on = !!bookmarks[id];
  return (
    <button
      onClick={(e) => { e.stopPropagation(); toggleBookmark(id); }}
      aria-label={on ? "Remove bookmark" : "Add bookmark"}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/60 transition-colors hover:bg-accent/10 hover:text-accent",
        on && "border-accent/40 bg-accent/10 text-accent",
        className
      )}
    >
      {on ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
    </button>
  );
};
