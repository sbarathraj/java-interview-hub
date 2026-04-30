CREATE TABLE public.ai_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic TEXT NOT NULL,
  topic_label TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy','medium','hard')),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  pro_tip TEXT,
  code_snippet TEXT,
  resume_link TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  model TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read ai questions"
  ON public.ai_questions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert ai questions"
  ON public.ai_questions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can delete ai questions"
  ON public.ai_questions FOR DELETE
  USING (true);

CREATE INDEX ai_questions_topic_idx ON public.ai_questions(topic);
CREATE INDEX ai_questions_created_at_idx ON public.ai_questions(created_at DESC);