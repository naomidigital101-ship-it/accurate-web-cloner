import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

const cdn = "/wp/uploads";

type NewsItem = { title?: string; source: string; date: string; img: string; href: string };

const newsItems: NewsItem[] = [
  { title: "ארגון 'קשר של תפילין' – ככה זה עובד בשטח", source: "הידברות", date: "28.9.25", img: `${cdn}/2026/06/לוגו-הידברות.webp`, href: "https://www.hidabroot.org/article/1214439" },
  { source: "מגזין אתנחתא", date: "ג' תשרי תשפ\"ן 25.09.25", img: `${cdn}/2025/10/אתנחתא.png`, href: "https://tefilin.or-hadash.org.il/wp-content/uploads/2025/10/yedidya_1164-1.pdf" },
  { title: "כתבה על קשר של תפילין בעיתון של כפר חב\"ד", source: "עיתון כפר חב\"ד", date: "21/05/2025", img: `${cdn}/2025/05/כפר-חבד.jpg`, href: "https://tefilin.or-hadash.org.il/wp-content/uploads/2025/05/%D7%AA%D7%9E%D7%95%D7%A0%D7%94-%D7%A9%D7%9C-WhatsApp%E2%80%8F-2025-05-18-%D7%91%D7%A9%D7%A2%D7%94-15.22.07_3aeb7c27.jpg" },
  { title: "גם לזוג התפילין הישנות שלכם יש ייעוד חשוב | מיזם 'קשר של תפילין' – כסף אנושי, פרק 5", source: "103FM", date: "21/04/2025", img: `${cdn}/2025/05/103FM.jpg`, href: "https://www.youtube.com/watch?v=Tmb7WBKtvsw" },
  { title: "\"מהדקין את הקשר\" כתבה בעיתון ב7", source: "עיתון ב7", date: "28/08/2024", img: `${cdn}/2024/09/ערוץ-7-1.jpg`, href: "https://www.inn.co.il/news/646944" },
  { title: "STRAPPED TOGETHER – כתבה במגזין \"משפחה\"", source: "MISHPACHA", date: "05.03.2024", img: `${cdn}/2024/05/לוגו-עיתון-משפחה-עברית.webp`, href: "https://mishpacha.com/strapped-together/" },
  { title: "התפילין של הזולת: סיפורים מרגשים מפרויקט החיבור בין יהודים – כתבה בכיכר השבת", source: "כיכר השבת", date: "י' בניסן התשפ\"ד | 14.04.2024", img: `${cdn}/2024/05/כיכר-השבת-לוגו.png`, href: "https://www.kikar.co.il/haredim-news/sc5lp6" },
  { title: "כך מחברים את עם ישראל בעזרת מצוות תפילין", source: "בשבע", date: "י\"ז שבט תשפ\"ד 27.01.24", img: `${cdn}/2024/01/בשבע-1.svg`, href: "https://www.inn.co.il/news/627412" },
  { title: "לע\"נ הנופלים בעזה: 'זמן אוויר' במבצע תפילין מיוחד", source: "קול חי", date: "יג' שבט התשפ\"ד 23.01.2024", img: `${cdn}/2024/01/קול-חי.png`, href: "https://www.93fm.co.il/radio/979389/" },
];

export const Route = createFileRoute("/in-news")({
  head: () => ({
    meta: [
      { title: "בתקשורת | קשר של תפילין" },
      { name: "description", content: "כתבות ופרסומים על מיזם 'קשר של תפילין' של עמותת אור חדש בכלי התקשורת בישראל." },
      { property: "og:title", content: "בתקשורת | קשר של תפילין" },
      { property: "og:description", content: "כתבות ופרסומים על מיזם 'קשר של תפילין' בכלי התקשורת בישראל." },
      { property: "og:url", content: "https://accurate-web-cloner.lovable.app/in-news" },
    ],
    links: [{ rel: "canonical", href: "https://accurate-web-cloner.lovable.app/in-news" }],
  }),

  component: InNewsPage,
});

function InNewsPage() {
  return (
    <PageShell title="כתבות בתקשורת">
      <div className="news-list">
        {newsItems.map((p, i) => (
          <a key={i} href={p.href} target="_blank" rel="noopener" className="press-item">
            <span className="press-item-logo" style={{ backgroundImage: `url('${p.img}')` }} />
            <span className="press-item-body">
              {p.title && <span className="press-item-title">{p.title}</span>}
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
