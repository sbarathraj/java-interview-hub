// Edge function: generate interview questions via OpenRouter and persist to DB
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const AI_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "google/gemma-3-12b-it:free";

const SYSTEM_PROMPT = `You are a senior Java/Spring Boot interviewer who has interviewed candidates at top product companies.
You generate ORIGINAL, real-world interview questions for "Barath", a Java backend developer whose resume includes:
- Core Java 8/11, Spring Boot, Spring Core, Microservices, REST APIs, JPA/Hibernate
- AWS deployment (EC2, S3, RDS), Docker, CI/CD
- React, WebSocket / real-time apps
- Personal projects: KUWY (banking APIs), BarathAI Chat, AI English Tutor (Web Speech API + IndexedDB)

Rules:
- Questions must be INTERVIEW-QUALITY: deep, conceptual, scenario-based — not trivia.
- Mix difficulties: roughly 30% easy, 40% medium, 30% hard.
- Answers must be COMPLETE and interview-ready (4-10 sentences, technical, specific).
- Pro tip = follow-up trap, common mistake, or "what interviewer asks next".
- codeSnippet = OPTIONAL Java or React code (only when it materially helps).
- resumeLink = which part of Barath's resume this maps to (1 short sentence).
- tags = 2-5 lowercase keywords.
- Return ONLY valid JSON. No prose, no markdown fences.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OPENROUTER_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = await req.json().catch(() => ({}));
    const topic: string = body.topic ?? "core-java";
    const topicLabel: string = body.topicLabel ?? "Core Java";
    const count: number = Math.min(Math.max(Number(body.count) || 10, 1), 20);
    const model: string = body.model || DEFAULT_MODEL;

    const userPrompt = `Generate ${count} fresh, NON-DUPLICATE interview questions for the topic: "${topicLabel}".
Mix difficulties. Each question must be production-grade and tied (when relevant) to Barath's resume projects.

Return ONLY a JSON object with this exact shape (no markdown, no prose):
{
  "questions": [
    {
      "difficulty": "easy" | "medium" | "hard",
      "question": "...",
      "answer": "...",
      "proTip": "...",
      "codeSnippet": "optional",
      "resumeLink": "optional",
      "tags": ["tag1", "tag2"]
    }
  ]
}`;

    const aiRes = await fetch(AI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.9,
      }),
    });

    if (!aiRes.ok) {
      const t = await aiRes.text();
      console.error("OpenRouter error", aiRes.status, t);
      return new Response(
        JSON.stringify({ error: `AI provider error (${aiRes.status})`, detail: t }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const aiJson = await aiRes.json();
    const content: string = aiJson.choices?.[0]?.message?.content ?? "";

    let parsed: any = null;
    try { parsed = JSON.parse(content); } catch { /* try extract */ }
    if (!parsed) {
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        try { parsed = JSON.parse(match[0]); } catch { /* ignore */ }
      }
    }

    const questions = Array.isArray(parsed?.questions) ? parsed.questions : [];
    if (questions.length === 0) {
      return new Response(
        JSON.stringify({ error: "AI returned no questions", raw: content.slice(0, 500) }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Persist using service role
    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const rows = questions.map((q: any) => ({
      topic,
      topic_label: topicLabel,
      difficulty: ["easy", "medium", "hard"].includes(q.difficulty) ? q.difficulty : "medium",
      question: String(q.question || "").slice(0, 2000),
      answer: String(q.answer || "").slice(0, 8000),
      pro_tip: q.proTip ? String(q.proTip).slice(0, 2000) : null,
      code_snippet: q.codeSnippet ? String(q.codeSnippet).slice(0, 4000) : null,
      resume_link: q.resumeLink ? String(q.resumeLink).slice(0, 500) : null,
      tags: Array.isArray(q.tags) ? q.tags.slice(0, 8).map(String) : [],
      model,
    }));

    const { data: inserted, error } = await sb
      .from("ai_questions")
      .insert(rows)
      .select("*");

    if (error) {
      console.error("DB insert error", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ questions: inserted, count: inserted?.length ?? 0 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("ai-generate-questions error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
