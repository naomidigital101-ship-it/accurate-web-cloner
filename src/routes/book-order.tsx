import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SITE_URL } from "@/lib/site";
import { track } from "@/lib/analytics";
import campaignCss from "@/book-order.css?url";

export const Route = createFileRoute("/book-order")({
  head: () => ({
    meta: [
      { title: "קשר של תפילין — 23 סיפורים מהחיים" },
      { name: "description", content: "23 סיפורים אמיתיים על אנשים שהתחילו להניח תפילין. בחרו מארז והמשיכו לתשלום מאובטח." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "קשר של תפילין — הספר של הרב עמיחי איל" },
      { property: "og:image", content: `${SITE_URL}/book/mock-two-copies.webp` },
      { property: "og:url", content: `${SITE_URL}/book-order` },
    ],
    links: [{ rel: "stylesheet", href: campaignCss }, { rel: "canonical", href: `${SITE_URL}/book-order` }],
  }),
  component: BookOrderPage,
});

type Delivery = "pickup" | "shipping";
const bundles = [
  { quantity: 1, title: "עותק אחד", price: 78, shipping: 40, detail: "לקריאה בבית או כמתנה" },
  { quantity: 2, title: "שני עותקים", price: 143, shipping: 20, detail: "אחד בשבילכם ואחד למתנה", badge: "הבחירה הפופולרית" },
  { quantity: 3, title: "שלושה עותקים", price: 199, shipping: 0, detail: "למשפחה ולשתי מתנות", badge: "המחיר הטוב ביותר" },
];
const purchaseLinks: Record<number, string> = {
  1: "https://pay.grow.link/MTA1NDQ5~49262f78c08b742d6ad21b74b49de3e5-Mzk4OTY3OA",
  2: "https://pay.grow.link/MTA1NDQ5~ec72d87f8af24e604ef10150073d2b54-Mzk4OTcwNw",
  3: "https://pay.grow.link/MTA1NDQ5~a1922e39c4975492fad2f1321d3c42ee-Mzk5MDI4NA",
};
const audiences = [
  ["לקריאה אישית", "23 פרקים קצרים שאפשר לקרוא לפי הסדר או לבחור בכל פעם סיפור אחר."],
  ["כמתנה עם תוכן", "לבר מצווה, לאירוע משפחתי או לאדם קרוב שמתחיל להניח תפילין."],
  ["לקריאה משותפת", "סיפורים שיכולים לפתוח שיחה בין הורים לילדים ובין בני משפחה."],
  ["למי שמתחיל מחדש", "אנשים מספרים מה גרם להם להתחיל להניח תפילין או לחזור אליהן."],
];
const faqs = [
  ["זה ספר הלכה או מדריך להנחת תפילין?", "זהו ספר סיפורים על האנשים, המפגשים וההחלטות שמאחורי הנחת התפילין. הוא אינו מדריך הלכתי."],
  ["הסיפורים מבוססים על אנשים אמיתיים?", "כן. הסיפורים הגיעו לרב עמיחי במסגרת מיזם ״קשר של תפילין״ ונכתבו לספר. חלק מהשמות והפרטים המזהים שונו כדי לשמור על פרטיות המספרים."],
  ["הספר מתאים לנער בר מצווה?", "הספר יכול להתאים כמתנה לבר מצווה ולקריאה משותפת. בחלק מהסיפורים יש נושאים של מלחמה, אובדן והתמודדויות משפחתיות, ולכן לקוראים צעירים מומלץ שהורה או מחנך יבחרו מראש את הסיפורים המתאימים."],
  ["אפשר לבקש הקדשה אישית?", "לאחר ההזמנה אפשר לפנות בוואטסאפ ולבדוק אפשרות להקדשה אישית מהרב עמיחי, בכפוף לזמינות."],
  ["כמה זמן לוקח המשלוח?", "משלוח עד הבית מגיע בתוך עד 8 ימי עסקים. עלות המשלוח היא 40 ₪ לעותק אחד, 20 ₪ לשני עותקים וכלולה במחיר של שלושה עותקים. איסוף עצמי מבית אל הוא ללא עלות ובתיאום מראש."],
  ["איך משלמים?", "אחרי שבוחרים מארז ואופן קבלה, עוברים בקישור מאובטח של Grow. במסך התשלום ממלאים את פרטי ההזמנה ומשלימים את התשלום."],
  ["אפשר להזמין כמות גדולה?", "כן. להזמנה לכיתה, לצוות או לאירוע אפשר לפנות אלינו ולציין את מספר העותקים ואת המועד הרצוי, ונבדוק מחיר ואפשרויות אספקה."],
];

