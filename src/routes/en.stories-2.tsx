import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { readStories } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

type EnStory = { slug: string; title: string; img: string };

const stories: EnStory[] = [
  { slug: "divine-providence-in-kibbutz-nir-oz", title: "DIVINE PROVIDENCE IN KIBBUTZ NIR OZ", img: "/wp/uploads/2024/05/Nir_Oz_-_01.jpg" },
  { slug: "after-four-miracles-g-d-left-him-no-choice", title: "AFTER FOUR MIRACLES, G-D LEFT HIM NO CHOICE", img: "/wp/uploads/2024/04/נובה.jpg" },
  { slug: "parents-to-the-rescue", title: "PARENTS TO THE RESCUE", img: "/wp/uploads/2024/01/תמונת-עמוד-קשר-של-תפילין-min.webp" },
  { slug: "the-cooperative-father-to-a-point", title: "THE COOPERATIVE FATHER – TO A POINT", img: "/wp/uploads/2024/05/הבן-של-י.png" },
  { slug: "the-whispered-request", title: "THE WHISPERED REQUEST", img: "/wp/uploads/2024/01/tallit-tefillin-white-background-min.webp" },
  { slug: "moshes-mother-recovers", title: "M.'S MOTHER RECOVERS", img: "/wp/uploads/2024/01/מושיקו-מעלה-אדומים.jpg" },
  { slug: "the-tefillin-tie-from-boston-to-zikhron-yaakov", title: "FROM BOSTON TO ZIKHRON YAAKOV", img: "/wp/uploads/2024/04/min-e1715770154894-300x278-1.webp" },
  { slug: "tefillin-awakening-all-over-the-world", title: "TEFILLIN AWAKENING ALL OVER THE WORLD", img: "/wp/uploads/2024/01/cropped-hand-wrapped-tefillin-min.webp" },
  { slug: "from-kibbutz-to-western-wall", title: "FROM KIBBUTZ TO WESTERN WALL", img: "/wp/uploads/2024/05/רונן-min-300x225-1.png" },
  { slug: "the-story-of-rabbi-katz-and-daniel-from-tel-aviv", title: "The story of Rabbi Katz and D. from Tel Aviv", img: "/wp/uploads/2024/01/battlefield-reconstruction-battle-second-world-war-battle-sevastopol-min.webp" },
  { slug: "the-story-of-yehezkel-meir-zl-from-petach-tikva-and-benny-from-kiryat-malachi", title: "The story of Yehezkel Meir z\"l from Petach Tikva, and B. from Kiryat Malachi", img: "/wp/uploads/2024/01/אחרי-1-min.webp" },
  { slug: "the-story-of-ami-from-rehovot", title: "CLOSE TO HOME!", img: "/wp/uploads/2024/01/cropped-hand-wrapped-tefillin-min.webp" },
  { slug: "the-story-of-g-from-kiryat-gat", title: "The story of G. from Kiryat Gat", img: "/wp/uploads/2024/01/גלעד-178x300-1.png" },
  { slug: "the-story-of-k-from-the-kibbutz-near-the-gaza-strip", title: "The story of K. from the kibbutz near the Gaza Strip", img: "/wp/uploads/2024/01/נתיב-העשרה.jpg" },
  { slug: "the-story-of-i-from-rosh-haayin", title: "The story of I. from Rosh Ha'Ayin", img: "/wp/uploads/2024/01/קשת-2-min-225x300-1.png" },
];

export const Route = createFileRoute("/en/stories-2")({
  head: () => ({
    meta: [
      { title: "Tefillin Stories - Real Lives Changed | The Tefillin Tie Initiative" },
      { name: "description", content: "True stories of soldiers, Bar Mitzvah boys and returnees who received tefillin through the initiative - read how one pair changes a life." },
      { property: "og:title", content: "Tefillin Stories - Real Lives Changed | The Tefillin Tie Initiative" },
      { property: "og:description", content: "True stories of soldiers, Bar Mitzvah boys and returnees who received tefillin through the initiative - read how one pair changes a life." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: `${SITE_URL}/en/stories-2/` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/en/stories-2/` }],
  }),
  loader: async () => ({ rows: await readStories("en") }),
  component: Page,
});

function Page() {
  const { rows } = Route.useLoaderData();
  const list = rows && rows.length > 0
    ? rows.map((r) => ({ slug: r.slug, title: r.title, img: r.img ?? "" }))
    : stories;
  return (
    <PageShell title="stories" en>
      <a href="/stories/" className="eng-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        צפייה בסיפורים בעברית
      </a>
      <div className="stories-page-grid">
        {list.map((s) => (
          <a key={s.slug} href={`/en/tefilin/${s.slug}`} className="st-card" style={{ backgroundImage: `url('${s.img}')` }}>
            <span className="st-card-panel">
              <h3 className="st-card-title">{s.title}</h3>
            </span>
          </a>
        ))}
      </div>
    </PageShell>
  );
}
