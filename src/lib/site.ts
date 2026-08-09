/**
 * מקור אמת יחיד לכתובת האתר.
 *
 * כל canonical, og:url, JSON-LD וסייטמאפ נגזרים מכאן. במעבר לדומיין הקבוע
 * זו השורה היחידה שצריך לשנות בקוד (ובנוסף להריץ scripts/gen-sitemap.mjs).
 * בלי זה גוגל ממשיך לייחס את הערך לדומיין הזמני.
 */
export const SITE_URL = "https://accurate-web-cloner.lovable.app";

/** בונה כתובת מוחלטת מנתיב יחסי, עם סלאש סוגר אחיד */
export function abs(path = "/"): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  const withSlash = p.endsWith("/") || p.includes(".") ? p : `${p}/`;
  return `${SITE_URL}${withSlash}`;
}
