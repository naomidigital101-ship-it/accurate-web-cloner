/**
 * מאיפה הגיעה הפנייה - נאסף בדפדפן בזמן שליחת הטופס.
 *
 * שתי שאלות נפרדות, ולכן שני שדות:
 *   formPage - באיזה עמוד באתר מולא הטופס. עונה על "איזה עמוד מייצר פניות",
 *              ובעיקר: האם הטופס בעמוד הבית עובד טוב יותר מהעמוד הייעודי.
 *   referer  - מאיפה הגולש הגיע לאתר מלכתחילה. עונה על "איזה ערוץ מביא".
 *
 * ה-referer נשמר כשם ערוץ ולא ככתובת מלאה: כתובת מלאה עלולה להכיל מזהי
 * מעקב ומחרוזות חיפוש, כלומר מידע על הגולש שאין לנו צורך בו. שם הערוץ
 * מספיק כדי למדוד, ולא שומר עליו שום דבר אישי.
 */

function channelOf(url: string): string {
  const u = url.toLowerCase();
  if (u.includes("chatgpt") || u.includes("openai")) return "chatgpt";
  if (u.includes("perplexity")) return "perplexity";
  if (u.includes("gemini") || u.includes("bard")) return "gemini";
  if (u.includes("google")) return "google";
  if (u.includes("bing")) return "bing";
  if (u.includes("facebook") || u.includes("fb.com")) return "facebook";
  if (u.includes("instagram")) return "instagram";
  if (u.includes("whatsapp") || u.includes("wa.me")) return "whatsapp";
  if (u.includes("t.co") || u.includes("twitter") || u.includes("x.com")) return "twitter";
  if (u.includes("youtube")) return "youtube";
  if (u.includes("or-hadash")) return "internal";
  try {
    return new URL(url).hostname.replace(/^www\./, "").slice(0, 60);
  } catch {
    return "other";
  }
}

export function leadSource(): { form_page: string; referer: string } {
  if (typeof window === "undefined") return { form_page: "", referer: "" };
  const path = window.location.pathname + window.location.search;
  const ref = document.referrer;
  return {
    form_page: decodeURIComponent(path).slice(0, 300),
    referer: ref ? channelOf(ref) : "direct",
  };
}
