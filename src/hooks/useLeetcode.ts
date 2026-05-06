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

const SEEDED_PREFIX = "leetcode_seeded_v2_"; // bumped: v1 seeded 14, v2 seeds 1
const PINNED_PREFIX = "leetcode_pinned_";

export function useLeetcode() {
  const { user } = useAuth();
  const [items, setItems] = useState<LeetSolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [pinnedId, setPinnedIdState] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    // RLS already restricts to the current user — guarantees per-user isolation.
    const { data, error } = await supabase
      .from("leetcode_solutions")
      .select("*")
      .eq("user_id", user.id)
      .order("date_solved", { ascending: false });
    if (!error && data) setItems(data as LeetSolution[]);
    setLoading(false);
  }, [user]);

  // Seed a single sample solution on first visit per user.
  useEffect(() => {
    const seedIfNeeded = async () => {
      if (!user) return;

      // Clean up any stale per-user seed flags from other accounts on this device.
      try {
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const k = localStorage.key(i);
          if (!k) continue;
          if (k.startsWith("leetcode_seeded_") && !k.endsWith(user.id)) {
            localStorage.removeItem(k);
          }
        }
      } catch { /* ignore */ }

      const flagKey = `${SEEDED_PREFIX}${user.id}`;
      if (localStorage.getItem(flagKey)) return;

      const { count } = await supabase
        .from("leetcode_solutions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);

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

  // Load pinned id (per-user)
  useEffect(() => {
    if (!user) { setPinnedIdState(null); return; }
    setPinnedIdState(localStorage.getItem(`${PINNED_PREFIX}${user.id}`));
  }, [user]);

  const setPinnedId = useCallback((id: string | null) => {
    if (!user) return;
    const key = `${PINNED_PREFIX}${user.id}`;
    if (id) localStorage.setItem(key, id);
    else localStorage.removeItem(key);
    setPinnedIdState(id);
  }, [user]);

  return { items, loading, refresh, pinnedId, setPinnedId };
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
