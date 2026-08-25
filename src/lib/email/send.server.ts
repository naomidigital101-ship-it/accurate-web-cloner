/**
 * שליחת מייל, בשכבה דקה מעל הספק.
 *
 * הספק נקבע ממשתני סביבה ולא בקוד, כדי שהחלפה שלו לא תדרוש שינוי בלוגיקה.
 * נתמכים היום Resend ו-Lovable Emails - שניהם REST עם מפתח ב-Authorization,
 * ולכן אותה קריאה משרתת את שניהם.
 *
 * שני עקרונות שלא משתנים:
 *   1. שליחה לעולם לא מפילה את הבקשה שקראה לה. פנייה של גולש חייבת להישמר
 *      גם אם ספק המייל למטה.
 *   2. בלי הגדרות - לא נשלח כלום, ונרשם לוג. אין קריסה ואין שגיאה לגולש.
 */

function env(name: string): string | undefined {
  return process.env?.[name] || undefined;
}

export type MailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

export type MailResult = { sent: boolean; skipped?: string; error?: string };

export function mailConfigured(): boolean {
  return Boolean(env("EMAIL_API_KEY") && env("EMAIL_FROM"));
}

export async function sendMail(input: MailInput): Promise<MailResult> {
  const key = env("EMAIL_API_KEY");
  const from = env("EMAIL_FROM");
  const url = env("EMAIL_API_URL") || "https://api.resend.com/emails";

  if (!key || !from) {
    console.warn("[mail] לא מוגדר - EMAIL_API_KEY או EMAIL_FROM חסרים. המייל לא נשלח.");
    return { sent: false, skipped: "not_configured" };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(input.to) ? input.to : [input.to],
        subject: input.subject,
        html: input.html,
        ...(input.text ? { text: input.text } : {}),
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[mail] הספק החזיר ${res.status}: ${body.slice(0, 300)}`);
      return { sent: false, error: `provider_${res.status}` };
    }
    return { sent: true };
  } catch (e) {
    console.error("[mail] שליחה נכשלה", e);
    return { sent: false, error: "network" };
  }
}
