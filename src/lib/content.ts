import { publicDb } from "./supabase.server";

/**
 * קריאת תוכן לצד השרת, לשימוש ב-loader של נתיבים.
 *
 * הכלל בכל הפונקציות כאן: אם ה-DB לא זמין או ריק - מחזירים null, והרכיב
 * מציג את המערך שבקוד. כך מעבר לניהול מה-DB לא יכול להוריד תוכן מהאתר.
 */
/**
 * מטמון בזיכרון האיזולט, 60 שניות.
 *
 * התוכן הזה נקרא בכל רינדור של כל עמוד, והוא כמעט לא משתנה - מכתבי רבנים,
 * גלריה, שאלות נפוצות. בלי המטמון כל מבקר שילם נסיעה לסופבייס לפני שיצא
 * ביט אחד של HTML, וזה היה חלק ניכר מזמן התגובה של השרת.
 *
 * שמירה מהאדמין מאפסת את המטמון מיד (invalidateContent), כך שאין המתנה
 * של דקה כדי לראות שינוי. ה-TTL הוא רק רשת ביטחון.
 */
const READ_TTL_MS = 60_000;
const readCache = new Map<string, { at: number; value: unknown[] | null }>();

/** מאפסת את המטמון אחרי כתיבה מהאדמין. ללא ארגומנט - מאפסת הכל. */
export function invalidateContent(table?: string) {
  if (!table) return readCache.clear();
  for (const k of readCache.keys()) if (k === table || k.startsWith(table + ":")) readCache.delete(k);
}

async function read<T>(table: string, lang?: "he" | "en"): Promise<T[] | null> {
  const key = lang ? `${table}:${lang}` : table;
  const hit = readCache.get(key);
  if (hit && Date.now() - hit.at < READ_TTL_MS) return hit.value as T[] | null;

  try {
    let q = publicDb().from(table).select("*").order("sort_order", { ascending: true });
    if (lang) q = q.eq("lang", lang);
    const { data, error } = await q;
    // כשל או טבלה ריקה נשמרים גם הם, אחרת DB שנפל היה מייצר נסיון חוזר
    // בכל רינדור ומאט את האתר בדיוק כשהוא הכי שביר. המערך שבקוד מוצג ממילא.
    const value = error || !data || data.length === 0 ? null : (data as T[]);
    readCache.set(key, { at: Date.now(), value });
    return value;
  } catch {
    readCache.set(key, { at: Date.now(), value: null });
    return null;
  }
}

export type DbRabbi = { name: string; role: string | null; letter_url: string | null; portrait_url: string | null };
export type DbPress = {
  title: string | null;
  source: string;
  published_label: string | null;
  href: string | null;
  logo_url: string | null;
  logo_text: string | null;
};
export type DbGallery = { url: string; alt: string | null };
export type DbService = {
  title: string;
  more_label: string | null;
  back_title: string | null;
  back_text: string | null;
  img: string | null;
  href: string | null;
  card_height: number | null;
};
export type DbFaq = { question: string; answer: string };
export type DbStory = {
  slug: string;
  title: string;
  subtitle: string | null;
  author: string | null;
  city: string | null;
  img: string | null;
  extra_img: string | null;
  paragraphs: string[];
};

export const readRabbis = (lang: "he" | "en") => read<DbRabbi>("rabbi_letters", lang);
export const readPress = (lang: "he" | "en") => read<DbPress>("press_items", lang);
export const readGallery = () => read<DbGallery>("gallery_images");
export const readServices = (lang: "he" | "en") => read<DbService>("services", lang);
export const readFaqs = (lang: "he" | "en") => read<DbFaq>("faqs", lang);
export const readStories = (lang: "he" | "en") => read<DbStory>("stories", lang);

export type DbThankYouLetter = { title: string; sub: string | null; img: string };
/** מכתבי תודה - נקראים לפי שפה, ואם אין שורות מוצג המערך שבקוד */
export const readThankYouLetters = (lang: "he" | "en") =>
  read<DbThankYouLetter>("thank_you_letters", lang);
