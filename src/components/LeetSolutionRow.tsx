import { Link } from "react-router-dom";
import { LeetSolution } from "@/hooks/useLeetcode";
import { DifficultyBadge } from "./DifficultyBadge";
import { getCategoryName } from "@/data/leetcodeCategories";
import { CheckCircle2, RotateCcw, XCircle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const statusIcon = {
  solved: <CheckCircle2 className="h-4 w-4 text-easy" />,
  revisit: <RotateCcw className="h-4 w-4 text-medium" />,
  unsolved: <XCircle className="h-4 w-4 text-hard" />,
};

export const LeetSolutionRow = ({ s }: { s: LeetSolution }) => (
  <Link
    to={`/leetcode/problem/${s.id}`}
    className="group flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/40 hover:shadow-card"
  >
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted font-mono text-xs font-bold text-muted-foreground">
      {s.problem_number}
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <span className="truncate font-semibold text-foreground group-hover:text-primary">{s.title}</span>
        {s.leetcode_url && (
          <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        )}
      </div>
      <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <span>{getCategoryName(s.category)}</span>
        <span>•</span>
        <span>{new Date(s.date_solved).toLocaleDateString()}</span>
        {s.tags.slice(0, 3).map((t) => (
          <span key={t} className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium">{t}</span>
        ))}
      </div>
    </div>
    <DifficultyBadge difficulty={s.difficulty} />
    <span title={s.status} className={cn("inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted")}>
      {statusIcon[s.status]}
    </span>
  </Link>
);
