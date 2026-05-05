import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { SAMPLE_SOLUTIONS } from "@/data/sampleLeetcode";

export type Difficulty = "easy" | "medium" | "hard";
export type SolutionStatus = "solved" | "revisit" | "unsolved";

export interface LeetSolution {
  id: string;
  user_id: string;
  problem_number: number;
  title: string;
  leetcode_url: string | null;
  difficulty: Difficulty;
  category: string;
  tags: string[];
  status: SolutionStatus;
  date_solved: string;
  code: string;
  approach: string | null;
  time_complexity: string | null;
  space_complexity: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const SEEDED_KEY = "leetcode_seeded_v1";

export function useLeetcode() {
  const { user } = useAuth();
  const [items, setItems] = useState<LeetSolution[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) { setItems([]); setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from("leetcode_solutions")
      .select("*")
      .order("date_solved", { ascending: false });
    if (!error && data) setItems(data as LeetSolution[]);
    setLoading(false);
  }, [user]);

  // Seed sample solutions on first visit per user
  useEffect(() => {
    const seedIfNeeded = async () => {
      if (!user) return;
      const flagKey = `${SEEDED_KEY}_${user.id}`;
      if (localStorage.getItem(flagKey)) return;
      const { count } = await supabase
        .from("leetcode_solutions")
        .select("id", { count: "exact", head: true });
      if ((count ?? 0) === 0) {
        const rows = SAMPLE_SOLUTIONS.map((s) => ({ ...s, user_id: user.id }));
        await supabase.from("leetcode_solutions").insert(rows);
      }
      localStorage.setItem(flagKey, "1");
      refresh();
    };
    seedIfNeeded();
  }, [user, refresh]);

  useEffect(() => { refresh(); }, [refresh]);

  return { items, loading, refresh };
}

export async function createSolution(payload: Omit<LeetSolution, "id" | "user_id" | "created_at" | "updated_at"> & { user_id: string }) {
  return supabase.from("leetcode_solutions").insert(payload).select().single();
}

export async function updateSolution(id: string, patch: Partial<LeetSolution>) {
  return supabase.from("leetcode_solutions").update(patch).eq("id", id).select().single();
}

export async function deleteSolution(id: string) {
  return supabase.from("leetcode_solutions").delete().eq("id", id);
}

export async function getSolution(id: string) {
  return supabase.from("leetcode_solutions").select("*").eq("id", id).single();
}
