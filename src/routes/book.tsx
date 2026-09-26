import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, BookOpen, Check, MapPin, Truck } from "lucide-react";
import { SITE_URL } from "@/lib/site";
import { Header } from "@/components/home/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { track } from "@/lib/analytics";
import bookCss from "@/book.css?url";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "קשר של תפילין — הספר של הרב עמיחי איל" },
      {
        name: "description",
        content:
          "23 סיפורים מהחיים על הנחת תפילין והתחלה של קשר. הכירו את הספר של הרב עמיחי איל וקראו קטע מתוכו.",
      },
      { name: "robots", content: "index, follow" },
      {
        property: "og:title",
        content: "קשר של תפילין — הספר של הרב עמיחי איל",
      },
      {
        property: "og:description",
        content: "23 סיפורים מהחיים על הנחת תפילין והתחלה של קשר.",
      },
      { property: "og:image", content: `${SITE_URL}/book/kesher-cover.jpeg` },
      { property: "og:image:width", content: "1021" },
      { property: "og:image:height", content: "1600" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:url", content: `${SITE_URL}/book` },
      { name: "twitter:image", content: `${SITE_URL}/book/kesher-cover.jpeg` },
    ],
    links: [
      { rel: "stylesheet", href: bookCss },
      { rel: "canonical", href: `${SITE_URL}/book` },
    ],
  }),
  component: BookPage,
});

