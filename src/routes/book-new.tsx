import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, BookOpen, Check, MapPin, Truck } from "lucide-react";
import { SITE_URL } from "@/lib/site";
import { Header } from "@/components/home/Header";
import { SiteFooter } from "@/components/SiteFooter";
import bookCss from "@/book-new.css?url";

export const Route = createFileRoute("/book-new")({
  head: () => ({
    meta: [
      { title: "קשר של תפילין — הספר של עמיחי איל" },
      {
        name: "description",
        content:
          "23 סיפורים מהחיים על הנחת תפילין והתחלה של קשר. הכירו את הספר של עמיחי איל וקראו קטע מתוכו.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "קשר של תפילין — הספר של עמיחי איל" },
      {
        property: "og:description",
        content: "23 סיפורים מהחיים על הנחת תפילין והתחלה של קשר.",
      },
      { property: "og:image", content: `${SITE_URL}/book/kesher-cover.jpeg` },
      { property: "og:image:width", content: "1021" },
      { property: "og:image:height", content: "1600" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:url", content: `${SITE_URL}/book-new` },
      { name: "twitter:image", content: `${SITE_URL}/book/kesher-cover.jpeg` },
    ],
    links: [
      { rel: "stylesheet", href: bookCss },
      { rel: "canonical", href: `${SITE_URL}/book-new` },
    ],
  }),
  component: BookNewPage,
});

const bundles = [
  {
    quantity: 1,
    title: "עותק אחד",
    price: 78,
    detail: "לעצמכם או למתנה · לא כולל משלוח",
  },
  {
    quantity: 2,
    title: "שני עותקים",
    price: 143,
    detail: "כולל משלוח עד הבית · הקדשה אישית מעמיחי",
  },
  {
    quantity: 3,
    title: "שלושה עותקים",
    price: 199,
    detail: "כולל משלוח עד הבית · הקדשה אישית מעמיחי",
  },
];

/** מחיר ליחידה מחושב מהמחיר של כל מארז, לא מקודד ידנית. */
function unitPriceLabel(price: number, quantity: number): string {
  if (quantity === 1) return "מחיר בסיס";
  return `${(price / quantity).toFixed(1)} ₪ לעותק`;
}

const letters = [
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

function BookNewPage() {
  const [quantity, setQuantity] = useState(2);
  const [delivery, setDelivery] = useState<"pickup" | "shipping">("pickup");
  const bundle = bundles.find((item) => item.quantity === quantity)!;
  const shippingIncluded = quantity > 1;
  const total =
    bundle.price + (!shippingIncluded && delivery === "shipping" ? 40 : 0);
  const deliveryText = shippingIncluded
    ? "כולל משלוח עד הבית"
    : delivery === "pickup"
      ? "באיסוף עצמי"
      : "במשלוח עד הבית";
  const message = `שלום עמיחי, אשמח לברר על הזמנת ${quantity} עותקים מהספר קשר של תפילין, ${deliveryText}. הסכום שמוצג בעמוד: ${total} ש״ח.`;

  return (
    <div className="book-organic" dir="rtl">
      <Header />
      <div className="kb">
        <a className="kb-skip" href="#content">
          דילוג לתוכן
        </a>
        <main id="content">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Book",
                name: "קשר של תפילין",
                author: [
                  { "@type": "Person", name: "עמיחי איל" },
                  { "@type": "Person", name: "שמעון חי בן־שחר" },
                ],
                inLanguage: "he",
                numberOfPages: 184,
                bookFormat: "https://schema.org/Paperback",
                description: "23 סיפורים מהחיים על הנחת תפילין והתחלה של קשר.",
                image: `${SITE_URL}/book/kesher-cover.jpeg`,
                url: `${SITE_URL}/book-new`,
              }),
            }}
          />
          <div className="kb-opening">
            <section className="kb-hero kb-wrap" aria-labelledby="kb-title">
              <div className="kb-hero-copy">
                <p className="kb-kicker">״קשר של תפילין״ · הספר של עמיחי איל</p>
                <h1 id="kb-title">
                  23 סיפורים מרגשים ואמיתיים על רגעים שבהם השמיים נפתחו, והחיים
                  השתנו מקצה לקצה
                </h1>
                <p className="kb-subtitle">
                  מקרבות בעזה ועד למקומות הנידחים בעולם — גלה את ההשגחה הפרטית
                  שהפתיעה אפילו את הספקנים ביותר.
                </p>
                <div className="kb-hero-price">
                  <strong>78 ₪</strong>
                  <span>
                    לעותק · מארז 2 עותקים ב־143 ₪ כולל משלוח עד הבית והקדשה
                    אישית מעמיחי
                  </span>
                </div>
                <div className="kb-actions">
                  <a href="#kb-order" className="kb-button">
                    לבחירת מארז והזמנה <ArrowLeft size={19} aria-hidden="true" />
                  </a>
                  <a href="#kb-sample" className="kb-text-link">
                    <BookOpen size={19} aria-hidden="true" /> קראו קודם קטע
                    מהספר
                  </a>
                </div>
                <p className="kb-scroll-cue">
                  גלול למטה לקריאת סיפור מיוחד מתוך הספר ולבחירת המארז שלך 👇
                </p>
                <p className="kb-small">
                  איסוף עצמי בבית אל ללא עלות · משלוח עד הבית 40 ₪ · ביטול עד 14
                  יום לפי חוק
                </p>
              </div>
              <figure className="kb-cover">
                <div className="kb-cover-frame">
                  <img
                    src="/book/kesher-cover.jpeg"
                    alt="כריכת הספר קשר של תפילין מאת עמיחי איל"
                    width="1021"
                    height="1600"
                    fetchPriority="high"
                  />
                </div>
              </figure>
            </section>
            <dl className="kb-trustbar kb-wrap">
              <div>
                <dt>זוגות תפילין שחולקו במיזם</dt>
                <dd>מעל 1,300</dd>
              </div>
              <div>
                <dt>הסכמות מגדולי הרבנים למיזם</dt>
                <dd>9</dd>
              </div>
              <div>
                <dt>סיפורים בספר</dt>
                <dd>23</dd>
              </div>
              <div>
                <dt>עמודים · כריכה רכה · עברית</dt>
                <dd>184</dd>
              </div>
            </dl>
          </div>
          <section id="kb-hook" className="kb-hook" aria-labelledby="kb-hook-title">
            <div className="kb-wrap kb-hook-grid">
              <div className="kb-hook-copy">
                <p className="kb-kicker">הסיפור שפותח את הספר</p>
                <h2 id="kb-hook-title">
                  ״ומה אני יכול לעשות כדי להודות שהצילו אותי?״
                </h2>
                <p>
                  יזהר וילדיו ניצלו בשבעה באוקטובר. חברים מהקיבוץ נרצחו ונחטפו.
                  בתוך הכאב הוא חיפש דרך להודות — ושאל רב מה הוא יכול לעשות.
                  התשובה הייתה מילה אחת.
                </p>
                <a href="#kb-sample" className="kb-text-link">
                  להמשך הסיפור בקטע לקריאה{" "}
                  <ArrowLeft size={16} aria-hidden="true" />
                </a>
              </div>
              <div>
                <blockquote className="kb-hook-quote">
                  ״תפילין. תתחיל להניח תפילין!״ ענה הרב ישירות.
                  <small className="kb-small">
                    מתוך הסיפור ״על הניסים ועל הנפלא־אות״
                  </small>
                </blockquote>
              </div>
            </div>
          </section>
          <section id="kb-trust" className="kb-trust" aria-labelledby="kb-trust-title">
            <div className="kb-wrap">
              <p className="kb-kicker">המיזם שמאחורי הספר</p>
              <h2 id="kb-trust-title">ברכות הרבנים למיזם ״קשר של תפילין״</h2>
              <p className="kb-trust-note">
                המכתבים ניתנו למיזם ולפעילותו. הם אינם ביקורות על הספר.
              </p>
              <div className="kb-rabbis">
                {letters.map((rabbi) => (
                  <a
                    key={rabbi.name}
                    href={rabbi.letter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={rabbi.image}
                      alt=""
                      width="76"
                      height="76"
                      loading="lazy"
                    />
                    <div>
                      <h3>{rabbi.name}</h3>
                      <span>לקריאת מכתב הברכה ↗</span>
                    </div>
                  </a>
                ))}
              </div>
              <div className="kb-trust-links">
                <a
                  href="https://www.youtube.com/watch?v=aQYiyBfycrc"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  הראיון עם עמיחי בערוץ 7 ↗
                </a>
                <a href="/in-news">
                  כתבות על המיזם בתקשורת{" "}
                  <ArrowLeft size={15} aria-hidden="true" />
                </a>
                <a href="/מכתבי-תודה">
                  מכתבי תודה מאנשים שקיבלו תפילין{" "}
                  <ArrowLeft size={15} aria-hidden="true" />
                </a>
              </div>
            </div>
          </section>
          <section
            className="kb-featured kb-wrap"
            aria-labelledby="kb-featured-title"
            id="kb-featured"
          >
            <p className="kb-kicker">שלושה מהסיפורים שבספר</p>
            <h2 id="kb-featured-title">מאחורי הבקשה לתפילין</h2>
            <div className="kb-featured-grid">
              <article>
                <h3>אב מהעוטף, אחרי שבעה באוקטובר</h3>
                <p>
                  יזהר וילדיו ניצלו, אבל חברים מהקיבוץ נרצחו ונחטפו. לצד הכאב
                  הוא מרגיש צורך להודות על חיי משפחתו. בשיחה עם רב הוא שואל מה
                  הוא יכול לעשות, ומחליט להתחיל להניח תפילין.
                </p>
                <small>מתוך ״על הניסים ועל הנפלא־אות״</small>
              </article>
              <article>
                <h3>ההבטחה של נעם, ששרד את הנובה</h3>
                <p>
                  ברגעי הסכנה נעם הבטיח להניח תפילין אם יֵצא בחיים. הוא ניצל, אך
                  ההבטחה נשארה איתו גם כשחזר לשגרה. הסיפור עוקב אחר הדרך שעבר עד
                  שפנה לעמיחי.
                </p>
                <small>מתוך ״לא השאיר לי ברירה״</small>
              </article>
              <article>
                <h3>להתחיל את הבוקר בברלין עם תפילין</h3>
                <p>
                  ישראלי שחי בברלין מחליט להתחיל להניח תפילין. לצד הבחירה האישית
                  הוא מתמודד עם החשש של אביו, ומנסה לשמור על הקשר המשפחתי בתוך
                  השינוי.
                </p>
                <small>מתוך ״יותר טוב מאספרסו״</small>
              </article>
            </div>
            <p className="kb-small">
              התקצירים מבוססים על הסיפורים בספר. חלק מהשמות והפרטים שונו בספר
              לשמירה על פרטיות המספרים.
            </p>
          </section>
          <section
            id="kb-sample"
            className="kb-sample kb-wrap"
            aria-labelledby="kb-sample-title"
          >
            <div className="kb-sample-intro">
              <p className="kb-kicker">קטע לקריאה מתוך הספר</p>
              <h2 id="kb-sample-title">על הניסים ועל הנפלא־אות</h2>
              <p>
                יזהר וילדיו ניצלו בשבעה באוקטובר. לצד הכאב על חבריו מהקיבוץ, הוא
                מבקש דרך להודות על חיי משפחתו ופונה לרב דוד. זהו קטע מהסיפור.
              </p>
              <a href="#kb-order" className="kb-button">
                להזמנת הספר <ArrowLeft size={18} aria-hidden="true" />
              </a>
            </div>
            <div className="kb-paper">
              <span className="kb-paper-label">
                קשר של תפילין / על הניסים ועל הנפלא־אות
              </span>
              <blockquote>
                <p>
                  &quot;ומה אני יכול לעשות כדי להודות לאלוקים שהציל אותי ונתן לי
                  את החיים במתנה?&quot; שאל יזהר.
                </p>
                <p>&quot;תפילין. תתחיל להניח תפילין!&quot; ענה הרב ישירות.</p>
                <p>
                  הרב הסביר לְיזהר על המצווה, ואמר שע&quot;י הנחת תפילין וקריאת
                  שמע בכל יום דבר שלא מצריך הרבה זמן – הוא מחבר את עצמו לה&#x27;
                  באופן פנימי ועמוק מאד. יזהר הקשיב והרעיון מצא חן בעיניו. לפני
                  שנפרדו, הרב דוד בירך את יזהר בחום. &quot;לחיים טובים ומאושרים,
                  מעכשיו ועד מאה עשרים!&quot;, ונתן לו את המספר של הרב עמיחי.
                  &quot;תתקשר אליו, הוא יעזור לך וידאג להביא לך תפילין&quot;.
                </p>
                <p>
                  מאז שיזהר פגש את הרב דוד עברו כמה שבועות, אבל הדברים ששמע מהרב
                  המשיכו להדהד בראשו. גם עכשיו, תוך כדי הטיול עם הכלב, הוא נזכר
                  בדברי הרב על הניסים ועל התפילין, והחליט שהגיע הזמן להוציא אל
                  הפועל את הרעיון. הוא החל לפסוע בחזרה הביתה בצעדים מהירים. אחרי
                  שנכנס לדירה הקטנה, פתח את המגירה, הוציא ממנה את הפתק שעליו כתב
                  הרב דוד את המספר והתקשר.
                </p>
              </blockquote>
            </div>
          </section>
          <nav className="kb-page-nav kb-wrap" aria-label="תוכן העניינים בעמוד">
            <strong>בעמוד הזה</strong>
            <a href="#kb-sample">קטע לקריאה</a>
            <a href="#kb-contents">תוכן הספר</a>
            <a href="#kb-author">על עמיחי</a>
            <a href="#kb-trust">ברכות הרבנים</a>
            <a href="#kb-order">מחיר ומשלוח</a>
            <a href="#kb-faq">שאלות ותשובות</a>
          </nav>
          <section
            id="kb-contents"
            className="kb-contents"
            aria-labelledby="kb-contents-title"
          >
            <div className="kb-wrap">
              <div className="kb-section-heading">
                <p className="kb-kicker">מה יש בספר</p>
                <h2 id="kb-contents-title">תוכן העניינים ופרטי הספר</h2>
                <p>
                  הסיפורים נעים בין הבית והעבודה, השירות הצבאי והטיול בחו״ל. בכל
                  אחד מהם הנחת התפילין מקבלת מקום בתוך חייו של אדם מסוים.
                </p>
              </div>
              <dl className="kb-book-facts">
                <div>
                  <dt>מספר עמודים</dt>
                  <dd>184</dd>
                </div>
                <div>
                  <dt>כריכה</dt>
                  <dd>רכה</dd>
                </div>
                <div>
                  <dt>שפה</dt>
                  <dd>עברית</dd>
                </div>
                <div>
                  <dt>כתיבה</dt>
                  <dd>שמעון חי בן־שחר ועמיחי איל</dd>
                </div>
              </dl>
            </div>
          </section>

          <section
            id="kb-author"
            className="kb-author kb-wrap"
            aria-labelledby="kb-author-title"
          >
            <img
              src="/wp/img/עמיחי-פרופיל-ערוך-min.webp"
              alt="הרב עמיחי איל"
              width="932"
              height="1400"
              loading="lazy"
            />
            <div>
              <p className="kb-kicker">האיש ששמע את הסיפורים</p>
              <h2 id="kb-author-title">נעים להכיר, עמיחי איל</h2>
              <p>
                עמיחי, תושב בית אל, הקים ומנהל את מיזם ״קשר של תפילין״: מעל
                1,300 זוגות תפילין שאינן בשימוש נבדקו, חודשו ונמסרו למי שרצה
                להתחיל להניח. הוא עסק בהוראה בישיבות ובניהול ארגון ״נהורא״.
              </p>
              <p>
                בכל מסירה כזו התחיל סיפור. 23 מהם מגיעים עכשיו לספר — כולל
                סיפורי מלחמה, אובדן והתמודדויות משפחתיות. זה לא ספר ילדים, וכדאי
                לעיין בו לפני שמעבירים לנער.
              </p>
              <a
                className="kb-text-link"
                href="https://www.youtube.com/watch?v=aQYiyBfycrc"
                target="_blank"
                rel="noopener noreferrer"
              >
                לראיון עם עמיחי על המיזם בערוץ 7 ↗
              </a>
              <p className="kb-small">כתיבה: שמעון חי בן־שחר ועמיחי איל</p>
            </div>
          </section>

          <section
            id="kb-order"
            className="kb-order"
            aria-labelledby="kb-order-title"
          >
            <div className="kb-wrap">
              <div className="kb-section-heading">
                <p className="kb-kicker">לרגל הוצאת הספר</p>
                <h2 id="kb-order-title">
                  בחרו מארז — ועמיחי יסגור איתכם את ההזמנה
                </h2>
                <p>
                  במארז של שני עותקים ומעלה מצורפת הקדשה אישית מעמיחי — אחד
                  לכם ואחד לתת.
                </p>
              </div>
              <fieldset className="kb-bundles">
                <legend className="kb-sr-only">בחירת מספר עותקים</legend>
                {bundles.map((item) => (
                  <label
                    className={`kb-bundle ${quantity === item.quantity ? "is-selected" : ""}`}
                    key={item.quantity}
                  >
                    <input
                      type="radio"
                      name="book-quantity"
                      value={item.quantity}
                      checked={quantity === item.quantity}
                      onChange={() => setQuantity(item.quantity)}
                    />
                    <div className="kb-bundle-top">
                      <h3>{item.title}</h3>
                      <span className="kb-radio" aria-hidden="true">
                        {quantity === item.quantity && <Check size={14} />}
                      </span>
                    </div>
                    <strong>
                      {item.price}
                      <small> ₪</small>
                    </strong>
                    <p>{item.detail}</p>
                    <p className="kb-unit-price">
                      {unitPriceLabel(item.price, item.quantity)}
                    </p>
                  </label>
                ))}
              </fieldset>
              <div className="kb-order-bottom">
                <div className="kb-delivery">
                  {quantity === 1 ? (
                    <fieldset>
                      <legend>איך תרצו לקבל את הספר?</legend>
                      <div className="kb-delivery-options">
                        <label>
                          <input
                            type="radio"
                            name="book-delivery"
                            checked={delivery === "pickup"}
                            onChange={() => setDelivery("pickup")}
                          />
                          <MapPin size={18} aria-hidden="true" /> איסוף עצמי ·
                          ללא עלות
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="book-delivery"
                            checked={delivery === "shipping"}
                            onChange={() => setDelivery("shipping")}
                          />
                          <Truck size={18} aria-hidden="true" /> משלוח עד הבית ·
                          40 ₪
                        </label>
                      </div>
                      <p className="kb-delivery-detail" aria-live="polite">
                        {delivery === "pickup"
                          ? "איסוף מארץ חמדה 33, בית אל. מתאים גם לתושבי יישובי בנימין."
                          : "משלוח של עד 5 ספרים: 40 ₪. עד 8 ימי עסקים."}
                      </p>
                    </fieldset>
                  ) : (
                    <div>
                      <p className="kb-delivery-included">
                        <Truck size={18} aria-hidden="true" /> משלוח עד הבית
                        כלול במחיר המארז
                      </p>
                      <p className="kb-delivery-detail" aria-live="polite">
                        המשלוח עד הבית כלול כבר במחיר המארז, עד 8 ימי עסקים.
                        אפשר גם לתאם עם עמיחי איסוף עצמי.
                      </p>
                    </div>
                  )}
                </div>
                <div className="kb-total">
                  <div aria-live="polite">
                    <span>
                      סה״כ
                      {quantity === 1 && delivery === "shipping"
                        ? ", כולל משלוח"
                        : ""}
                    </span>
                    <strong>{total} ₪</strong>
                  </div>
                  <p>
                    התשלום באתר עדיין לא נפתח. שליחת הפרטים בוואטסאפ שומרת לכם
                    את ההזמנה, ועמיחי חוזר עם אישור ותיאום.
                  </p>
                  <a
                    href={`https://wa.me/972546713966?text=${encodeURIComponent(message)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="kb-button"
                  >
                    שליחת ההזמנה לעמיחי בוואטסאפ{" "}
                    <ArrowLeft size={18} aria-hidden="true" />
                  </a>
                  <span className="kb-small">
                    הבחירה בעמוד אינה מבצעת חיוב. ביטול עסקה עד 14 יום לפי חוק
                    הגנת הצרכן.
                  </span>
                </div>
              </div>
              <div className="kb-group">
                <div>
                  <h3>רוצים להזמין לכיתה, לעובדים או לאירוע משפחתי?</h3>
                  <p>
                    פנו לעמיחי עם מספר העותקים והמועד הרצוי, כדי לתאם הזמנה
                    קבוצתית.
                  </p>
                </div>
                <a
                  href="https://wa.me/972546713966?text=%D7%A9%D7%9C%D7%95%D7%9D%20%D7%A2%D7%9E%D7%99%D7%97%D7%99%2C%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%91%D7%A8%D7%A8%20%D7%A2%D7%9C%20%D7%94%D7%96%D7%9E%D7%A0%D7%94%20%D7%A7%D7%91%D7%95%D7%A6%D7%AA%D7%99%D7%AA%20%D7%A9%D7%9C%20%D7%94%D7%A1%D7%A4%D7%A8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kb-text-link"
                >
                  נדבר על הזמנה קבוצתית{" "}
                  <ArrowLeft size={18} aria-hidden="true" />
                </a>
              </div>
            </div>
          </section>
          <section
            id="kb-faq"
            className="kb-faq kb-wrap"
            aria-labelledby="kb-faq-title"
          >
            <p className="kb-kicker">לפני שמזמינים</p>
            <h2 id="kb-faq-title">שאלות על הספר וההזמנה</h2>
            {[
              [
                "האם זה ספר הלכה או מדריך להנחת תפילין?",
                "זהו ספר סיפורים. הוא מביא את האנשים, המפגשים וההחלטות שמאחורי הנחת התפילין. הוא אינו תחליף למדריך הלכתי.",
              ],
              [
                "הסיפורים מבוססים על אנשים אמיתיים?",
                "הסיפורים מבוססים על סיפורים שהגיעו לעמיחי במסגרת המיזם ונכתבו לספר. חלק מהשמות והפרטים המזהים שונו כדי לשמור על פרטיות המספרים.",
              ],
              [
                "אפשר לתת את הספר לנער בר מצווה?",
                "אפשר לשלב אותו במתנה ולבחור סיפורים לקריאה משותפת. מומלץ שהורה או מחנך יעיינו קודם, משום שבחלק מהסיפורים יש תיאורי מלחמה והתמודדויות שאינם מתאימים לכל גיל.",
              ],
              [
                "איך מקבלים הקדשה אישית?",
                "הקדשה אישית מעמיחי כלולה במארז של שני עותקים או שלושה עותקים. כשמתאמים את ההזמנה, מציינים למי ההקדשה מיועדת.",
              ],
              [
                "איפה אוספים את הספר?",
                "האיסוף העצמי הוא מארץ חמדה 33, בית אל, בתיאום עם עמיחי. אין תוספת תשלום לאיסוף. בשלב זה זו נקודת האיסוף המאושרת.",
              ],
              [
                "כמה עולה המשלוח ומתי הוא מגיע?",
                "משלוח עד הבית עולה 40 ש״ח עבור עד חמישה ספרים, בנוסף למחיר הספרים. זמן האספקה הוא עד שמונה ימי עסקים. להזמנה גדולה יותר מתאמים מראש את אופן המשלוח והעלות.",
              ],
              [
                "אפשר להזמין כמות לכיתה או לעובדים?",
                "כן. שלחו לעמיחי את מספר העותקים, המועד שבו אתם צריכים אותם והאם תרצו הקדשות. המחיר ותנאי האספקה להזמנה קבוצתית ייקבעו בתיאום אישי.",
              ],
              [
                "אפשר לשלם כבר בעמוד?",
                "מערכת התשלום עבור הספר עדיין אינה מחוברת. בחירת המארז והמשלוח בעמוד מציגה את הסכום, והכפתור פותח פנייה לעמיחי בוואטסאפ. בחירה בעמוד אינה הזמנה מאושרת או חיוב.",
              ],
            ].map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </section>
          <section
            id="kb-cancellation"
            className="kb-faq kb-wrap"
            aria-labelledby="kb-cancel-title"
          >
            <h2 id="kb-cancel-title">ביטול והחזרת הזמנה</h2>
            <details>
              <summary>
                מדיניות ביטול עסקת מכר מרחוק <span aria-hidden="true">+</span>
              </summary>
              <p>
                בכפוף להוראות חוק הגנת הצרכן, ניתן לבטל רכישת מוצר בתוך 14 ימים
                מקבלתו או מקבלת מסמך פרטי העסקה, לפי המאוחר. הודעת ביטול אפשר
                למסור בטלפון 054-6713966, בוואטסאפ או בדואר לכתובת ארץ חמדה 33,
                בית אל, בציון שם ופרטי ההזמנה.
              </p>
              <p>
                בביטול שלא עקב פגם, אי־התאמה, איחור באספקה או הפרה אחרת, ניתן
                לגבות דמי ביטול של 5% ממחיר העסקה או 100 ש״ח, לפי הנמוך. הצרכן
                יחזיר את המוצר לעוסק על חשבונו. בביטול עקב אחת העילות האמורות לא
                ייגבו דמי ביטול, והמוצר יועמד לרשות העוסק במקום שבו נמסר. ההחזר
                וביטול החיוב יבוצעו בתוך 14 ימים מקבלת הודעת הביטול.
              </p>
              <p>
                לאזרח ותיק, עולה חדש או אדם עם מוגבלות עשויה לעמוד זכות ביטול
                בתוך ארבעה חודשים, כאשר ההתקשרות כללה שיחה עם העוסק, לרבות
                בתקשורת אלקטרונית, ובהתאם לתנאי החוק. חלים החריגים והסייגים
                הקבועים בדין; אין באמור כדי לגרוע מזכויות הצרכן על פי חוק.
              </p>
              <a
                className="kb-text-link"
                href="https://www.consumers.org.il/category/click-guide"
                target="_blank"
                rel="noopener noreferrer"
              >
                מידע נוסף במועצה הישראלית לצרכנות ↗
              </a>
            </details>
          </section>
        </main>
        <div className="kb-mobile-bar">
          <div>
            <span>
              {bundle.title} · {total} ₪
            </span>
            <small>
              {shippingIncluded
                ? "כולל משלוח עד הבית · הקדשה אישית מעמיחי"
                : "איסוף עצמי ללא עלות · משלוח עד הבית 40 ₪"}
            </small>
          </div>
          <a className="kb-button" href="#kb-order">
            להזמנה <ArrowLeft size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
