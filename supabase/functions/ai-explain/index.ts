// Edge function: stream a deeper explanation for any question via OpenRouter
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) {
      return new Response(JSON.stringify({ error: "OPENROUTER_API_KEY not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { question, mode = "explain", model = "deepseek/deepseek-chat-v3.1:free" } =
      await req.json();

    if (!question || typeof question !== "string") {
      return new Response(JSON.stringify({ error: "question required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemByMode: Record<string, string> = {
      explain: "You are a senior Java/Spring Boot mentor. Explain the question deeply with examples, edge cases, common pitfalls and a follow-up the interviewer might ask. Use clean markdown.",
      hint: "You are a kind interviewer. Give ONLY a short hint (2-3 sentences). Do NOT reveal the full answer.",
      review: "You are a strict interviewer. The user will paste their answer. Score it /10 and give specific, actionable feedback in markdown.",
    };

    const aiRes = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://lovable.dev",
        "X-Title": "Barath Interview Refresh Portal",
      },
      body: JSON.stringify({
        model,
        stream: true,
        temperature: 0.4,
        messages: [
          { role: "system", content: systemByMode[mode] ?? systemByMode.explain },
          { role: "user", content: question },
        ],
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
