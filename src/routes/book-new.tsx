import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, BookOpen, Check, MapPin, Truck } from "lucide-react";
import { SITE_URL } from "@/lib/site";
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
  { quantity: 1, title: "עותק אחד", price: 78, detail: "לעצמכם או למתנה" },
  {
    quantity: 2,
    title: "שני עותקים",
    price: 140,
    detail: "כולל הקדשה אישית מעמיחי",
  },
  {
    quantity: 3,
    title: "שלושה עותקים",
    price: 190,
    detail: "כולל הקדשה אישית מעמיחי",
  },
];
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
  const total = bundle.price + (delivery === "shipping" ? 40 : 0);
  const message = `שלום עמיחי, אשמח לברר על הזמנת ${quantity} עותקים מהספר קשר של תפילין, ב${delivery === "pickup" ? "איסוף עצמי" : "משלוח עד הבית"}. הסכום שמוצג בעמוד: ${total} ש״ח.`;

  return (
    <div className="kb" dir="rtl">
      <a className="kb-skip" href="#content">
        דילוג לתוכן
      </a>
      <header className="kb-top kb-wrap">
        <a href="#content" className="kb-wordmark">
          קשר של תפילין <span>הספר של עמיחי איל</span>
        </a>
        <a className="kb-top-link" href="#kb-order">
          מחירים והזמנה <ArrowLeft size={16} aria-hidden="true" />
        </a>
      </header>
      <main id="content">
        <section className="kb-hero kb-wrap" aria-labelledby="kb-title">
          <div className="kb-hero-copy">
            <p className="kb-kicker">23 סיפורים מהחיים · עמיחי איל</p>
            <h1 id="kb-title">
              קשר של <br />
              <span>תפילין</span>
            </h1>
            <p className="kb-subtitle">
              סיפורים מהחיים על הנחת תפילין <br />
              והתחלה של קשר
            </p>
            <p className="kb-intro">
              מה מביא אדם להתחיל להניח תפילין? עמיחי איל שאל את האנשים שפנו אליו
              לקבל זוג. בספר הזה הוא מביא את הסיפורים ששמע מהם.
            </p>
            <div className="kb-actions">
              <a href="#kb-order" className="kb-button">
                אני רוצה להזמין עותק <ArrowLeft size={19} aria-hidden="true" />
              </a>
              <a href="#kb-sample" className="kb-text-link">
                <BookOpen size={19} aria-hidden="true" /> לקריאת קטע מהספר
              </a>
            </div>
            <p className="kb-small">184 עמודים · כריכה רכה · עותק ב־78 ₪</p>
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
            <figcaption>אפשר לקנות לעצמכם. אפשר לתת למישהו יקר.</figcaption>
          </figure>
        </section>

        <section className="kb-stories" aria-labelledby="kb-stories-title">
          <div className="kb-wrap">
            <div className="kb-section-heading">
              <p className="kb-kicker">מתוך 23 הסיפורים בספר</p>
              <h2 id="kb-stories-title">את מי תפגשו בין הדפים?</h2>
            </div>
            <div className="kb-story-grid">
              <article>
                <span className="kb-number">01</span>
                <h3>
                  יורי, שכמעט הגיע לגיל תשעים <br />
                  בלי לחגוג בר מצווה
                </h3>
                <p>
                  הוא מתנדב ב״יד שרה״ כבר שנים. שיחה עם מתנדב אחר מגלה פרט שאף
                  אחד מסביבו לא ידע — ומולידה רעיון לחגיגה.
                </p>
                <a href="#kb-sample">
                  קראו קטע מהסיפור <ArrowLeft size={16} aria-hidden="true" />
                </a>
              </article>
              <article>
                <span className="kb-number">02</span>
                <h3>
                  אורי, שביקש קשר <br />
                  כמו של סבא
                </h3>
                <p>
                  אורי לא הכיר את סבו. כשהוא מבקש תפילין, יש לו בקשה אחת מאוד
                  מסוימת: שהקשר יהיה כמו זה שהיה בתפילין של סבא.
                </p>
                <span className="kb-story-name">מתוך ״משמעות חדשה לקשר״</span>
              </article>
              <article>
                <span className="kb-number">03</span>
                <h3>
                  גלי, שנסע לגלוש <br />
                  בסרי לנקה
                </h3>
                <p>
                  בין הגלים הוא פוגש את יובל, ששרד את מסיבת הנובה. המפגש ביניהם
                  מוביל לרגע שבו גלי מניח את הגלשן בצד ומניח תפילין.
                </p>
                <span className="kb-story-name">מתוך ״חוף מבטחים״</span>
              </article>
            </div>
          </div>
        </section>

        <section
          id="kb-sample"
          className="kb-sample kb-wrap"
          aria-labelledby="kb-sample-title"
        >
          <div className="kb-sample-intro">
            <p className="kb-kicker">פותחים את הספר</p>
            <h2 id="kb-sample-title">
              אף פעם <br />
              לא מאוחר
            </h2>
            <p>
              שמואל, מתנדב חדש ב״יד שרה״, מכיר את יורי, איש התחזוקה הוותיק. באחת
              מארוחות הצהריים הם מתחילים לדבר.
            </p>
            <span className="kb-small">קטע מתוך הספר</span>
          </div>
          <div className="kb-paper">
            <span className="kb-paper-label">
              קשר של תפילין / אף פעם לא מאוחר
            </span>
            <blockquote>
              <p>שאלתי אותו בהיסוס:</p>
              <p>״יורי, בן כמה אתה?״</p>
              <p>יורי חייך. ניכר היה שהוא שמח בשאלה, וענה:</p>
              <p>״עוד מעט אני יום הולדת תשעים!״</p>
              <p>
                ״תשעים?!״ העיניים שלי התרחבו בתדהמה. ״תשעים?! וואוו! וככה אתה
                עובד ומטפס על סולם?״
              </p>
              <p>
                ״בטח״, הוא ענה וחיוכו התרחב, ״אני עוד צעיר, אני בארץ רק 30
                שנה...״
              </p>
              <details>
                <summary>
                  להמשיך לקרוא <span aria-hidden="true">+</span>
                </summary>
                <div>
                  <p>
                    שאלתי אותו על שמירת היהדות באותם ימים ברוסיה ויורי ענה, שחוץ
                    מהעובדה שהוא ידע שהם יהודים, לא היה שום ביטוי ממשי ליהדות
                    שלהם.
                  </p>
                  <p>״לא חגגו לך בר מצווה?״</p>
                  <p>״לא לא. לא בר מצווה, לא שום דבר!״</p>
                  <p>
                    העזתי ושאלתי אותו האם הוא יסכים להניח תפילין אם אדאג להשיג
                    לו תפילין, ויורי ענה בפשטות:
                  </p>
                  <p>״נו, למה לא?״</p>
                </div>
              </details>
            </blockquote>
          </div>
        </section>

        <section className="kb-about">
          <div className="kb-wrap kb-about-grid">
            <div>
              <p className="kb-kicker">איך נולד הספר</p>
              <h2>
                בהתחלה אנשים ביקשו תפילין. <br />
                אחר כך הם סיפרו למה.
              </h2>
            </div>
            <div>
              <p>
                במיזם ״קשר של תפילין״ עמיחי איל מחבר בין אנשים שיש להם תפילין
                שאינן בשימוש לבין מי שרוצים להתחיל להניח. עם הזמן, לצד הבקשות
                לתפילין, הצטברו גם הסיפורים.
              </p>
              <p>
                23 מהם מובאים בספר: על משפחה, על זיכרונות מהבית, על אמונה ועל
                ההחלטה להתחיל להניח. חלק מהשמות והפרטים שונו לשמירה על פרטיות
                המספרים.
              </p>
              <p className="kb-small">כתיבה: שמעון חי בן־שחר ועמיחי איל</p>
            </div>
          </div>
        </section>

        <section className="kb-trust kb-wrap" aria-labelledby="kb-trust-title">
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
          <a className="kb-text-link" href="/מכתבי-תודה">
            למכתבי התודה מאנשים שקיבלו תפילין{" "}
            <ArrowLeft size={17} aria-hidden="true" />
          </a>
        </section>

        <section
          id="kb-order"
          className="kb-order"
          aria-labelledby="kb-order-title"
        >
          <div className="kb-wrap">
            <div className="kb-section-heading">
              <p className="kb-kicker">לעצמכם, למשפחה או למתנה</p>
              <h2 id="kb-order-title">כמה עותקים תרצו?</h2>
              <p>אפשר לבחור גם זוג או שלישייה עם הקדשה אישית מעמיחי.</p>
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
                </label>
              ))}
            </fieldset>
            <div className="kb-order-bottom">
              <div className="kb-delivery">
                <fieldset>
                  <legend>איך תרצו לקבל את הספרים?</legend>
                  <div className="kb-delivery-options">
                    <label>
                      <input
                        type="radio"
                        name="book-delivery"
                        checked={delivery === "pickup"}
                        onChange={() => setDelivery("pickup")}
                      />
                      <MapPin size={18} aria-hidden="true" /> איסוף עצמי · ללא
                      עלות
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="book-delivery"
                        checked={delivery === "shipping"}
                        onChange={() => setDelivery("shipping")}
                      />
                      <Truck size={18} aria-hidden="true" /> משלוח עד הבית · 40
                      ₪
                    </label>
                  </div>
                </fieldset>
                <p className="kb-delivery-detail" aria-live="polite">
                  {delivery === "pickup"
                    ? "איסוף מארץ חמדה 33, בית אל. מתאים גם לתושבי יישובי בנימין."
                    : "משלוח של עד 5 ספרים: 40 ₪. עד 8 ימי עסקים."}
                </p>
              </div>
              <div className="kb-total">
                <div aria-live="polite">
                  <span>
                    סה״כ
                    {delivery === "shipping" ? ", כולל משלוח" : ", באיסוף עצמי"}
                  </span>
                  <strong>{total} ₪</strong>
                </div>
                <p>
                  התשלום באתר עדיין לא נפתח. אפשר לברר עם עמיחי על ההזמנה
                  בוואטסאפ.
                </p>
                <a
                  href={`https://wa.me/972546713966?text=${encodeURIComponent(message)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kb-button"
                >
                  לבירור הזמנה עם עמיחי{" "}
                  <ArrowLeft size={18} aria-hidden="true" />
                </a>
                <span className="kb-small">
                  הבחירה כאן אינה מבצעת הזמנה או חיוב.
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
                נדבר על הזמנה קבוצתית <ArrowLeft size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className="kb-footer kb-wrap">
        <div>
          <strong>קשר של תפילין</strong>
          <p>מיזם של עמותת אור חדש · ע״ר 580703965</p>
        </div>
        <nav aria-label="קישורים בתחתית עמוד הספר">
          <a href="/">לאתר המיזם</a>
          <a href="/privacy">פרטיות</a>
          <a href="/terms">תנאי שימוש</a>
          <a href="/accessibility">נגישות</a>
        </nav>
        <p className="kb-draft">עמוד חדש לבדיקה · המכירה באתר טרם נפתחה</p>
      </footer>
      <div className="kb-mobile-bar">
        <span>
          קשר של תפילין <small>החל מ־78 ₪</small>
        </span>
        <a href="#kb-order" className="kb-button">
          מחירים והזמנה <ArrowLeft size={16} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
