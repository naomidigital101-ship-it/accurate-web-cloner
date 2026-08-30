/**
 * מייצר את public/sitemap.xml ואת public/robots.txt מתוך קבצי הנתונים של הסיפורים.
 * הרצה:  node scripts/gen-sitemap.mjs
 * להריץ אחרי כל הוספה/הסרה של סיפור, ואחרי מעבר לדומיין (עדכון SITE_URL).
 */
import { readFileSync, statSync, writeFileSync } from "node:fs";

// מקור אמת יחיד - נקרא מ-src/lib/site.ts כדי שלא יהיו שתי כתובות שונות
const ORIGIN = (readFileSync("src/lib/site.ts", "utf8").match(/SITE_URL = "([^"]+)"/) ?? [])[1];
if (!ORIGIN) throw new Error("SITE_URL not found in src/lib/site.ts");

const STATIC = [
  ["/", "weekly", "1.0"],
  ["/stories", "weekly", "0.9"],
  ["/agreements", "monthly", "0.8"],
  ["/מכתבי-תודה", "monthly", "0.7"],
  ["/in-news", "monthly", "0.7"],
  ["/request", "monthly", "0.8"],
  ["/give", "monthly", "0.8"],
  ["/book", "monthly", "0.7"],
  ["/donate", "monthly", "0.8"],
  ["/en/the-tefillin-tie-initiative", "monthly", "0.6"],
  ["/en/articles-in-the-media", "monthly", "0.5"],
  ["/en/rabbis-agreements", "monthly", "0.5"],
  ["/en/thank-you-letters", "monthly", "0.5"],
  ["/en/stories-2", "monthly", "0.5"],
  ["/en/request-for-tefillin", "monthly", "0.5"],
  ["/en/request-to-donate-tefillin", "monthly", "0.5"],
  ["/en/support-and-donation", "monthly", "0.5"],
  ["/accessibility", "yearly", "0.3"],
  ["/en/accessibility", "yearly", "0.3"],
  ["/privacy", "yearly", "0.3"],
  ["/en/privacy", "yearly", "0.3"],
  ["/terms", "yearly", "0.3"],
  ["/certificates", "monthly", "0.5"],
  ["/en/terms", "yearly", "0.3"],
];

function slugsOf(file) {
  const src = readFileSync(file, "utf8");
  return [...src.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
}

const he = slugsOf("src/data/stories.ts").map((s) => `/tefilin/${s}`);
const en = slugsOf("src/data/en-stories.ts").map((s) => `/en/tefilin/${s}`);

const enc = (p) => p.split("/").map(encodeURIComponent).join("/");

const rows = [
  ...STATIC.map(([p, cf, pr]) => [p, cf, pr]),
  ...he.map((p) => [p, "monthly", "0.7"]),
  ...en.map((p) => [p, "monthly", "0.5"]),
];

/**
 * lastmod ולא changefreq/priority: גוגל הודיע ב-2023 שהוא מתעלם משני האחרונים
 * לחלוטין ומשתמש רק ב-lastmod כדי להחליט מה כדאי לסרוק מחדש. התאריך נגזר
 * ממועד השינוי של קובץ הנתונים עצמו, ולכן הוא לא "משקר" בכל בנייה מחדש.
 */
const stamp = (f) => statSync(f).mtime.toISOString().slice(0, 10);
const DATA_HE = stamp("src/data/stories.ts");
const DATA_EN = stamp("src/data/en-stories.ts");
const SITE = stamp("src/routes/index.tsx");
const lastmodOf = (p) =>
  p.startsWith("/en/tefilin/") ? DATA_EN : p.startsWith("/tefilin/") ? DATA_HE : SITE;

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  rows
    .map(([p]) => `  <url><loc>${ORIGIN}${enc(p)}</loc><lastmod>${lastmodOf(p)}</lastmod></url>`)
    .join("\n") +
  `\n</urlset>\n`;

writeFileSync("public/sitemap.xml", xml);
console.log(`sitemap.xml: ${rows.length} URLs (${STATIC.length} static, ${he.length} HE stories, ${en.length} EN stories)`);

// robots.txt נגזר מאותו ORIGIN. הנחיית Sitemap מחייבת כתובת מוחלטת לפי התקן,
// ובלעדי הייצור הזה הדומיין מופיע קשיח בשני מקומות ומעבר דומיין שוכח אחד מהם.
writeFileSync(
  "public/robots.txt",
  `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${ORIGIN}/sitemap.xml\n`,
);
console.log(`robots.txt: sitemap -> ${ORIGIN}/sitemap.xml`);
