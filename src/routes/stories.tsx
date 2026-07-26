import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { storyIndex } from "@/data/stories-index";

export const Route = createFileRoute("/stories")({
  head: () => ({
    meta: [
      { title: "סיפורים | קשר של תפילין" },
      { name: "description", content: "סיפורים אמיתיים ומרגשים של יהודים שקיבלו תפילין ממיזם 'קשר של תפילין' של עמותת אור חדש." },
      { property: "og:title", content: "סיפורים | קשר של תפילין" },
      { property: "og:description", content: "סיפורים אמיתיים ומרגשים של יהודים שקיבלו תפילין ממיזם 'קשר של תפילין'." },
      { property: "og:url", content: "https://accurate-web-cloner.lovable.app/stories/" },
    ],
    links: [{ rel: "canonical", href: "https://accurate-web-cloner.lovable.app/stories/" }],
  }),
  component: StoriesPage,
});


function StoriesPage() {
  return (
    <PageShell title="סיפורים">
      <a href="/en/the-tefillin-tie-initiative/" className="eng-link" aria-label="לסיפורים באנגלית">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20a15.3 15.3 0 0 1 0-20" />
        </svg>
        For the stories <b>In English</b>
      </a>
      <div className="stories-page-grid">
        {storyIndex.map((s) => (
          <a key={s.slug} href={`/tefilin/${s.slug}`} className="st-card" style={{ backgroundImage: `url('${s.img}')` }}>
            <span className="st-card-panel">
              <h3 className="st-card-title">{s.title}</h3>
            </span>
          </a>
        ))}
      </div>
    </PageShell>
  );
}
