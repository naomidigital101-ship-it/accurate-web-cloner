/**
 * מייצר את public/sitemap.xml מתוך קבצי הנתונים של הסיפורים.
 * הרצה:  node scripts/gen-sitemap.mjs
 * להריץ אחרי כל הוספה/הסרה של סיפור, ואחרי מעבר לדומיין (עדכון ORIGIN).
 */
import { readFileSync, writeFileSync } from "node:fs";

// מקור אמת יחיד - נקרא מ-src/lib/site.ts כדי שלא יהיו שתי כתובות שונות
const ORIGIN = (readFileSync("src/lib/site.ts", "utf8").match(/SITE_URL = "([^"]+)"/) ?? [])[1];
if (!ORIGIN) throw new Error("SITE_URL not found in src/lib/site.ts");

const STATIC = [
  ["/", "weekly", "1.0"],
  ["/stories/", "weekly", "0.9"],
  ["/agreements/", "monthly", "0.8"],
  ["/מכתבי-תודה/", "monthly", "0.7"],
  ["/in-news/", "monthly", "0.7"],
  ["/request/", "monthly", "0.8"],
  ["/give/", "monthly", "0.8"],
  ["/donate/", "monthly", "0.8"],
  ["/en/the-tefillin-tie-initiative/", "monthly", "0.6"],
  ["/en/articles-in-the-media/", "monthly", "0.5"],
  ["/en/rabbis-agreements/", "monthly", "0.5"],
  ["/en/thank-you-letters/", "monthly", "0.5"],
  ["/en/stories-2/", "monthly", "0.5"],
  ["/en/request-for-tefillin/", "monthly", "0.5"],
  ["/en/request-to-donate-tefillin/", "monthly", "0.5"],
  ["/en/support-and-donation/", "monthly", "0.5"],
  ["/accessibility/", "yearly", "0.3"],
  ["/en/accessibility/", "yearly", "0.3"],
  ["/privacy/", "yearly", "0.3"],
  ["/en/privacy/", "yearly", "0.3"],
  ["/terms/", "yearly", "0.3"],
  ["/brand-kit/", "monthly", "0.4"],
  ["/certificates/", "monthly", "0.5"],
  ["/en/terms/", "yearly", "0.3"],
];

function slugsOf(file) {
  const src = readFileSync(file, "utf8");
  return [...src.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
}

const he = slugsOf("src/data/stories.ts").map((s) => `/tefilin/${s}/`);
const en = slugsOf("src/data/en-stories.ts").map((s) => `/en/tefilin/${s}/`);

const enc = (p) => p.split("/").map(encodeURIComponent).join("/");

const rows = [
  ...STATIC.map(([p, cf, pr]) => [p, cf, pr]),
  ...he.map((p) => [p, "monthly", "0.7"]),
  ...en.map((p) => [p, "monthly", "0.5"]),
];

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  rows
    .map(
      ([p, cf, pr]) =>
        `  <url><loc>${ORIGIN}${enc(p)}</loc><changefreq>${cf}</changefreq><priority>${pr}</priority></url>`,
    )
    .join("\n") +
  `\n</urlset>\n`;

writeFileSync("public/sitemap.xml", xml);
console.log(`sitemap.xml: ${rows.length} URLs (${STATIC.length} static, ${he.length} HE stories, ${en.length} EN stories)`);
