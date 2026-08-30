import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { SITE_URL } from "@/lib/site";

const PAGE_TITLE = "[שם הספר] | קשר של תפילין";
const PAGE_DESC = "[תיאור קצר של הספר למנועי חיפוש — יש להחליף כשהתוכן האמיתי יהיה מוכן]";
const PAGE_URL = `${SITE_URL}/book`;

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESC },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESC },
      { property: "og:type", content: "product" },
      { property: "og:url", content: PAGE_URL },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
  }),
  component: BookPage,
});

function BookPage() {
  return (
    <PageShell title="[שם הספר]">
      <section className="book-hero" aria-labelledby="book-hero-title">
        <div className="book-hero-text">
          <p id="book-hero-title" className="book-hero-tagline">
            [משפט אחד שמסביר על מה הספר]
          </p>
          <p className="book-hero-price">[מחיר]</p>
          <a href="#" className="btn-e btn-mint-solid book-hero-cta" aria-label="לרכישת הספר">
            לרכישת הספר
          </a>
        </div>
        <div className="book-hero-media">
          <div
            className="book-cover-placeholder"
            role="img"
            aria-label="[כאן תופיע תמונת הספר]"
          >
            <span>[כאן תופיע תמונת הספר]</span>
          </div>
        </div>
      </section>

      <section className="book-section" aria-labelledby="book-about-title">
        <h2 id="book-about-title">על הספר</h2>
        <p>[תיאור מלא של הספר — פסקה ראשונה שמסבירה את הרקע, התוכן והמסר המרכזי]</p>
        <p>[תיאור מלא של הספר — פסקה שנייה שמפרטת את המבנה, הפרקים או הסיפורים שבתוכו]</p>
        <p>[תיאור מלא של הספר — פסקה שלישית שמדגישה את הערך המיוחד והמקוריות של הספר]</p>
      </section>

      <section className="book-section" aria-labelledby="book-audience-title">
        <h2 id="book-audience-title">למי הספר מיועד</h2>
        <p>[קהל היעד — הסבר מי ייהנה מהספר, אילו שאלות הוא עונה עליהן, ולמה כדאי לו לקרוא אותו]</p>
      </section>

      <section className="book-section" aria-labelledby="book-details-title">
        <h2 id="book-details-title">פרטי הספר</h2>
        <ul className="book-details">
          <li><span>מספר עמודים:</span> [מספר עמודים]</li>
          <li><span>סוג כריכה:</span> [סוג הכריכה]</li>
          <li><span>שנת הוצאה:</span> [שנת הוצאה]</li>
        </ul>
      </section>

      <section className="book-section" aria-labelledby="book-testimonials-title">
        <h2 id="book-testimonials-title">מה אומרים על הספר</h2>
        <div className="book-testimonials">
          <blockquote className="book-testimonial">
            <p>[טקסט ההמלצה הראשון — ציטוט קצר ונקי]</p>
            <footer>
              <strong>[שם מלא]</strong>
              <span>[תפקיד או עיר]</span>
            </footer>
          </blockquote>
          <blockquote className="book-testimonial">
            <p>[טקסט ההמלצה השני — ציטוט קצר ונקי]</p>
            <footer>
              <strong>[שם מלא]</strong>
              <span>[תפקיד או עיר]</span>
            </footer>
          </blockquote>
          <blockquote className="book-testimonial">
            <p>[טקסט ההמלצה השלישי — ציטוט קצר ונקי]</p>
            <footer>
              <strong>[שם מלא]</strong>
              <span>[תפקיד או עיר]</span>
            </footer>
          </blockquote>
        </div>
      </section>

      <section className="book-cta-band" aria-label="קריאה לפעולה לרכישת הספר">
        <a href="#" className="btn-e btn-mint-solid" aria-label="לרכישת הספר">
          לרכישת הספר — [מחיר]
        </a>
      </section>

      <section className="book-section" aria-labelledby="book-shipping-title">
        <h2 id="book-shipping-title">משלוח והחזרות</h2>
        <p><strong>משלוח:</strong> [מדיניות המשלוח — לאן נשלח, איך נארז, ומי מבצע]</p>
        <p><strong>זמן אספקה:</strong> [זמן אספקה — כמה ימים עד שהספר מגיע]</p>
        <p><strong>ביטול והחזרה:</strong> [מדיניות ביטול והחזרה — תנאים ומגבלות]</p>
        <div className="book-contact">
          <p>
            לשאלות וסיוע: <a href="tel:[טלפון]">[טלפון]</a>
          </p>
          <p>
            או בדוא"ל: <a href="mailto:[מייל]">[מייל]</a>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
