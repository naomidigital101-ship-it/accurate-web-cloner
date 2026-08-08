import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import process from "node:process";

/**
 * בדיקה זמנית: מגלה אילו משתני סביבה של Supabase מוזרקים על ידי Lovable Cloud,
 * כדי לדעת באילו שמות לחבר את הלקוח. מחזירה שמות ואורכים בלבד - לעולם לא ערכים.
 * למחוק את הקובץ הזה מיד לאחר השימוש.
 */
const probeEnv = createServerFn({ method: "GET" }).handler(async () => {
  // ב-Cloudflare Workers הסביבה נקשרת בזמן הבקשה, לכן קוראים בתוך ההנדלר
  const names = Object.keys(process.env ?? {});
  const interesting = names.filter((n) => /SUPABASE|DATABASE|POSTGRES|ANON|PUBLISHABLE|LOVABLE/i.test(n));
  const detail = interesting.map((n) => {
    const v = process.env[n] ?? "";
    const isUrl = /^https?:\/\//.test(v);
    return { name: n, length: v.length, isUrl, host: isUrl ? new URL(v).host : null };
  });
  const viteKeys = Object.keys(import.meta.env ?? {}).filter((n) => /SUPABASE|ANON|PUBLISHABLE/i.test(n));
  return { totalEnvVars: names.length, matched: detail, viteKeys };
});

export const Route = createFileRoute("/envcheck")({
  loader: async () => probeEnv(),
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: EnvCheck,
});

function EnvCheck() {
  const data = Route.useLoaderData();
  return (
    <pre dir="ltr" style={{ padding: 24, fontSize: 13, whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