const bundles = [
  {
    quantity: 1,
    title: "עותק אחד",
    price: 78,
    detail: "איסוף עצמי ללא עלות, או משלוח ב־40 ₪",
  },
  {
    quantity: 2,
    title: "שני עותקים",
    price: 143,
    detail: "איסוף עצמי ללא עלות, או משלוח ב־20 ₪",
  },
  {
    quantity: 3,
    title: "שלושה עותקים",
    price: 199,
    detail: "משלוח עד הבית כלול",
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

export function BookPage() {
  const [quantity, setQuantity] = useState(2);
  const [delivery, setDelivery] = useState<"pickup" | "shipping">("pickup");
  const bundle = bundles.find((item) => item.quantity === quantity)!;
  const shippingIncluded = quantity === 3;
  const shippingPrice = quantity === 1 ? 40 : quantity === 2 ? 20 : 0;
  const total =
    bundle.price + (delivery === "shipping" ? shippingPrice : 0);
  // קישורי רכישה אמיתיים לפי המארז — זהים לאזור הרכישה בעמוד הבית.
  const purchaseLinks: Record<number, string> = {
    1: "https://pay.grow.link/MTA1NDQ5~49262f78c08b742d6ad21b74b49de3e5-Mzk4OTY3OA",
    2: "https://pay.grow.link/MTA1NDQ5~ec72d87f8af24e604ef10150073d2b54-Mzk4OTcwNw",
    3: "https://pay.grow.link/MTA1NDQ5~a1922e39c4975492fad2f1321d3c42ee-Mzk5MDI4NA",
  };
  const purchaseUrl = purchaseLinks[quantity] ?? purchaseLinks[1]!;

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
                  { "@type": "Person", name: "הרב עמיחי איל" },
                  { "@type": "Person", name: "שמעון חי בן־שחר" },
                ],
                inLanguage: "he",
                numberOfPages: 184,
                bookFormat: "https://schema.org/Paperback",
                description: "23 סיפורים מהחיים על הנחת תפילין והתחלה של קשר.",
                image: `${SITE_URL}/book/kesher-cover.jpeg`,
                url: `${SITE_URL}/book`,
              }),
            }}
          />
          <div className="kb-opening">
            <section className="kb-hero kb-wrap" aria-labelledby="kb-title">
              <div className="kb-hero-copy">
                <p className="kb-kicker">
                  ״קשר של תפילין״ · הספר של הרב עמיחי איל
                </p>
                <h1 id="kb-title">
                  23 סיפורים מהחיים על הנחת תפילין והתחלה של קשר
                </h1>
                <p className="kb-subtitle">
                  הספר מביא את האנשים, השאלות והמפגשים שמאחורי ההחלטה להתחיל להניח תפילין — בבית, בצבא, במהלך טיול או בתוך שינוי משפחתי.
                </p>
                <div className="kb-hero-price">
                  <strong>78 ₪</strong>
                  <span>לעותק · מארז 2 עותקים ב־143 ₪, משלוח בתוספת 20 ₪</span>
                </div>
                <div className="kb-actions">
                  <a href="#kb-order" className="kb-button">
                    לבחירת מארז ולהזמנה <ArrowLeft size={19} aria-hidden="true" />
                  </a>
                  <a href="#kb-sample" className="kb-text-link">
                    <BookOpen size={19} aria-hidden="true" /> רוצים להכיר את הספר? קראו קטע מתוכו
                  </a>
                </div>
                <details className="kb-hero-intro-disclosure">
                  <summary>
                    מה תמצאו בספר? <span aria-hidden="true">+</span>
                  </summary>
                  <p>
                    ״קשר של תפילין״ מביא 23 סיפורים על אנשים שהחליטו להתחיל להניח תפילין ועל הנסיבות שהובילו אותם לכך. בין הסיפורים תמצאו הבטחה שניתנה ברגע של סכנה, התחלה חדשה הרחק מהארץ ושיחות על אמונה בתוך המשפחה.
                  </p>
                </details>
                <p className="kb-scroll-cue">
                  גלול למטה לקריאת סיפור מיוחד מתוך הספר ולבחירת המארז שלך 👇
                </p>
                <details className="kb-orderinfo-disclosure">
                  <summary>
                    פרטי משלוח, איסוף וביטול <span aria-hidden="true">+</span>
                  </summary>
                  <ul className="kb-orderinfo">
                    <li>
                      <Truck size={18} aria-hidden="true" />
                      <span>
                        <strong>משלוח עד הבית · עד 8 ימי עסקים</strong>
                        40 ₪ לעותק אחד, 20 ₪ לזוג, כלול במחיר השלישייה
                      </span>
                    </li>
                    <li>
                      <MapPin size={18} aria-hidden="true" />
                      <span>
                        <strong>איסוף עצמי · ללא עלות</strong>
                        ארץ חמדה 33, בית אל — בתיאום מראש
                      </span>
                    </li>
                    <li>
                      <Check size={18} aria-hidden="true" />
                      <span>
                        <strong>ביטול עד 14 יום</strong>
                        מקבלת הספר, לפי חוק הגנת הצרכן
                      </span>
                    </li>
                  </ul>
                </details>
              </div>
              <figure className="kb-cover">
                <div className="kb-cover-frame">
                  <img
                    src="/book/kesher-cover.jpeg"
                    alt="כריכת הספר קשר של תפילין מאת הרב עמיחי איל"
                    width="1021"
                    height="1600"
                    fetchPriority="high"
                  />
                </div>
              </figure>
            </section>
            <dl className="kb-trustbar kb-wrap">
              <div>
                <dt>סיפורים בספר</dt>
                <dd>23</dd>
              </div>
              <div>
                <dt>עמודים</dt>
                <dd>184</dd>
              </div>
              <div>
                <dt>כריכה רכה · עברית</dt>
                <dd>מהדורה ראשונה</dd>
              </div>
            </dl>
          </div>
          <section
            id="kb-audience"
            className="kb-audience kb-wrap"
            aria-labelledby="kb-audience-title"
          >
            <p className="kb-kicker">לפני שבוחרים עותק</p>
            <h2 id="kb-audience-title">למי הספר מתאים?</h2>
            <p className="kb-section-lead">
              הספר נכתב לקוראים שרוצים לפגוש את מצוות התפילין דרך האנשים שבחרו
              להכניס אותה לחייהם, בלי צורך בידע מוקדם.
            </p>
            <div className="kb-audience-grid">
              <article>
                <span>לקריאה אישית</span>
                <h3>למי שאוהב סיפורים אמיתיים</h3>
                <p>
                  כל פרק מביא אדם אחר, נסיבות אחרות והשאלות שעלו בדרך להנחת
                  תפילין. אפשר לקרוא סיפור אחד בכל פעם או להמשיך ברצף.
                </p>
              </article>
              <article>
                <span>לתחילתו של קשר</span>
                <h3>למי שמתחיל להניח תפילין או חוזר אליהן</h3>
                <p>
                  הסיפורים נותנים מקום גם להחלטה עצמה וגם למה שמסביבה: המשפחה,
                  השגרה, החששות והשיחות שמלוות את השינוי.
                </p>
              </article>
              <article>
                <span>כמתנה או לקריאה משותפת</span>
                <h3>להורים, למחנכים ולאדם קרוב</h3>
                <p>
                  אפשר לתת את הספר לקראת בר מצווה, לקרוא ממנו יחד או להשתמש
                  בסיפור כפתיחה לשיחה. חלק מהסיפורים עוסקים במלחמה ובאובדן, ולכן
                  כדאי לבחור מראש מה מתאים לקוראים צעירים.
                </p>
              </article>
            </div>
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
            <details className="kb-sample-disclosure">
              <summary>
                לקריאת הקטע מתוך הספר <span aria-hidden="true">+</span>
              </summary>
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
            </details>
          </section>
          <section
            id="kb-order"
            className="kb-order"
            aria-labelledby="kb-order-title"
          >
            <div className="kb-wrap">
              <div className="kb-section-heading">
                <p className="kb-kicker">לרגל הוצאת הספר</p>
                <h2 id="kb-order-title">בחרו כמה עותקים להזמין</h2>
                <p>
                  משלוח ב־40 ₪ לעותק אחד, ב־20 ₪ לזוג וכלול במחיר השלישייה.
                </p>
              </div>
              <fieldset className="kb-bundles">
                <legend className="kb-sr-only">בחירת מספר עותקים</legend>
                {bundles.map((item) => (
                  <label
                    className={`kb-bundle ${item.quantity === 2 ? "kb-bundle-recommended" : ""} ${quantity === item.quantity ? "is-selected" : ""}`}
                    key={item.quantity}
                  >
                    <input
                      type="radio"
                      name="book-quantity"
                      value={item.quantity}
                      checked={quantity === item.quantity}
                      onChange={() => setQuantity(item.quantity)}
                    />
                    {item.quantity === 2 && (
                      <span className="kb-bundle-badge">הבחירה המומלצת</span>
                    )}
                    <div className="kb-bundle-top">
                      <h3>{item.title}</h3>
                      <span className="kb-radio" aria-hidden="true">
                        {quantity === item.quantity && <Check size={14} />}
                      </span>
                    </div>
                    <strong>
                      {item.price + (delivery === "shipping" ? item.quantity === 1 ? 40 : item.quantity === 2 ? 20 : 0 : 0)}
                      <small> ₪</small>
                    </strong>
                    <p>{delivery === "shipping" ? "מחיר סופי כולל משלוח עד הבית" : "מחיר סופי באיסוף עצמי"}</p>
                    <p>{item.quantity === 3 ? "משלוח עד הבית כלול במחיר" : `משלוח עד הבית: ${item.quantity === 1 ? 40 : 20} ₪`}</p>
                    {item.quantity === 2 && (
                      <div className="kb-bundle-saving">
                        <span><s>{156 + (delivery === "shipping" ? 20 : 0)} ₪</s> <b>חוסכים 13 ₪ על הספרים</b></span>
                        <small>בהשוואה ל־2 עותקים במחיר יחיד של 78 ₪{delivery === "shipping" ? ", בתוספת אותם דמי משלוח (20 ₪)" : ""}.</small>
                      </div>
                    )}
                    <p className="kb-unit-price">
                      {unitPriceLabel(item.price, item.quantity)}
                    </p>
                  </label>
                ))}
              </fieldset>
              <div className="kb-order-bottom">
                <div className="kb-delivery">
                    <fieldset>
                      <legend>חישוב מחיר לפי אופן קבלת הספר</legend>
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
                          {shippingIncluded ? "כלול במחיר" : `${shippingPrice} ₪`}
                        </label>
                      </div>
                      <p className="kb-delivery-detail" aria-live="polite">
                        {delivery === "pickup"
                          ? "איסוף עצמי: ארץ חמדה 33, בית אל, בתיאום מראש."
                          : "משלוח עד הבית: עד 8 ימי עסקים."}
                      </p>
                    </fieldset>
                </div>
                <div className="kb-total">
                  <div aria-live="polite">
                    <span>
                      סה״כ
                      {delivery === "shipping"
                        ? ", כולל משלוח"
                        : ""}
                    </span>
                    <strong>{total} ₪</strong>
                  </div>
                  <p>
                    במסך התשלום בוחרים משלוח או איסוף עצמי וממלאים את פרטי ההזמנה.
                  </p>
                  <a
                    href={purchaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="kb-button"
                    onClick={() =>
                      track("begin_checkout", {
                        currency: "ILS",
                        value: total,
                        page_type: "book_organic",
                        delivery,
                        items: [
                          {
                            item_name: "קשר של תפילין",
                            quantity,
                            price: bundle.price,
                          },
                        ],
                      })
                    }
                  >
                    להזמנת הספר <ArrowLeft size={18} aria-hidden="true" />
                  </a>
                  <p className="kb-dedication-note">
                    רוצים הקדשה אישית מהרב עמיחי? אפשר לפנות בוואטסאפ לאחר ההזמנה ולבדוק אפשרות להקדשה.
                  </p>
                </div>
              </div>
              <div className="kb-group">
                <div>
                  <h3>מזמינים לכיתה, לצוות או לאירוע?</h3>
                  <p>
                    שלחו לנו את מספר העותקים ואת התאריך שבו תרצו לקבל אותם, ונבדוק יחד את המחיר ואת אפשרויות האספקה.
                  </p>
                </div>
                <a
                  href="https://wa.me/972546713966?text=%D7%A9%D7%9C%D7%95%D7%9D%20%D7%A2%D7%9E%D7%99%D7%97%D7%99%2C%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%91%D7%A8%D7%A8%20%D7%A2%D7%9C%20%D7%94%D7%96%D7%9E%D7%A0%D7%94%20%D7%A7%D7%91%D7%95%D7%A6%D7%AA%D7%99%D7%AA%20%D7%A9%D7%9C%20%D7%94%D7%A1%D7%A4%D7%A8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kb-text-link"
                >
                  לבירור הזמנה קבוצתית בוואטסאפ{" "}
                  <ArrowLeft size={18} aria-hidden="true" />
                </a>
              </div>
            </div>
          </section>
          <nav className="kb-page-nav kb-wrap" aria-label="תוכן העניינים בעמוד">
            <strong>בעמוד הזה</strong>
            <a href="#kb-sample">קטע לקריאה</a>
            <a href="#kb-order">מחיר והזמנה</a>
            <a href="#kb-contents">פרטי הספר</a>
            <a href="#kb-author">על הרב עמיחי</a>
            <a href="#kb-trust">ברכות הרבנים</a>
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
                <h2 id="kb-contents-title">פרטי הספר</h2>
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
                  <dd>שמעון חי בן־שחר והרב עמיחי איל</dd>
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
              <h2 id="kb-author-title">נעים להכיר, הרב עמיחי איל</h2>
              <p>
                הרב עמיחי איל, תושב בית אל, הקים ומנהל את מיזם ״קשר של תפילין״,
                עסק בהוראה בישיבות ובניהול ארגון ״נהורא״. לאורך השנים הוא שמע
                מאות סיפורים מאנשים שהתחילו להניח תפילין.
              </p>
              <p>
                23 מהם מגיעים עכשיו לספר — כולל סיפורי מלחמה, אובדן והתמודדויות
                משפחתיות.
              </p>
              <a
                className="kb-text-link"
                href="https://www.youtube.com/watch?v=aQYiyBfycrc"
                target="_blank"
                rel="noopener noreferrer"
              >
                לראיון עם הרב עמיחי על המיזם בערוץ 7 ↗
              </a>
              <p className="kb-small">כתיבה: שמעון חי בן־שחר והרב עמיחי איל</p>
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
                  הראיון עם הרב עמיחי בערוץ 7 ↗
                </a>
                <a href="/in-news">
                  כתבות על המיזם בתקשורת{" "}
                  <ArrowLeft size={15} aria-hidden="true" />
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
                "הסיפורים מבוססים על סיפורים שהגיעו להרב עמיחי במסגרת המיזם ונכתבו לספר. חלק מהשמות והפרטים המזהים שונו כדי לשמור על פרטיות המספרים.",
              ],
              [
                "האם הספר מתאים לנער בר מצווה?",
                "בוודאי. זו מתנה נהדרת לבר מצווה — סיפורים אמיתיים על אנשים שהתחילו להניח תפילין. מומלץ לקרוא את הספר יחד, או שהורה או מחנך יעיינו בו קודם ויבחרו סיפורים לקריאה משותפת, כי בחלק מהסיפורים יש תיאורי מלחמה והתמודדויות שמתאימים יותר לגיל מבוגר.",
              ],
              [
                "איפה אוספים את הספר?",
                "האיסוף העצמי הוא מארץ חמדה 33, בית אל, בתיאום מראש. אין תוספת תשלום לאיסוף. בשלב זה זו נקודת האיסוף המאושרת.",
              ],
              [
                "כמה עולה המשלוח ומתי הוא מגיע?",
                "משלוח עד הבית עולה 40 ₪ לעותק אחד ו־20 ₪ לזוג עותקים. במארז של שלושה עותקים המשלוח כלול במחיר. זמן האספקה הוא עד שמונה ימי עסקים. איסוף עצמי מבית אל הוא ללא תוספת תשלום. את אופן הקבלה בוחרים במסך התשלום. להזמנה גדולה יותר מתאמים מראש את אופן המשלוח והעלות.",
              ],
              [
                "אפשר להזמין כמות לכיתה או לעובדים?",
                "כן. שלחו להרב עמיחי את מספר העותקים והמועד שבו אתם צריכים אותם. המחיר ותנאי האספקה להזמנה קבוצתית ייקבעו בתיאום אישי.",
              ],
              [
                "אפשר לשלם כבר בעמוד?",
                "כן. כפתור הרכישה פותח מסך תשלום מאובטח לפי המארז שבחרתם, והספר נשלח לכתובת שתמלאו — אין צורך בשיחה נוספת.",
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
              {delivery === "shipping"
                ? "כולל משלוח עד הבית"
                : "איסוף עצמי ללא עלות"}
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
