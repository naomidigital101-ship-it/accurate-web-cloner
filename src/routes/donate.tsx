import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/donate")({
  head: () => ({ meta: [{ title: "תרומה - קשר של תפילין" }] }),
  component: DonatePage,
});

function DonatePage() {
  return (
    <PageShell title="תרומה">
      <p className="donate-intro">
        <b>השותפות שלך חשובה לנו!</b> עלויות הפרויקט גבוהות והוא מתקיים הודות לשותפים רבים שלוקחים חלק בזיכוי הרבים שאין כמותו.
      </p>
      <div className="donate-cards">
        <div className="donate-card">
          <h2>תרומה חד פעמית</h2>
          <p>מוכר לצרכי מס</p>
          <a href="https://bit.ly/tfil" target="_blank" rel="noopener" className="btn-e btn-mint-solid">לתרומה</a>
        </div>
        <div className="donate-card">
          <h2>תרומה בהוראת קבע</h2>
          <a href="https://meshulam.co.il/s/08cd0725-9e8a-ece2-1540-638f28f8919f" target="_blank" rel="noopener" className="btn-e btn-mint-solid">לתרומה</a>
        </div>
      </div>
    </PageShell>
  );
}
