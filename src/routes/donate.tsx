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
