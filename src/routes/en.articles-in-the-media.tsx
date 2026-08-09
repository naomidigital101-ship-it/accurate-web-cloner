import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { readPress } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

type PressItem = {
  title: string;
  source: string;
  date: string;
  href: string;
  img?: string;
  logoText?: string;
};

export const press: PressItem[] = [
  {
    title: "How Hamas Brought Jews Back to Judaism",
    source: "HAMODIA",
    date: "27/10/2024",
    href: "/wp/uploads/2024/10/DOC-20241014-WA0015.pdf",
    img: "/wp/uploads/2024/10/לוגו-המודיע.jpg",
  },
  {
    title: "“Tightening the Bond” - article in the B'Sheva newspaper",
    source: "B'Sheva",
    date: "16/08/2024",
    href: "https://www.inn.co.il/news/646944",
    img: "/wp/uploads/2024/09/ערוץ-7-1.jpg",
  },
  {
    title: "Strapped Together",
    source: "Mishpacha Magazine",
    date: "MARCH 5, 2024",
    href: "https://mishpacha.com/strapped-together/",
    img: "/wp/uploads/2024/05/משפחה-לוגו.webp",
  },
  {
    title: "Uniting the Jewish People through the mitzva of tefillin",
    source: "Israel National News",
    date: "Jun 17, 2024, 12:00",
    href: "https://www.israelnationalnews.com/news/388053",
    img: "/wp/uploads/2024/07/ערוץ-7-באנגלית-2.jpg",
  },
];

export const Route = createFileRoute("/en/articles-in-the-media")({
  head: () => ({
    meta: [
      { title: "In the Media | The Tefillin Tie Initiative" },
      { name: "description", content: "Media coverage of the Tefillin Tie Initiative: Hamodia, Mishpacha Magazine, Israel National News and more." },
      { property: "og:title", content: "In the Media | The Tefillin Tie Initiative" },
      { property: "og:description", content: "Media coverage of the Tefillin Tie Initiative: Hamodia, Mishpacha Magazine, Israel National News and more." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: `${SITE_URL}/en/articles-in-the-media/` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/en/articles-in-the-media/` }],
  }),
  loader: async () => ({ press: await readPress("en") }),
  component: Page,
});

function Page() {
  const { press: fromDb } = Route.useLoaderData();
  const list = fromDb
    ? fromDb.map((p) => ({ title: p.title ?? "", source: p.source, date: p.published_label ?? "", href: p.href ?? "#", img: p.logo_url ?? undefined, logoText: p.logo_text ?? undefined }))
    : press;
  return (
    <PageShell title="articles in the media" en>
      <div className="news-list">
        {list.map((p, i) => (
          <a key={i} href={p.href} target="_blank" rel="noopener" className="press-item">
            {p.img ? (
              <span className="press-item-logo" style={{ backgroundImage: `url('${p.img}')` }} />
            ) : (
              <span
                className="press-item-logo"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#060633",
                  color: "#fff",
                  fontFamily: "\"Maadim\", \"Maadim OS\", sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: 1,
                }}
              >
                {p.logoText}
              </span>
            )}
            <span className="press-item-body">
              <span className="press-item-title">{p.title}</span>
              <span className="press-item-meta">
                <b>{p.source}</b>
                <span>{p.date}</span>
              </span>
            </span>
          </a>
        ))}
      </div>
    </PageShell>
  );
}
