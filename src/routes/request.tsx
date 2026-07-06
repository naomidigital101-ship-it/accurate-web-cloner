import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { RequestForm } from "@/components/home/FormTabsSection";

export const Route = createFileRoute("/request")({
  head: () => ({
    meta: [
      { title: "בקשת תפילין | קשר של תפילין" },
      { name: "description", content: "רוצה להניח תפילין משלך? מלא את הטופס ונדאג לך לזוג תפילין מהודר ומחודש." },
      { property: "og:title", content: "בקשת תפילין | קשר של תפילין" },
      { property: "og:description", content: "רוצה להניח תפילין משלך? מלא את הטופס ונדאג לך לזוג תפילין מהודר." },
      { property: "og:url", content: "https://accurate-web-cloner.lovable.app/request" },
    ],
    links: [{ rel: "canonical", href: "https://accurate-web-cloner.lovable.app/request" }],
  }),
  component: RequestPage,
});


function RequestPage() {
  return (
    <PageShell title="בקשת תפילין">
      <div className="formpage-wrap">
        <div className="form-card">
          <h2 className="form-card-title">רוצה להניח תפילין משלך?</h2>
          <p className="form-card-sub">אנא מלא את הטופס המצורף כדי שנוכל לעזור לך לקבל תפילין משלך!</p>
          <RequestForm />
        </div>
      </div>
    </PageShell>
  );
}
