import { createFileRoute } from "@tanstack/react-router";

import { ContentManager, type FieldDef } from "@/components/admin/ContentManager";

export const Route = createFileRoute("/admin/press")({ component: Page });

const FIELDS: FieldDef[] = [
    { key: "source", label: "שם הגוף המפרסם", type: "text", required: true },
    { key: "title", label: "כותרת הכתבה", type: "text" },
    { key: "published_label", label: "תאריך כפי שיוצג", type: "text", hint: "טקסט חופשי, למשל 21/04/2025" },
    { key: "href", label: "קישור לכתבה", type: "url" },
    { key: "logo_url", label: "לוגו", type: "image" },
];

function Page() {
  return (
    <ContentManager
      table="press_items"
      title="כתבות בתקשורת"
      subtitle="פרסומים על המיזם. מוצגים בעמוד הבית ובעמוד הכתבות."
      fields={FIELDS}
      columns={[{ key: "source", label: "מקור" }, { key: "title", label: "כותרת" }, { key: "published_label", label: "תאריך" }, { key: "logo_url", label: "לוגו" }]}
      bilingual
    />
  );
}
