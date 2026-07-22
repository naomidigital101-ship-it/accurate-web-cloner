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
    const url = `https://accurate-web-cloner.lovable.app/tefilin/${slug}/`;
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
    <StoryShell
      title={story.title}
      subtitle={story.subtitle}
      name={story.author}
      place={story.city}
      img={story.img}
      extraImg={story.extraImg}
      paragraphs={story.paragraphs}
      prev={prev ? { slug: prev.slug, title: prev.title } : undefined}
      next={next ? { slug: next.slug, title: next.title } : undefined}
    />
  );
}
