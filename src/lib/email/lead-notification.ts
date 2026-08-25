import { SITE_URL } from "@/lib/site";

/**
 * מייל התראה על פנייה חדשה מהאתר.
 *
 * נכתב בטבלאות ובסגנונות inline ולא ב-CSS מודרני, כי אאוטלוק מרנדר עם המנוע
 * של Word: flex, grid, ו-<style> חיצוני פשוט לא עובדים שם. זו לא בחירה
 * אסתטית אלא תנאי לכך שהמייל ייראה זהה בג'ימייל, באאוטלוק ובנייד.
 *
 * dir="rtl" יושב על כל טבלה בנפרד ולא רק על ה-body, כי חלק מהלקוחות
 * מסירים תכונות מה-body בעת הסניטציה.
 */

export type LeadEmail = {
  id?: string;
  kind: "request" | "donate";
  lang?: "he" | "en";
  fullName?: string | null;
  phone?: string | null;
  email?: string | null;
  city?: string | null;
  address?: string | null;
  target?: string | null;
  hand?: string | null;
  delivery?: string | null;
  condition?: string | null;
  dedication?: string | null;
  createdAt?: Date;
  /** כמה פעמים אותו טלפון כבר פנה. 2 ומעלה = פונה חוזר */
  repeatCount?: number;
};

const NAVY = "#2d2e83";
const CYAN = "#009fe3";
const INK = "#1c1e2b";
const MUTED = "#6b7280";
const LINE = "#e5e7eb";
const WARM = "#fff7ed";
const WARM_LINE = "#fdba74";
const WARM_INK = "#9a3412";

function esc(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** מנקה טלפון ישראלי לפורמט בינלאומי, ל-tel: ולוואטסאפ */
function intlPhone(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const d = phone.replace(/\D/g, "");
  if (d.startsWith("972")) return d;
  if (d.startsWith("0")) return "972" + d.slice(1);
  return d.length >= 9 ? d : null;
}

function timeIL(d: Date): string {
  return new Intl.DateTimeFormat("he-IL", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Asia/Jerusalem",
  }).format(d);
}

function row(label: string, value: string | null | undefined): string {
  if (!value || !String(value).trim()) return "";
  return `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid ${LINE};color:${MUTED};font-size:14px;white-space:nowrap;vertical-align:top;width:34%;">${esc(label)}</td>
          <td style="padding:10px 0 10px 14px;border-bottom:1px solid ${LINE};color:${INK};font-size:15px;font-weight:600;vertical-align:top;">${esc(value)}</td>
        </tr>`;
}

function button(href: string, text: string, bg: string, fg = "#ffffff"): string {
  // כפתור לבן חייב מסגרת, אחרת הוא נבלע ברקע הלבן של המייל ולא נראה כפתור
  const border = bg === "#ffffff" ? `border:1px solid ${LINE};` : "border:1px solid " + bg + ";";
  return `<a href="${esc(href)}" style="display:inline-block;background:${bg};color:${fg};${border}text-decoration:none;font-size:15px;font-weight:700;padding:12px 22px;border-radius:8px;margin:0 0 8px 8px;">${esc(text)}</a>`;
}

export function leadSubject(lead: LeadEmail): string {
  const what = lead.kind === "donate" ? "תרומת תפילין" : "בקשת תפילין";
  const who = lead.fullName?.trim() || lead.phone || "ללא שם";
  const where = lead.city?.trim() ? ` מ${lead.city.trim()}` : "";
  const repeat = (lead.repeatCount ?? 1) > 1 ? " · פונה חוזר" : "";
  return `${what}: ${who}${where}${repeat}`;
}

