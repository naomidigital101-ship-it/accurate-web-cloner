/**
 * ממפה תמונה מלאה לגרסה הממוזערת שלה.
 *
 * הכרטיסים באתר - גלריה, מכתבי תודה, הסכמות רבנים, אישורים - מציגים תמונות
 * ברוחב 300 פיקסל בערך, אבל טענו עד היום את הקובץ המלא: 1400 עד 2048 פיקסל,
 * מאות קילובייט לכל אחד. הממוזערת היא 640 פיקסל, כלומר פי שניים מרוחב התצוגה
 * וחדה גם על מסך Retina.
 *
 * המקור לא נגרע ולא נדחס יותר - הוא נשאר בדיוק כפי שהוא ונטען בלחיצה,
 * בלייטבוקס או בלשונית חדשה. האיכות בצפייה המלאה זהה.
 *
 * הממוזערות נוצרות ב-scripts/gen-thumbs.mjs. אם אין ממוזערת לתמונה מסוימת,
 * ה-onError שבקומפוננטה מחזיר את המקור, כך שתמונה חדשה מהאדמין לא נשברת.
 */
import { THUMB_SIZES } from "@/data/thumb-sizes";

const THUMB_DIR = "/wp/thumbs/";

export function thumb(url: string | null | undefined): string {
  if (!url) return "";
  if (!url.startsWith("/wp/") || url.startsWith(THUMB_DIR)) return url;
  const rest = url.slice("/wp/".length).split("?")[0];
  const dot = rest.lastIndexOf(".");
  if (dot < 0) return url;
  return THUMB_DIR + rest.slice(0, dot).replaceAll("/", "-") + ".webp";
}

/** נופל בחזרה לתמונה המלאה כשאין ממוזערת - לתמונות שנוספו מהאדמין */
export function thumbFallback(e: { currentTarget: HTMLImageElement }, full: string) {
  const img = e.currentTarget;
  if (img.dataset.fellBack) return;
  img.dataset.fellBack = "1";
  img.src = full;
}

/**
 * מידות הממוזערת, לשימוש ב-width/height של התגית.
 *
 * בלי זה תמונה עם loading="lazy" נשארת בגובה אפס עד שהיא נטענת - ובפריסת
 * עמודות היא אז לא חותכת את הוויופורט, ולכן לעולם לא נטענת. זה בדיוק מה
 * שקרה בגלריה: 28 תמונות שלא ירדו כלל.
 */
export function thumbSize(url: string | null | undefined): [number, number] | null {
  const t = thumb(url);
  return THUMB_SIZES[t] ?? null;
}
