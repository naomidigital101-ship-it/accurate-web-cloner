import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title: "תרומה | קשר של תפילין" },
      { name: "description", content: "תמכו במיזם 'קשר של תפילין' של עמותת אור חדש - תרומה חד פעמית או הוראת קבע, מוכר לצרכי מס." },
      { property: "og:title", content: "תרומה | קשר של תפילין" },
      { property: "og:description", content: "תמכו במיזם 'קשר של תפילין' - חד פעמית או הוראת קבע, מוכר לצרכי מס." },
      { property: "og:url", content: "https://accurate-web-cloner.lovable.app/donate" },
    ],
    links: [{ rel: "canonical", href: "https://accurate-web-cloner.lovable.app/donate" }],
  }),
  component: DonatePage,
});

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

function DonatePage() {
  return (
    <PageShell title="תרומה">
      <p className="donate-intro">
        <strong>השותפות שלך חשובה לנו!</strong><br />
        עלויות הפרויקט גבוהות והוא מתקיים הודות לשותפים רבים שלוקחים חלק בזיכוי הרבים שאין כמותו.
      </p>
      <div className="donate-cards">
        <div className="donate-card donate-card-onetime">
          <span className="donate-card-icon"><HeartIcon /></span>
          <h2>תרומה חד פעמית</h2>
          <p>מוכר לצרכי מס</p>
          <a href="https://bit.ly/tfil" target="_blank" rel="noopener" className="btn-donate">לתרומה</a>
        </div>
        <div className="donate-card donate-card-recurring">
          <span className="donate-card-icon"><CardIcon /></span>
          <h2>תרומה בהוראת קבע</h2>
          <a href="https://meshulam.co.il/s/08cd0725-9e8a-ece2-1540-638f28f8919f" target="_blank" rel="noopener" className="btn-donate">לתרומה</a>
        </div>
      </div>
    </PageShell>
  );
}
