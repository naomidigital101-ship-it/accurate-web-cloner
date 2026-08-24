import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { DonateForm } from "@/components/home/FormTabsSection";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/give")({
  head: () => ({
    meta: [
      { title: "מסירת תפילין שאינן בשימוש | קשר של תפילין" },
      { name: "description", content: "יש לכם תפילין שאינן בשימוש? תרמו אותן לעמותת אור חדש - נבדוק, נחדש ונעביר אותן ליהודי שיניח אותן מדי יום. מלאו טופס מסירה." },
      { property: "og:title", content: "מסירת תפילין שאינן בשימוש | קשר של תפילין" },
      { property: "og:description", content: "יש לכם תפילין שאינן בשימוש? תרמו אותן לעמותת אור חדש - נבדוק, נחדש ונעביר אותן ליהודי שיניח אותן מדי יום. מלאו טופס מסירה." },
      { property: "og:url", content: `${SITE_URL}/give` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/give` }],
  }),
  component: GivePage,
});


function GivePage() {
  return (
    <PageShell title="מסירת/תרומת תפילין">
      <div className="formpage-wrap">
        <div className="form-card">
          <h2 className="form-card-title">יש לך תפילין מיותרות?</h2>
          <p className="form-card-sub">אנא מלא את הטופס כדי שתוכל לקיים בהם מצוה חשובה וזיכוי הרבים!</p>
          <DonateForm />
        </div>
      </div>
    </PageShell>
  );
}
