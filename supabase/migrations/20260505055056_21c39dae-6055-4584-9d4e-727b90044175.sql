
-- Update timestamp helper (idempotent)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE public.leetcode_solutions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  problem_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  leetcode_url TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy','medium','hard')),
  category TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'solved' CHECK (status IN ('solved','revisit','unsolved')),
  date_solved DATE NOT NULL DEFAULT CURRENT_DATE,
  code TEXT NOT NULL DEFAULT '',
  approach TEXT,
  time_complexity TEXT,
  space_complexity TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_leetcode_user ON public.leetcode_solutions(user_id);
CREATE INDEX idx_leetcode_category ON public.leetcode_solutions(category);
CREATE INDEX idx_leetcode_status ON public.leetcode_solutions(status);

ALTER TABLE public.leetcode_solutions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select own solutions" ON public.leetcode_solutions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert own solutions" ON public.leetcode_solutions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update own solutions" ON public.leetcode_solutions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "delete own solutions" ON public.leetcode_solutions
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_leetcode_solutions_updated_at
BEFORE UPDATE ON public.leetcode_solutions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
