import { track } from "@/lib/analytics";

const PURCHASE_ID = "kb-purchase";

const GROW_SINGLE = "https://pay.grow.link/MTA1NDQ5~49262f78c08b742d6ad21b74b49de3e5-Mzk4OTY3OA?price_check=20261019";
const GROW_PAIR = "https://pay.grow.link/MTA1NDQ5~ec72d87f8af24e604ef10150073d2b54-Mzk4OTcwNw";
const GROW_TRIPLE = "https://pay.grow.link/MTA1NDQ5~a1922e39c4975492fad2f1321d3c42ee-Mzk5MDI4NA";

const offers = [
  {
    quantity: 1,
    name: "עותק בודד",
    price: "67",
    note: "משלוח בתוספת 35 ₪",
    href: GROW_SINGLE,
    best: false,
  },
  {
    quantity: 2,
    name: "זוג עותקים",
    price: "118",
    note: "משלוח בתוספת 20 ₪",
    href: GROW_PAIR,
    best: true,
  },
  {
    quantity: 3,
    name: "שלישיית עותקים",
    price: "156",
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
          הספר ״קשר של תפילין״ — 23 סיפורים אמיתיים על רגעי התעוררות והשגחה. משלוח ב־35 ₪ לעותק אחד, ב־20 ₪ לזוג וכלול במחיר השלישייה.
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
                onClick={() =>
                  /* אותו אירוע כמו בעמודי הספר: לחיצה על הזמנה. התשלום עצמו קורה ב-Grow ולא נמדד כאן */
                  track("begin_checkout", {
                    page_type: "home",
                    location: "home_shop",
                    currency: "ILS",
                    value: Number(o.price),
                    bundle: o.quantity,
                    transport_type: "beacon",
                    items: [{ item_id: `kesher-book-${o.quantity}`, item_name: `קשר של תפילין - ${["", "עותק אחד", "שני עותקים", "שלושה עותקים"][o.quantity]}`, price: Number(o.price), quantity: 1 }],
                  })
                }
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
