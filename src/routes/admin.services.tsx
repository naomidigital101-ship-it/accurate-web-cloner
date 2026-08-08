import { createFileRoute } from "@tanstack/react-router";

import { ContentManager, type FieldDef } from "@/components/admin/ContentManager";

export const Route = createFileRoute("/admin/services")({ component: Page });

const FIELDS: FieldDef[] = [
    { key: "title", label: "כותרת", type: "text", required: true },
    { key: "more_label", label: "טקסט הקישור", type: "text" },
    { key: "back_title", label: "כותרת בצד האחורי", type: "text" },
    { key: "back_text", label: "טקסט בצד האחורי", type: "textarea", full: true },
    { key: "img", label: "תמונת רקע", type: "image" },
    { key: "href", label: "קישור", type: "url" },
    { key: "card_height", label: "גובה הכרטיס", type: "number", hint: "בפיקסלים" },
];

function Page() {
  return (
    <ContentManager
      table="services"
      title="שירותים נוספים"
      subtitle="הכרטיסים המתהפכים בתחתית עמוד הבית."
      fields={FIELDS}
      columns={[{ key: "title", label: "כותרת" }, { key: "more_label", label: "טקסט קישור" }, { key: "img", label: "תמונה" }]}
      bilingual
    />
  );
}
