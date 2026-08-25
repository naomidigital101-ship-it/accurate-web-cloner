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
    // צירוף פסקאות עד שמגיעים לאורך שמיצג משהו: פסקה ראשונה שהיא רק "שלום הרב,"
    // יצרה תיאור בן 15 תווים שלא אומר לגוגל ולא לגולש שום דבר.
    const desc = buildDesc(story.paragraphs, story.title);
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
        {
          // פירורי לחם: בלי זה גוגל מציג את ה-URL הגולמי בתוצאה במקום מסלול קריא
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "קשר של תפילין", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "סיפורים", item: `${SITE_URL}/stories` },
              { "@type": "ListItem", position: 3, name: story.title, item: url },
            ],
          }),
        },
      ],
    };
  },
  /**
   * סלאג שאינו קיים חייב להחזיר 404 אמיתי ולא 200 עם "לא נמצא" - אחרת זה
   * soft-404: גוגל סופר את העמוד כתקין, וכל טעות בכתובת סיפור נבלעת בשקט.
   */
  loader: async ({ params }: { params: { slug: string } }): Promise<{ rows: DbStory[] | null }> => {
    const rows = await readStories("he");
    const list = rows && rows.length > 0 ? rows : stories;
    if (!list.some((s) => norm(s.slug) === norm(params.slug))) throw notFound();
    return { rows };
  },
  component: StoryPage,
});


/** תיאור מטא מתוך גוף הסיפור: מצרף פסקאות עד 110 תווים לפחות, וחותך ב-155 */
function buildDesc(paragraphs: string[] | undefined, fallback: string) {
  let out = "";
  for (const p of paragraphs ?? []) {
    if (out.length >= 110) break;
    out = out ? `${out} ${p}` : p;
  }
  const clean = (out || fallback).replace(/\s+/g, " ").trim();
  if (clean.length <= 155) return clean;
  const cut = clean.slice(0, 155);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 100 ? cut.lastIndexOf(" ") : 155)}...`;
}

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
