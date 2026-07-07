import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { StoryShell } from "@/components/StoryShell";
import { stories } from "@/data/stories";


export const Route = createFileRoute("/tefilin/$slug")({
  head: ({ params }) => {
    const slug = params.slug;
    const story = stories.find((s) => norm(s.slug) === norm(slug));
    if (!story) {
      return {
        meta: [
          { title: "סיפור לא נמצא | קשר של תפילין" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const url = `https://accurate-web-cloner.lovable.app/tefilin/${slug}`;
    const desc = (story.paragraphs?.[0] ?? story.title).replace(/\s+/g, " ").slice(0, 155);
    const title = `${story.title.slice(0, 55)} | קשר של תפילין`;
    const image = story.img?.startsWith("http") ? story.img : `https://accurate-web-cloner.lovable.app${story.img}`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: image },
        { name: "twitter:image", content: image },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: story.title,
            description: desc,
            image,
            author: { "@type": "Person", name: story.author },
            publisher: {
              "@type": "Organization",
              name: "עמותת אור חדש",
              logo: {
                "@type": "ImageObject",
                url: "https://accurate-web-cloner.lovable.app/wp/img/אור-חדש-לוגו-01.svg",
              },
            },
            mainEntityOfPage: url,
          }),
        },
      ],
    };
  },
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
