/**
 * הפניות מהדומיין הישן tefilin.or-hadash.org.il לדומיין הקבוע.
 *
 * למה בקוד ולא בוורדפרס: 37 מתוך 154 הכתובות הישנות החזירו 500 מתוך
 * וורדפרס עצמו, כולל הסייטמאפ - שרת שנופל לא יכול להגיש 301. מרגע
 * שהסאב-דומיין מצביע לאתר הזה, ההפניות מוגשות מתשתית תקינה, ובמקביל
 * נעלמת כפילות התוכן בין שני האתרים.
 *
 * שלושה כללים, לפי סדר:
 *   1. GONE - ארכיוני וורדפרס ופידים: 404, בלי הפניה מלאכותית לדף הבית
 *   2. MAP  - איחוד. שימו לב: באתר הישן /letters/ הכיל שני סוגי תוכן -
 *      מכתבי תודה ממקבלי תפילין, והסכמות רבנים. באתר החדש הם פוצלו לשני
 *      עמודים, ולכן 17 כתובות של הסכמות מופנות ל-/agreements ולא למכתבים.
 *   3. ברירת מחדל - אותו נתיב בדיוק על הדומיין החדש (עמודי התוכן)
 */
export const LEGACY_HOST = "tefilin.or-hadash.org.il";

/** נתיבים שאין להם מקבילה ואין להם ערך - עדיף 404 מאשר הפניה מטעה */
export const GONE: ReadonlySet<string> = new Set([
  "/author/jeremy",
  "/brand-kit", // הוסר ביוזמת הלקוח 25.8.26; היה בסייטמאפ ולכן 410 ולא 404
  "/category/uncategorized",
  "/comments/feed",
  "/en/comments/feed",
  "/en/feed",
  "/feed",
  "/languages/en",
  "/languages/אנגלית",
  "/languages/עברית",
  "/xmlrpc.php",
]);

