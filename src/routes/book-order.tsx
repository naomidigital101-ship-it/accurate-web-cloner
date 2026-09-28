import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SITE_URL } from "@/lib/site";
import { track } from "@/lib/analytics";
import campaignCss from "@/book-order.css?url";

export const Route = createFileRoute("/book-order")({
  head: () => ({
    meta: [
      { title: "קשר של תפילין — 23 סיפורים מהחיים" },
      { name: "description", content: "23 סיפורים על אנשים שהחליטו להתחיל להניח תפילין. בחרו מארז והמשיכו לתשלום מאובטח." },
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
  { quantity: 2, title: "שני עותקים", price: 143, shipping: 20, detail: "אחד בשבילכם ואחד למתנה", badge: "עותק לכם ועותק למתנה" },
  { quantity: 3, title: "שלושה עותקים", price: 199, shipping: 0, detail: "למשפחה ולשתי מתנות", badge: "המחיר הטוב ביותר" },
];
const purchaseLinks: Record<number, string> = {
  1: "https://pay.grow.link/MTA1NDQ5~49262f78c08b742d6ad21b74b49de3e5-Mzk4OTY3OA",
  2: "https://pay.grow.link/MTA1NDQ5~ec72d87f8af24e604ef10150073d2b54-Mzk4OTcwNw",
  3: "https://pay.grow.link/MTA1NDQ5~a1922e39c4975492fad2f1321d3c42ee-Mzk5MDI4NA",
};
const groupLink = "https://api.whatsapp.com/send?phone=972546713966&text=" + encodeURIComponent("שלום עמיחי, אשמח לבדוק הזמנה קבוצתית של הספר קשר של תפילין. הספרים מיועדים ל: __. מספר עותקים משוער: __. מועד רצוי: __. יישוב למשלוח או איסוף: __.");
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
    <main id="cb-main">
      <section className="cb-hero" aria-labelledby="cb-title">
        <div className="cb-orb cb-orb-one" aria-hidden="true" /><div className="cb-orb cb-orb-two" aria-hidden="true" />
        <div className="cb-wrap cb-hero-wrap">
          <div className="cb-topline"><img src="/wp/img/לוגו-קשר-של-תפילין-01.svg" alt="קשר של תפילין" width="54" height="54" /><span>מיזם של עמותת אור חדש · ע״ר 580703965</span></div>
          <div className="cb-hero-grid">
            <div className="cb-hero-copy"><h1 id="cb-title"><em>קשר של תפילין</em> — 23 סיפורים מהחיים על הנחת תפילין והתחלה של קשר</h1><p className="cb-lead">אנשים בגילים שונים ובמקומות שונים מספרים מה גרם להם להכניס את התפילין לחיים. ספר לקריאה אישית, למתנה למי שאוהב סיפורי אמונה, ולקריאה משותפת לקראת בר מצווה.</p><div className="cb-hero-actions"><a className="cb-button" href="#cb-offer">להזמנת הספר <span aria-hidden="true">←</span></a><a className="cb-text-link" href="#cb-sample">לקריאת קטע מהספר</a></div><ul className="cb-hero-checks"><li>✓ 184 עמודים · כריכה רכה</li><li>✓ משלוח עד הבית או איסוף עצמי מבית אל</li><li>✓ תשלום מאובטח ב־Grow</li></ul></div>
            <figure className="cb-hero-book"><div className="cb-book-glow" aria-hidden="true" /><img src="/book/mock-hands.webp" alt="הספר קשר של תפילין מוחזק בידיים" width="900" height="1125" fetchPriority="high" /></figure>
          </div>
          <div className="cb-facts"><span><strong>23</strong> סיפורים</span><span><strong>184</strong> עמודים</span><span><strong>כריכה רכה</strong> · עברית</span></div>
        </div>
      </section>

      <section className="cb-section cb-many" data-reveal><div className="cb-wrap"><div className="cb-many-intro"><p className="cb-eyebrow">לא סיפור אחד</p><h2>23 דרכים שונות להתחיל</h2><p>הספר לא מסביר לאנשים מה להרגיש. הוא נותן להם לספר, כל אחד בקול שלו, מה הוביל אותו אל התפילין.</p></div><div className="cb-story-lines"><article><span>01</span><p>נעם יוצא בחיים מהנובה ונזכר בהבטחה שנתן ברגעי הסכנה.</p></article><article><span>02</span><p>ישראלי בברלין מתחיל להניח בבוקר ומנסה להסביר את הבחירה לאביו.</p></article><article><span>03</span><p>שיחה בתוך המשפחה הופכת להחלטה שממשיכה גם ביום שאחרי.</p></article></div><div className="cb-funnel-cta"><a className="cb-button cb-button-quiet" href="#cb-sample">לקריאת קטע מהספר <span aria-hidden="true">←</span></a></div></div></section>

      <section id="cb-sample" className="cb-excerpt" data-reveal><div className="cb-wrap cb-excerpt-grid"><div className="cb-section-heading"><p className="cb-eyebrow">קטע מתוך הסיפור הראשון</p><h2>כך נשמע הספר מבפנים</h2><p>יזהר וילדיו ניצלו בשבעה באוקטובר. לצד הכאב על חבריו מהקיבוץ, הוא פונה לרב דוד ושואל איך להודות על חיי משפחתו. קראו קטע מתוך שיחתם.</p></div><blockquote><footer>קשר של תפילין / על הניסים ועל הנפלא־אות</footer><p>&quot;ומה אני יכול לעשות כדי להודות לאלוקים שהציל אותי ונתן לי את החיים במתנה?&quot; שאל יזהר.</p><p>&quot;תפילין. תתחיל להניח תפילין!&quot; ענה הרב ישירות.</p><p>הרב הסביר לְיזהר על המצווה, ואמר שע&quot;י הנחת תפילין וקריאת שמע בכל יום דבר שלא מצריך הרבה זמן – הוא מחבר את עצמו לה&#x27; באופן פנימי ועמוק מאד. יזהר הקשיב והרעיון מצא חן בעיניו. לפני שנפרדו, הרב דוד בירך את יזהר בחום. &quot;לחיים טובים ומאושרים, מעכשיו ועד מאה עשרים!&quot;, ונתן לו את המספר של הרב עמיחי. &quot;תתקשר אליו, הוא יעזור לך וידאג להביא לך תפילין&quot;.</p><p>מאז שיזהר פגש את הרב דוד עברו כמה שבועות, אבל הדברים ששמע מהרב המשיכו להדהד בראשו. גם עכשיו, תוך כדי הטיול עם הכלב, הוא נזכר בדברי הרב על הניסים ועל התפילין, והחליט שהגיע הזמן להוציא אל הפועל את הרעיון. הוא החל לפסוע בחזרה הביתה בצעדים מהירים. אחרי שנכנס לדירה הקטנה, פתח את המגירה, הוציא ממנה את הפתק שעליו כתב הרב דוד את המספר והתקשר.</p></blockquote></div></section>

      <section id="cb-gift" className="cb-gift" aria-labelledby="cb-gift-title"><div className="cb-wrap cb-gift-layout"><img src="/book/mock-two-copies.webp" alt="שני עותקים של הספר קשר של תפילין" width="1200" height="800" loading="lazy" /><div><h2 id="cb-gift-title">עותק בשבילכם, ואולי גם מתנה למישהו קרוב</h2><p>יש לכם אבא, סבא או חבר שאוהב לקרוא סיפורים על אמונה? אפשר לתת לו את ״קשר של תפילין״, ולהשאיר עותק גם אצלכם.</p><p>לקראת בר מצווה, אפשר לבחור סיפור ולקרוא יחד עם הבן. להכיר את האנשים שמאחוריו, לשמוע מה הוא חושב ולדבר על התפילין שעומדות להיות חלק מהיום שלו.</p><a className="cb-button" href="#cb-offer">לבחירת עותק או מארז <span aria-hidden="true">←</span></a></div></div></section>

      <section className="cb-trust" data-reveal><div className="cb-wrap"><p className="cb-eyebrow">המיזם שמאחורי הספר</p><h2>רבנים נתנו למיזם את ברכתם</h2><p className="cb-trust-note">המכתבים ניתנו למיזם ולפעילותו ואינם ביקורות על הספר.</p><div className="cb-rabbis"><article><img src="/wp/uploads/2026/05/הרב-דוד-יוסף-min.webp" alt="" width="72" height="72" loading="lazy" /><h3>הרב דוד יוסף</h3><a href="/wp/uploads/2026/05/מכתב-מהראשלצ.webp" target="_blank" rel="noopener noreferrer">לקריאת מכתב הברכה</a></article><article><img src="/wp/uploads/2024/04/רב-זילברמן-3-1.webp" alt="" width="72" height="72" loading="lazy" /><h3>הרב יצחק זילברשטיין</h3><a href="/wp/uploads/2024/04/מכתב-הסכמה-מהרב-זילברשטיין-scaled.webp" target="_blank" rel="noopener noreferrer">לקריאת מכתב הברכה</a></article><article><img src="/wp/uploads/2024/04/הרב-זלמן-מלמד-2.jpeg" alt="" width="72" height="72" loading="lazy" /><h3>הרב זלמן ברוך מלמד</h3><a href="/wp/uploads/2024/04/מכתב-ברכה-הרב-זלמן-ברוך-מלמד-scaled.webp" target="_blank" rel="noopener noreferrer">לקריאת מכתב הברכה</a></article></div><div className="cb-founder"><img src="/wp/img/עמיחי-פרופיל-ערוך-min.webp" alt="הרב עמיחי איל" width="932" height="1400" loading="lazy" /><div><h3>הרב עמיחי איל</h3><p>מייסד מיזם ״קשר של תפילין״ והאיש שמאחורי הספר</p></div><p>1,500 זוגות תפילין שאינן בשימוש נבדקו, חודשו ונמסרו למי שרצה להתחיל להניח. מתוך המפגשים והשיחות במסגרת המיזם נאספו הסיפורים לספר, שנכתב עם שמעון חי בן־שחר.</p></div></div></section>

      <section id="cb-offer" className="cb-offer" data-reveal><div className="cb-wrap">
        <div className="cb-offer-head"><div><p className="cb-eyebrow">בחרו מארז והמשיכו לתשלום מאובטח</p><h2>אחד לכם, ואחד למי שאתם רוצים שיקרא את זה</h2><p>עותק אחד נשאר אצלכם, ואחד עובר למי שאתם רוצים שיקרא. לאחר הבחירה תוכלו לבקש הקדשה בכתב יד מהמחבר, בכפוף לזמינות.</p></div><img src="/book/mock-two-copies.webp" alt="שני עותקים של הספר קשר של תפילין" width="1200" height="800" loading="lazy" /></div>
        <fieldset className="cb-bundles"><legend className="cb-sr-only">בחירת מספר עותקים</legend>{bundles.map((item) => { const selected = item.quantity === quantity; const full = 78 * item.quantity; const saving = full - item.price; return <label className={`cb-bundle ${selected ? "is-selected" : ""}`} key={item.quantity}>{item.badge && <span className="cb-badge">{item.badge}</span>}<input type="radio" name="book-quantity" checked={selected} onChange={() => setQuantity(item.quantity)} /><span className="cb-radio" /><h3>{item.title}</h3><div className="cb-bundle-price"><strong>{item.price} ₪</strong>{saving > 0 && <del>{full} ₪</del>}</div><p>{item.detail}</p><b>{item.shipping === 0 ? "משלוח עד הבית כלול" : `משלוח עד הבית ב־${item.shipping} ₪`}</b>{saving > 0 && <small>חיסכון של {saving} ₪ · {(item.price / item.quantity).toFixed(1)} ₪ לעותק</small>}</label>; })}</fieldset>
        <div className="cb-order-grid"><fieldset className="cb-delivery"><legend>איך תרצו לקבל את הספרים?</legend><label className={delivery === "pickup" ? "is-selected" : ""}><input type="radio" name="delivery" checked={delivery === "pickup"} onChange={() => setDelivery("pickup")} /><span><strong>איסוף עצמי</strong><small>ארץ חמדה 33, בית אל · בתיאום מראש · ללא עלות</small></span></label><label className={delivery === "shipping" ? "is-selected" : ""}><input type="radio" name="delivery" checked={delivery === "shipping"} onChange={() => setDelivery("shipping")} /><span><strong>משלוח עד הבית</strong><small>{bundle.shipping === 0 ? "כלול במחיר המארז" : `${bundle.shipping} ₪ · עד 8 ימי עסקים`}</small></span></label><ul><li>✓ כריכה רכה, 184 עמודים, עברית</li><li>✓ אפשר לבדוק אפשרות להקדשה לאחר ההזמנה</li><li>✓ ביטול עסקה לפי חוק הגנת הצרכן</li></ul></fieldset><div className="cb-checkout"><div className="cb-total" aria-live="polite"><span>{delivery === "shipping" ? "סה״כ, כולל משלוח" : "סה״כ, באיסוף עצמי"}</span><strong data-testid="order-total">{total} ₪</strong></div><p>במסך התשלום של Grow תבחרו שוב את אופן הקבלה, תמלאו את פרטי ההזמנה ותשלימו את התשלום המאובטח.</p><a className="cb-button" href={purchaseLinks[quantity]} target="_blank" rel="noopener noreferrer" onClick={trackCheckout}>להמשך לתשלום מאובטח <span>←</span></a><small>הסכום הסופי יוצג ב־Grow לפי אופן הקבלה שתבחרו שם.</small></div></div>
      </div></section>

      <section id="cb-groups" className="cb-section cb-groups" aria-labelledby="cb-groups-title"><div className="cb-wrap"><div className="cb-section-heading"><p className="cb-eyebrow">למחנכים, לקהילות ולארגונים</p><h2 id="cb-groups-title">רוצים לתת את הספר לכיתה או לצוות?</h2><p>בהזמנה לקבוצה חשוב לדעת למי הספר מיועד, כמה עותקים צריך ומתי הם צריכים להגיע. פנו לעמיחי עם הפרטים ונבדוק יחד את האפשרויות.</p></div><div className="cb-pillars"><article><h3>מחנכים לנערי בר מצווה</h3><p>אפשר לבחור סיפור לקריאה ולשיחה בכיתה, ולתת לכל נער עותק להמשך הקריאה בבית. כדאי לעיין בספר ולבחור תוכן שמתאים לגיל ולאופי הקבוצה.</p></article><article><h3>מנהלים שמחפשים שי לעובדים</h3><p>לצוות שעולם המסורת והסיפור האישי מדבר אליו, הספר יכול להתאים כשי לחג או לאירוע. נשמח לבדוק כמות, מועד ומסירה מרוכזת.</p></article><article><h3>קהילות וקבוצות לימוד</h3><p>אפשר להציע לקבוצה לקרוא סיפור לקראת מפגש ולדון בבחירות של הדמויות. זו הצעה לשימוש בספר; ערכת לימוד או הנחיה אינן כלולות ברכישה.</p></article></div><div className="cb-group-contact"><div><h3>מה כדאי לכתוב לנו?</h3><p>למי מיועדים הספרים, מספר העותקים המשוער, המועד הרצוי והיישוב למשלוח או לאיסוף.</p><p>מחיר לכמות, זמינות והקדשות ייבדקו בפנייה. אין צורך לשלם לפני שמסכמים את פרטי ההזמנה.</p></div><a className="cb-button" href={groupLink} target="_blank" rel="noopener noreferrer" onClick={() => track("contact", { page_type: "book_campaign", contact_method: "whatsapp", intent: "group_order" })}>לבירור הזמנה קבוצתית בוואטסאפ ←</a></div></div></section>

      <section className="cb-faq" data-reveal><div className="cb-narrow"><h2>לפני שמזמינים</h2>{faqs.map(([q, a]) => <details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></section>
      <section className="cb-final" data-reveal><div className="cb-narrow"><h2>23 אנשים סיפרו על הרגע שבו החליטו להתחיל להניח תפילין.<br /><em>עכשיו אפשר לקרוא את הסיפורים שלהם.</em></h2><a className="cb-button" href="#cb-offer">להזמנת הספר <span>←</span></a><p>איסוף עצמי ללא עלות · משלוח עד הבית בהתאם למארז · ביטול לפי חוק</p></div></section>
    </main>
    <footer className="cb-footer"><div className="cb-wrap"><span>עמותת אור חדש · ע״ר 580703965 · ארץ חמדה 33, בית אל · <a href="tel:0546713966">054-6713966</a></span><nav><a href="/accessibility">הצהרת נגישות</a><a href="/privacy">מדיניות פרטיות</a><a href="/terms">תקנון וביטול עסקה</a></nav></div></footer>
    <div className={`cb-sticky ${showBar ? "is-visible" : ""}`} aria-hidden={!showBar}><div className="cb-wrap"><span><strong>{bundle.title} · {total} ₪</strong><small>{delivery === "shipping" ? "כולל משלוח עד הבית" : "איסוף עצמי ללא עלות"}</small></span><a href="#cb-offer">להזמנה ←</a></div></div>
  </div>;
}

