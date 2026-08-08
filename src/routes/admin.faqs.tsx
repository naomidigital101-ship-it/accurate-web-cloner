import { createFileRoute } from "@tanstack/react-router";

import { ContentManager, type FieldDef } from "@/components/admin/ContentManager";

export const Route = createFileRoute("/admin/faqs")({ component: Page });

const FIELDS: FieldDef[] = [
    { key: "question", label: "שאלה", type: "text", required: true },
    { key: "answer", label: "תשובה", type: "textarea", required: true, full: true },
];

function Page() {
  return (
    <ContentManager
      table="faqs"
      title="שאלות נפוצות"
      subtitle="מוצגות בעמוד הבית ומזינות את הסימון המובנה שגוגל ומנועי AI קוראים."
      fields={FIELDS}
      columns={[{ key: "question", label: "שאלה" }]}
      bilingual
    />
  );
}
