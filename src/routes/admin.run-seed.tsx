import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { runSeed } from "@/lib/api/seed.functions";

/**
 * הרצת ההגירה דרך כתובת עם אסימון חד-פעמי, לשימוש בזמן ההקמה בלבד.
 * ה-loader רץ בשרת, ולכן אפשר להפעיל בלי דפדפן מחובר.
 * האסימון נשרף בהצלחה הראשונה.
 */
export const Route = createFileRoute("/admin/run-seed")({
  validateSearch: z.object({ token: z.string().optional() }),
  loaderDeps: ({ search }) => ({ token: search.token }),
  loader: async ({ deps }) => runSeed(deps.token),
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: Page,
});

function Page() {
  const data = Route.useLoaderData();
  return (
    <pre dir="ltr" style={{ padding: 24, fontSize: 13, whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
