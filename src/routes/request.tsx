import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { RequestForm } from "@/components/home/FormTabsSection";

export const Route = createFileRoute("/request")({
  head: () => ({ meta: [{ title: "בקשת תפילין - קשר של תפילין" }] }),
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
