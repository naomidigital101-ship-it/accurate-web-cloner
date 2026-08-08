import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

const cdn = "/wp/uploads";

type NewsItem = { title?: string; source: string; date: string; img: string; href: string };

export const newsItems: NewsItem[] = [
  { title: "ארגון 'קשר של תפילין' – ככה זה עובד בשטח", source: "הידברות", date: "28.9.25", img: `${cdn}/2026/06/לוגו-הידברות.webp`, href: "https://www.hidabroot.org/article/1214439" },
  { source: "מגזין אתנחתא", date: "ג' תשרי תשפ\"ן 25.09.25", img: `${cdn}/2025/10/אתנחתא.png`, href: `${cdn}/2025/10/yedidya_1164-1.pdf` },
  { title: "כתבה על קשר של תפילין בעיתון של כפר חב\"ד", source: "עיתון כפר חב\"ד", date: "21/05/2025", img: `${cdn}/2025/05/כפר-חבד.jpg`, href: `${cdn}/2025/05/kfar-chabad-whatsapp-15.22.07.jpg` },
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
      { title: "כתבות בתקשורת על המיזם | קשר של תפילין" },
      { name: "description", content: "סיקור תקשורתי של מיזם קשר של תפילין: כתבות בערוץ 7, מגזין משפחה, HAMODIA, בשבע ועוד על חלוקת תפילין לאלפי יהודים." },
      { property: "og:title", content: "כתבות בתקשורת על המיזם | קשר של תפילין" },
      { property: "og:description", content: "סיקור תקשורתי של מיזם קשר של תפילין: כתבות בערוץ 7, מגזין משפחה, HAMODIA, בשבע ועוד על חלוקת תפילין לאלפי יהודים." },
      { property: "og:url", content: "https://accurate-web-cloner.lovable.app/in-news/" },
    ],
    links: [{ rel: "canonical", href: "https://accurate-web-cloner.lovable.app/in-news/" }],
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