export function leadEmailHtml(lead: LeadEmail): string {
  const created = lead.createdAt ?? new Date();
  const tel = intlPhone(lead.phone);
  const isDonate = lead.kind === "donate";
  const accent = isDonate ? NAVY : CYAN;
  const kindLabel = isDonate ? "תרומת / מסירת תפילין" : "בקשת תפילין";
  const repeat = (lead.repeatCount ?? 1) > 1;

  const actions = [
    tel ? button(`tel:+${tel}`, "חיוג", accent) : "",
    tel ? button(`https://wa.me/${tel}`, "וואטסאפ", "#25d366") : "",
    button(`${SITE_URL}/admin/leads`, "פתיחה בניהול", "#ffffff", INK),
  ].join("");

  return `<!doctype html>
<html dir="rtl" lang="he">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(leadSubject(lead))}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;">
  <!-- טקסט התצוגה המקדימה בתיבה. נסתר בגוף המייל עצמו. -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    ${esc(kindLabel)} · ${esc(lead.fullName || lead.phone || "")} · ${esc(timeIL(created))} — כדאי לחזור היום.
  </div>

  <table role="presentation" dir="rtl" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" dir="rtl" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;font-family:'Segoe UI',Arial,Helvetica,sans-serif;">

        <!-- לוגו -->
        <tr><td align="center" style="padding:28px 24px 18px;">
          <img src="${SITE_URL}/email/logo-kesher.png" width="200" alt="קשר של תפילין" style="display:block;border:0;width:200px;height:auto;">
        </td></tr>

        <tr><td style="padding:0 24px;"><div style="height:3px;background:${accent};border-radius:2px;"></div></td></tr>

        <!-- כותרת -->
        <tr><td style="padding:22px 24px 4px;" align="right">
          <div style="font-size:13px;font-weight:700;color:${accent};letter-spacing:.02em;">${esc(kindLabel)}</div>
          <h1 style="margin:6px 0 0;font-size:26px;line-height:1.25;color:${INK};font-weight:800;">
            פנייה חדשה מהאתר${repeat ? " · פונה חוזר" : ""}
          </h1>
          <div style="margin-top:6px;font-size:14px;color:${MUTED};">התקבלה ב-${esc(timeIL(created))}</div>
        </td></tr>

        <!-- למה עכשיו -->
        <tr><td style="padding:18px 24px 0;">
          <table role="presentation" dir="rtl" width="100%" cellpadding="0" cellspacing="0" style="background:${WARM};border:1px solid ${WARM_LINE};border-radius:10px;">
            <tr><td style="padding:14px 16px;" align="right">
              <div style="font-size:15px;font-weight:800;color:${WARM_INK};margin-bottom:4px;">כדאי לחזור אליו היום</div>
              <div style="font-size:14px;line-height:1.6;color:${WARM_INK};">
                מי שמילא את הטופס עשה את זה ברגע של רצון. ככל שעובר זמן הרצון מתקרר,
                והסיכוי שהוא יענה לטלפון או יזכור בכלל שפנה - יורד.
                שיחה באותו יום הופכת פנייה לזוג תפילין שיוצא לדרך.
              </div>
            </td></tr>
          </table>
        </td></tr>

        ${repeat ? `
        <tr><td style="padding:12px 24px 0;">
          <div style="background:#eef2ff;border-right:4px solid ${NAVY};border-radius:8px;padding:12px 14px;font-size:14px;color:${NAVY};" align="right">
            הטלפון הזה כבר פנה ${esc(lead.repeatCount)} פעמים. כדאי להסתכל בהיסטוריה בניהול לפני שמתקשרים.
          </div>
        </td></tr>` : ""}

        <!-- פרטים -->
        <tr><td style="padding:20px 24px 0;">
          <table role="presentation" dir="rtl" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            ${row("שם", lead.fullName)}
            ${row("טלפון", lead.phone)}
            ${row("אימייל", lead.email)}
            ${row("עיר", lead.city)}
            ${row("כתובת", lead.address)}
            ${row("למי מיועדות התפילין", lead.target)}
            ${row("כותב ביד", lead.hand)}
            ${row("שיטת אספקה", lead.delivery)}
            ${row("מצב התפילין", lead.condition)}
            ${row("הקדשה", lead.dedication)}
            ${row("שפת הטופס", lead.lang === "en" ? "אנגלית" : "עברית")}
          </table>
        </td></tr>

        <!-- פעולות -->
        <tr><td style="padding:22px 24px 4px;" align="right">${actions}</td></tr>

        <tr><td style="padding:8px 24px 24px;" align="right">
          <div style="font-size:13px;color:${MUTED};line-height:1.6;">
            ${tel ? `כפתור החיוג פותח את הטלפון ישירות. אם עונים - נסו לסגור את הפרטים בשיחה אחת.` : `לא הושאר טלפון בפנייה הזו. אפשר לענות למייל הזה או לפנות דרך הניהול.`}
          </div>
        </td></tr>

        <!-- פוטר -->
        <tr><td style="background:${NAVY};padding:22px 24px;" align="center">
          <a href="https://move-geo.ai/" style="text-decoration:none;">
            <img src="${SITE_URL}/email/logo-move.png" width="120" alt="MOVE" style="display:block;border:0;width:120px;height:auto;margin:0 auto 10px;">
          </a>
          <div style="font-size:12px;color:#c7cbe8;line-height:1.7;">
            ההתראה הזו נשלחת אוטומטית ע"י מערכת הלידים שבנתה MOVE עבור עמותת אור חדש.<br>
            <a href="${SITE_URL}/admin/leads" style="color:#ffffff;text-decoration:underline;">כל הפניות במערכת הניהול</a>
          </div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/** גרסת טקסט, ללקוחות שלא מציגים HTML ולסינון ספאם טוב יותר */
export function leadEmailText(lead: LeadEmail): string {
  const created = lead.createdAt ?? new Date();
  const lines = [
    lead.kind === "donate" ? "תרומת / מסירת תפילין" : "בקשת תפילין",
    `התקבלה ב-${timeIL(created)}`,
    "",
    "כדאי לחזור אליו היום - מי שמילא את הטופס עשה זאת ברגע של רצון, וזה מתקרר.",
    "",
    lead.fullName ? `שם: ${lead.fullName}` : "",
    lead.phone ? `טלפון: ${lead.phone}` : "",
    lead.email ? `אימייל: ${lead.email}` : "",
    lead.city ? `עיר: ${lead.city}` : "",
    lead.address ? `כתובת: ${lead.address}` : "",
    lead.target ? `למי מיועדות: ${lead.target}` : "",
    lead.hand ? `כותב ביד: ${lead.hand}` : "",
    lead.delivery ? `אספקה: ${lead.delivery}` : "",
    lead.dedication ? `הקדשה: ${lead.dedication}` : "",
    "",
    `כל הפניות: ${SITE_URL}/admin/leads`,
    "",
    "נשלח אוטומטית ע\"י מערכת הלידים שבנתה MOVE עבור עמותת אור חדש.",
  ];
  return lines.filter((l) => l !== "").join("\n");
}
