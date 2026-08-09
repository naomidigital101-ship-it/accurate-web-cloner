import { createFileRoute } from "@tanstack/react-router";

import { ContentManager, type FieldDef } from "@/components/admin/ContentManager";

export const Route = createFileRoute("/admin/stories")({ component: Page });

const FIELDS: FieldDef[] = [
    { key: "slug", label: "כתובת בקישור (slug)", type: "text", hint: "מופיע בכתובת העמוד. לא לשנות אחרי פרסום.", required: true },
    { key: "title", label: "כותרת", type: "text", required: true },
    { key: "subtitle", label: "כותרת משנה", type: "text" },
    { key: "author", label: "שם המספר/ת", type: "text" },
    { key: "city", label: "יישוב", type: "text" },
    { key: "img", label: "תמונה ראשית", type: "image", hint: "נתיב או כתובת מלאה" },
    { key: "extra_img", label: "תמונה נוספת", type: "image" },
    { key: "paragraphs", label: "גוף הסיפור", type: "lines", hint: "שורה ריקה בין פסקאות", full: true },
  { key: "meta_title", label: "כותרת לגוגל", hint: "ריק - נגזר מהכותרת" },
  { key: "meta_description", label: "תיאור לגוגל", type: "textarea", hint: "עד 155 תווים", full: true },
  { key: "og_image_url", label: "תמונה לשיתוף ברשתות", type: "image" },
];

function Page() {
  return (
    <ContentManager
      table="stories"
      title="סיפורים"
      subtitle="הסיפורים שמאחורי התפילין. כל סיפור מקבל עמוד משלו באתר."
      fields={FIELDS}
      columns={[{ key: "title", label: "כותרת" }, { key: "author", label: "מספר/ת" }, { key: "city", label: "יישוב" }, { key: "img", label: "תמונה" }]}
      bilingual
    />
  );
}
