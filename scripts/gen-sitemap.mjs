/**
 * מייצר את public/sitemap.xml ואת public/robots.txt.
 *
 * הרצה ידנית:  node scripts/gen-sitemap.mjs
 * רץ גם אוטומטית לפני כל בנייה (ראו "build" ב-package.json), ולכן אין יותר
 * מצב שמוסיפים סיפור ושוכחים לעדכן את המפה.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";

// מקור אמת יחיד - נקרא מ-src/lib/site.ts כדי שלא יהיו שתי כתובות שונות
const ORIGIN = (readFileSync("src/lib/site.ts", "utf8").match(/SITE_URL = "([^"]+)"/) ?? [])[1];
if (!ORIGIN) throw new Error("SITE_URL not found in src/lib/site.ts");

const STATIC = [
  "/",
  "/stories",
  "/agreements",
  "/מכתבי-תודה",
  "/in-news",
  "/request",
  "/give",
  "/book",
  "/donate",
  "/certificates",
  "/accessibility",
  "/privacy",
  "/terms",
  "/en/the-tefillin-tie-initiative",
  "/en/articles-in-the-media",
  "/en/rabbis-agreements",
  "/en/thank-you-letters",
  "/en/stories-2",
  "/en/request-for-tefillin",
  "/en/request-to-donate-tefillin",
  "/en/support-and-donation",
  "/en/accessibility",
  "/en/privacy",
  "/en/terms",
];

const STORY_DATA_HE = "src/data/stories.ts";
const STORY_DATA_EN = "src/data/en-stories.ts";

function slugsOf(file) {
  return [...readFileSync(file, "utf8").matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
}

/** הנתיב בקובץ הראוטים שמרנדר את הכתובת: /en/stories-2 -> src/routes/en.stories-2.tsx */
function routeFileOf(path) {
  const name = path === "/" ? "index" : path.replace(/^\//, "").replaceAll("/", ".");
  return `src/routes/${name}.tsx`;
}

/**
 * מקורות התוכן של כל כתובת. תאריך העדכון נגזר מהם, ולכן חשוב שיהיו רק
 * הקבצים שבאמת קובעים את התוכן של אותו עמוד - לא ה-shell ולא גיליון הסגנון.
 * שינוי גלובלי בעיצוב אינו שינוי תוכן, ואסור לו להקפיץ 82 תאריכים.
 */
function sourcesOf(path) {
  if (path.startsWith("/en/tefilin/")) return [STORY_DATA_EN, "src/routes/en.tefilin.$slug.tsx"];
  if (path.startsWith("/tefilin/")) return [STORY_DATA_HE, "src/routes/tefilin.$slug.tsx"];
  return [routeFileOf(path)];
}

/**
 * תאריך העדכון האמיתי: מועד הקומיט האחרון שנגע בקובץ, לא מועד הבנייה.
 *
 * זו כל הנקודה. גוגל מתעלם מ-lastmod שקופץ בכל פרסום - תאריך שמכריז שכל
 * 82 העמודים השתנו הוא בדיוק אותה כמות מידע כמו אין תאריך בכלל. תאריך
 * שנשען על הגיט משתנה רק כשהתוכן באמת השתנה, וזה מה שגורם לגוגל לחזור
 * ולסרוק את מה שכדאי.
 */
const gitCache = new Map();
function gitDate(file) {
  if (gitCache.has(file)) return gitCache.get(file);
  let out = null;
  try {
    if (existsSync(file)) {
      const s = execFileSync("git", ["log", "-1", "--format=%cs", "--", file], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) out = s;
    }
  } catch {
    /* אין גיט בסביבת הבנייה - ניפול לשלב הבא */
  }
  gitCache.set(file, out);
  return out;
}

/**
 * המפה הקודמת משמשת רשת ביטחון: אם הגיט לא זמין (למשל clone רדוד בסביבת
 * הבנייה), עדיף לשמר את התאריך שכבר פורסם מאשר להמציא תאריך חדש ולאותת
 * לגוגל על שינוי שלא קרה.
 */
const previous = new Map();
if (existsSync("public/sitemap.xml")) {
  const prev = readFileSync("public/sitemap.xml", "utf8");
  for (const m of prev.matchAll(/<loc>([^<]+)<\/loc><lastmod>([^<]+)<\/lastmod>/g)) {
    previous.set(m[1], m[2]);
  }
}

const enc = (p) => p.split("/").map(encodeURIComponent).join("/");
const mtime = (f) => (existsSync(f) ? statSync(f).mtime.toISOString().slice(0, 10) : null);

function lastmodOf(path) {
  const src = sourcesOf(path);
  const dates = src.map(gitDate).filter(Boolean);
  if (dates.length) return dates.sort().at(-1);
  const prev = previous.get(`${ORIGIN}${enc(path)}`);
  if (prev) return prev;
  return src.map(mtime).filter(Boolean).sort().at(-1) ?? new Date().toISOString().slice(0, 10);
}

const paths = [
  ...STATIC,
  ...slugsOf(STORY_DATA_HE).map((s) => `/tefilin/${s}`),
  ...slugsOf(STORY_DATA_EN).map((s) => `/en/tefilin/${s}`),
];

const missing = STATIC.filter((p) => !existsSync(routeFileOf(p)));
if (missing.length) {
  throw new Error(
    `אין קובץ ראוט לכתובות האלה, והן היו נכנסות למפה כ-404: ${missing.join(", ")}`,
  );
}

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  paths
    .map((p) => `  <url><loc>${ORIGIN}${enc(p)}</loc><lastmod>${lastmodOf(p)}</lastmod></url>`)
    .join("\n") +
  `\n</urlset>\n`;

writeFileSync("public/sitemap.xml", xml);

const uniqueDates = new Set(paths.map(lastmodOf)).size;
const gitOk = [...gitCache.values()].some(Boolean);
console.log(
  `sitemap.xml: ${paths.length} כתובות, ${uniqueDates} תאריכי עדכון שונים` +
    (gitOk ? " (מקור: היסטוריית הגיט)" : " (אזהרה: הגיט לא זמין - נשמרו התאריכים הקודמים)"),
);

// robots.txt נגזר מאותו ORIGIN. הנחיית Sitemap מחייבת כתובת מוחלטת לפי התקן,
// ובלעדי הייצור הזה הדומיין מופיע קשיח בשני מקומות ומעבר דומיין שוכח אחד מהם.
writeFileSync(
  "public/robots.txt",
  `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${ORIGIN}/sitemap.xml\n`,
);
console.log(`robots.txt: sitemap -> ${ORIGIN}/sitemap.xml`);
