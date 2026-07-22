import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { DonateForm } from "@/components/home/FormTabsSection";

export const Route = createFileRoute("/give")({
  head: () => ({
    meta: [
      { title: "מסירת תפילין | קשר של תפילין" },
      { name: "description", content: "יש לך תפילין שאינם בשימוש? מלא את הטופס ותרום אותן ליהודי שרוצה להניח." },
      { property: "og:title", content: "מסירת תפילין | קשר של תפילין" },
      { property: "og:description", content: "יש לך תפילין שאינם בשימוש? תרום אותן ליהודי שרוצה להניח." },
      { property: "og:url", content: "https://accurate-web-cloner.lovable.app/give/" },
    ],
    links: [{ rel: "canonical", href: "https://accurate-web-cloner.lovable.app/give/" }],
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
