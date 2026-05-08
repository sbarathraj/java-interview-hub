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

const SEEDED_PREFIX = "leetcode_seeded_v2_";
const ORDER_PREFIX = "leetcode_order_";

// Module-level guard prevents StrictMode / re-mount double-seeding (the
// root cause of the "duplicate problem on first login" bug).
const seedingInFlight = new Set<string>();

export function useLeetcode() {
  const { user } = useAuth();
  const [items, setItems] = useState<LeetSolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [order, setOrderState] = useState<string[]>([]);

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
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

      // Clean stale per-user seed flags from other accounts on this device.
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
      if (seedingInFlight.has(user.id)) return;
      seedingInFlight.add(user.id);

      try {
        // Set flag BEFORE insert to block any racing effect run.
        localStorage.setItem(flagKey, "1");

        const { count } = await supabase
          .from("leetcode_solutions")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id);

        if ((count ?? 0) === 0) {
          const rows = SAMPLE_SOLUTIONS.map((s) => ({ ...s, user_id: user.id }));
          await supabase.from("leetcode_solutions").insert(rows);
        }
        await refresh();
      } finally {
        seedingInFlight.delete(user.id);
      }
    };
    seedIfNeeded();
  }, [user, refresh]);

  useEffect(() => { refresh(); }, [refresh]);

  // Load custom order (per-user)
  useEffect(() => {
    if (!user) { setOrderState([]); return; }
    try {
      const raw = localStorage.getItem(`${ORDER_PREFIX}${user.id}`);
      setOrderState(raw ? JSON.parse(raw) : []);
    } catch { setOrderState([]); }
  }, [user]);

  const setOrder = useCallback((next: string[]) => {
    if (!user) return;
    localStorage.setItem(`${ORDER_PREFIX}${user.id}`, JSON.stringify(next));
    setOrderState(next);
  }, [user]);

  const moveItem = useCallback((id: string, direction: "up" | "down", visibleIds: string[]) => {
    // Build a full ordered list combining current saved order + any new ids.
    const known = order.length ? order : visibleIds;
    const merged = [...known];
    visibleIds.forEach((vid) => { if (!merged.includes(vid)) merged.push(vid); });
    // Filter merged to only ids that still exist among visibleIds for movement context.
    const movable = merged.filter((m) => visibleIds.includes(m));
    const idx = movable.indexOf(id);
    if (idx === -1) return;
    const swap = direction === "up" ? idx - 1 : idx + 1;
    if (swap < 0 || swap >= movable.length) return;
    [movable[idx], movable[swap]] = [movable[swap], movable[idx]];
    // Reinsert moved sequence back into merged
    const result: string[] = [];
    let mi = 0;
    for (const m of merged) {
      if (visibleIds.includes(m)) { result.push(movable[mi++]); }
      else result.push(m);
    }
    setOrder(result);
  }, [order, setOrder]);

  return { items, loading, refresh, order, setOrder, moveItem };
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
