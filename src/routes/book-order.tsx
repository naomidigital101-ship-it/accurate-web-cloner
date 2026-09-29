import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SITE_URL } from "@/lib/site";
import { track } from "@/lib/analytics";
import campaignCss from "@/book-order.css?url";

/**
 * עמוד הקמפיין של הספר ״קשר של תפילין״ (noindex).
 * מקבל תנועה ממודעות, ולכן בנוי כרצף אחד בלי יציאות:
 * ספר → שאלה של אדם אחד → עוד שלושה → עמוד מהספר → למי → מי עומד מאחור → הזמנה.
 */
export const Route = createFileRoute("/book-order")({
  head: () => ({
    meta: [
      { title: "קשר של תפילין — 23 סיפורים מהחיים | הרב עמיחי איל" },
      {
        name: "description",
        content:
          "ספר של הרב עמיחי איל: 23 סיפורים על אנשים שהחליטו להתחיל להניח תפילין. 184 עמודים, משלוח עד הבית או איסוף עצמי.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "קשר של תפילין — 23 סיפורים מהחיים" },
      {
        property: "og:description",
        content: "אנשים שונים, מקומות שונים, והדרך שהובילה כל אחד מהם להתחיל להניח תפילין.",
      },
      { property: "og:image", content: `${SITE_URL}/book/mock-two-copies.webp` },
      { property: "og:url", content: `${SITE_URL}/book-order` },
    ],
    links: [
      { rel: "stylesheet", href: campaignCss },
      { rel: "canonical", href: `${SITE_URL}/book-order` },
      { rel: "preload", as: "image", href: "/book/mock-hands.webp" },
    ],
  }),
  component: BookOrderPage,
});

type Delivery = "shipping" | "pickup";

const BOOK_NAME = "קשר של תפילין";
const PAGE_TYPE = "book_campaign";

const bundles = [
  { quantity: 1, title: "עותק אחד", price: 78, shipping: 40, tag: "" },
  { quantity: 2, title: "שני עותקים", price: 143, shipping: 20, tag: "אחד לכם, אחד למתנה" },
  { quantity: 3, title: "שלושה עותקים", price: 199, shipping: 0, tag: "המחיר הטוב ביותר" },
] as const;

const purchaseLinks: Record<number, string> = {
  1: "https://pay.grow.link/MTA1NDQ5~49262f78c08b742d6ad21b74b49de3e5-Mzk4OTY3OA",
  2: "https://pay.grow.link/MTA1NDQ5~ec72d87f8af24e604ef10150073d2b54-Mzk4OTcwNw",
  3: "https://pay.grow.link/MTA1NDQ5~a1922e39c4975492fad2f1321d3c42ee-Mzk5MDI4NA",
};

const groupLink =
  "https://api.whatsapp.com/send?phone=972546713966&text=" +
  encodeURIComponent(
    "שלום עמיחי, אשמח לבדוק הזמנה של הספר קשר של תפילין לקבוצה. הספרים מיועדים ל: __. מספר עותקים: __. מועד רצוי: __. יישוב: __.",
  );

const starts = [
  {
    tag: "הבטחה",
    title: "ברגע של סכנה",
    text: "הוא הבטיח משהו כשלא היה ברור שייצא משם. הסיפור שלו מתחיל אחר כך, כשהחיים חוזרים לשגרה וצריך להחליט אם לקיים.",
  },
  {
    tag: "ברלין",
    title: "התחלה רחוקה מהבית",
    text: "ישראלי שחי שנים בברלין מתחיל להניח תפילין. הרגע הקשה מגיע דווקא בביקור בארץ, מול אבא שלו.",
  },
  {
    tag: "משפחה",
    title: "שיחה ליד השולחן",
    text: "יש סיפורים שקורים בבית: מי שמספר להורים שהחליט להתחיל, ומי שצריך להחליט איך להגיב.",
  },
  {
    tag: "ועוד 19",
    title: "מלחמה, אובדן, שגרה",
    text: "אנשים שהתחילו אחרי שנים, ואנשים שהניחו בפעם הראשונה. כל סיפור עומד בפני עצמו ואפשר לקרוא אותם בכל סדר.",
  },
];

const readers = [
  {
    title: "למי שאוהב לקרוא על אנשים",
    text: "23 סיפורים ב־184 עמודים, בערך שמונה עמודים לכל אחד. סיפור אחד בערב, בכל סדר שרוצים.",
  },
  {
    title: "לנער לפני בר מצווה, עם מבוגר לידו",
    text: "בחלק מהסיפורים יש מלחמה ואובדן. כדאי שההורה יקרא קודם, יבחר סיפור ויקרא אותו יחד עם הבן.",
  },
  {
    title: "למי שחושב להתחיל להניח, או מכיר מישהו כזה",
    text: "הספר לא מלמד איך מניחים. הוא מראה איך אחרים התחילו, ומה עבר עליהם בדרך.",
  },
  {
    title: "למתנה",
    text: "במארז של שניים עותק אחד נשאר אצלכם, והשני הולך לאבא, לחבר או לבן.",
  },
];

const rabbis = [
  {
    name: "הרב דוד יוסף",
    image: "/wp/uploads/2026/05/הרב-דוד-יוסף-min.webp",
    letter: "/wp/uploads/2026/05/מכתב-מהראשלצ.webp",
  },
  {
    name: "הרב יצחק זילברשטיין",
    image: "/wp/uploads/2024/04/רב-זילברמן-3-1.webp",
    letter: "/wp/uploads/2024/04/מכתב-הסכמה-מהרב-זילברשטיין-scaled.webp",
  },
  {
    name: "הרב זלמן ברוך מלמד",
    image: "/wp/uploads/2024/04/הרב-זלמן-מלמד-2.jpeg",
    letter: "/wp/uploads/2024/04/מכתב-ברכה-הרב-זלמן-ברוך-מלמד-scaled.webp",
  },
];

const faqs: [string, string][] = [
  [
    "זה ספר הלכה?",
    "לא. זה ספר סיפורים. הוא לא מסביר איך מניחים תפילין ואינו מחליף מדריך הלכתי.",
  ],
  [
    "הסיפורים קרו באמת?",
    "הסיפורים הגיעו לרב עמיחי במסגרת מיזם ״קשר של תפילין״. חלק מהשמות והפרטים המזהים שונו כדי לשמור על פרטיות האנשים.",
  ],
  [
    "כל הספר עוסק בשבעה באוקטובר?",
    "לא. חלק מהסיפורים קשורים למלחמה, ואחרים מתרחשים במקומות ובזמנים אחרים לגמרי: בחו״ל, בבית, בתוך המשפחה.",
  ],
  [
    "מתאים לנער בר מצווה?",
    "כן, עם מבוגר שמלווה. בחלק מהסיפורים יש מלחמה ואובדן, ולכן מומלץ שהורה או מחנך יבחרו מראש את הסיפורים לקריאה משותפת.",
  ],
  [
    "כמה עולה המשלוח ומתי הוא מגיע?",
    "עד 8 ימי עסקים. 40 ₪ לעותק אחד, 20 ₪ לשני עותקים, וכלול במחיר של שלושה. איסוף עצמי מבית אל ללא עלות ובתיאום מראש.",
  ],
  [
    "אפשר להזמין לכיתה, לצוות או לקהילה?",
    "כן. כתבו לנו בוואטסאפ כמה עותקים צריך ולמתי, ונחזור אליכם עם מחיר ואפשרויות אספקה.",
  ],
];

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

function finalPrice(quantity: number, delivery: Delivery) {
  const b = bundles.find((x) => x.quantity === quantity)!;
  return b.price + (delivery === "shipping" ? b.shipping : 0);
}

function BookOrderPage() {
  const [quantity, setQuantity] = useState(2);
  const [delivery, setDelivery] = useState<Delivery>("shipping");
  const [expanded, setExpanded] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const [thanks, setThanks] = useState(false);
  const [bump, setBump] = useState(0);
  const [touched, setTouched] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const orderRef = useRef<HTMLElement>(null);

  const bundle = bundles.find((b) => b.quantity === quantity)!;
  const total = finalPrice(quantity, delivery);

  // צפייה בעמוד (page_view נשלח כבר ב-root) + view_item, וחזרה מ-Grow אחרי תשלום.
  useEffect(() => {
    track("view_item", {
      page_type: PAGE_TYPE,
      currency: "ILS",
      value: 78,
      items: [{ item_name: BOOK_NAME, price: 78 }],
    });

    // ב-Grow מגדירים לכל עמוד תשלום כתובת הצלחה:
    // /book-order?order=done&q=1  (ו-q=2, q=3 בהתאמה)
    const params = new URLSearchParams(window.location.search);
    if (params.get("order") === "done") {
      setThanks(true);
      const q = Number(params.get("q"));
      const b = bundles.find((x) => x.quantity === q);
      let seen = false;
      try {
        seen = sessionStorage.getItem("kb-purchase-sent") === "1";
        sessionStorage.setItem("kb-purchase-sent", "1");
      } catch {
        /* מצב פרטי */
      }
      if (!seen) {
        track("purchase", {
          page_type: PAGE_TYPE,
          currency: "ILS",
          value: b ? b.price : undefined,
          items: b ? [{ item_name: BOOK_NAME, quantity: b.quantity, price: b.price }] : undefined,
        });
      }
    }
  }, []);

  // פס ההזמנה במובייל: מופיע אחרי הפתיח, נעלם כשאזור ההזמנה על המסך.
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    let heroOut = false;
    let orderIn = false;
    const update = () => setShowBar(heroOut && !orderIn);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === heroRef.current) heroOut = !e.isIntersecting;
        if (e.target === orderRef.current) orderIn = e.isIntersecting;
      }
      update();
    });
    if (heroRef.current) io.observe(heroRef.current);
    if (orderRef.current) io.observe(orderRef.current);
    return () => io.disconnect();
  }, []);

  // כניסה עדינה של סקשנים. בלי תנועה למי שביקש להפחית אותה.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    nodes.forEach((n) => n.classList.add("kr-ready"));
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("kr-in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -8%", threshold: 0.05 },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  const ctaClick = (location: string) => track("cta_click", { page_type: PAGE_TYPE, location });

  const chooseQuantity = (q: number) => {
    if (q === quantity) return;
    setQuantity(q);
    setTouched(true);
    setBump((n) => n + 1);
    track("select_bundle", {
      page_type: PAGE_TYPE,
      quantity: q,
      value: finalPrice(q, delivery),
      currency: "ILS",
    });
  };

  const chooseDelivery = (d: Delivery) => {
    if (d === delivery) return;
    setDelivery(d);
    setTouched(true);
    setBump((n) => n + 1);
    track("select_delivery", { page_type: PAGE_TYPE, delivery: d, quantity });
  };

  const goToCheckout = () =>
    track("begin_checkout", {
      page_type: PAGE_TYPE,
      currency: "ILS",
      value: total,
      delivery,
      items: [{ item_name: BOOK_NAME, quantity, price: bundle.price }],
    });

  const orderLine =
    delivery === "shipping"
      ? bundle.shipping === 0
        ? "משלוח עד הבית כלול"
        : `משלוח ${bundle.shipping} ₪`
      : "איסוף עצמי מבית אל, ללא עלות";

  return (
    <div className="kr" dir="rtl">
      <a className="kr-skip" href="#kr-order">
        דילוג להזמנה
      </a>

      {thanks && (
        <div className="kr-thanks" role="status">
          <div className="kr-wrap">
            <strong>תודה, ההזמנה התקבלה.</strong>
            <span>
              פרטי ההזמנה הגיעו אלינו. בשאלות אפשר לכתוב בוואטסאפ ל־
              <a href="https://wa.me/972546713966">054-6713966</a>.
            </span>
          </div>
        </div>
      )}

      <header className="kr-top">
        <div className="kr-wrap">
          <img src="/wp/img/לוגו-קשר-של-תפילין-01.svg" alt="קשר של תפילין" width="44" height="44" />
          <span>עמותת אור חדש</span>
        </div>
      </header>

      <main>
        {/* 1 · הספר */}
        <section className="kr-hero" ref={heroRef} aria-labelledby="kr-title">
          <div className="kr-wrap kr-hero-grid">
            <div className="kr-hero-copy">
              <p className="kr-kicker">ספר חדש · הרב עמיחי איל</p>
              <h1 id="kr-title">
                <span className="kr-h1-name">קשר של תפילין</span>
                <span className="kr-h1-desc">
                  23 סיפורים מהחיים על אנשים שהחליטו להתחיל להניח תפילין
                </span>
              </h1>
              <p className="kr-hero-lead">
                לא ספר הלכה ולא מדריך. כל פרק הוא אדם אחר, והדרך שהובילה אותו אל התפילין.
              </p>
              <div className="kr-hero-actions">
                <a className="kr-btn" href="#kr-order" onClick={() => ctaClick("hero")}>
                  לבחירת עותק · מ־78 ₪
                </a>
                <a
                  className="kr-link"
                  href="#kr-read"
                  onClick={() => track("sample_click", { page_type: PAGE_TYPE, location: "hero" })}
                >
                  לקרוא עמוד מתוך הספר
                </a>
              </div>
              <p className="kr-facts">
                184 עמודים · כריכה רכה · משלוח עד הבית או איסוף מבית אל
              </p>
            </div>
            <figure className="kr-hero-book">
              <img
                src="/book/mock-hands.webp"
                alt="הספר קשר של תפילין מוחזק בשתי ידיים"
                width="900"
                height="1125"
                fetchPriority="high"
              />
            </figure>
          </div>
        </section>

        {/* 2 · השאלה של אדם אחד */}
        <section className="kr-question" aria-labelledby="kr-q-quote">
          <div className="kr-narrow" data-reveal>
            <svg className="kr-knot" viewBox="0 0 220 60" aria-hidden="true">
              <path d="M4 44 C 50 44, 70 10, 104 12 C 136 14, 132 50, 106 50 C 82 50, 86 16, 120 14 C 156 12, 170 44, 216 44" />
            </svg>
            <p className="kr-q-label">סיפור 1 מתוך 23</p>
            <blockquote id="kr-q-quote">
              ״ומה אני יכול לעשות כדי להודות לאלוקים שהציל אותי ונתן לי את החיים במתנה?״
            </blockquote>
            <p className="kr-q-body">
              את השאלה הזאת שאל יזהר, אחרי שהוא וילדיו ניצלו בשבעה באוקטובר. הרב דוד ענה לו במילה
              אחת.
            </p>
            <a
              className="kr-link kr-link-light"
              href="#kr-read"
              onClick={() => track("sample_click", { page_type: PAGE_TYPE, location: "question" })}
            >
              איזו מילה, ומה יזהר עשה איתה
            </a>
          </div>
        </section>

        {/* 3 · עוד נקודות התחלה */}
        <section className="kr-starts" aria-labelledby="kr-starts-title">
          <div className="kr-wrap" data-reveal>
            <p className="kr-kicker">ועוד 22</p>
            <h2 id="kr-starts-title">כל אחד הגיע לתפילין מכיוון אחר</h2>
            <p className="kr-lead">
              יזהר פותח את הספר. אחריו באים אנשים שלא דומים לו, וגם לא זה לזה.
            </p>
          </div>
          <div className="kr-starts-track" data-reveal>
            <ol className="kr-starts-list">
              {starts.map((s, i) => (
                <li key={s.tag} className={i === starts.length - 1 ? "is-more" : ""}>
                  <span className="kr-start-tag">{s.tag}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
          <p className="kr-wrap kr-privacy">חלק מהשמות והפרטים שונו כדי לשמור על פרטיות האנשים.</p>
        </section>

        {/* 4 · עמוד מתוך הספר */}
        <section id="kr-read" className="kr-read" aria-labelledby="kr-read-title">
          <div className="kr-wrap kr-read-grid">
            <div className="kr-read-intro" data-reveal>
              <p className="kr-kicker">עמוד מתוך הספר</p>
              <h2 id="kr-read-title">כך הספר נשמע מבפנים</h2>
              <p className="kr-lead">
                הקטע לקוח מהסיפור הראשון, ״על הניסים ועל הנפלא־אות״. כמה שבועות אחרי השיחה עם
                הרב דוד, יזהר עדיין לא עשה כלום עם התשובה.
              </p>
            </div>
            <article className={`kr-page ${expanded ? "is-open" : ""}`} data-reveal>
              <header>
                <span>קשר של תפילין</span>
                <span>על הניסים ועל הנפלא־אות</span>
              </header>
              <div className="kr-page-body" id="kr-page-body">
                <p>
                  &quot;ומה אני יכול לעשות כדי להודות לאלוקים שהציל אותי ונתן לי את החיים
                  במתנה?&quot; שאל יזהר.
                </p>
                <p>&quot;תפילין. תתחיל להניח תפילין!&quot; ענה הרב ישירות.</p>
                <p>
                  הרב הסביר לְיזהר על המצווה, ואמר שע&quot;י הנחת תפילין וקריאת שמע בכל יום דבר
                  שלא מצריך הרבה זמן – הוא מחבר את עצמו לה&#x27; באופן פנימי ועמוק מאד. יזהר
                  הקשיב והרעיון מצא חן בעיניו. לפני שנפרדו, הרב דוד בירך את יזהר בחום. &quot;לחיים
                  טובים ומאושרים, מעכשיו ועד מאה עשרים!&quot;, ונתן לו את המספר של הרב עמיחי.
                  &quot;תתקשר אליו, הוא יעזור לך וידאג להביא לך תפילין&quot;.
                </p>
                <p>
                  מאז שיזהר פגש את הרב דוד עברו כמה שבועות, אבל הדברים ששמע מהרב המשיכו להדהד
                  בראשו. גם עכשיו, תוך כדי הטיול עם הכלב, הוא נזכר בדברי הרב על הניסים ועל
                  התפילין, והחליט שהגיע הזמן להוציא אל הפועל את הרעיון. הוא החל לפסוע בחזרה
                  הביתה בצעדים מהירים. אחרי שנכנס לדירה הקטנה, פתח את המגירה, הוציא ממנה את
                  הפתק שעליו כתב הרב דוד את המספר והתקשר.
                </p>
              </div>
              {!expanded ? (
                <button
                  type="button"
                  className="kr-page-more"
                  aria-controls="kr-page-body"
                  aria-expanded="false"
                  onClick={() => {
                    setExpanded(true);
                    track("sample_expand", { page_type: PAGE_TYPE });
                  }}
                >
                  להמשך הקטע
                </button>
              ) : (
                <footer className="kr-page-end">
                  <p>כאן נגמר הקטע. בספר הסיפור של יזהר ממשיך, ואחריו עוד 22.</p>
                  <a className="kr-btn" href="#kr-order" onClick={() => ctaClick("excerpt")}>
                    לבחירת עותק
                  </a>
                </footer>
              )}
            </article>
          </div>
        </section>

        {/* 5 · למי */}
        <section className="kr-readers" aria-labelledby="kr-readers-title">
          <div className="kr-wrap kr-readers-grid">
            <figure data-reveal>
              <img
                src="/book/mock-father-son.webp"
                alt="אב ובנו משוחחים ליד שולחן, הספר מונח ביניהם"
                width="1200"
                height="800"
                loading="lazy"
              />
            </figure>
            <div data-reveal>
              <p className="kr-kicker">למי</p>
              <h2 id="kr-readers-title">למי קונים את הספר הזה</h2>
              <ul className="kr-readers-list">
                {readers.map((r) => (
                  <li key={r.title}>
                    <h3>{r.title}</h3>
                    <p>{r.text}</p>
                  </li>
                ))}
              </ul>
              <a className="kr-link" href="#kr-order" onClick={() => ctaClick("readers")}>
                לבחירת מארז
              </a>
            </div>
          </div>
        </section>

        {/* 6 · מי עומד מאחור */}
        <section className="kr-source" aria-labelledby="kr-source-title">
          <div className="kr-wrap kr-source-grid">
            <div className="kr-source-copy" data-reveal>
              <p className="kr-kicker">מי עומד מאחורי הספר</p>
              <h2 id="kr-source-title">מאיפה הגיעו הסיפורים</h2>
              <p>
                הרב עמיחי איל, תושב בית אל, מנהל את מיזם ״קשר של תפילין״ של עמותת אור חדש.
                המיזם אוסף תפילין שאינן בשימוש, בודק ומחדש אותן, ומוסר אותן למי שרוצה להתחיל
                להניח.
              </p>
              <p className="kr-stat">
                <strong>1,500</strong>
                <span>זוגות תפילין נבדקו, חודשו ונמסרו במסגרת המיזם</span>
              </p>
              <p>
                כל זוג כזה התחיל בפנייה של אדם. מתוך הפניות והשיחות האלה נבחרו 23 הסיפורים
                לספר, שנכתב יחד עם שמעון חי בן־שחר.
              </p>
            </div>
            <figure className="kr-author" data-reveal>
              <img
                src="/wp/img/עמיחי-פרופיל-ערוך-min.webp"
                alt="הרב עמיחי איל"
                width="932"
                height="1400"
                loading="lazy"
              />
              <figcaption>הרב עמיחי איל</figcaption>
            </figure>
          </div>
          <div className="kr-wrap kr-letters" data-reveal>
            <h3>רבנים שנתנו למיזם מכתבי ברכה</h3>
            <ul>
              {rabbis.map((r) => (
                <li key={r.name}>
                  <a
                    href={r.letter}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("letter_open", { page_type: PAGE_TYPE, rabbi: r.name })}
                  >
                    <img src={r.image} alt="" width="56" height="56" loading="lazy" />
                    <span>
                      <strong>{r.name}</strong>
                      <small>למכתב</small>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p>המכתבים ניתנו למיזם ולפעילותו, לא לספר.</p>
          </div>
        </section>

        {/* 7 · הזמנה */}
        <section id="kr-order" className="kr-order" ref={orderRef} aria-labelledby="kr-order-title">
          <div className="kr-wrap kr-order-grid">
            <div className="kr-order-head" data-reveal>
              <p className="kr-kicker">הזמנה</p>
              <h2 id="kr-order-title">כמה עותקים להזמין?</h2>
              <p className="kr-lead">
                המחירים כאן סופיים. בוחרים אופן קבלה וכמות, ורואים בדיוק כמה משלמים.
              </p>
              <img
                className="kr-order-img"
                src="/book/mock-two-copies.webp"
                alt="שני עותקים של הספר קשר של תפילין"
                width="1200"
                height="800"
                loading="lazy"
              />
            </div>

            <div className="kr-order-box">
              <fieldset className="kr-delivery">
                <legend>איך הספר יגיע אליכם?</legend>
                <div className="kr-seg">
                  {(
                    [
                      ["shipping", "משלוח עד הבית", "עד 8 ימי עסקים"],
                      ["pickup", "איסוף עצמי", "בית אל · ללא עלות"],
                    ] as const
                  ).map(([value, label, sub]) => (
                    <label key={value} className={delivery === value ? "is-on" : ""}>
                      <input
                        type="radio"
                        name="kr-delivery"
                        value={value}
                        checked={delivery === value}
                        onChange={() => chooseDelivery(value)}
                      />
                      <strong>{label}</strong>
                      <small>{sub}</small>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="kr-bundles">
                <legend>כמה עותקים?</legend>
                {bundles.map((b) => {
                  const price = finalPrice(b.quantity, delivery);
                  const on = b.quantity === quantity;
                  const breakdown =
                    delivery === "pickup"
                      ? "איסוף עצמי, ללא תוספת"
                      : b.shipping === 0
                        ? "משלוח עד הבית כלול"
                        : `${b.price} ₪ + משלוח ${b.shipping} ₪`;
                  const perCopy = b.quantity > 1 ? `${fmt(price / b.quantity)} ₪ לעותק` : "";
                  return (
                    <label key={b.quantity} className={`kr-bundle ${on ? "is-on" : ""}`}>
                      <input
                        type="radio"
                        name="kr-quantity"
                        value={b.quantity}
                        checked={on}
                        onChange={() => chooseQuantity(b.quantity)}
                      />
                      <span className="kr-radio" aria-hidden="true" />
                      <span className="kr-bundle-main">
                        {b.tag && <span className="kr-bundle-tag">{b.tag}</span>}
                        <strong>{b.title}</strong>
                        <small>{breakdown}</small>
                        {perCopy && <small className="kr-per-copy">{perCopy}</small>}
                      </span>
                      <span className="kr-bundle-price">
                        {price}
                        <small> ₪</small>
                      </span>
                    </label>
                  );
                })}
              </fieldset>

              <div className="kr-summary" aria-live="polite">
                <div>
                  <span>סה״כ לתשלום</span>
                  <small>
                    {bundle.title} · {orderLine}
                  </small>
                </div>
                <strong key={bump} className="kr-total">
                  {total} ₪
                </strong>
              </div>

              <a
                className="kr-btn kr-btn-pay"
                href={purchaseLinks[quantity]}
                target="_blank"
                rel="noopener noreferrer"
                onClick={goToCheckout}
              >
                לתשלום מאובטח · {total} ₪
              </a>

              <ol className="kr-next">
                <li>נפתח עמוד התשלום של Grow עם המארז שבחרתם.</li>
                <li>
                  ממלאים פרטים ובוחרים שם שוב {delivery === "shipping" ? "משלוח" : "איסוף עצמי"},
                  כמו כאן.
                </li>
                <li>
                  ההזמנה מגיעה ישירות אלינו.{" "}
                  {delivery === "shipping"
                    ? "הספר יוצא אליכם ומגיע בתוך עד 8 ימי עסקים."
                    : "נתאם איתכם איסוף מארץ חמדה 33, בית אל."}
                </li>
              </ol>

              <ul className="kr-order-notes">
                <li>
                  הקדשה אישית מהרב עמיחי: אפשר לבקש בוואטסאפ אחרי ההזמנה, בכפוף לזמינות.
                </li>
                <li>
                  ביטול עסקה לפי חוק הגנת הצרכן.{" "}
                  <a href="#kr-cancel">פרטים</a>
                </li>
                <li>
                  הזמנה לכיתה, לצוות או לקהילה?{" "}
                  <a
                    href={groupLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      track("contact", {
                        page_type: PAGE_TYPE,
                        contact_method: "whatsapp",
                        intent: "group_order",
                      })
                    }
                  >
                    כתבו לנו בוואטסאפ
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 8 · שאלות */}
        <section className="kr-faq" aria-labelledby="kr-faq-title">
          <div className="kr-narrow">
            <h2 id="kr-faq-title">שאלות לפני שמזמינים</h2>
            {faqs.map(([q, a]) => (
              <details
                key={q}
                onToggle={(e) => {
                  if ((e.currentTarget as HTMLDetailsElement).open)
                    track("faq_open", { page_type: PAGE_TYPE, question: q });
                }}
              >
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
            <details id="kr-cancel">
              <summary>ביטול עסקה והחזרה</summary>
              <p>
                בכפוף להוראות חוק הגנת הצרכן, ניתן לבטל רכישת מוצר בתוך 14 ימים מקבלתו או מקבלת
                מסמך פרטי העסקה, לפי המאוחר. הודעת ביטול אפשר למסור בטלפון 054-6713966, בוואטסאפ
                או בדואר לכתובת ארץ חמדה 33, בית אל, בציון שם ופרטי ההזמנה.
              </p>
              <p>
                בביטול שלא עקב פגם, אי־התאמה, איחור באספקה או הפרה אחרת, ניתן לגבות דמי ביטול של
                5% ממחיר העסקה או 100 ש״ח, לפי הנמוך. הצרכן יחזיר את המוצר לעוסק על חשבונו. בביטול
                עקב אחת העילות האמורות לא ייגבו דמי ביטול, והמוצר יועמד לרשות העוסק במקום שבו
                נמסר. ההחזר וביטול החיוב יבוצעו בתוך 14 ימים מקבלת הודעת הביטול.
              </p>
              <p>
                לאזרח ותיק, עולה חדש או אדם עם מוגבלות עשויה לעמוד זכות ביטול בתוך ארבעה חודשים,
                כאשר ההתקשרות כללה שיחה עם העוסק, לרבות בתקשורת אלקטרונית, ובהתאם לתנאי החוק. חלים
                החריגים והסייגים הקבועים בדין; אין באמור כדי לגרוע מזכויות הצרכן על פי חוק.
              </p>
            </details>
          </div>
        </section>

        {/* 9 · סגירה */}
        <section className="kr-final" aria-labelledby="kr-final-title">
          <div className="kr-narrow kr-final-inner" data-reveal>
            <img src="/book/kesher-cover.jpeg" alt="" width="1021" height="1600" loading="lazy" />
            <div>
              <h2 id="kr-final-title">יזהר פותח את הספר. אחריו עוד 22 סיפורים.</h2>
              <a className="kr-btn" href="#kr-order" onClick={() => ctaClick("final")}>
                לבחירת עותק · מ־78 ₪
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="kr-footer">
        <div className="kr-wrap">
          <span>
            עמותת אור חדש · ע״ר 580703965 · ארץ חמדה 33, בית אל ·{" "}
            <a href="tel:0546713966">054-6713966</a>
          </span>
          <nav aria-label="מידע משפטי">
            <a href="/accessibility">הצהרת נגישות</a>
            <a href="/privacy">מדיניות פרטיות</a>
            <a href="/terms">תקנון</a>
          </nav>
        </div>
      </footer>

      <div className={`kr-bar ${showBar ? "is-on" : ""}`} aria-hidden={!showBar}>
        <div>
          <strong>{BOOK_NAME}</strong>
          <small>{touched ? `${bundle.title} · ${total} ₪` : "23 סיפורים · מ־78 ₪"}</small>
        </div>
        <a
          href="#kr-order"
          tabIndex={showBar ? 0 : -1}
          onClick={() => ctaClick("sticky")}
        >
          להזמנה
        </a>
      </div>
    </div>
  );
}
