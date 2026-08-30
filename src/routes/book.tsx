import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "הספר | קשר של תפילין" },
      // TODO: הסרת noindex/nofollow כשהתוכן האמיתי יעלה
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/book` }],
  }),
  component: BookPage,
});

function BookPage() {
  return (
    <PageShell title="הספר">
      <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
        <p className="text-lg md:text-xl max-w-2xl mb-8 leading-relaxed">
          העמוד בהכנה. בקרוב יהיה כאן מידע על הספר ואפשרות להזמין אותו.
        </p>
        <a href="/" className="btn-e btn-mint-solid" aria-label="חזרה לדף הבית">
          חזרה לאתר
        </a>
      </div>
    </PageShell>
  );
}
