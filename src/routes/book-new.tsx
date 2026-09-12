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
                  23 סיפורים על הרגע שבו אנשים בחרו להתחיל להניח תפילין
                </h1>
                <p className="kb-subtitle">
                  מהעוטף וממסיבת הנובה ועד לחיים בברלין
                </p>
                <p className="kb-intro">
                  אב שניצל עם ילדיו בשבעה באוקטובר, צעיר ששרד את הנובה וישראלי
                  שמתגורר בברלין. כל אחד מהם פנה לעמיחי איל בבקשה לתפילין, ולכל
                  אחד סיפור משלו. הספר מביא את הסיפורים ואת הדרך שהובילה לבקשה.
                </p>
                <dl className="kb-hero-specs">
                  <div>
                    <dt>עמודים</dt>
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
                </dl>
                <div className="kb-hero-price">
                  <strong>78 ₪</strong>
                  <span>לעותק · לא כולל משלוח</span>
                </div>
                <div className="kb-actions">
                  <a href="#kb-order" className="kb-button">
                    מחירים ואפשרויות הזמנה{" "}
                    <ArrowLeft size={19} aria-hidden="true" />
                  </a>
                  <a href="#kb-sample" className="kb-text-link">
                    <BookOpen size={19} aria-hidden="true" /> לקריאת קטע מהספר
                  </a>
                </div>
                <p className="kb-small">
                  איסוף עצמי בבית אל או משלוח עד הבית · מארזים עם הקדשה אישית
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
          </div>
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
          <nav className="kb-page-nav kb-wrap" aria-label="תוכן העניינים בעמוד">
            <strong>בעמוד הזה</strong>
            <a href="#kb-contents">תוכן הספר ופרטים</a>
            <a href="#kb-sample">קטע לקריאה</a>
            <a href="#kb-author">על עמיחי איל</a>
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
              <details className="kb-toc" open>
                <summary>
                  23 הסיפורים בספר <span aria-hidden="true">+</span>
                </summary>
                <ol>
                  {[
                    "הזכות להציל חיים",
                    "יש שכר לפעולתך",
                    "חוליה בשרשרת",
                    "רק תגיד אני רוצה",
                    "עוד שלב במסע",
                    "יותר טוב מאספרסו",
                    "על הניסים ועל הנפלא אות",
                    "אף פעם לא מאוחר",
                    "מפגש חלומי",
                    "לא השאיר לי ברירה",
                    "משמעות חדשה לקשר",
                    "אחד ועוד אחד",
                    "מצאת תאמין",
                    "תיתן אמת ליעקב",
                    "ברית עולם",
                    "עסקה כפולה",
                    "מנגינת חיי",
                    "חוף מבטחים",
                    "מגלגלים זכות",
                    "טוב לי תורת פיך מהאלפים",
                    "זירוז מגן עדן",
                    "סימן שהמשיח בפתח",
                    "פתח לנו שער",
                  ].map((title) => (
                    <li key={title}>{title}</li>
                  ))}
                </ol>
              </details>
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
                שמואל, מתנדב חדש ב״יד שרה״, מכיר את יורי, איש התחזוקה הוותיק.
                באחת מארוחות הצהריים הם מתחילים לדבר.
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
                      שאלתי אותו על שמירת היהדות באותם ימים ברוסיה ויורי ענה,
                      שחוץ מהעובדה שהוא ידע שהם יהודים, לא היה שום ביטוי ממשי
                      ליהדות שלהם.
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

          <section className="kb-about" aria-labelledby="kb-about-title">
            <div className="kb-wrap kb-about-grid">
              <div>
                <p className="kb-kicker">איך נולד הספר</p>
                <h2 id="kb-about-title">על הספר והמיזם</h2>
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
                <p>
                  הספר מיועד לקוראים המתעניינים בסיפורים אישיים על אמונה, משפחה
                  והקשר למסורת. הורים ומחנכים יכולים לבחור מתוכו סיפור לקריאה
                  משותפת לקראת בר מצווה. כדאי לעיין מראש: הספר כולל גם סיפורי
                  מלחמה, אובדן והתמודדויות משפחתיות, ולא נכתב כספר ילדים.
                </p>
                <p className="kb-small">כתיבה: שמעון חי בן־שחר ועמיחי איל</p>
              </div>
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
                עמיחי, תושב בית אל, הקים ומנהל את מיזם ״קשר של תפילין״. הוא עסק
                בהוראה בישיבות ובניהול ארגון ״נהורא״, ומלווה בעלי תשובה ומתקרבים
                ליהדות.
              </p>
              <p>
                דרך המיזם הוא פוגש את שני הצדדים: אנשים שמוסרים תפילין שאינן
                בשימוש, ואנשים שמבקשים זוג משלהם. הספר נולד מההיכרות עם האנשים
                ומהרצון להביא את סיפוריהם לקוראים נוספים.
              </p>
              <a
                className="kb-text-link"
                href="https://www.youtube.com/watch?v=aQYiyBfycrc"
                target="_blank"
                rel="noopener noreferrer"
              >
                לראיון עם עמיחי על המיזם בערוץ 7 ↗
              </a>
              <p className="kb-small">הראיון עוסק במיזם ובפעילותו.</p>
            </div>
          </section>

          <section
            id="kb-trust"
            className="kb-trust kb-wrap"
            aria-labelledby="kb-trust-title"
          >
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
                <h2 id="kb-order-title">מחירים, משלוח ואיסוף עצמי</h2>
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
                        <Truck size={18} aria-hidden="true" /> משלוח עד הבית ·
                        40 ₪
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
                      {delivery === "shipping"
                        ? ", כולל משלוח"
                        : ", באיסוף עצמי"}
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
      </div>
      <SiteFooter />
    </div>
  );
}
