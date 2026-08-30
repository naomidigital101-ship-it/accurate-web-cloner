import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/start")({
  head: () => ({
    meta: [
      { title: "תודה שקראתם | קשר של תפילין" },
      // This page is a QR link hub, not indexed content; keep noindex permanently.
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/start` }],
  }),
  component: StartPage,
});

function StartPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center px-5 py-10">
      <img
        src="/wp/img/אור-חדש-לוגו-01.svg"
        alt="לוגו קשר של תפילין"
        className="w-44 md:w-52 mb-10"
        width="208"
        height="79"
      />
      <h1 className="font-sans text-2xl md:text-3xl font-bold text-center mb-10">
        תודה שקראתם
      </h1>
      <nav className="w-full max-w-md flex flex-col gap-4" aria-label="קישורים מהירים">
        {/* destination to be filled in later */}
        <a
          href="#"
          className="btn-e btn-mint-solid flex w-full justify-center py-5 text-lg md:text-xl"
        >
          להזמנת עותקים נוספים
        </a>
        {/* destination to be filled in later */}
        <a
          href="#"
          className="btn-e btn-mint-solid flex w-full justify-center py-5 text-lg md:text-xl"
        >
          לתרומה לעמותה
        </a>
        {/* destination to be filled in later */}
        <a
          href="#"
          className="btn-e btn-mint-solid flex w-full justify-center py-5 text-lg md:text-xl"
        >
          Donate (US tax purposes)
        </a>
        {/* destination to be filled in later */}
        <a
          href="#"
          className="btn-e btn-mint-solid flex w-full justify-center py-5 text-lg md:text-xl"
        >
          ליצירת קשר
        </a>
      </nav>
    </div>
  );
}
