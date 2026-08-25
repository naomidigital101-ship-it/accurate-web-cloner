import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { StoryShell } from "@/components/StoryShell";
import { PageShell } from "@/components/PageShell";
import { enStories } from "@/data/en-stories";
import { readStories } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

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
    const url = `${SITE_URL}/en/tefilin/${params.slug}`;
    const desc = (story.paragraphs?.[0] ?? story.title).replace(/\s+/g, " ").slice(0, 155);
    const title = `${story.title} | The Tefillin Tie Initiative`;
    const image = story.img.startsWith("http") ? story.img : `${SITE_URL}${story.img}`;
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
    };
  },
  /**
   * סלאג שאינו קיים חייב להחזיר 404 אמיתי ולא 200 עם "לא נמצא" - אחרת זה
   * soft-404: גוגל סופר את העמוד כתקין, וכל טעות בכתובת סיפור נבלעת בשקט.
   */
  loader: async ({ params }) => {
    const rows = await readStories("en");
    const list = rows && rows.length > 0 ? rows : enStories;
    if (!list.some((s) => s.slug === params.slug)) throw notFound();
    return { rows };
  },
  component: StoryPage,
});

function StoryPage() {
  const { slug } = Route.useParams();
  const { rows } = Route.useLoaderData();
  const list = rows && rows.length > 0
    ? rows.map((r) => ({
        slug: r.slug, title: r.title, subtitle: r.subtitle ?? "", name: r.author ?? "",
        place: r.city ?? "", img: r.img ?? "", paragraphs: r.paragraphs ?? [],
      }))
    : enStories;
  const idx = list.findIndex((s) => s.slug === slug);
  const story = list[idx];
  if (!story) {
    return (
      <PageShell title="stories" en>
        <p className="e-body-navy">Story not found. <Link to="/en/stories-2">All stories</Link></p>
      </PageShell>
    );
  }
  // Sort: newest → oldest. Prev = next in array (older), Next = previous (newer).
  const prev = list[idx + 1];
  const next = list[idx - 1];
  return (
    <StoryShell
      en
      title={story.title}
      subtitle={story.subtitle}
      name={story.name || undefined}
      place={story.place || undefined}
      img={story.img}
      paragraphs={story.paragraphs}
      prev={prev ? { slug: prev.slug, title: prev.title } : undefined}
      next={next ? { slug: next.slug, title: next.title } : undefined}
    />
  );
}
