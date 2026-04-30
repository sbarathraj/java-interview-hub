import { Difficulty } from "@/data/questions";
import { cn } from "@/lib/utils";

const styles: Record<Difficulty, { dot: string; bg: string; label: string }> = {
  easy:   { dot: "🟢", bg: "bg-easy/15 text-easy border-easy/30",       label: "Easy" },
  medium: { dot: "🟡", bg: "bg-medium/15 text-medium border-medium/30", label: "Medium" },
  hard:   { dot: "🔴", bg: "bg-hard/15 text-hard border-hard/30",       label: "Hard" },
};

export const DifficultyBadge = ({ difficulty, className }: { difficulty: Difficulty; className?: string }) => {
  const s = styles[difficulty];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold", s.bg, className)}>
      <span aria-hidden>{s.dot}</span>
      {s.label}
    </span>
  );
};
