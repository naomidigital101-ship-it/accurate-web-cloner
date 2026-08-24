import { publicDb } from "./supabase.server";

/**
 * קריאת תוכן לצד השרת, לשימוש ב-loader של נתיבים.
 *
 * הכלל בכל הפונקציות כאן: אם ה-DB לא זמין או ריק - מחזירים null, והרכיב
 * מציג את המערך שבקוד. כך מעבר לניהול מה-DB לא יכול להוריד תוכן מהאתר.
 */
async function read<T>(table: string, lang?: "he" | "en"): Promise<T[] | null> {
  try {
    let q = publicDb().from(table).select("*").order("sort_order", { ascending: true });
    if (lang) q = q.eq("lang", lang);
    const { data, error } = await q;
    if (error || !data || data.length === 0) return null;
    return data as T[];
  } catch {
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
