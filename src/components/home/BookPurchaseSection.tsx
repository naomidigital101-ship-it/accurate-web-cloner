const PURCHASE_ID = "kb-purchase";

const GROW_SINGLE = "https://pay.grow.link/MTA1NDQ5~49262f78c08b742d6ad21b74b49de3e5-Mzk4OTY3OA";
const GROW_PAIR = "https://pay.grow.link/MTA1NDQ5~ec72d87f8af24e604ef10150073d2b54-Mzk4OTcwNw";
const GROW_TRIPLE = "https://pay.grow.link/MTA1NDQ5~a1922e39c4975492fad2f1321d3c42ee-Mzk5MDI4NA";

const offers = [
  {
    name: "עותק בודד",
    price: "78",
    note: "לא כולל משלוח",
    href: GROW_SINGLE,
    best: false,
  },
  {
    name: "זוג עותקים",
    price: "143",
    note: "כולל משלוח עד הבית",
    href: GROW_PAIR,
    best: true,
  },
  {
    name: "שלישיית עותקים",
    price: "199",
    note: "כולל משלוח עד הבית",
    href: GROW_TRIPLE,
    best: false,
  },
] as const;

export function BookPurchaseSection() {
  return (
    <section dir="rtl" id={PURCHASE_ID} className="kb-shop" aria-labelledby="kb-shop-title">
      <div className="kb-shop-inner">
        <h2 id="kb-shop-title" className="kb-shop-title">לרגל הוצאת הספר</h2>
        <p className="kb-shop-sub">
          הספר ״קשר של תפילין״ — 23 סיפורים אמיתיים על רגעי התעוררות והשגחה. במארז של שני עותקים ומעלה מצורפת הקדשה אישית מעמיחי.
        </p>
        <div className="kb-shop-cards">
          {offers.map((o) => (
            <article key={o.name} className={`kb-shop-card${o.best ? " kb-shop-card-best" : ""}`}>
              {o.best && <span className="kb-shop-badge">הכי משתלם</span>}
              <h3 className="kb-shop-name">{o.name}</h3>
              <p className="kb-shop-price">
                {o.price} <small>₪</small>
              </p>
              <p className="kb-shop-note">{o.note}</p>
              <a
                className="btn-e kb-shop-btn"
                href={o.href}
                target="_blank"
                rel="noopener"
                aria-label={`לרכישה — ${o.name}, ${o.price} שקלים`}
              >
                לרכישה
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
