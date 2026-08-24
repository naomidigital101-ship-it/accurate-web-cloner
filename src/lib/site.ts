/**
 * מקור אמת יחיד לכתובת האתר.
 *
 * כל canonical, og:url, JSON-LD וסייטמאפ נגזרים מכאן. במעבר לדומיין הקבוע
 * זו השורה היחידה שצריך לשנות בקוד (ובנוסף להריץ scripts/gen-sitemap.mjs).
 * בלי זה גוגל ממשיך לייחס את הערך לדומיין הזמני.
 */
export const SITE_URL = "https://accurate-web-cloner.lovable.app";

/**
 * בונה כתובת מוחלטת מנתיב יחסי, **בלי** סלאש סוגר.
 *
 * הראוטר מגיש את הגרסה בלי הסלאש כ-200 ומפנה אליה את הגרסה עם הסלאש ב-307.
 * לכן canonical/hreflang/סייטמאפ שמצביעים על הגרסה עם הסלאש מצביעים על
 * הפניה, וגוגל בוחר קנוניקל בעצמו. תמיד לפלוט את הכתובת שמחזירה 200.
 */
export function abs(path = "/"): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  const clean = p.length > 1 ? p.replace(/\/+$/, "") : p;
  return `${SITE_URL}${clean}`;
}
