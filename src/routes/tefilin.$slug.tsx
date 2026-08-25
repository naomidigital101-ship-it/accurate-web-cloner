import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { StoryShell } from "@/components/StoryShell";
import { stories } from "@/data/stories";
import { readStories, type DbStory } from "@/lib/content";
import { SITE_URL } from "@/lib/site";


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
    const url = `${SITE_URL}/tefilin/${slug}`;
    const desc = (story.paragraphs?.[0] ?? story.title).replace(/\s+/g, " ").slice(0, 155);
    const title = `${story.title.slice(0, 55)} | קשר של תפילין`;
    const image = story.img?.startsWith("http") ? story.img : `${SITE_URL}${story.img}`;
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
                url: `${SITE_URL}/wp/img/אור-חדש-לוגו-01.svg`,
              },
            },
            mainEntityOfPage: url,
          }),
        },
      ],
    };
  },
  /**
   * סלאג שאינו קיים חייב להחזיר 404 אמיתי ולא 200 עם "לא נמצא" - אחרת זה
   * soft-404: גוגל סופר את העמוד כתקין, וכל טעות בכתובת סיפור נבלעת בשקט.
   */
  loader: async ({ params }) => {
    const rows = await readStories("he");
    const list = rows && rows.length > 0 ? rows : stories;
    if (!list.some((s) => norm(s.slug) === norm(params.slug))) throw notFound();
    return { rows };
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
  const { rows } = Route.useLoaderData();
  // ה-DB הוא המקור; אם אינו זמין נופלים למערך שבקוד ושום סיפור לא נעלם
  const list = rows && rows.length > 0
    ? rows.map((r) => ({
        slug: r.slug, title: r.title, subtitle: r.subtitle ?? "", author: r.author ?? "",
        city: r.city ?? "", img: r.img ?? "", extraImg: r.extra_img ?? undefined,
        paragraphs: r.paragraphs ?? [],
      }))
    : stories;
  const idx = list.findIndex((s) => norm(s.slug) === norm(slug));
  const story = list[idx];
  if (!story) {
    return (
      <PageShell title="סיפורים">
        <p className="e-body-navy">הסיפור לא נמצא. <Link to="/stories">לכל הסיפורים</Link></p>
      </PageShell>
    );
  }
  const prev = list[idx - 1];
  const next = list[idx + 1];
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
