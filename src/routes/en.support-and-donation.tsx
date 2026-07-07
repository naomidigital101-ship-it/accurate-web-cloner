import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/en/support-and-donation")({
  head: () => ({ meta: [{ title: "support and donation | The Tefillin Tie Initiative" }] }),
  component: Page,
});

function Page() {
  return (
    <PageShell title="support and donation" en>
      <p className="donate-intro">
        <b>Your partnership is important to us!</b> The costs of the project are high and it is being carried out thanks to many partners who take part in the unprecedented crowdfunding.
      </p>
      <div className="donate-cards">
        <div className="donate-card">
          <h2>One time donation</h2>
          <p>Donations are tax-deductible</p>
          <a href="https://bit.ly/tfil" target="_blank" rel="noopener" className="btn-e btn-mint-solid">Donate</a>
        </div>
        <div className="donate-card">
          <h2>Donation by direct debit</h2>
          <a href="https://meshulam.co.il/s/08cd0725-9e8a-ece2-1540-638f28f8919f" target="_blank" rel="noopener" className="btn-e btn-mint-solid">donate</a>
        </div>
      </div>
    </PageShell>
  );
}