function BookOrderPage() {
  const [quantity, setQuantity] = useState(2);
  const [delivery, setDelivery] = useState<Delivery>("pickup");
  const [showBar, setShowBar] = useState(false);
  const bundle = bundles.find((item) => item.quantity === quantity)!;
  const total = bundle.price + (delivery === "shipping" ? bundle.shipping : 0);

  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > 520);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    let observer: IntersectionObserver | undefined;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
      nodes.forEach((node) => node.classList.add("cb-reveal-ready"));
      observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer?.unobserve(entry.target); }
      }), { rootMargin: "0px 0px -10%", threshold: 0.08 });
      nodes.forEach((node) => observer?.observe(node));
    }
    return () => { window.removeEventListener("scroll", onScroll); observer?.disconnect(); };
  }, []);

  const trackCheckout = () => track("begin_checkout", { currency: "ILS", value: total, items: [{ item_name: "קשר של תפילין", quantity, price: bundle.price }], page_type: "book_campaign" });

  return <div className="cb" dir="rtl">
    <a className="cb-skip" href="#cb-main">דילוג לתוכן</a>
    <main id="cb-main">
      <section className="cb-hero" aria-labelledby="cb-title">
        <div className="cb-orb cb-orb-one" aria-hidden="true" /><div className="cb-orb cb-orb-two" aria-hidden="true" />
        <div className="cb-wrap cb-hero-wrap">
          <div className="cb-topline"><img src="/wp/img/לוגו-קשר-של-תפילין-01.svg" alt="קשר של תפילין" width="112" height="112" /><span>מיזם של עמותת אור חדש · ע״ר 580703965</span></div>
          <div className="cb-hero-grid">
            <div className="cb-hero-copy"><p className="cb-kicker">הספר של מיזם ״קשר של תפילין״</p><h1 id="cb-title"><em>קשר של תפילין</em> — 23 סיפורים מהחיים על הנחת תפילין והתחלה של קשר</h1><p className="cb-lead">הספר מביא את הסיפורים שמאחורי ההחלטה להתחיל להניח תפילין: מה עבר על האנשים, מה הוביל אותם לכך ואיך התפילין נכנסו לחיים שלהם.</p><div className="cb-hero-actions"><a className="cb-button" href="#cb-offer">אני רוצה את הספר <span aria-hidden="true">←</span></a><a className="cb-text-link" href="#cb-sample">אפשר לקרוא קטע לפני שמזמינים</a></div><p className="cb-from">החל מ־78 ₪ לעותק · איסוף עצמי ללא עלות או משלוח עד הבית</p><ul className="cb-hero-checks"><li>✓ תשלום מאובטח</li><li>✓ משלוח עד 8 ימי עסקים</li><li>✓ ביטול לפי חוק</li></ul></div>
            <figure className="cb-hero-book"><div className="cb-book-glow" aria-hidden="true" /><img src="/book/mock-hands.webp" alt="הספר קשר של תפילין מוחזק בידיים" width="900" height="1125" fetchPriority="high" /></figure>
          </div>
          <div className="cb-facts"><span><strong>23</strong> סיפורים אמיתיים</span><span><strong>184</strong> עמודים</span><span><strong>עברית</strong> · כריכה רכה</span><span><strong>המיזם של</strong> הרב עמיחי איל</span></div>
        </div>
      </section>

      <section className="cb-section cb-now" data-reveal><div className="cb-narrow"><p className="cb-eyebrow">מה יש בספר?</p><h2>כל פרק מתחיל באדם וברגע שבו הוא החליט</h2><p>אחד הבטיח להתחיל ברגע של סכנה. אחר הכניס את התפילין לשגרת הבוקר שלו בברלין. יש מי שחזר אחרי שנים, ויש מי שהתחיל בעקבות שיחה בבית.</p><p>הספר מביא את הסיפורים שהגיעו לרב עמיחי איל במסגרת המיזם: מה עבר על האנשים, למה פנו אליו ואילו שאלות ליוו אותם בדרך.</p></div></section>

      <section id="cb-sample" className="cb-excerpt" data-reveal><div className="cb-wrap"><div className="cb-section-heading"><p className="cb-eyebrow">קראו לפני שמזמינים</p><h2>קטע קצר מתוך הספר</h2></div><blockquote><p>״ברגעי הסכנה נעם הבטיח שאם יֵצא בחיים, יתחיל להניח תפילין. הוא ניצל, אבל גם כשחזר לשגרה ההבטחה נשארה איתו.״</p><footer>מתוך הסיפור ״לא השאיר לי ברירה״</footer></blockquote><p className="cb-privacy">חלק מהשמות והפרטים המזהים שונו כדי לשמור על פרטיות המספרים.</p><div className="cb-funnel-cta"><a className="cb-button" href="#cb-offer">לבחירת מארז <span aria-hidden="true">←</span></a></div></div></section>

      <section className="cb-section" data-reveal><div className="cb-wrap"><div className="cb-section-heading"><p className="cb-eyebrow">23 סיפורים, 184 עמודים</p><h2>ספר שקוראים סיפור אחר סיפור</h2></div><div className="cb-pillars"><article><span>01</span><h3>פרקים קצרים</h3><p>כל סיפור עומד בפני עצמו, כך שאפשר לקרוא פרק אחד בכל פעם.</p></article><article><span>02</span><h3>מקומות ורגעים אמיתיים</h3><p>מהנובה, מברלין, מהצבא ומהבית. כל אדם מגיע עם הסיבה שלו.</p></article><article><span>03</span><h3>שאלות מהחיים</h3><p>המשפחה, השגרה והאמונה נמצאות בתוך הסיפורים, בשפה פשוטה וישירה.</p></article></div></div></section>

      <section className="cb-audience" data-reveal><div className="cb-wrap cb-audience-grid"><img src="/book/mock-father-son.webp" alt="אב ונער משוחחים ליד הספר קשר של תפילין" width="1200" height="800" loading="lazy" /><div><p className="cb-eyebrow">למי הספר מתאים?</p><h2>לקריאה אישית, למתנה או לשיחה משותפת</h2><div className="cb-audience-list">{audiences.map(([title, text]) => <article key={title}><span>✓</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div><div className="cb-funnel-cta cb-funnel-cta-start"><a className="cb-button" href="#cb-offer">לבחירת מארז <span aria-hidden="true">←</span></a></div></div></div></section>

      <section id="cb-offer" className="cb-offer" data-reveal><div className="cb-wrap">
        <div className="cb-offer-head"><div><p className="cb-eyebrow">הזמנה ישירה מהעמותה</p><h2>בחרו את המארז שמתאים לכם</h2><p>רואים כאן את מחיר הספרים ואת דמי המשלוח. לאחר הבחירה ממשיכים לתשלום מאובטח.</p></div><img src="/book/mock-two-copies.webp" alt="שני עותקים של הספר קשר של תפילין" width="1200" height="800" loading="lazy" /></div>
        <fieldset className="cb-bundles"><legend className="cb-sr-only">בחירת מספר עותקים</legend>{bundles.map((item) => { const selected = item.quantity === quantity; const full = 78 * item.quantity; const saving = full - item.price; return <label className={`cb-bundle ${selected ? "is-selected" : ""}`} key={item.quantity}>{item.badge && <span className="cb-badge">{item.badge}</span>}<input type="radio" name="book-quantity" checked={selected} onChange={() => setQuantity(item.quantity)} /><span className="cb-radio" /><h3>{item.title}</h3><div className="cb-bundle-price"><strong>{item.price} ₪</strong>{saving > 0 && <del>{full} ₪</del>}</div><p>{item.detail}</p><b>{item.shipping === 0 ? "משלוח עד הבית כלול" : `משלוח עד הבית ב־${item.shipping} ₪`}</b>{saving > 0 && <small>חיסכון של {saving} ₪ · {(item.price / item.quantity).toFixed(1)} ₪ לעותק</small>}</label>; })}</fieldset>
        <div className="cb-order-grid"><fieldset className="cb-delivery"><legend>איך תרצו לקבל את הספרים?</legend><label className={delivery === "pickup" ? "is-selected" : ""}><input type="radio" name="delivery" checked={delivery === "pickup"} onChange={() => setDelivery("pickup")} /><span><strong>איסוף עצמי</strong><small>ארץ חמדה 33, בית אל · בתיאום מראש · ללא עלות</small></span></label><label className={delivery === "shipping" ? "is-selected" : ""}><input type="radio" name="delivery" checked={delivery === "shipping"} onChange={() => setDelivery("shipping")} /><span><strong>משלוח עד הבית</strong><small>{bundle.shipping === 0 ? "כלול במחיר המארז" : `${bundle.shipping} ₪ · עד 8 ימי עסקים`}</small></span></label><ul><li>✓ כריכה רכה, 184 עמודים, עברית</li><li>✓ אפשר לבדוק אפשרות להקדשה לאחר ההזמנה</li><li>✓ ביטול עסקה לפי חוק הגנת הצרכן</li></ul></fieldset><div className="cb-checkout"><div className="cb-total" aria-live="polite"><span>{delivery === "shipping" ? "סה״כ, כולל משלוח" : "סה״כ, באיסוף עצמי"}</span><strong data-testid="order-total">{total} ₪</strong></div><p>במסך התשלום ממלאים את פרטי ההזמנה ומשלימים תשלום מאובטח באמצעות Grow.</p><a className="cb-button" href={purchaseLinks[quantity]} target="_blank" rel="noopener noreferrer" onClick={trackCheckout}>להמשך לתשלום מאובטח <span>←</span></a><small>המחיר הסופי כולל את המארז ואופן הקבלה שבחרתם.</small></div></div>
      </div></section>

      <section className="cb-trust" data-reveal><div className="cb-wrap"><p className="cb-eyebrow">המיזם שמאחורי הספר</p><h2>רבנים נתנו למיזם את ברכתם</h2><p className="cb-trust-note">המכתבים ניתנו למיזם ולפעילותו ואינם ביקורות על הספר.</p><div className="cb-rabbis"><article><img src="/wp/uploads/2026/05/הרב-דוד-יוסף-min.webp" alt="" width="72" height="72" loading="lazy" /><h3>הרב דוד יוסף</h3></article><article><img src="/wp/uploads/2024/04/רב-זילברמן-3-1.webp" alt="" width="72" height="72" loading="lazy" /><h3>הרב יצחק זילברשטיין</h3></article><article><img src="/wp/uploads/2024/04/הרב-זלמן-מלמד-2.jpeg" alt="" width="72" height="72" loading="lazy" /><h3>הרב זלמן ברוך מלמד</h3></article></div><div className="cb-founder"><img src="/wp/img/עמיחי-פרופיל-ערוך-min.webp" alt="הרב עמיחי איל" width="932" height="1400" loading="lazy" /><div><h3>הרב עמיחי איל</h3><p>מייסד מיזם ״קשר של תפילין״ והאיש שמאחורי הספר</p></div><p>1,500 זוגות תפילין שאינן בשימוש נבדקו, חודשו ונמסרו למי שרצה להתחיל להניח. בכל מסירה כזו התחיל סיפור — 23 מהם מגיעים עכשיו לספר.</p></div></div></section>

      <section className="cb-faq" data-reveal><div className="cb-narrow"><h2>לפני שמזמינים</h2>{faqs.map(([q, a]) => <details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></section>
      <section className="cb-final" data-reveal><div className="cb-narrow"><h2>בחרו כמה עותקים תרצו<br /><em>והמשיכו לתשלום מאובטח</em></h2><p className="cb-final-copy">עותק אחד לקריאה, שניים אם תרצו לתת אחד במתנה, או שלושה במחיר הטוב ביותר.</p><a className="cb-button" href="#cb-offer">לבחירת מארז ותשלום <span>←</span></a><p>איסוף עצמי ללא עלות · משלוח עד הבית בהתאם למארז · ביטול לפי חוק</p></div></section>
    </main>
    <footer className="cb-footer"><div className="cb-wrap"><span>עמותת אור חדש · ע״ר 580703965 · ארץ חמדה 33, בית אל · <a href="tel:0546713966">054-6713966</a></span><nav><a href="/accessibility">הצהרת נגישות</a><a href="/privacy">מדיניות פרטיות</a><a href="/terms">תקנון וביטול עסקה</a></nav></div></footer>
    <div className={`cb-sticky ${showBar ? "is-visible" : ""}`} aria-hidden={!showBar}><div className="cb-wrap"><span><strong>{bundle.title} · {total} ₪</strong><small>{delivery === "shipping" ? "כולל משלוח עד הבית" : "איסוף עצמי ללא עלות"}</small></span><a href="#cb-offer">להזמנה ←</a></div></div>
  </div>;
}
