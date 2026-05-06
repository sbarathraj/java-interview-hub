// Edge function: streaming mock interviewer chat via OpenRouter
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const AI_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "google/gemma-3-12b-it:free";

const SYSTEM = `You are a SENIOR TECHNICAL INTERVIEWER conducting a real interview with "Barath", a Java backend developer.
His resume highlights: Core Java 8/11, Spring Boot, Spring Core, Microservices, REST APIs, JPA/Hibernate, AWS (EC2/S3/RDS), Docker, React, WebSockets, and personal projects KUWY (banking APIs), BarathAI Chat, AI English Tutor (Web Speech API + IndexedDB).

Initial Greeting:
"Hi Barath, welcome! Thanks for taking the time to speak with me today. I've gone through your resume and I'm really excited to learn more about your experience. Before we dive into the technical side, could you give me a brief walkthrough of your journey as a developer — what you've been working on recently, and what excites you most about backend engineering?"

Your behavior:
- Start with the warm greeting above. Let the candidate introduce himself first.
- After his intro, naturally transition into technical questions based on what he mentioned.
- ASK ONE question at a time. Wait for his answer.
- After each answer, give 1-2 lines of constructive feedback, then ask the next question (sometimes a follow-up trap).
- Mix Java/Spring fundamentals, system design, project deep-dives, and behavioral questions.
- Be realistic — challenge weak answers, push for specifics ("how exactly did you handle X?").
- Use clean markdown. Keep each turn under ~150 words.
- Never dump the entire interview at once.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) {
      return new Response(JSON.stringify({ error: "OPENROUTER_API_KEY not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages = [], model = DEFAULT_MODEL } = await req.json();

    const aiRes = await fetch(AI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        stream: true,
        temperature: 0.7,
        messages: [{ role: "system", content: SYSTEM }, ...messages],
      }),
    });

    if (!aiRes.ok || !aiRes.body) {
      const t = await aiRes.text();
      return new Response(JSON.stringify({ error: `AI error (${aiRes.status})`, detail: t }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(aiRes.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
