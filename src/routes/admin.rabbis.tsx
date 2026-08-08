import { createFileRoute } from "@tanstack/react-router";

import { ContentManager, type FieldDef } from "@/components/admin/ContentManager";

export const Route = createFileRoute("/admin/rabbis")({ component: Page });

const FIELDS: FieldDef[] = [
    { key: "name", label: "שם הרב", type: "text", required: true },
    { key: "role", label: "תפקיד", type: "text" },
    { key: "letter_url", label: "קובץ המכתב", type: "image" },
    { key: "portrait_url", label: "תמונת דיוקן", type: "image" },
];

function Page() {
  return (
    <ContentManager
      table="rabbi_letters"
      title="הסכמות רבנים"
      subtitle="מכתבי ההסכמה והברכה. הסדר כאן הוא הסדר באתר."
      fields={FIELDS}
      columns={[{ key: "name", label: "שם" }, { key: "role", label: "תפקיד" }, { key: "portrait_url", label: "תמונה" }]}
      bilingual
    />
  );
}