/** נתיבים שהתאחדו לעמוד מרכזי, או ששינו כתובת */
export const MAP: Readonly<Record<string, string>> = {
  "/en/letters": "/en/thank-you-letters",
  "/en/letters/2rabbi-yitzhak-zilberstein": "/en/rabbis-agreements",
  "/en/letters/3rabbi-osher-weiss": "/en/rabbis-agreements",
  "/en/letters/a-heartfelt-thank-you-letter-to-the-brothers": "/en/thank-you-letters",
  "/en/letters/a-letter-from-rabbi-amihud-shiloh": "/en/thank-you-letters",
  "/en/letters/a-letter-from-the-air-force-base-chief": "/en/thank-you-letters",
  "/en/letters/a-letter-from-the-commander-of-the-camp-of-zirifin": "/en/thank-you-letters",
  "/en/letters/a-letter-from-the-commander-of-the-nachshon-battalion": "/en/thank-you-letters",
  "/en/letters/a-letter-from-the-day-center-to-the-elderly": "/en/thank-you-letters",
  "/en/letters/a-letter-from-the-maale-adumim-institute": "/en/thank-you-letters",
  "/en/letters/a-letter-from-the-shavas-major-of-the-northern-command": "/en/thank-you-letters",
  "/en/letters/a-letter-of-thanks-from-a-father-to-a-bar-mitzvah-boy": "/en/thank-you-letters",
  "/en/letters/letter-of-thanks-from-rabbi-eitan-eckstein": "/en/thank-you-letters",
  "/en/letters/letter-of-thanks-from-the-jewish-community-in-romania": "/en/thank-you-letters",
  "/en/letters/letter-of-thanks-gerin-hadar-haifa": "/en/thank-you-letters",
  "/en/letters/rabbi-eliakim-lebanon": "/en/rabbis-agreements",
  "/en/letters/rabbi-shlomo-moshe-amer": "/en/rabbis-agreements",
  "/en/letters/rabbi-yehoshua-katz": "/en/rabbis-agreements",
  "/en/letters/rabbi-zalman-baruch-melamed": "/en/rabbis-agreements",
  "/en/letters/rav-david-yosef": "/en/rabbis-agreements",
  "/en/letters/rebii-aharun-biton": "/en/rabbis-agreements",
  "/en/letters/thank-you-letter-from-a-soldiers-mother": "/en/thank-you-letters",
  "/en/letters/thank-you-letter-from-ramat-tamir-sheltered-housing": "/en/thank-you-letters",
  "/en/letters/המלצה-מבית-ספר-חטיבת-הביינים": "/en/thank-you-letters",
  "/en/news-ment": "/en/articles-in-the-media",
  "/en/news-ment/1310": "/en/articles-in-the-media",
  "/en/news-ment/strapped-together": "/en/articles-in-the-media",
  "/en/news-ment/uniting-the-jewish-people-through-the-mitzva-of-tefillin": "/en/articles-in-the-media",
  "/en/news-ment/כתבה-בעיתון-בשבע-מהדקים-את-הקשר": "/en/articles-in-the-media",
  "/en/tefilin": "/en/stories-2",
  "/letters": "/מכתבי-תודה",
  "/letters/1": "/agreements",
  "/letters/2": "/agreements",
  "/letters/3": "/agreements",
  "/letters/ביס-בית-אל-חטיבת-הביניים": "/מכתבי-תודה",
  "/letters/הרב-דוד-יוסף-שליטא": "/agreements",
  "/letters/הרב-המקובל-חכם-אהרון-ביטון-שליטא": "/agreements",
  "/letters/הרב-שלמה-יהודה-בארי-הינוקא": "/agreements",
  "/letters/מכתב-ברכה-מהרב-אליקים-לבנון": "/agreements",
  "/letters/מכתב-ברכה-מהרב-זלמן-ברוך-מלמד": "/agreements",
  "/letters/מכתב-ברכה-מהרב-יהושוע-כץ": "/agreements",
  "/letters/מכתב-מאמית-מעלה-אדומים": "/מכתבי-תודה",
  "/letters/מכתב-מהרב-שילה-חיל-האוויר": "/מכתבי-תודה",
  "/letters/מכתב-ממפקד-גדוד-נחשון": "/מכתבי-תודה",
  "/letters/מכתב-ממפקד-מחנה-צריפין": "/מכתבי-תודה",
  "/letters/מכתב-ממרכז-היום-לקשיש": "/מכתבי-תודה",
  "/letters/מכתב-מרב-בסיס-חיל-האויר": "/מכתבי-תודה",
  "/letters/מכתב-מרב-שבס-של-פיקוד-הצפון": "/מכתבי-תודה",
  "/letters/מכתב-תודה-מאבא-לנער-בר-מצוה": "/מכתבי-תודה",
  "/letters/מכתב-תודה-מאמא-של-חייל": "/מכתבי-תודה",
  "/letters/מכתב-תודה-מגרעין-הדר-חיפה": "/מכתבי-תודה",
  "/letters/מכתב-תודה-מדיור-מוגן-רמת-תמיר": "/מכתבי-תודה",
  "/letters/מכתב-תודה-מהקהילה-היהודית-ברומניה": "/מכתבי-תודה",
  "/letters/מכתב-תודה-מהרב-איתן-אקשטיין": "/מכתבי-תודה",
  "/letters/מכתב-תודה-מלב-לאחים": "/מכתבי-תודה",
  "/letters/מכתב-תודה-מקיבוץ-כברי": "/מכתבי-תודה",
  "/letters/מכתב-תודה-פורום-שקופי-הקרב": "/מכתבי-תודה",
  "/news-ment": "/in-news",
  "/news-ment/1438": "/in-news",
  "/news-ment/strapped-together-כתבה-במגזין-משפחה": "/in-news",
  "/news-ment/או-חדש-על-ציור-תאיר-ראיון-בעלון-קרוב-אל": "/in-news",
  "/news-ment/גם-לזוג-התפילין-הישנות-שלכם-יש-ייעוד-חש": "/in-news",
  "/news-ment/התפילין-של-הזולת-סיפורים-מרגשים-מפרוי": "/in-news",
  "/news-ment/יש-התעוררות-מאוד-גדולה-להנחת-תפילין": "/in-news",
  "/news-ment/כך-מחברים-את-עם-ישראל-בעזרת-מצוות-תפילי": "/in-news",
  "/news-ment/כתבה-על-קשר-של-תפילין-באתר-הידברות": "/in-news",
  "/news-ment/כתבה-על-קשר-של-תפילין-בעיתון-של-כפר-חבד": "/in-news",
  "/news-ment/לענ-הנופלים-בעזה-זמן-אוויר-במבצע-תפיל": "/in-news",
  "/news-ment/מהדקין-את-הקשר-כתבה-בעיתון-ב7": "/in-news",
  "/news-ment/סיפורים-מפעימים-עלון-צפנת-פענח-פרשת-ב": "/in-news",
  "/post-cat/agree-ltrs": "/agreements",
  "/post-cat/tnx-ltrs": "/מכתבי-תודה",
  "/tefilin": "/stories",
};

/** מנרמל נתיב: בלי סלאש סוגר ומפוענח */
export function normalizePath(pathname: string): string {
  let p = pathname;
  try {
    p = decodeURIComponent(p);
  } catch {
    /* נתיב עם קידוד שבור - משאירים כמו שהוא */
  }
  p = p.replace(/\/+$/, "");
  return p === "" ? "/" : p;
}

/**
 * מחזיר את היעד להפניה, או null אם צריך להחזיר 404.
 * ברירת המחדל היא אותו נתיב על הדומיין החדש - כך שגם כתובת ישנה
 * שלא הופיעה בטבלת המיפוי לא נופלת בין הכיסאות.
 */
export function legacyTarget(pathname: string, search = ""): string | null {
  const p = normalizePath(pathname);
  if (GONE.has(p)) return null;
  const mapped = MAP[p];
  return (mapped ?? p) + search;
}
