import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { storyIndex } from "@/data/stories-index";

export const Route = createFileRoute("/stories")({
  head: () => ({ meta: [{ title: "סיפורים - קשר של תפילין" }] }),
  component: StoriesPage,
});

function StoriesPage() {
  return (
    <PageShell title="סיפורים">
      <a href="/en" className="eng-link">For the stories <b>In English</b></a>
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
