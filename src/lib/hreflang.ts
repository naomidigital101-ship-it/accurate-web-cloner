/**
 * מיפוי דו-כיווני בין העמודים המקבילים בעברית ובאנגלית, לצורך תגיות hreflang.
 * רק זוגות שהם באמת אותו תוכן בשתי שפות. עמודי הסיפורים לא מופיעים כאן
 * כי אין ביניהם התאמה של אחד-לאחד (43 בעברית מול 16 באנגלית).
 *
 * בעת מעבר לדומיין הקבוע - לעדכן את ORIGIN.
 */
export const ORIGIN = "https://accurate-web-cloner.lovable.app";

/** [נתיב עברי, נתיב אנגלי] */
const PAIRS: [string, string][] = [
  ["/", "/en/the-tefillin-tie-initiative/"],
  ["/stories/", "/en/stories-2/"],
  ["/in-news/", "/en/articles-in-the-media/"],
  ["/מכתבי-תודה/", "/en/thank-you-letters/"],
  ["/agreements/", "/en/rabbis-agreements/"],
  ["/request/", "/en/request-for-tefillin/"],
  ["/give/", "/en/request-to-donate-tefillin/"],
  ["/donate/", "/en/support-and-donation/"],
  ["/accessibility/", "/en/accessibility/"],
];

const strip = (p: string) => p.replace(/\/+$/, "") || "/";

/**
 * מחזיר את זוג ה-hreflang עבור נתיב נתון, או null אם לעמוד אין מקבילה.
 */
export function hreflangPair(pathname: string): { he: string; en: string } | null {
  const p = strip(pathname);
  const hit = PAIRS.find(([he, en]) => strip(he) === p || strip(en) === p);
  if (!hit) return null;
  return { he: ORIGIN + encodeURI(hit[0]), en: ORIGIN + encodeURI(hit[1]) };
}
