import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "הספר | קשר של תפילין" },
      // TODO: remove noindex/nofollow when real book content goes live
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/book` }],
  }),
  component: BookPage,
});

function BookPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-5 py-16 text-center">
      <img
        src="/wp/img/אור-חדש-לוגו-01.svg"
        alt="לוגו קשר של תפילין"
        className="w-40 md:w-48 mb-8"
        width="192"
        height="73"
      />
      <h1 className="font-sans text-3xl md:text-4xl font-bold mb-6">
        הספר
      </h1>
      <p className="text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
        העמוד בהכנה. בקרוב יהיה כאן מידע על הספר ואפשרות להזמין אותו.
      </p>
      <a href="/" className="btn-e btn-mint-solid" aria-label="חזרה לדף הבית">
        חזרה לאתר
      </a>
    </div>
  );
}
