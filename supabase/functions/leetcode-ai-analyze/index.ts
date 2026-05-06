// Edge function: analyze a LeetCode solution via OpenRouter and return JSON
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AI_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "google/gemma-3-12b-it:free";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) {
      return new Response(JSON.stringify({ error: "OPENROUTER_API_KEY not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { title, problemNumber, code, language = "java" } = await req.json();
    if (!code || typeof code !== "string") {
      return new Response(JSON.stringify({ error: "code required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `You are a senior interview coach. Analyze this LeetCode solution.

Problem: ${problemNumber ? `#${problemNumber} ` : ""}${title ?? "(unknown)"}
Language: ${language}

\`\`\`${language}
${code}
\`\`\`

Return ONLY valid minified JSON with these fields:
{
  "approach": "concise 2-4 sentence explanation in plain English",
  "time_complexity": "Big-O like O(n)",
  "space_complexity": "Big-O like O(1)",
  "notes": "1-2 sentences on edge cases or pitfalls",
  "tags": ["3-5 short DSA tags like HashMap, Two Pointer"]
}

No markdown, no commentary — only JSON.`;

    const aiRes = await fetch(AI_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${OPENROUTER_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        temperature: 0.2,
        messages: [
          { role: "system", content: "You output strict JSON. Never include markdown fences." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!aiRes.ok) {
      const t = await aiRes.text();
      return new Response(JSON.stringify({ error: `AI error (${aiRes.status})`, detail: t }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiRes.json();
    const text: string = data?.choices?.[0]?.message?.content ?? "{}";

    let parsed: any = {};
    try { parsed = JSON.parse(text); }
    catch {
      const m = text.match(/\{[\s\S]*\}/);
      if (m) try { parsed = JSON.parse(m[0]); } catch { /* ignore */ }
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
