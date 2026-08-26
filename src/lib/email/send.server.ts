/**
 * שליחת מייל דרך שירות המייל המנוהל של Lovable.
 *
 * המשלוח סינכרוני מול ה-API המנוהל; אחריות, נסיונות חוזרים, חסימות והסרה
 * מרשימת תפוצה מטופלים בצד הפלטפורמה, ולכן אין כאן תור ואין cron.
 *
 * שני עקרונות שלא משתנים:
 *   1. שליחה לעולם לא מפילה את הבקשה שקראה לה. פנייה של גולש חייבת להישמר
 *      גם אם ספק המייל למטה.
 *   2. בלי הגדרות - לא נשלח כלום, ונרשם לוג. אין קריסה ואין שגיאה לגולש.
 */

import process from "node:process";

import { EmailAPIError, sendLovableEmail } from "@lovable.dev/email-js";

const SENDER_DOMAIN = "notify.or-hadash.org.il";
const DEFAULT_FROM = `קשר של תפילין <no-reply@${SENDER_DOMAIN}>`;

/**
 * חובה לייבא את process מ-node:process ולא להסתמך על גלובל.
 * ב-Cloudflare Workers אין `process` גלובלי, וכל גישה אליו זורקת ReferenceError -
 * מה שהפיל את mailConfigured() בשקט וגרם לכך שאף מייל לא נשלח.
 * זו בדיוק ההערה שכבר קיימת ב-supabase.server.ts, ופה היא פוספסה.
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
  return Boolean(env("LOVABLE_API_KEY"));
}

/** ממיר HTML לגרסת טקסט סבירה, כשלא סופקה כזו */
function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export async function sendMail(input: MailInput): Promise<MailResult> {
  const apiKey = env("LOVABLE_API_KEY");
  if (!apiKey) {
    console.warn("[mail] לא מוגדר - LOVABLE_API_KEY חסר. המייל לא נשלח.");
    return { sent: false, skipped: "not_configured" };
  }

  const from = env("EMAIL_FROM") || DEFAULT_FROM;
  const recipients = (Array.isArray(input.to) ? input.to : [input.to])
    .map((x) => x.trim())
    .filter(Boolean);
  if (recipients.length === 0) return { sent: false, skipped: "no_recipient" };

  const text = input.text?.trim() || htmlToText(input.html);
  let sentAny = false;
  let lastError: string | undefined;

  // ה-API המנוהל שולח לנמען אחד בכל קריאה, ולכן נשלחת קריאה לכל מורשה.
  for (const to of recipients) {
    try {
      const res = await sendLovableEmail(
        {
          to,
          from,
          sender_domain: SENDER_DOMAIN,
          subject: input.subject,
          html: input.html,
          text,
          ...(input.replyTo ? { reply_to: input.replyTo } : {}),
        },
        { apiKey },
      );
      if (res.success) sentAny = true;
      else lastError = res.status || "send_failed";
    } catch (e) {
      if (e instanceof EmailAPIError) {
        // נמען חסום או הגבלת קצב הם מצב צפוי, לא תקלה שצריך להפיל עליה בקשה
        console.error(`[mail] שליחה נדחתה (${e.code ?? "error"}): ${e.message}`);
        lastError = e.code ?? "api_error";
      } else {
        console.error("[mail] שליחה נכשלה", e);
        lastError = "network";
      }
    }
  }

  return sentAny ? { sent: true } : { sent: false, error: lastError ?? "send_failed" };
}
