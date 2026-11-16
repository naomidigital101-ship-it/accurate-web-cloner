/**
 * שכבת מדידה דקה מעל gtag של GA4.
 *
 * הכלל היחיד כאן: מדידה לעולם לא שוברת את הזרימה של המשתמש. אם gtag לא
 * נטען, חסום על ידי חוסם פרסומות או שאנחנו ב-SSR - הקריאה פשוט לא קורית.
 * אף פעם לא לשלוח מידע מזהה אישית (שם, טלפון, אימייל, כתובת) בפרמטרים.
 */
export function track(name: string, params: Record<string, unknown> = {}): void {
  try {
    if (typeof window === "undefined") return;
    const g = window.gtag;
    if (typeof g !== "function") return;
    g("event", name, params);
  } catch {
    /* מדידה לא מפילה כלום */
  }
}

/**
 * שמות הטפסים שנשלחים ב-form_id של generate_lead. שמות קבועים, זהים בעברית
 * ובאנגלית - השפה נשלחת בנפרד ב-lang.
 */
export type LeadFormId = "tefillin_request" | "tefillin_donation";

/**
 * המרת ליד אחידה (generate_lead) - לקרוא רק אחרי שהשרת אישר שהליד נשמר.
 * השם generate_lead והפרמטר form_id זהים בכל אתרי הלקוחות.
 */
export function trackLead(formId: LeadFormId, params: Record<string, unknown> = {}): void {
  track("generate_lead", { ...params, form_id: formId });
}

/** סוג קישור יצירת קשר לפי ה-href, או null אם זה לא קישור כזה */
export function contactLinkType(href: string): "phone" | "email" | "whatsapp" | null {
  const h = href.trim().toLowerCase();
  if (h.startsWith("tel:")) return "phone";
  if (h.startsWith("mailto:")) return "email";
  if (h.startsWith("whatsapp:")) return "whatsapp";
  try {
    const url = new URL(h, "https://or-hadash.org.il");
    if (url.hostname === "wa.me" || url.hostname === "www.wa.me") return "whatsapp";
    if (
      ["api.whatsapp.com", "web.whatsapp.com", "whatsapp.com", "www.whatsapp.com"].includes(url.hostname) &&
      url.pathname.replace(/\/+$/, "") === "/send"
    )
      return "whatsapp";
  } catch {
    /* href לא תקין - לא קישור יצירת קשר */
  }
  return null;
}

const CONTACT_EVENT = { phone: "phone_click", email: "email_click", whatsapp: "whatsapp_click" } as const;

/**
 * אירוע GA4 אחיד ללחיצה על טלפון / וואטסאפ / מייל. בלי המספר או הכתובת עצמם -
 * רק סוג הקישור ומיקומו בעמוד. beacon כדי שהאירוע יישלח גם כשהדפדפן עוזב את העמוד.
 */
export function trackContactClick(
  type: "phone" | "email" | "whatsapp",
  params: Record<string, unknown> = {},
): void {
  track(CONTACT_EVENT[type], { ...params, transport_type: "beacon" });
}

/** שפת העמוד הנוכחי, לפי ה-lang של המסמך */
export function pageLang(): "he" | "en" {
  if (typeof document === "undefined") return "he";
  return document.documentElement.lang?.toLowerCase().startsWith("en") ? "en" : "he";
}
