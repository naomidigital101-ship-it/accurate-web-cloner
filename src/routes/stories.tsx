import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { storyIndex } from "@/data/stories-index";
import { readStories } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/stories")({
  head: () => ({
    meta: [
      { title: "הסיפורים שמאחורי התפילין - סיפורים אמיתיים | קשר של תפילין" },
      { name: "description", content: "סיפורים אמיתיים ומרגשים של חיילים, נערי בר מצווה ומתחזקים שקיבלו תפילין מהמיזם. קראו איך זוג תפילין אחד משנה חיים שלמים." },
      { property: "og:title", content: "הסיפורים שמאחורי התפילין - סיפורים אמיתיים | קשר של תפילין" },
      { property: "og:description", content: "סיפורים אמיתיים ומרגשים של חיילים, נערי בר מצווה ומתחזקים שקיבלו תפילין מהמיזם. קראו איך זוג תפילין אחד משנה חיים שלמים." },
      { property: "og:url", content: `${SITE_URL}/stories/` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/stories/` }],
  }),
  // הרשימה מגיעה מה-DB; בלי זה נשארים על המערך שבקוד
  loader: async () => ({ stories: await readStories("he") }),
  component: StoriesPage,
});


function StoriesPage() {
  const { stories: fromDb } = Route.useLoaderData();
  const list = fromDb
    ? fromDb.map((s) => ({ title: s.title, slug: s.slug, img: s.img ?? "" }))
    : storyIndex;
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
        {list.map((s) => (
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
