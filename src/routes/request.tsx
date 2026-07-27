import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { RequestForm } from "@/components/home/FormTabsSection";

export const Route = createFileRoute("/request")({
  head: () => ({
    meta: [
      { title: "בקשת תפילין - טופס פנייה | קשר של תפילין" },
      { name: "description", content: "רוצים להתחיל להניח תפילין? מלאו טופס קצר ונדאג לכם לזוג תפילין מהודר וכשר - לחיילים, נערי בר מצווה, מתחזקים וכל יהודי." },
      { property: "og:title", content: "בקשת תפילין - טופס פנייה | קשר של תפילין" },
      { property: "og:description", content: "רוצים להתחיל להניח תפילין? מלאו טופס קצר ונדאג לכם לזוג תפילין מהודר וכשר - לחיילים, נערי בר מצווה, מתחזקים וכל יהודי." },
      { property: "og:url", content: "https://accurate-web-cloner.lovable.app/request/" },
    ],
    links: [{ rel: "canonical", href: "https://accurate-web-cloner.lovable.app/request/" }],
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
