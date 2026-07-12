import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/en/support-and-donation")({
  head: () => ({ meta: [{ title: "support and donation | The Tefillin Tie Initiative" }] }),
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
  return (
    <PageShell title="support and donation" en>
      <p className="donate-intro">
        <strong>Your partnership is important to us!</strong><br />
        The costs of the project are high and it is being carried out thanks to many partners who take part in the unprecedented crowdfunding.
      </p>
      <div className="donate-cards">
        <div className="donate-card donate-card-onetime">
          <span className="donate-card-icon"><HeartIcon /></span>
          <h2>One time donation</h2>
          <p>Donations are tax-deductible</p>
          <a href="https://bit.ly/tfil" target="_blank" rel="noopener" className="btn-donate">Donate</a>
        </div>
        <div className="donate-card donate-card-recurring">
          <span className="donate-card-icon"><CardIcon /></span>
          <h2>Donation by direct debit</h2>
          <a href="https://meshulam.co.il/s/08cd0725-9e8a-ece2-1540-638f28f8919f" target="_blank" rel="noopener" className="btn-donate">donate</a>
        </div>
      </div>
    </PageShell>
  );
}
