import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Check,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { SITE_URL } from "@/lib/site";
import { track } from "@/lib/analytics";
import campaignCss from "@/book-order.css?url";

export const Route = createFileRoute("/book-order")({
  head: () => ({
    meta: [
      { title: "קשר של תפילין — בחירת מארז והזמנה" },
      {
        name: "description",
        content:
          "23 סיפורים מהחיים על הנחת תפילין והתחלה של קשר. בחרו מארז והמשיכו לתשלום מאובטח.",
      },
      { name: "robots", content: "noindex, nofollow" },
      {
        property: "og:title",
        content: "קשר של תפילין — הספר של הרב עמיחי איל",
      },
      { property: "og:image", content: `${SITE_URL}/book/kesher-cover.jpeg` },
      { property: "og:url", content: `${SITE_URL}/book-order` },
    ],
    links: [
      { rel: "stylesheet", href: campaignCss },
      { rel: "canonical", href: `${SITE_URL}/book-order` },
    ],
  }),
  component: BookOrderPage,
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
    detail: "משלוח עד הבית כלול",
    badge: "הבחירה המשתלמת",
  },
  {
    quantity: 3,
    title: "שלושה עותקים",
    price: 199,
    detail: "משלוח עד הבית כלול",
  },
];

const purchaseLinks: Record<number, string> = {
  1: "https://pay.grow.link/MTA1NDQ5~49262f78c08b742d6ad21b74b49de3e5-Mzk4OTY3OA",
  2: "https://pay.grow.link/MTA1NDQ5~ec72d87f8af24e604ef10150073d2b54-Mzk4OTcwNw",
  3: "https://pay.grow.link/MTA1NDQ5~a1922e39c4975492fad2f1321d3c42ee-Mzk5MDI4NA",
};

