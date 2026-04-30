import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { Topic } from "@/data/questions";
import { ProgressBar } from "./ProgressBar";

interface Props {
  topic: Topic;
  total: number;
  done: number;
  pct: number;
}

export const TopicCard = ({ topic, total, done, pct }: Props) => {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[topic.icon] ?? Icons.Box;
  return (
    <Link
      to={`/topic/${topic.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-gradient-card p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant"
    >
      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${topic.accent} text-white shadow-md`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-display text-lg font-bold leading-tight">{topic.label}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{topic.description}</p>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>{total} questions</span>
        <span className="font-semibold text-foreground">{done}/{total}</span>
      </div>
      <ProgressBar value={pct} className="mt-2" />
    </Link>
  );
};
