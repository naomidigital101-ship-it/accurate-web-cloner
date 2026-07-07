import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { enStories } from "@/data/en-stories";

export const Route = createFileRoute("/en/tefilin/$slug")({
  head: ({ params }) => {
    const story = enStories.find((s) => s.slug === params.slug);
    if (!story) {
      return {
        meta: [
          { title: "Story not found | The Tefillin Tie Initiative" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    return {
      meta: [{ title: `${story.title} | The Tefillin Tie Initiative` }],
    };
  },
  component: StoryPage,
});

function StoryPage() {
  const { slug } = Route.useParams();
  const idx = enStories.findIndex((s) => s.slug === slug);
  const story = enStories[idx];
  if (!story) {
    return (
      <PageShell title="stories" en>
        <p className="e-body-navy">Story not found. <Link to="/en/stories-2">All stories</Link></p>
      </PageShell>
    );
  }
  // Sort: newest → oldest. Prev = next in array (older), Next = previous (newer).
  const prev = enStories[idx + 1];
  const next = enStories[idx - 1];
  return (
    <PageShell title={story.title} en>
      <article className="story-e">
        {story.subtitle && <h2 className="story-subtitle">{story.subtitle}</h2>}
        <div className="qc-meta story-meta">
          {story.name && <span>{story.name}</span>}
          {story.place && <span>{story.place}</span>}
        </div>
        {story.paragraphs.map((p, i) => (
          <p key={i} className="story-par">{p}</p>
        ))}
        <nav className="story-nav" aria-label="Story navigation">
          {prev ? (
            <Link to="/en/tefilin/$slug" params={{ slug: prev.slug }} className="story-nav-link">
              <span>Prev סיפור קודם</span>
              <b>{prev.title}</b>
            </Link>
          ) : <span />}
          {next ? (
            <Link to="/en/tefilin/$slug" params={{ slug: next.slug }} className="story-nav-link story-nav-next">
              <span>הבא Next</span>
              <b>{next.title}</b>
            </Link>
          ) : <span />}
        </nav>
      </article>
    </PageShell>
  );
}
