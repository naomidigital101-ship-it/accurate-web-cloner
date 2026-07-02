import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { stories } from "@/data/stories";

export const Route = createFileRoute("/tefilin/$slug")({
  component: StoryPage,
});

function norm(s: string) {
  try {
    return decodeURIComponent(s).normalize("NFC").replace(/\/$/, "");
  } catch {
    return s.normalize("NFC");
  }
}

function StoryPage() {
  const { slug } = Route.useParams();
  const idx = stories.findIndex((s) => norm(s.slug) === norm(slug));
  const story = stories[idx];
  if (!story) {
    return (
      <PageShell title="סיפורים">
        <p className="e-body-navy">הסיפור לא נמצא. <Link to="/stories">לכל הסיפורים</Link></p>
      </PageShell>
    );
  }
  const prev = stories[idx - 1];
  const next = stories[idx + 1];
  return (
    <PageShell title={story.title}>
      <article className="story-e">
        {story.subtitle && <h2 className="story-subtitle">{story.subtitle}</h2>}
        <div className="qc-meta story-meta">
          <span>{story.author}</span>
          {story.city && <span>{story.city}</span>}
        </div>
        {story.paragraphs.map((p, i) => (
          <p key={i} className="story-par" dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>") }} />
        ))}
        {story.extraImg && <img src={story.extraImg} alt="" className="story-extra-img" loading="lazy" />}
        <nav className="story-nav" aria-label="ניווט בין סיפורים">
          {prev ? (
            <Link to="/tefilin/$slug" params={{ slug: prev.slug }} className="story-nav-link">
              <span>סיפור קודם</span>
              <b>{prev.title}</b>
            </Link>
          ) : <span />}
          {next ? (
            <Link to="/tefilin/$slug" params={{ slug: next.slug }} className="story-nav-link story-nav-next">
              <span>הסיפור הבא</span>
              <b>{next.title}</b>
            </Link>
          ) : <span />}
        </nav>
      </article>
    </PageShell>
  );
}
