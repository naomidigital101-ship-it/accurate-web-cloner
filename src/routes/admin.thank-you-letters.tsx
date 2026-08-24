import { createFileRoute } from "@tanstack/react-router";

import { ContentManager } from "@/components/admin/ContentManager";

export const Route = createFileRoute("/admin/thank-you-letters")({ component: Page });

function Page() {
  return (
    <ContentManager
      table="thank_you_letters"
      title="מכתבי תודה"
      subtitle="המכתבים שמופיעים בעמוד 'מכתבי תודה', בעברית ובאנגלית. הסדר כאן הוא הסדר באתר."
      bilingual
      defaults={{ status: "published", sort_order: 0 }}
      fields={[
        { key: "title", label: "כותרת המכתב", type: "text", required: true, full: true },
        { key: "sub", label: "שם הכותב או הגוף", type: "text", hint: "אפשר להשאיר ריק" },
        {
          key: "img",
          label: "סריקת המכתב",
          type: "image",
          required: true,
          full: true,
          hint: "מעלים את הקובץ במסך 'ספריית מדיה', מעתיקים את הכתובת ומדביקים כאן",
        },
      ]}
      columns={[
        { key: "title", label: "כותרת" },
        { key: "sub", label: "כותב" },
      ]}
    />
  );
}
