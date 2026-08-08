import { createFileRoute } from "@tanstack/react-router";

import { ContentManager, type FieldDef } from "@/components/admin/ContentManager";

export const Route = createFileRoute("/admin/certificates")({ component: Page });

const FIELDS: FieldDef[] = [
    { key: "title", label: "שם האישור", type: "text", required: true },
    { key: "issuer", label: "גורם מנפיק", type: "text" },
    { key: "description", label: "תיאור", type: "textarea", full: true },
    { key: "valid_from", label: "בתוקף מתאריך", type: "date" },
    { key: "valid_until", label: "בתוקף עד", type: "date" },
    { key: "file_url", label: "קובץ האישור", type: "url" },
    { key: "thumb_url", label: "תמונת תצוגה", type: "image" },
];

function Page() {
  return (
    <ContentManager
      table="certificates"
      title="אישורי העמותה"
      subtitle="אישור ניהול תקין, סעיף 46 ותעודות נוספות."
      fields={FIELDS}
      columns={[{ key: "title", label: "שם האישור" }, { key: "issuer", label: "גורם מנפיק" }, { key: "valid_until", label: "בתוקף עד" }, { key: "thumb_url", label: "תצוגה" }]}
      
    />
  );
}
