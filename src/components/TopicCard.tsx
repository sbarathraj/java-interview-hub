import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { Topic } from "@/data/questions";
import { ProgressBar } from "./ProgressBar";
import { ArrowUpRight } from "lucide-react";

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
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-slate-200"
    >
      {/* Hover arrow */}
      <div className="absolute right-4 top-4 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        <ArrowUpRight className="h-4 w-4 text-slate-400" />
      </div>

      {/* Colorful topic icon */}
      <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${topic.accent} text-white shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
        <Icon className="h-5 w-5" />
      </div>

      <div className="flex-1">
        <h3 className="font-display text-sm font-bold leading-tight text-slate-800 group-hover:text-indigo-700 transition-colors">{topic.label}</h3>
        <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-slate-400">{topic.description}</p>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-slate-400">
          <div className="flex items-center gap-1.5">
            <span>{total} questions · {done} done</span>
          </div>
          <span className="font-extrabold text-slate-700">{pct}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${topic.accent} transition-all duration-700`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </Link>
  );
};
