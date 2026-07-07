import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

type PressItem = {
  title: string;
  source: string;
  date: string;
  href: string;
  img?: string;
  logoText?: string;
};

const press: PressItem[] = [
  {
    title: "How Hamas Brought Jews Back to Judaism",
    source: "HAMODIA",
    date: "27/10/2024",
    href: "https://tefilin.or-hadash.org.il/wp-content/uploads/2024/10/DOC-20241014-WA0012..pdf",
    logoText: "HAMODIA",
  },
  {
    title: "“כתבה בעיתון בשבע “מהדקים את הקשר",
    source: "עיתון ב7",
    date: "16/08/2024",
    href: "https://www.inn.co.il/news/646944",
    img: "/wp/uploads/2024/09/ערוץ-7-1.jpg",
  },
  {
    title: "strapper together",
    source: "Mishpacha Magazine",
    date: "MARCH 5, 2024",
    href: "https://mishpacha.com/strapped-together/",
    img: "/wp/uploads/2024/05/לוגו-עיתון-משפחה-עברית.webp",
  },
  {
    title: "Uniting the Jewish People through the mitzva of tefillin",
    source: "7Israel National News",
    date: "Jun 17, 2024, 12:00",
    href: "https://www.israelnationalnews.com/news/388053",
    img: "/wp/uploads/2024/09/ערוץ-7-1.jpg",
  },
];

export const Route = createFileRoute("/en/articles-in-the-media")({
  head: () => ({ meta: [{ title: "In the Media | The Tefillin Tie Initiative" }] }),
  component: Page,
});

function Page() {
  return (
    <PageShell title="In the Media" en>
      <div className="news-list">
        {press.map((p, i) => (
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
