import { createFileRoute } from "@tanstack/react-router";

import { ContentManager, type FieldDef } from "@/components/admin/ContentManager";

export const Route = createFileRoute("/admin/gallery")({ component: Page });

const FIELDS: FieldDef[] = [
    { key: "url", label: "כתובת התמונה", type: "image", required: true },
    { key: "alt", label: "תיאור לקורא מסך", type: "text", hint: "חשוב לנגישות" },
];

function Page() {
  return (
    <ContentManager
      table="gallery_images"
      title="גלריה"
      subtitle="התמונות שמופיעות ברצועת הגלריה בתחתית האתר."
      fields={FIELDS}
      columns={[{ key: "url", label: "תמונה" }, { key: "alt", label: "תיאור לקורא מסך" }]}
      
    />
  );
}
