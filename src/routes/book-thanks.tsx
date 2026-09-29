import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { track } from "@/lib/analytics";
import campaignCss from "@/book-order.css?url";
import { CHECKOUT_STORAGE_KEY } from "@/lib/book-checkout";

/**
 * דף החזרה אחרי תשלום מוצלח ב-Grow. עובד רק אם בהגדרות דף התשלום ב-Grow
 * מוגדרת כתובת חזרה אחרי הצלחה: https://or-hadash.org.il/book-thanks
 * מקור האמת לרכישה הוא ה-webhook (/api/grow-webhook); האירוע כאן נועד רק
 * לשייך את הרכישה לקמפיין ב-GA4.
 */
export const Route = createFileRoute("/book-thanks")({
  head: () => ({
    meta: [
      { title: "תודה על ההזמנה - קשר של תפילין" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "stylesheet", href: campaignCss }],
  }),
  component: BookThanksPage,
});

const TTL_MS = 6 * 60 * 60 * 1000;

function BookThanksPage() {
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHECKOUT_STORAGE_KEY);
      if (!raw) return;
      // נמחק לפני השליחה, כך שרענון הדף לא ידווח את אותה רכישה פעמיים.
      localStorage.removeItem(CHECKOUT_STORAGE_KEY);
      const c = JSON.parse(raw) as { quantity: number; delivery: string; total: number; at: number };
      if (!c?.total || Date.now() - c.at > TTL_MS) return;
      track("purchase", {
        page_type: "book_campaign",
        transaction_id: `kb-${c.at}`,
        currency: "ILS",
        value: c.total,
        delivery: c.delivery,
        bundle: c.quantity,
        items: [{ item_id: `kesher-book-${c.quantity}`, item_name: "קשר של תפילין", price: c.total, quantity: 1 }],
      });
    } catch {
      /* מדידה לא מפילה את הדף */
    }
  }, []);

  return (
    <div className="kb" dir="rtl">
      <main className="kb-final" style={{ minHeight: "70vh" }}>
        <div className="kb-narrow">
          <img src="/wp/img/לוגו-קשר-של-תפילין-01.svg" alt="קשר של תפילין" width="64" height="64" style={{ margin: "0 auto 18px" }} />
          <h1 style={{ fontSize: "clamp(30px,7vw,44px)", fontWeight: 900, color: "var(--ink)" }}>תודה על ההזמנה</h1>
          <p>
            במשלוח עד הבית הספר מגיע תוך עד 8 ימי עסקים. באיסוף עצמי מתאמים מועד בטלפון, והאיסוף הוא מארץ חמדה 33, בית אל.
          </p>
          <p>
            רוצים לבדוק אפשרות להקדשה מהרב עמיחי, או שיש שאלה על ההזמנה? כתבו בוואטסאפ או התקשרו ל־<a href="tel:0546713966">054-6713966</a>.
          </p>
        </div>
      </main>
    </div>
  );
}
