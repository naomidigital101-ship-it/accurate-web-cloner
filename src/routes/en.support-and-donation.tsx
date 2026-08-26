import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useSetting, useDonateUrl } from "@/lib/settings";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/en/support-and-donation")({
  head: () => ({
    meta: [
      { title: "Support & Donate | The Tefillin Tie Initiative" },
      { name: "description", content: "Partner with the Tefillin Tie Initiative - one-time or recurring donations supporting Jews who want to start putting on tefillin." },
      { property: "og:title", content: "Support & Donate | The Tefillin Tie Initiative" },
      { property: "og:description", content: "Partner with the Tefillin Tie Initiative - one-time or recurring donations supporting Jews who want to start putting on tefillin." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: `${SITE_URL}/en/support-and-donation` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/en/support-and-donation` }],
  }),
  component: Page,
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

function Page() {
  /**
   * שני הכרטיסים בעמוד האנגלי אינם "חד פעמי מול הוראת קבע" אלא שני ערוצי
   * סליקה בשתי מדינות: הכרטיס עם הלב מוביל לערוץ הישראלי, והשני לקרן נאמן
   * שהיא עמותה אמריקאית. לכן הכותרות מציינות את המדינה שבה התרומה מוכרת
   * לצרכי מס - זה ההבדל שמעניין את התורם, וזה גם מה שקורה בפועל בקישורים.
   */
  const onetime = useSetting("donate_onetime_url");
  const recurring = useDonateUrl("recurring", true);
  return (
    <PageShell title="support and donation" en>
      <p className="donate-intro">
        <strong>Your partnership is important to us!</strong><br />
        The costs of the project are high and it is being carried out thanks to many partners who take part in the unprecedented crowdfunding.
      </p>
      <div className="donate-cards">
        <div className="donate-card donate-card-onetime">
          <span className="donate-card-icon"><HeartIcon /></span>
          <h2>For tax purposes in Israel</h2>
          <p>Donations are tax-deductible</p>
          <a href={onetime} target="_blank" rel="noopener" className="btn-donate">Donate</a>
        </div>
        <div className="donate-card donate-card-recurring">
          <span className="donate-card-icon"><CardIcon /></span>
          <h2>For tax purposes in the USA</h2>
          <a href={recurring} target="_blank" rel="noopener" className="btn-donate">Donate</a>
        </div>
      </div>
    </PageShell>
  );
}
