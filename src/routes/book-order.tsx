import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SITE_URL } from "@/lib/site";
import { track } from "@/lib/analytics";
import { CHECKOUT_STORAGE_KEY } from "@/lib/book-checkout";
import campaignCss from "@/book-order.css?url";

const HERO_SRCSET = "/book/mock-hands-600.webp 600w, /book/mock-hands.webp 900w";
const HERO_SIZES = "(min-width: 900px) 440px, 250px";

/**
 * עמוד הקמפיין הממומן של הספר. בלי Header ובלי SiteFooter, noindex.
 * כל טקסט מתוך הספר כאן מועתק מכתב היד ("הספר קשר של תפילין - שליחה לעימוד.docx")
 * ולא מנוסח מחדש. לפני שינוי ציטוט - לבדוק מול כתב היד.
 */
export const Route = createFileRoute("/book-order")({
  head: () => ({
    meta: [
      { title: "קשר של תפילין - ספר סיפורים אמיתיים מאת הרב עמיחי איל" },
      {
        name: "description",
        content:
          "הספר של הרב עמיחי איל: 23 סיפורים אמיתיים על אנשים שהתחילו להניח תפילין. 184 עמודים, משלוח עד הבית או איסוף מבית אל.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "קשר של תפילין - הספר של הרב עמיחי איל" },
      { property: "og:description", content: "23 סיפורים אמיתיים על אנשים שהתחילו להניח תפילין, ועל מה שקרה להם בדרך." },
      { property: "og:image", content: `${SITE_URL}/book/mock-two-copies.webp` },
      { property: "og:url", content: `${SITE_URL}/book-order` },
    ],
    links: [
      { rel: "stylesheet", href: campaignCss },
      { rel: "canonical", href: `${SITE_URL}/book-order` },
      { rel: "preload", as: "image", href: "/book/mock-hands-600.webp", imageSrcSet: HERO_SRCSET, imageSizes: HERO_SIZES, fetchPriority: "high" },
    ],
  }),
  component: BookOrderPage,
});

type Bundle = { quantity: number; title: string; price: number; shipping: number; badge?: string };

// price = מחיר באיסוף עצמי (מה שמוגדר ב-Grow). המחיר הבולט בעמוד הוא עם משלוח.
const BUNDLES: Bundle[] = [
  { quantity: 1, title: "עותק אחד", price: 78, shipping: 40 },
  { quantity: 2, title: "שני עותקים", price: 143, shipping: 20, badge: "אחד לכם, אחד למתנה" },
  { quantity: 3, title: "שלושה עותקים", price: 199, shipping: 0, badge: "העותק השלישי ב־36 ₪" },
];
const PURCHASE_LINKS: Record<number, string> = {
  1: "https://pay.grow.link/MTA1NDQ5~49262f78c08b742d6ad21b74b49de3e5-Mzk4OTY3OA",
  2: "https://pay.grow.link/MTA1NDQ5~ec72d87f8af24e604ef10150073d2b54-Mzk4OTcwNw",
  3: "https://pay.grow.link/MTA1NDQ5~a1922e39c4975492fad2f1321d3c42ee-Mzk5MDI4NA",
};
const GROUP_LINK =
  "https://api.whatsapp.com/send?phone=972546713966&text=" +
  encodeURIComponent(
    "שלום עמיחי, אשמח לבדוק הזמנה קבוצתית של הספר קשר של תפילין. הספרים מיועדים ל: __. מספר עותקים משוער: __. מועד רצוי: __. יישוב למשלוח או איסוף: __.",
  );

/** המחיר הסופי עם משלוח. אופן הקבלה נבחר בדף התשלום של Grow, לא כאן. */
const withShipping = (b: Bundle) => b.price + b.shipping;
const perCopy = (n: number) => (Number.isInteger(n) ? `${n}` : `כ־${Math.round(n)}`);
const ev = (name: string, params: Record<string, unknown> = {}) =>
  track(name, { page_type: "book_campaign", ...params });

const STORIES = [
  {
    who: "יורי, כמעט בן 90, ירושלים",
    from: "אף פעם לא מאוחר",
    text: "יורי עלה מרוסיה לפני 30 שנה, ועד היום מתנדב בתחזוקה ביד שרה. מתנדב חדש רואה אותו מחליף נורה על סולם גבוה, ומגלה בשיחה שהוא כמעט בן 90, שלא חגג בר מצווה ושמעולם לא הניח תפילין. כמה ימים אחר כך חוגגים לו בר מצווה באולם של יד שרה, והוא מבקש מכולם לקרוא לו מעכשיו בשמו העברי, מאיר.",
  },
  {
    who: "אברהם, מעלה אדומים",
    from: "עוד שלב במסע",
    text: "אברהם הגיע לארץ מאתיופיה דרך מדבריות סודן. כמה פעמים ניסה להתחיל להניח תפילין ולא התמיד. ערב אחד ביקש: אם אתה רוצה שאניח תפילין, תן לי סימן. למחרת בבוקר שכן שהוא מכיר רק מ״שלום״ בסופר קרא לו ברחוב: ״בדיוק חלמתי עליך הלילה!״. בחלום שניהם נכנסו לבית הכנסת והניחו תפילין.",
  },
  {
    who: "בר, 38, ברלין",
    from: "יותר טוב מאספרסו",
    text: "בפורים, אחרי קריאת מגילה במשרד, בר הסכים להניח תפילין. בדרך הביתה עורך הדין שלו התקשר לבשר שהתביעה נגדו בוטלה, וכשהגיע הביתה חיכתה לו הודעה שמעמדו בעבודה הוסדר. בפסח, אצל ההורים בקיבוץ, אבא שלו צעק ״תפילין? לא אצלי בבית!״. כמה ימים אחר כך אותו אבא לקח את מפתחות הרכב והסיע אותו לאסוף אותן.",
  },
];
const MORE_STARTS = [
  "נעם, שיצא חי מהנובה והבטיח להניח תפילין, ולא קיים עד שיצא כמעט בלי פגע מתאונה בצומת",
  "גלי, גולש מבת ים, שהניח תפילין על חוף בסרי לנקה כי ישראלי שקט שפגש שם אמר לו ״בוא תניח גם אתה״",
  "עובד הייטק שהתחיל להניח תפילין, ופחות משבוע אחר כך קיבל את התפקיד שביקש במשך שנים",
  "פרופסור לכלכלה שנכנס ברכב של הרב עמיחי, ובמקום לשלם על הנזק ישב איתו ללמוד גמרא",
  "בן שחלם בלילה לפני שמסר את התפילין של אביו שנפטר, ובחלום האב שאל אותו למה הוא עוד לא הביא אותן",
  "חובש מילואים שהבטיח לחבר פצוע: אם תחיה, אני מתחיל להניח תפילין",
];
const RABBIS = [
  { name: "הרב דוד יוסף", letter: "/wp/uploads/2026/05/מכתב-מהראשלצ.webp" },
  { name: "הרב יצחק זילברשטיין", letter: "/wp/uploads/2024/04/מכתב-הסכמה-מהרב-זילברשטיין-scaled.webp" },
  { name: "הרב זלמן ברוך מלמד", letter: "/wp/uploads/2024/04/מכתב-ברכה-הרב-זלמן-ברוך-מלמד-scaled.webp" },
];
// מיושר לשאלות בעמוד /book, בתוספת הקדשה וביטול. מחירי המשלוח כאן חייבים להתאים ל-BUNDLES.
const FAQS: [string, string][] = [
  ["האם זה ספר הלכה או מדריך להנחת תפילין?", "לא. זה ספר סיפורים על האנשים, המפגשים וההחלטות שמאחורי הנחת התפילין. הוא אינו מלמד איך להניח ואינו תחליף למדריך הלכתי, ולא צריך ידע מוקדם כדי לקרוא אותו."],
  ["הסיפורים מבוססים על אנשים אמיתיים?", "כן. הסיפורים הגיעו לרב עמיחי במסגרת מיזם ״קשר של תפילין״, והוא פגש בעצמו את האנשים שבספר. חלק מהשמות והפרטים המזהים שונו כדי לשמור על פרטיות המספרים."],
  ["האם הספר מתאים לנער בר מצווה?", "כן, בליווי של מבוגר. בחלק מהסיפורים יש תיאורי קרבות ואובדן, ולכן כדאי שהורה יעבור על הספר קודם ויבחר סיפורים לקריאה משותפת."],
  ["כמה עולה המשלוח ומתי הוא מגיע?", "משלוח עד הבית עולה 40 ₪ לעותק אחד ו־20 ₪ לשני עותקים. בשלושה עותקים המשלוח כלול במחיר. הספר מגיע תוך עד 8 ימי עסקים."],
  ["איפה אוספים את הספר?", "מארץ חמדה 33, בית אל, בתיאום מראש וללא תוספת תשלום. בשלב זה זו נקודת האיסוף היחידה."],
  ["איך משלמים?", "בוחרים כאן כמה עותקים ועוברים לדף תשלום מאובטח של Grow. שם בוחרים משלוח או איסוף עצמי וממלאים את פרטי ההזמנה."],
  ["אפשר להזמין כמות לכיתה, לקהילה או לעובדים?", "כן. כתבו לרב עמיחי בוואטסאפ ל־054-6713966 כמה עותקים אתם צריכים ועד מתי. המחיר ותנאי האספקה להזמנה קבוצתית נקבעים בתיאום אישי."],
  ["אפשר לקבל הקדשה מהרב עמיחי?", "אחרי ההזמנה אפשר לכתוב בוואטסאפ ל־054-6713966 ולבדוק. זה תלוי בזמינות, ולא מובטח."],
  ["אפשר לבטל הזמנה?", "כן, תוך 14 יום מקבלת הספר, לפי חוק הגנת הצרכן. הפרטים המלאים בתקנון."],
];

function BookOrderPage() {
  const [quantity, setQuantity] = useState(2);
  const [excerptOpen, setExcerptOpen] = useState(false);
  const [heroOut, setHeroOut] = useState(false);
  const [summaryIn, setSummaryIn] = useState(false);
  // אחרי שהקורא בחר מארז, הפס הצף מציג את הבחירה והסכום ומוביל ישר לתשלום.
  const [picked, setPicked] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const bundle = BUNDLES.find((b) => b.quantity === quantity)!;
  // הפס הצף מופיע אחרי ההירו. לפני בחירה הוא מוביל לאזור ההזמנה ומוסתר ליד תיבת הסיכום;
  // אחרי בחירה הוא נשאר קבוע עם המארז, הסכום וכפתור תשלום ישיר.
  const barVisible = heroOut && (picked || !summaryIn);

  useEffect(() => {
    ev("view_item", {
      currency: "ILS",
      value: 78,
      items: [{ item_id: "kesher-book", item_name: "קשר של תפילין", price: 78, quantity: 1 }],
    });

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === heroRef.current) setHeroOut(!e.isIntersecting);
        if (e.target === summaryRef.current) setSummaryIn(e.isIntersecting);
      }
    });
    if (heroRef.current) io.observe(heroRef.current);
    if (summaryRef.current) io.observe(summaryRef.current);

    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    let revealIo: IntersectionObserver | undefined;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((n) => n.classList.add("kb-reveal"));
      revealIo = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("is-in");
              revealIo?.unobserve(e.target);
            }
          }),
        { rootMargin: "0px 0px -8%", threshold: 0.05 },
      );
      nodes.forEach((n) => revealIo?.observe(n));
    }
    return () => {
      io.disconnect();
      revealIo?.disconnect();
    };
  }, []);

  const ctaClick = (location: string) => () => ev("book_cta_click", { location });
  const openExcerpt = (location: string) => {
    if (!excerptOpen) ev("book_excerpt_open", { location });
    setExcerptOpen(true);
  };
  const chooseBundle = (b: Bundle) => {
    setQuantity(b.quantity);
    setPicked(true);
    ev("select_item", {
      item_list_name: "book_bundles",
      bundle: b.quantity,
      items: [{ item_id: `kesher-book-${b.quantity}`, item_name: `קשר של תפילין - ${b.title}`, price: b.price, quantity: 1 }],
    });
  };
  const checkout = (location: string) => () => {
    ev("begin_checkout", {
      currency: "ILS",
      value: bundle.price,
      bundle: quantity,
      location,
      items: [{ item_id: `kesher-book-${quantity}`, item_name: `קשר של תפילין - ${bundle.title}`, price: bundle.price, quantity: 1 }],
    });
    try {
      localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify({ quantity, delivery: "chosen_in_grow", total: bundle.price, at: Date.now() }));
    } catch {
      /* מצב פרטי או חסימת אחסון - המדידה לא שוברת את התשלום */
    }
  };

  return (
    <div className="kb" dir="rtl">
      <a className="kb-skip" href="#kb-order">דילוג להזמנה</a>

      <header className="kb-top">
        <div className="kb-wrap kb-top-in">
          <img src="/wp/img/לוגו-קשר-של-תפילין-01.svg" alt="קשר של תפילין" width="44" height="44" />
          <span>מיזם של עמותת אור חדש</span>
        </div>
      </header>

      <main>
        {/* 1. מה זה - בשלוש שניות */}
        <section className="kb-hero" ref={heroRef} aria-labelledby="kb-title">
          <div className="kb-wrap kb-hero-grid">
            <div className="kb-hero-copy">
              <p className="kb-kicker">ספר חדש מאת הרב עמיחי איל</p>
              <h1 id="kb-title">
                <span className="kb-h1-name">קשר של תפילין</span>
                <span className="kb-h1-desc">ספר סיפורים אמיתיים על אנשים שהתחילו להניח תפילין, ועל מה שקרה להם בדרך</span>
              </h1>
              <p className="kb-lead">
                סיפור אחד מתחיל בשתי שיחות טלפון לבנק, בהפרש של 19 דקות. אחר בבר מצווה שנחגגה בגיל תשעים. בספר 23 סיפורים, וכל אחד מהם הרב עמיחי שמע ממי שעבר אותו.
              </p>
            </div>
            <figure className="kb-hero-book">
              <img
                src="/book/mock-hands-600.webp"
                srcSet={HERO_SRCSET}
                sizes={HERO_SIZES}
                alt="הספר קשר של תפילין בכריכה רכה, מוחזק בשתי ידיים"
                width="600"
                height="750"
                fetchPriority="high"
              />
            </figure>
            <div className="kb-hero-actions">
              <a className="kb-btn" href="#kb-order" onClick={ctaClick("hero")}>
                לבחירת מארז והזמנה <span aria-hidden="true">←</span>
              </a>
              <a className="kb-link" href="#kb-excerpt" onClick={() => openExcerpt("hero")}>
                לקריאת קטע מהספר
              </a>
              <ul className="kb-facts" aria-label="פרטי הספר">
                <li>184 עמודים</li>
                <li>כריכה רכה</li>
                <li>118 ₪ עם משלוח, או 78 ₪ באיסוף מבית אל</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 2. איך נולד הספר */}
        <section className="kb-question" aria-labelledby="kb-q">
          <div className="kb-narrow" data-reveal>
            <p id="kb-q" className="kb-q-quote">״מה הביא אותך להחלטה להתחיל להניח תפילין?״</p>
            <p>
              את השאלה הזאת שואל הרב עמיחי איל כל מי שמבקש ממנו תפילין. הוא מדבר בטלפון עם כל אחד, ונותן תפילין רק למי שמתחייב להניח אותן כל יום. לספר הוא בחר 23 מהתשובות.
            </p>
            <blockquote className="kb-q-rabbi">
              <p>
                ״את כל האנשים המובאים בספר פגשתי בעצמי, ושמעתי מהם את הסיפור כפי שהוא כתוב. [...] הרבה פעמים הודו בפני בני שיחי שאני האדם הראשון שהם משתפים אותו בסיפורם האישי.״
              </p>
              <footer>הרב עמיחי איל, מתוך ההקדמה לספר</footer>
            </blockquote>
          </div>
        </section>

        {/* 3. מה יש בספר */}
        <section className="kb-stories" aria-labelledby="kb-stories-title">
          <div className="kb-wrap">
            <h2 id="kb-stories-title" data-reveal>שלושה מתוך 23 הסיפורים</h2>
            <ol className="kb-story-list">
              {STORIES.map((s, i) => (
                <li key={s.who} data-reveal>
                  <span className="kb-story-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <p className="kb-story-who">{s.who}</p>
                  <p className="kb-story-text">{s.text}</p>
                  <p className="kb-story-from">מתוך הסיפור ״{s.from}״</p>
                </li>
              ))}
            </ol>
            <div className="kb-more" data-reveal>
              <h3>ועוד בספר:</h3>
              <ul>
                {MORE_STARTS.map((line) => <li key={line}>{line}</li>)}
              </ul>
              <p className="kb-more-note">
                כל הסיפורים קרו בשלוש השנים האחרונות, מאז פרוץ המלחמה. בחלקם המלחמה היא הסיפור עצמו, ובאחרים היא רק ברקע.
              </p>
            </div>
          </div>
        </section>

        {/* 4. הקול של הספר */}
        <section id="kb-excerpt" className="kb-excerpt" aria-labelledby="kb-excerpt-title">
          <div className="kb-narrow">
            <p className="kb-kicker">קטע מתוך הספר</p>
            <h2 id="kb-excerpt-title">שתי שיחות בבנק, בהפרש של 19 דקות</h2>
            <p className="kb-excerpt-intro">
              ב־8:07 מתקשר לוורד מבנק מזרחי ניצן, בנקאי מסניף באר שבע שמשפחתו פונתה מהעוטף. באמצע שיחת עבודה הוא מספר לה שהוא חושב להתחיל להניח תפילין, אבל אין לו. היא מבטיחה לבדוק מה אפשר לעשות. 19 דקות אחר כך הטלפון שלה מצלצל שוב.
            </p>
            <article className={`kb-page ${excerptOpen ? "is-open" : ""}`} aria-label="קטע מתוך הסיפור רק תגיד 'אני רוצה!'">
              <p className="kb-page-head">קשר של תפילין · רק תגיד 'אני רוצה!'</p>
              <div className="kb-page-body" id="kb-excerpt-body">
                <p className="kb-page-time">8:26</p>
                <p>"בוקר טוב, בנק מזרחי, מדברת ורד, במה אפשר לעזור?"</p>
                <p>"שלום וברכה, בוקר טוב ורד, מדבר עמיחי. אני מנהל אצלכם חשבון של עמותה ואני צריך להעביר כסף למכון סת"ם שעשה לי עבודה, ומשום מה אני לא מצליח לעשות את זה דרך האתר של הבנק, את יכולה לעזור לי?"</p>
                <p>"אין בעיה, בוא נראה... זהו. לבצע העברה?"</p>
                <p>"כן. רק בבקשה תוסיפי שהתשלום עבור בדיקה ותיקון של 25 זוגות תפילין"</p>
                <p>"סליחה אדוני, אמרת שזה תשלום עבור תפילין וזה קשור לעמותה?"</p>
                <p>"כן, ב"ה אני מנהל ארגון ששמו 'קשר של תפילין' והמטרה היא לדאוג לתפילין לאנשים שרוצים להניח ואין להם אפשרות כרגע לרכוש את התפילין בעצמם, ויש מכון סת"ם ש..."</p>
                <p>"אני לא מאמינה! אני לא מאמינה! זה פשוט לא יאמן, איזו השגחה פרטית! סליחה אדוני, אבל אני חייבת לספר לך משהו. לפני כמה דקות דיברתי עם קולגה, בנקאי מסניף בדרום. אנחנו מכירים כבר שנים, הוא גר במושב בעוטף עזה ועכשיו הם מפונים. בחור ממש נחמד. לגמרי לא דתי וגם לא קרוב לזה, ועכשיו הוא מספר לי שהוא רוצה להתחיל להניח תפילין ואין לו. לא עברו כמה דקות ואתה מתקשר! אתה תוכל לעזור ולהביא לו תפילין?"</p>
                <p>"כן, בוודאי! בשמחה. תמסרי לו את מספר הטלפון שלי ובע"ה אדאג לו לתפילין"</p>
                <p>"וואוו, אני עם צמרמורת, אתה מבין מה קורה פה? איזו סיעתא דשמייא. איזו השגחה פרטית! פשוט לא יאמן! אני כבר מתקשרת אליו, קוראים לו ניצן".</p>
                <p className="kb-page-time">8:35</p>
                <p>הודעה מוֶרד לניצן: "ניצן, אתה לא תאמין! יש לך תפילין! ה' אוהב אותך!"</p>
                <p>ניצן: "מה? לא הבנתי. את רצינית?"</p>
                <p>ורד: "פשוט נס. אני רצינית לגמרי. בדיוק התקשר לבנק מישהו שמנהל ארגון שמחלק תפילין. דיברתי איתו והוא ישמח לעזור. הוא מכין לך זוג תפילין מהודרות. מתנה מאלוקים ישירות אליך. זה המספר שלו, תתקשר אליו".</p>
              </div>
              {!excerptOpen && (
                <button
                  type="button"
                  className="kb-page-more"
                  aria-expanded="false"
                  aria-controls="kb-excerpt-body"
                  onClick={() => openExcerpt("excerpt")}
                >
                  להמשך הקטע
                </button>
              )}
            </article>
            <p className="kb-excerpt-after">
              באותו יום ניצן התקשר לרב עמיחי. יומיים אחר כך הרב הביא את התפילין לסניף הבנק בירושלים, כדי שיעברו משם לניצן בבאר שבע.
            </p>
            <a className="kb-btn kb-btn-quiet" href="#kb-order" onClick={ctaClick("excerpt")}>
              להזמנת הספר <span aria-hidden="true">←</span>
            </a>
          </div>
        </section>

        {/* 5. למי הספר */}
        <section className="kb-gift" aria-labelledby="kb-gift-title">
          <div className="kb-wrap kb-gift-grid">
            <figure data-reveal>
              <img
                src="/book/mock-father-son-800.webp"
                srcSet="/book/mock-father-son-800.webp 800w, /book/mock-father-son.webp 1200w"
                sizes="(min-width: 900px) 520px, 100vw"
                alt="אב ובנו יושבים ליד שולחן ומדברים, והספר מונח ביניהם"
                width="800"
                height="533"
                loading="lazy"
              />
            </figure>
            <div>
              <h2 id="kb-gift-title" data-reveal>למי הספר מתאים</h2>
              <dl className="kb-gift-list">
                <div data-reveal>
                  <dt>למי שאוהב סיפורים אמיתיים</dt>
                  <dd>כל סיפור באורך של כמה עמודים ועומד בפני עצמו. אפשר לקרוא אחד בערב, ולא צריך שום רקע בהלכה.</dd>
                </div>
                <div data-reveal>
                  <dt>למי שהתחיל להניח תפילין, או חושב על זה</dt>
                  <dd>רוב האנשים בספר לא היו דתיים, ולחלקם המשפחה לא אהבה את הרעיון בהתחלה. כולם קיבלו על עצמם תנאי אחד: להניח כל יום.</dd>
                </div>
                <div data-reveal>
                  <dt>לקראת בר מצווה</dt>
                  <dd>אורי מהרצליה החליט בגיל 12 וחצי להמשיך את הדרך של סבא שלו, שהיה גבאי בית כנסת, וביקש תפילין עם קשר מרובע כמו של סבא. סיפור טוב לקרוא יחד עם הבן.</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* 6. מי שמע את הסיפורים */}
        <section className="kb-author" aria-labelledby="kb-author-title">
          <div className="kb-wrap">
            <div className="kb-author-grid" data-reveal>
              <img
                src="/wp/thumbs/img-עמיחי-פרופיל-ערוך-min.webp"
                alt="הרב עמיחי איל"
                width="426"
                height="640"
                loading="lazy"
              />
              <div>
                <p className="kb-kicker">מי שמע את הסיפורים</p>
                <h2 id="kb-author-title">הרב עמיחי איל</h2>
                <p>
                  הרב עמיחי איל מבית אל עבד שנים כמחנך. כמה שבועות אחרי 7 באוקטובר התחילו להגיע אליו בקשות לתפילין בלי שפרסם דבר, ואז החליט, כלשונו, ״לעזוב את שאר עיסוקי ולהתמסר לשליחות הזו״. כך קם מיזם ״קשר של תפילין״, שפועל במסגרת עמותת אור חדש. המיזם אוסף תפילין שאינן בשימוש, בודק ומחדש אותן, ומוסר אותן למי שרוצה להתחיל להניח.
                </p>
                <p>את הסיפורים כתב יחד איתו שמעון חי בן־שחר. שמות ופרטים מזהים שונו כדי לשמור על פרטיות המספרים.</p>
                <dl className="kb-numbers">
                  <div><dt>זוגות תפילין נבדקו, חודשו ונמסרו במסגרת המיזם</dt><dd>1,500</dd></div>
                  <div><dt>סיפורים נבחרו לספר</dt><dd>23</dd></div>
                </dl>
                <p className="kb-rabbis-line">
                  המיזם פועל בברכת{" "}
                  {RABBIS.map((r, i) => (
                    <span key={r.name}>
                      {i > 0 && (i === RABBIS.length - 1 ? " ו" : ", ")}
                      <a href={r.letter} target="_blank" rel="noopener noreferrer" onClick={() => ev("book_letter_open", { rabbi: r.name })}>
                        {r.name}
                      </a>
                    </span>
                  ))}
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. מה מקבלים, כמה זה עולה, מה קורה אחרי הלחיצה */}
        <section id="kb-order" className="kb-order" aria-labelledby="kb-order-title">
          <div className="kb-wrap">
            <div className="kb-order-head">
              <h2 id="kb-order-title">בחרו כמה עותקים</h2>
              <p>184 עמודים, כריכה רכה. המחיר הגדול כולל משלוח עד הבית. באיסוף עצמי מבית אל זה עולה פחות, ואת אופן הקבלה בוחרים בדף התשלום.</p>
            </div>

            <fieldset className="kb-bundles">
              <legend className="kb-sr">כמה עותקים</legend>
              {BUNDLES.map((b) => {
                const selected = b.quantity === quantity;
                return (
                  <label key={b.quantity} className={`kb-bundle ${selected ? "is-selected" : ""}`}>
                    <input type="radio" name="kb-qty" checked={selected} onChange={() => chooseBundle(b)} onClick={() => setPicked(true)} />
                    {b.badge && <span className="kb-badge">{b.badge}</span>}
                    <span className="kb-bundle-title">{b.title}</span>
                    <span className="kb-bundle-price">{withShipping(b)} ₪</span>
                    <span className="kb-bundle-rows">
                      <span>כולל משלוח עד הבית</span>
                      <span>{b.shipping === 0 ? "באיסוף עצמי: אותו מחיר" : `באיסוף עצמי מבית אל: ${b.price} ₪`}</span>
                    </span>
                    {b.quantity > 1 && (
                      <span className="kb-bundle-unit">{perCopy(withShipping(b) / b.quantity)} ₪ לעותק, כולל משלוח</span>
                    )}
                  </label>
                );
              })}
            </fieldset>

            <div className="kb-summary" ref={summaryRef}>
              <div className="kb-summary-row" aria-live="polite">
                <span>{bundle.title}</span>
                <dl className="kb-summary-prices">
                  <div><dt>עם משלוח עד הבית{bundle.shipping === 0 ? " (כלול)" : ""}</dt><dd>{withShipping(bundle)} ₪</dd></div>
                  <div><dt>באיסוף עצמי מבית אל</dt><dd data-testid="order-total">{bundle.price} ₪</dd></div>
                </dl>
              </div>
              <a
                className="kb-btn kb-btn-block"
                href={PURCHASE_LINKS[quantity]}
                target="_blank"
                rel="noopener noreferrer"
                onClick={checkout("summary")}
              >
                למעבר לתשלום מאובטח <span aria-hidden="true">←</span>
              </a>
              <ol className="kb-steps">
                <li>נפתח דף תשלום של Grow עם מספר העותקים שבחרתם.</li>
                <li>שם בוחרים משלוח או איסוף עצמי, ממלאים פרטים ומשלמים.</li>
                <li>משלוח מגיע תוך עד 8 ימי עסקים. איסוף מארץ חמדה 33, בית אל, בתיאום מראש. שאלות: <a href="tel:0546713966">054-6713966</a></li>
              </ol>
            </div>

            <p className="kb-group">
              מזמינים לכיתה, לקהילה או לצוות?{" "}
              <a
                href={GROUP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => ev("contact", { contact_method: "whatsapp", intent: "group_order" })}
              >
                כתבו לנו בוואטסאפ
              </a>{" "}
              ונבדוק מחיר ומועד.
            </p>
          </div>
        </section>

        <section className="kb-faq" aria-labelledby="kb-faq-title">
          <div className="kb-narrow">
            <h2 id="kb-faq-title">לפני שמזמינים</h2>
            {FAQS.map(([q, a]) => (
              <details key={q} onToggle={(e) => (e.currentTarget.open ? ev("book_faq_open", { question: q }) : undefined)}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="kb-final" aria-label="סיום">
          <div className="kb-narrow" data-reveal>
            <p className="kb-final-name">קשר של תפילין</p>
            <p>23 סיפורים, 184 עמודים. משלוח עד הבית או איסוף מבית אל.</p>
            <a className="kb-btn" href="#kb-order" onClick={ctaClick("final")}>
              לבחירת מארז <span aria-hidden="true">←</span>
            </a>
          </div>
        </section>
      </main>

      <footer className="kb-footer">
        <div className="kb-wrap">
          <p>עמותת אור חדש · ע״ר 580703965 · ארץ חמדה 33, בית אל · <a href="tel:0546713966">054-6713966</a></p>
          <nav aria-label="מידע משפטי">
            <a href="/accessibility">הצהרת נגישות</a>
            <a href="/privacy">מדיניות פרטיות</a>
            <a href="/terms">תקנון וביטול עסקה</a>
          </nav>
        </div>
      </footer>

      <div className={`kb-bar ${barVisible ? "is-visible" : ""}`} aria-hidden={!barVisible}>
        <div className="kb-bar-in">
          {picked ? (
            <>
              <span aria-live="polite">
                <strong>{bundle.title} · {withShipping(bundle)} ₪</strong>
                <small>
                  {bundle.shipping === 0 ? "כולל משלוח עד הבית" : `כולל משלוח, או ${bundle.price} ₪ באיסוף`}
                </small>
              </span>
              <a href={PURCHASE_LINKS[quantity]} target="_blank" rel="noopener noreferrer" tabIndex={barVisible ? 0 : -1} onClick={checkout("sticky")}>
                לתשלום ←
              </a>
            </>
          ) : (
            <>
              <span>
                <strong>קשר של תפילין</strong>
                <small>23 סיפורים · 184 עמודים</small>
              </span>
              <a href="#kb-order" tabIndex={barVisible ? 0 : -1} onClick={ctaClick("sticky")}>
                לבחירת מארז
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
