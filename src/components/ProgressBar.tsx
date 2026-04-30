import { cn } from "@/lib/utils";

interface Props {
  value: number; // 0..100
  className?: string;
  showLabel?: boolean;
}

export const ProgressBar = ({ value, className, showLabel }: Props) => {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("w-full", className)}>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-xs text-muted-foreground">{pct}% complete</div>
      )}
    </div>
  );
};
