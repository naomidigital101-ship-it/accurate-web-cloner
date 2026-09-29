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
      { title: "קשר של תפילין - 23 סיפורים על אנשים שהתחילו להניח תפילין" },
      {
        name: "description",
        content:
          "הספר של הרב עמיחי איל: 23 סיפורים מהחיים על אנשים שהחליטו להתחיל להניח תפילין. 184 עמודים, מ־78 ₪, איסוף מבית אל או משלוח עד הבית.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "קשר של תפילין - הספר של הרב עמיחי איל" },
      { property: "og:description", content: "23 סיפורים מהחיים על אנשים שהחליטו להתחיל להניח תפילין." },
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

type Delivery = "pickup" | "shipping";
type Bundle = { quantity: number; title: string; price: number; shipping: number; badge?: string };

const BUNDLES: Bundle[] = [
  { quantity: 1, title: "עותק אחד", price: 78, shipping: 40 },
  { quantity: 2, title: "שני עותקים", price: 143, shipping: 20, badge: "אחד לכם, אחד למתנה" },
  { quantity: 3, title: "שלושה עותקים", price: 199, shipping: 0, badge: "המחיר הטוב ביותר" },
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

const bundleTotal = (b: Bundle, d: Delivery) => b.price + (d === "shipping" ? b.shipping : 0);
const perCopy = (n: number) => (Number.isInteger(n) ? `${n}` : `כ־${Math.round(n)}`);
const ev = (name: string, params: Record<string, unknown> = {}) =>
  track(name, { page_type: "book_campaign", ...params });

const STORIES = [
  {
    who: "נעם, 25",
    from: "לא השאיר לי ברירה",
    text: "כשירו על הרכב שלהם ביציאה מהנובה, נעם צעק ״שמע ישראל״ והבטיח: אם אני יוצא מכאן בחיים, אני מניח תפילין כל יום. הוא יצא, ולא קיים. ההבטחה חזרה אליו חודשים אחר כך, כשיצא בלי פגע מתאונה בצומת.",
  },
  {
    who: "בר, 38, ברלין",
    from: "יותר טוב מאספרסו",
    text: "בפורים, אחרי קריאת מגילה במשרד בברלין, בר הסכים להניח תפילין, ״לא יודע למה״. בפסח, בבית ההורים בקיבוץ, אבא שלו צעק: ״תפילין? לא אצלי בבית!״. כמה ימים אחר כך אותו אבא לקח את מפתחות הרכב והסיע אותו לאסוף אותן.",
  },
  {
    who: "אורי, 17, הרצליה",
    from: "משמעות חדשה לַקֶּשֶׁר",
    text: "בגיל 12 וחצי נכנס אורי לבית כנסת ברחוב שלו, ראה את הגבאי ונזכר בסבא יעקב, שהיה גבאי עשרות שנים ואף אחד מצאצאיו לא המשיך בדרכו. באותו רגע החליט שהוא ימשיך. היום הוא מבקש תפילין עם קשר מרובע, כמו של סבא.",
  },
];
const MORE_STARTS = [
  "גולש מבת ים שהניח תפילין על חוף בסרי לנקה, כי ישראלי שקט שפגש שם אמר לו ״בוא תניח גם אתה״",
  "פקידה בבנק שקיבלה שתי שיחות טלפון בהפרש של 19 דקות",
  "אלמנה שביקשה מבנה למסור את התפילין של אביו, והחלום שחלם הבן בלילה שלפני",
  "חובש מילואים שהבטיח לחבר פצוע שאם יחיה, הוא יתחיל להניח תפילין",
  "אב לחמישה שביקש מאלוקים סימן, וקיבל אותו למחרת ברחוב",
  "ישראלי באלפים הצרפתיים שלא הצליח להבין למה מה שקורה בארץ לא נותן לו מנוח",
];
const RABBIS = [
  { name: "הרב דוד יוסף", img: "/wp/thumbs/uploads-2026-05-הרב-דוד-יוסף-min.webp", letter: "/wp/uploads/2026/05/מכתב-מהראשלצ.webp" },
  { name: "הרב יצחק זילברשטיין", img: "/wp/thumbs/uploads-2024-04-רב-זילברמן-3-1.webp", letter: "/wp/uploads/2024/04/מכתב-הסכמה-מהרב-זילברשטיין-scaled.webp" },
  { name: "הרב זלמן ברוך מלמד", img: "/wp/thumbs/uploads-2024-04-הרב-זלמן-מלמד-2.webp", letter: "/wp/uploads/2024/04/מכתב-ברכה-הרב-זלמן-ברוך-מלמד-scaled.webp" },
];
// מיושר לשאלות בעמוד /book, בתוספת הקדשה וביטול. מחירי המשלוח כאן חייבים להתאים ל-BUNDLES.
const FAQS: [string, string][] = [
  ["האם זה ספר הלכה או מדריך להנחת תפילין?", "לא. זה ספר סיפורים על האנשים, המפגשים וההחלטות שמאחורי הנחת התפילין. הוא אינו מלמד איך להניח ואינו תחליף למדריך הלכתי, ולא צריך ידע מוקדם כדי לקרוא אותו."],
  ["הסיפורים מבוססים על אנשים אמיתיים?", "כן. הסיפורים הגיעו לרב עמיחי במסגרת מיזם ״קשר של תפילין״, והוא פגש בעצמו את האנשים שבספר. חלק מהשמות והפרטים המזהים שונו כדי לשמור על פרטיות המספרים."],
  ["האם הספר מתאים לנער בר מצווה?", "כן, בליווי של מבוגר. אפשר לקרוא את הספר יחד, או שהורה או מחנך יעיינו בו קודם ויבחרו סיפורים לקריאה משותפת, כי בחלק מהסיפורים יש תיאורי מלחמה והתמודדויות שמתאימים יותר לגיל מבוגר."],
  ["כמה עולה המשלוח ומתי הוא מגיע?", "משלוח עד הבית עולה 40 ₪ לעותק אחד ו־20 ₪ לשני עותקים. בשלושה עותקים המשלוח כלול במחיר. הספר מגיע תוך עד 8 ימי עסקים."],
  ["איפה אוספים את הספר?", "מארץ חמדה 33, בית אל, בתיאום מראש וללא תוספת תשלום. בשלב זה זו נקודת האיסוף היחידה."],
  ["איך משלמים?", "בוחרים כאן מארז ואופן קבלה ולוחצים על כפתור התשלום. נפתח דף תשלום מאובטח של Grow עם המארז שבחרתם, ושם ממלאים את פרטי ההזמנה. אין צורך בשיחה נוספת."],
  ["אפשר להזמין כמות לכיתה, לקהילה או לעובדים?", "כן. כתבו לרב עמיחי בוואטסאפ ל־054-6713966 כמה עותקים אתם צריכים ועד מתי. המחיר ותנאי האספקה להזמנה קבוצתית נקבעים בתיאום אישי."],
  ["אפשר לקבל הקדשה מהרב עמיחי?", "אחרי ההזמנה אפשר לכתוב בוואטסאפ ל־054-6713966 ולבדוק. זה תלוי בזמינות, ולא מובטח."],
  ["אפשר לבטל הזמנה?", "כן, תוך 14 יום מקבלת הספר, לפי חוק הגנת הצרכן. הפרטים המלאים בתקנון."],
];

function BookOrderPage() {
  const [quantity, setQuantity] = useState(2);
  const [delivery, setDelivery] = useState<Delivery>("pickup");
  const [excerptOpen, setExcerptOpen] = useState(false);
  const [heroOut, setHeroOut] = useState(false);
  const [summaryIn, setSummaryIn] = useState(false);
  // אחרי שהקורא בחר מארז או אופן קבלה, הפס הצף מציג את הבחירה והסכום ומוביל ישר לתשלום.
  const [picked, setPicked] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const bundle = BUNDLES.find((b) => b.quantity === quantity)!;
  const total = bundleTotal(bundle, delivery);
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
  const chooseDelivery = (d: Delivery) => {
    setDelivery(d);
    setPicked(true);
    ev("book_delivery_select", { delivery: d, bundle: quantity });
  };
  const checkout = (location: string) => () => {
    ev("begin_checkout", {
      currency: "ILS",
      value: total,
      delivery,
      bundle: quantity,
      location,
      items: [{ item_id: `kesher-book-${quantity}`, item_name: `קשר של תפילין - ${bundle.title}`, price: total, quantity: 1 }],
    });
    try {
      localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify({ quantity, delivery, total, at: Date.now() }));
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
              <p className="kb-kicker">ספר חדש · הרב עמיחי איל</p>
              <h1 id="kb-title">
                <span className="kb-h1-name">קשר של תפילין</span>
                <span className="kb-h1-desc">23 סיפורים מהחיים על אנשים שהחליטו להתחיל להניח תפילין</span>
              </h1>
              <p className="kb-lead">
                הרב עמיחי איל שואל כל מי שמבקש ממנו תפילין: מה הביא אותך להחלטה? בספר 23 מהתשובות, מחוף בסרי לנקה ועד משרד בברלין.
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
                <li>מ־78 ₪</li>
                <li>איסוף חינם מבית אל או משלוח עד הבית</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 2. השאלה - רגע שקט שמסביר איך נולד הספר */}
        <section className="kb-question" aria-labelledby="kb-q">
          <div className="kb-narrow" data-reveal>
            <p id="kb-q" className="kb-q-quote">״מה הביא אותך להחלטה להתחיל להניח תפילין?״</p>
            <p>
              את השאלה הזאת שואל הרב עמיחי איל כל אדם שמבקש ממנו תפילין. הוא מדבר בטלפון עם כל אחד בעצמו, ומוסר תפילין רק למי שמתכוון להניח אותן כל יום. במסגרת המיזם כבר נבדקו, חודשו ונמסרו 1,500 זוגות.
            </p>
            <p>לספר הוא בחר 23 מהתשובות. הן שונות זו מזו יותר ממה שאפשר לנחש.</p>
          </div>
        </section>

        {/* 3. שלוש נקודות התחלה - הקורא מבין לבד את המגוון */}
        <section className="kb-stories" aria-labelledby="kb-stories-title">
          <div className="kb-wrap">
            <h2 id="kb-stories-title" data-reveal>שלוש תשובות מתוך 23</h2>
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
              <h3>ובין 20 הסיפורים האחרים:</h3>
              <ul>
                {MORE_STARTS.map((line) => <li key={line}>{line}</li>)}
              </ul>
              <p className="kb-more-note">
                חלק מהסיפורים עוסקים במלחמה ובאובדן. אחרים מתרחשים בבנק, על חוף הים, בישיבה או במטבח של סבתא.
              </p>
            </div>
          </div>
        </section>

        {/* 4. הקול של הספר */}
        <section id="kb-excerpt" className="kb-excerpt" aria-labelledby="kb-excerpt-title">
          <div className="kb-narrow">
            <p className="kb-kicker">קטע מתוך הספר</p>
            <h2 id="kb-excerpt-title">״בוא תניח גם אתה״</h2>
            <p className="kb-excerpt-intro">
              גלי, גולש מבת ים, טס לשלושה שבועות לסרי לנקה בשביל הגלים. הוא פוגש שם את יובל, ישראלי שכמעט לא מדבר.
            </p>
            <article className={`kb-page ${excerptOpen ? "is-open" : ""}`} aria-label="קטע מתוך הסיפור חוף מבטחים">
              <p className="kb-page-head">קשר של תפילין · חוף מבטחים</p>
              <div className="kb-page-body" id="kb-excerpt-body">
                <p>אחרי כמה ימים שהיינו יחד, יצא לנו להיות ביחד על החוף שנינו לבד. אזרתי אומץ, ופניתי אל יובל ואמרתי: "אחי, תגיד, מה קורה איתך? הכל טוב?"</p>
                <p>יובל שתק. אבל חיכיתי בסבלנות. השקט נמשך כמה דקות, ואני המשכתי לחכות בסבלנות. הרגשתי שהוא שמע את השאלה וחושב על התשובה. לא רציתי ללחוץ. ואז, יובל נעצר לרגע, הסתובב אליי, הסתכל לי בעיניים ולחש: "הייתי בנובה".</p>
                <p>יותר מזה הוא לא היה צריך להגיד כלום. וואוו. הרגשתי כאילו פצצה נופלת עלי. לא ידעתי מה לענות לו. איך להגיב ומה להגיד, אבל אחרי רגע פשוט מצאתי את עצמי נותן לו חיבוק ענק מכל הלב. הרגשתי את יובל מחבק בחזרה. לחשתי לו באוזן: "אחי, אין כמוך. אוהב אותך!"</p>
                <p className="kb-page-gap" aria-label="דילוג בקטע">[…]</p>
                <p>"אז כמו שאתה רואה" יובל פנה אליי, "יצאתי מזה חי, לפחות בגוף. גם הבנות שהיו איתי ניצלו". יובל הצביע על התיק שלו. "אתה רואה, אחי, יש פה את התפילין. לא פספסתי אפילו יום אחד".</p>
                <p>למחרת, כבר הרגשנו חברים יותר ויצאנו יחד לפנות בוקר אל הים. כשהגענו, יובל הפתיע אותי. הוא הניח את הגלשן בצד, ושלף מהתיק שלו שקית קטיפה קטנה של תפילין. עמדתי בצד בשקט. יובל הניח את התפילין בנחת, ומלמל לעצמו תפילות. חיכיתי בסבלנות, אבל יובל לא הפסיק להפתיע אותי. "בוא, גלי. בוא תניח גם אתה!"</p>
                <p>"אני?!", שאלתי בפליאה. לזה באמת לא הייתי מוכן. "מה הקשר שלי לתפילין?!"</p>
                <p>"כן. מה, רק אם כמעט תמות תניח?! תפילין זה לא רק למי שהיה בנובה. יאללה, תן יד! כדאי לך".</p>
                <p>"זורם איתך, אחי!" אמרתי לו, ספק בגלל שלא רציתי לפגוע בו, ספק בגלל שזה סקרן אותי.</p>
                <p>בזמן שיובל קשר לי את התפילין על היד הרגשתי צמרמורת מוזרה בכל הגוף. אף פעם לא הרגשתי הרגשה כזו. הבנתי שזו לא רק התרגשות, אלא משהו רוחני שאני מתחבר אליו עכשיו. כשסיים להניח את התפילין על הראש שלי הרגשתי שוב את הצמרמורת הזו באופן בלתי מוסבר.</p>
                <p>עמדתי בשתיקה. הרגליים נוגעות בחול. הראש נמצא בשמיים ועליו התפילין שמחברות את הכל לדבר אחד.</p>
                <p>הסתכלתי אל מרחבי הים, אל השמיים האין-סופיים ואל קצה האופק המחבר ביניהם ופתאום כאילו הרגשתי את הנשמה שלי – מן הרגשה רוחנית מאוד עמוקה. הדמעות שהופיעו בטבעיות יצרו תחושת מחנק בגרון, ורק החיבוק שקיבלתי מיובל באותו רגע, עזר לי לשחרר אותן בלי להתבייש.</p>
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
              הסיפור של גלי ממשיך בשיחה עם הרב עמיחי. הוא אמר לו ביושר שהוא לא מתכוון להפסיק לגלוש בשבת, וקיבל תפילין.
            </p>
            <a className="kb-btn kb-btn-quiet" href="#kb-order" onClick={ctaClick("excerpt")}>
              להזמנת הספר, מ־78 ₪ <span aria-hidden="true">←</span>
            </a>
          </div>
        </section>

        {/* 5. למי נותנים, ומה המקבל מוצא */}
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
              <h2 id="kb-gift-title" data-reveal>למי נותנים את הספר, ומה הוא ימצא בו</h2>
              <dl className="kb-gift-list">
                <div data-reveal>
                  <dt>לבן שמתקרב לבר מצווה</dt>
                  <dd>
                    קראו יחד את הסיפור של אורי, שבגיל 12 וחצי החליט להמשיך את סבא שלו, ושאלו אותו מה הוא היה עונה לרב עמיחי. חלק מהסיפורים עוסקים בקרבות ובאובדן, ולכן כדאי לעבור על הספר קודם ולבחור.
                  </dd>
                </div>
                <div data-reveal>
                  <dt>למי שחושב להתחיל להניח תפילין</dt>
                  <dd>
                    הוא יפגוש אנשים שעמדו בדיוק איפה שהוא עומד. רבים מהם לא היו דתיים ולא היו בטוחים שזה בשבילם, ולפעמים המשפחה לא אהבה את הרעיון. התנאי שהרב עמיחי הציב לכולם היה אחד: להניח כל יום.
                  </dd>
                </div>
                <div data-reveal>
                  <dt>לאבא, לסבא או לחבר שאוהב לקרוא</dt>
                  <dd>
                    כל סיפור עומד בפני עצמו, כך שאפשר לקרוא אחד בערב ולחזור מחר. לא צריך רקע בהלכה כדי ליהנות ממנו.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* 6. אמון - מי שמע את הסיפורים */}
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
                  הרב עמיחי איל מבית אל הקים את מיזם ״קשר של תפילין״, שפועל במסגרת עמותת אור חדש. המיזם אוסף תפילין שאינן בשימוש, בודק ומחדש אותן, ומוסר אותן למי שרוצה להתחיל להניח.
                </p>
                <p>
                  את כל האנשים שבספר הוא פגש בעצמו ושמע מהם את הסיפור. את הסיפורים כתב יחד איתו שמעון חי בן־שחר. שמות ופרטים מזהים שונו כדי לשמור על פרטיות המספרים.
                </p>
                <dl className="kb-numbers">
                  <div><dt>זוגות תפילין נבדקו, חודשו ונמסרו במסגרת המיזם</dt><dd>1,500</dd></div>
                  <div><dt>סיפורים נבחרו לספר</dt><dd>23</dd></div>
                </dl>
              </div>
            </div>
            <div className="kb-rabbis" data-reveal>
              <h3>רבנים שבירכו את המיזם</h3>
              <ul>
                {RABBIS.map((r) => (
                  <li key={r.name}>
                    <img src={r.img} alt="" width="56" height="56" loading="lazy" />
                    <span>{r.name}</span>
                    <a href={r.letter} target="_blank" rel="noopener noreferrer" onClick={() => ev("book_letter_open", { rabbi: r.name })}>
                      למכתב<span className="kb-sr"> של {r.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <p className="kb-note">המכתבים נכתבו למיזם ״קשר של תפילין״ ולפעילותו, ולא לספר.</p>
            </div>
          </div>
        </section>

        {/* 7-8. מה מקבלים, כמה זה עולה, מה קורה אחרי הלחיצה */}
        <section id="kb-order" className="kb-order" aria-labelledby="kb-order-title">
          <div className="kb-wrap">
            <div className="kb-order-head">
              <h2 id="kb-order-title">בחרו כמה עותקים</h2>
              <p>184 עמודים, כריכה רכה. המחיר שמופיע הוא הסכום לתשלום, כולל המשלוח אם בחרתם בו.</p>
            </div>

            <fieldset className="kb-bundles">
              <legend className="kb-sr">כמה עותקים</legend>
              {BUNDLES.map((b) => {
                const selected = b.quantity === quantity;
                const now = bundleTotal(b, delivery);
                return (
                  <label key={b.quantity} className={`kb-bundle ${selected ? "is-selected" : ""}`}>
                    <input type="radio" name="kb-qty" checked={selected} onChange={() => chooseBundle(b)} />
                    {b.badge && <span className="kb-badge">{b.badge}</span>}
                    <span className="kb-bundle-title">{b.title}</span>
                    <span className="kb-bundle-price">{now} ₪</span>
                    <span className="kb-bundle-rows">
                      {b.shipping === 0 ? (
                        <span>אותו מחיר באיסוף עצמי ובמשלוח עד הבית</span>
                      ) : (
                        <>
                          <span>איסוף עצמי: {b.price} ₪</span>
                          <span>עד הבית: {b.price + b.shipping} ₪</span>
                        </>
                      )}
                    </span>
                    {b.quantity > 1 && (
                      <span className="kb-bundle-unit">{perCopy(now / b.quantity)} ₪ לעותק{delivery === "shipping" ? ", כולל משלוח" : ""}</span>
                    )}
                  </label>
                );
              })}
            </fieldset>

            <fieldset className="kb-delivery">
              <legend>איך תקבלו את הספר?</legend>
              <label className={delivery === "pickup" ? "is-selected" : ""}>
                <input type="radio" name="kb-delivery" checked={delivery === "pickup"} onChange={() => chooseDelivery("pickup")} />
                <span><strong>איסוף עצמי, ללא עלות</strong><small>ארץ חמדה 33, בית אל, בתיאום מראש</small></span>
              </label>
              <label className={delivery === "shipping" ? "is-selected" : ""}>
                <input type="radio" name="kb-delivery" checked={delivery === "shipping"} onChange={() => chooseDelivery("shipping")} />
                <span>
                  <strong>משלוח עד הבית, {bundle.shipping === 0 ? "כלול במחיר" : `${bundle.shipping} ₪`}</strong>
                  <small>מגיע תוך עד 8 ימי עסקים</small>
                </span>
              </label>
            </fieldset>

            <div className="kb-summary" ref={summaryRef}>
              <div className="kb-summary-row" aria-live="polite">
                <span>{bundle.title} · {delivery === "shipping" ? "משלוח עד הבית" : "איסוף עצמי"}</span>
                <strong data-testid="order-total">{total} ₪</strong>
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
                <li>נפתח דף תשלום של Grow עם המארז שבחרתם.</li>
                <li>בדף של Grow בוחרים שוב ״{delivery === "shipping" ? "משלוח עד הבית" : "איסוף עצמי"}״, ממלאים את פרטי ההזמנה ומשלמים {total} ₪.</li>
                <li>{delivery === "shipping" ? "הספר מגיע אליכם תוך עד 8 ימי עסקים." : "מתאמים איסוף מבית אל."} שאלות: <a href="tel:0546713966">054-6713966</a></li>
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
            <blockquote>
              <p>״תפילין על הבוקר. יותר טוב מאספרסו.״</p>
              <footer>בר, ברלין · מתוך הספר</footer>
            </blockquote>
            <p>ועוד 22 אנשים שהתחילו ממקום אחר לגמרי.</p>
            <a className="kb-btn" href="#kb-order" onClick={ctaClick("final")}>
              להזמנת הספר <span aria-hidden="true">←</span>
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
                <strong>{bundle.title} · {total} ₪</strong>
                <small>
                  {delivery === "shipping" ? (bundle.shipping === 0 ? "משלוח עד הבית כלול" : `כולל משלוח עד הבית (${bundle.shipping} ₪)`) : "איסוף עצמי מבית אל, ללא עלות"}
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
                <small>23 סיפורים · מ־78 ₪</small>
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
