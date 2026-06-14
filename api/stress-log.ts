import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow the desktop app to POST from any origin
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { score, factors, surveyAnswers, source } = req.body ?? {};

  if (typeof score !== "number") {
    return res.status(400).json({ error: "score required" });
  }

  // Optional: auth header lets us attribute the log to a user
  const authHeader = req.headers.authorization ?? "";
  let userId: string | null = null;
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const { data } = await supabase.auth.getUser(token);
    userId = data?.user?.id ?? null;
  }

  const { error } = await supabase.from("telemetry_events").insert({
    user_id: userId,
    event: "stress_reading",
    cli: Math.round(score),
    details: { factors: factors ?? null, surveyAnswers: surveyAnswers ?? null, source: source ?? "desktop" },
  });

  if (error) {
    console.error("stress-log insert failed:", error.message);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ ok: true });
}