function BookOrderPage() {
  const [quantity, setQuantity] = useState(2);
  const [delivery, setDelivery] = useState<"pickup" | "shipping">("pickup");
  const bundle = bundles.find((item) => item.quantity === quantity)!;
  const shippingIncluded = quantity > 1;
  const total =
    bundle.price + (!shippingIncluded && delivery === "shipping" ? 40 : 0);
  const purchaseUrl = purchaseLinks[quantity] ?? purchaseLinks[1]!;

  const trackCheckout = () => {
    track("begin_checkout", {
      currency: "ILS",
      value: total,
      items: [{ item_name: "קשר של תפילין", quantity, price: bundle.price }],
      page_type: "book_campaign",
    });
  };

  return (
    <div className="ko" dir="rtl">
      <a className="ko-skip" href="#ko-content">
        דילוג לתוכן
      </a>
      <header className="ko-header" aria-label="קשר של תפילין">
        <img
          src="/wp/img/לוגו-קשר-של-תפילין-01.svg"
          alt="קשר של תפילין"
          width="100"
          height="100"
        />
        <div>
          <ShieldCheck size={18} aria-hidden="true" /> תשלום מאובטח
        </div>
      </header>

      <main id="ko-content">
        <section className="ko-hero ko-wrap" aria-labelledby="ko-title">
          <div className="ko-hero-copy">
            <p className="ko-eyebrow">הספר של הרב עמיחי איל</p>
            <h1 id="ko-title">
              23 סיפורים מהחיים על הנחת תפילין והתחלה של קשר
            </h1>
            <p className="ko-lead">
              אנשים שלא תכננו להתחיל להניח תפילין — עד שרגע אחד, שיחה אחת או
              הבטחה אחת שינו את הכיוון.
            </p>
            <ul className="ko-checks" aria-label="פרטי הספר">
              <li>
                <Check size={18} aria-hidden="true" /> 23 סיפורים המבוססים על
                אנשים אמיתיים
              </li>
              <li>
                <Check size={18} aria-hidden="true" /> 184 עמודים · כריכה רכה ·
                עברית
              </li>
              <li>
                <Check size={18} aria-hidden="true" /> משלוח עד הבית כלול משני
                עותקים
              </li>
            </ul>
            <div className="ko-hero-price">
              <strong>78 ₪</strong>
              <span>לעותק אחד</span>
            </div>
            <a className="ko-button" href="#ko-order">
              לבחירת מארז ולהזמנה <ArrowLeft size={19} aria-hidden="true" />
            </a>
          </div>
          <figure className="ko-cover">
            <div className="ko-cover-glow" aria-hidden="true" />
            <img
              src="/book/kesher-cover.jpeg"
              alt="כריכת הספר קשר של תפילין"
              width="1021"
              height="1600"
              fetchPriority="high"
            />
            <figcaption>כתיבה: שמעון חי בן־שחר והרב עמיחי איל</figcaption>
          </figure>
        </section>

        <div className="ko-proof">
          <div className="ko-wrap">
            <span>
              <strong>23</strong> סיפורים
            </span>
            <span>
              <strong>184</strong> עמודים
            </span>
            <span>
              <strong>8</strong> ימי עסקים לכל היותר
            </span>
          </div>
        </div>

        <section
          className="ko-section ko-wrap ko-reveal"
          aria-labelledby="ko-fit-title"
        >
          <p className="ko-eyebrow">הספר הזה יכול לפגוש אתכם בכמה מקומות</p>
          <h2 id="ko-fit-title">למי הוא מתאים?</h2>
          <div className="ko-fit-grid">
            <article>
              <span>01</span>
              <h3>למי שאוהב סיפורים אמיתיים</h3>
              <p>כל פרק מביא אדם אחר ואת הרגע שבו הנחת התפילין נכנסה לחייו.</p>
            </article>
            <article>
              <span>02</span>
              <h3>למי שמתחיל או חוזר</h3>
              <p>הסיפורים נותנים מקום להחלטה, למשפחה, לחששות ולשגרה החדשה.</p>
            </article>
            <article>
              <span>03</span>
              <h3>כמתנה שיש בה תוכן</h3>
              <p>לבר מצווה, לאדם קרוב או לקריאה משותפת שפותחת שיחה.</p>
            </article>
          </div>
        </section>

        <section
          className="ko-stories ko-reveal"
          aria-labelledby="ko-stories-title"
        >
          <div className="ko-wrap">
            <div className="ko-section-head">
              <p className="ko-eyebrow">שניים מתוך 23 הסיפורים</p>
              <h2 id="ko-stories-title">אלה האנשים שתפגשו בין העמודים</h2>
            </div>
            <div className="ko-story-grid">
              <article>
                <BookOpen size={25} aria-hidden="true" />
                <p className="ko-story-name">״לא השאיר לי ברירה״</p>
                <h3>ההבטחה שנעם לקח איתו מהנובה</h3>
                <p>
                  ברגעי הסכנה נעם הבטיח שאם יֵצא בחיים, יתחיל להניח תפילין. הוא
                  ניצל, וההבטחה נשארה איתו גם כשחזר לשגרה.
                </p>
              </article>
              <article>
                <BookOpen size={25} aria-hidden="true" />
                <p className="ko-story-name">״יותר טוב מאספרסו״</p>
                <h3>ההחלטה להתחיל להניח תפילין בברלין</h3>
                <p>
                  ישראלי שחי בברלין מכניס את הנחת התפילין לבוקר שלו ומנסה לשמור
                  גם על הבחירה שלו וגם על הקִרבה לאביו.
                </p>
              </article>
            </div>
            <p className="ko-privacy">
              חלק מהשמות והפרטים המזהים שונו כדי לשמור על פרטיות המספרים.
            </p>
          </div>
        </section>

        <section
          className="ko-author ko-wrap ko-reveal"
          aria-labelledby="ko-author-title"
        >
          <img
            src="/wp/img/עמיחי-פרופיל-ערוך-min.webp"
            alt="הרב עמיחי איל"
            width="932"
            height="1400"
            loading="lazy"
          />
          <div>
            <p className="ko-eyebrow">האיש ששמע את הסיפורים</p>
            <h2 id="ko-author-title">הרב עמיחי איל</h2>
            <p>
              מייסד ומנהל מיזם ״קשר של תפילין״. לאורך השנים הוא שמע מאות סיפורים
              מאנשים שהתחילו להניח תפילין; 23 מהם עובדו ונכתבו לספר.
            </p>
            <p className="ko-note">
              הספר כולל סיפורי מלחמה, אובדן והתמודדויות משפחתיות. לקוראים צעירים
              מומלץ לבחור מראש את הסיפורים המתאימים.
            </p>
          </div>
        </section>

        <section
          id="ko-order"
          className="ko-order"
          aria-labelledby="ko-order-title"
        >
          <div className="ko-wrap">
            <div className="ko-section-head">
              <p className="ko-eyebrow">הזמנה ישירה</p>
              <h2 id="ko-order-title">בחרו את המארז שלכם</h2>
              <p>שני עותקים ומעלה נשלחים עד הבית ללא תוספת תשלום.</p>
            </div>
            <fieldset className="ko-bundles">
              <legend className="ko-sr-only">בחירת מספר עותקים</legend>
              {bundles.map((item) => (
                <label
                  className={`ko-bundle ${quantity === item.quantity ? "is-selected" : ""}`}
                  key={item.quantity}
                >
                  {item.badge && <span className="ko-badge">{item.badge}</span>}
                  <input
                    type="radio"
                    name="campaign-book-quantity"
                    value={item.quantity}
                    checked={quantity === item.quantity}
                    onChange={() => setQuantity(item.quantity)}
                  />
                  <span className="ko-radio" aria-hidden="true">
                    {quantity === item.quantity && <Check size={14} />}
                  </span>
                  <h3>{item.title}</h3>
                  <strong>
                    {item.price}
                    <small> ₪</small>
                  </strong>
                  <p>{item.detail}</p>
                  {item.quantity > 1 && (
                    <small>
                      {(item.price / item.quantity).toFixed(1)} ₪ לעותק
                    </small>
                  )}
                </label>
              ))}
            </fieldset>

            {quantity === 1 && (
              <fieldset className="ko-delivery">
                <legend>איך תרצו לקבל את הספר?</legend>
                <label>
                  <input
                    type="radio"
                    name="campaign-delivery"
                    checked={delivery === "pickup"}
                    onChange={() => setDelivery("pickup")}
                  />{" "}
                  איסוף עצמי מבית אל · ללא עלות
                </label>
                <label>
                  <input
                    type="radio"
                    name="campaign-delivery"
                    checked={delivery === "shipping"}
                    onChange={() => setDelivery("shipping")}
                  />{" "}
                  משלוח עד הבית · 40 ₪
                </label>
              </fieldset>
            )}

            <div className="ko-checkout">
              <div>
                <span>סה״כ לתשלום</span>
                <strong>{total} ₪</strong>
                <small>
                  {shippingIncluded
                    ? "משלוח עד הבית כלול"
                    : delivery === "shipping"
                      ? "כולל משלוח עד הבית"
                      : "איסוף עצמי בתיאום מראש"}
                </small>
              </div>
              <a
                className="ko-button"
                href={purchaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={trackCheckout}
              >
                להמשך לתשלום מאובטח <ArrowLeft size={19} aria-hidden="true" />
              </a>
            </div>
            <ul className="ko-order-assurance">
              <li>
                <ShieldCheck size={19} aria-hidden="true" /> תשלום מאובטח
              </li>
              <li>
                <Truck size={19} aria-hidden="true" /> אספקה עד 8 ימי עסקים
              </li>
              <li>
                <PackageCheck size={19} aria-hidden="true" /> ביטול לפי חוק הגנת
                הצרכן
              </li>
            </ul>
          </div>
        </section>

        <section
          className="ko-faq ko-wrap ko-reveal"
          aria-labelledby="ko-faq-title"
        >
          <p className="ko-eyebrow">לפני שמזמינים</p>
          <h2 id="ko-faq-title">כמה תשובות קצרות</h2>
          <details>
            <summary>
              האם זה ספר הלכה או מדריך להנחת תפילין?
              <span aria-hidden="true">+</span>
            </summary>
            <p>
              זהו ספר סיפורים על האנשים, המפגשים וההחלטות שמאחורי הנחת התפילין.
              הוא אינו מדריך הלכתי.
            </p>
          </details>
          <details>
            <summary>
              הסיפורים מבוססים על אנשים אמיתיים?
              <span aria-hidden="true">+</span>
            </summary>
            <p>
              כן. הסיפורים הגיעו לרב עמיחי במסגרת המיזם ונכתבו לספר. חלק מהשמות
              והפרטים המזהים שונו לשמירת הפרטיות.
            </p>
          </details>
          <details>
            <summary>
              אפשר לבקש הקדשה אישית?<span aria-hidden="true">+</span>
            </summary>
            <p>
              לאחר ההזמנה אפשר לפנות בוואטסאפ ולבדוק אפשרות להקדשה אישית מהרב
              עמיחי.
            </p>
          </details>
          <details>
            <summary>
              מהי מדיניות הביטול?<span aria-hidden="true">+</span>
            </summary>
            <p>
              בכפוף לחוק הגנת הצרכן, ניתן לבטל בתוך 14 ימים מקבלת הספר או מסמך
              פרטי העסקה, לפי המאוחר. הודעת ביטול אפשר למסור בטלפון 054-6713966
              או בוואטסאפ.
            </p>
          </details>
        </section>

        <section
          className="ko-final ko-reveal"
          aria-labelledby="ko-final-title"
        >
          <div className="ko-wrap">
            <img
              src="/book/kesher-cover.jpeg"
              alt="כריכת קשר של תפילין"
              width="1021"
              height="1600"
              loading="lazy"
            />
            <div>
              <p className="ko-eyebrow">23 אנשים. 23 התחלות.</p>
              <h2 id="ko-final-title">בחרו את המארז שמתאים לכם</h2>
              <p>
                הספר מחכה לכם — לקריאה אישית, למתנה או לשיחה שמתחילה מסיפור אחד.
              </p>
              <a className="ko-button" href="#ko-order">
                לבחירת מארז <ArrowLeft size={19} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="ko-footer">
        <span>עמותת אור חדש (ע״ר 580703965)</span>
        <span>שירות והזמנות: 054-6713966</span>
      </footer>

      <div className="ko-mobile-bar">
        <div>
          <strong>
            {bundle.title} · {total} ₪
          </strong>
          <small>
            {shippingIncluded
              ? "המשלוח כלול"
              : delivery === "shipping"
                ? "כולל משלוח"
                : "איסוף עצמי"}
          </small>
        </div>
        <a className="ko-button" href="#ko-order">
          להזמנה <ArrowLeft size={16} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
