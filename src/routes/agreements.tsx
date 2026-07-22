import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

const cdn = "/wp/uploads";

type Rabbi = { name: string; role: string; letter: string; portrait: string };

const rabbis: Rabbi[] = [
  { name: "הרב אשר וייס שליט\"א", role: "גאב\"ד וראש ישיבת דרכי תורה", letter: `${cdn}/2024/06/הרב-אשר-וייס-ערוך-2.png`, portrait: `${cdn}/2024/06/הרב-אשר-2-min.webp` },
  { name: "הרב שלמה משה עאמר שליט\"א", role: "הראשון לציון ורבה של ירושלים", letter: `${cdn}/2024/05/הרב-עמר-min-1.webp`, portrait: `${cdn}/2024/05/רב-עמר-2-min.webp` },
  { name: "הרב יצחק זילברשטיין שליט\"א", role: "רב שכונת רמת אלחנן, בני ברק", letter: `${cdn}/2024/04/מכתב-הסכמה-מהרב-זילברשטיין-scaled.webp`, portrait: `${cdn}/2024/04/רב-זילברמן-3-1.webp` },
  { name: "הרב דוד יוסף שליט\"א", role: "הראשון לציון", letter: `${cdn}/2026/05/מכתב-מהראשלצ.png`, portrait: `${cdn}/2026/05/הרב-דוד-יוסף-min.webp` },
  { name: "הרב אליקים לבנון שליט\"א", role: "רב השומרון וראש ישיבת אלון מורה", letter: `${cdn}/2024/04/מכתב-ברכה-הרב-אליקים-לבנון-scaled.webp`, portrait: `${cdn}/2024/05/הרב-אליקים-לבנון.jpg` },
  { name: "הרב יהושע כ\"ץ שליט\"א", role: "רב העיר מעלה אדומים", letter: `${cdn}/2024/04/מכתב-ברכה-הרב-יהושע-כץ-מודפס-scaled.webp`, portrait: `${cdn}/2024/05/הרב_יהושע_כץ.png` },
  { name: "הרב זלמן ברוך מלמד שליט\"א", role: "ראש ישיבת בית אל", letter: `${cdn}/2024/04/מכתב-ברכה-הרב-זלמן-ברוך-מלמד-scaled.webp`, portrait: `${cdn}/2024/04/הרב-זלמן-מלמד-2.jpeg` },
  { name: "הרב המקובל חכם אהרון ביטון שליט\"א", role: "ראש ישיבת חובבי ציון, ירושלים - נחלאות", letter: `${cdn}/2025/05/הרב-ביטון.jpg`, portrait: `${cdn}/2025/05/-של-WhatsApp‏-2025-05-18-בשעה-15.23.53_bd7ce066-e1754304458496.jpg` },
  { name: "הרב שלמה יהודה בארי \"הינוקא\" שליט\"א", role: "הרב הינוקא", letter: `${cdn}/2025/05/ברכה-והצלחה.jpg`, portrait: `${cdn}/2025/05/הינוקא.jpg` },
];

export const Route = createFileRoute("/agreements")({
  head: () => ({
    meta: [
      { title: "הסכמות הרבנים | קשר של תפילין" },
      { name: "description", content: "מכתבי הסכמה וברכה מגדולי הרבנים למיזם 'קשר של תפילין' של עמותת אור חדש." },
      { property: "og:title", content: "הסכמות הרבנים | קשר של תפילין" },
      { property: "og:description", content: "מכתבי הסכמה וברכה מגדולי הרבנים למיזם 'קשר של תפילין' של עמותת אור חדש." },
      { property: "og:url", content: "https://accurate-web-cloner.lovable.app/agreements/" },
    ],
    links: [{ rel: "canonical", href: "https://accurate-web-cloner.lovable.app/agreements/" }],
  }),
  component: AgreementsPage,
});


function AgreementsPage() {
  return (
    <PageShell title="הסכמות הרבנים">
      <div className="doc-grid">
        {rabbis.map((r) => (
          <div key={r.name} className="doc-card">
            <a href={r.letter} target="_blank" rel="noopener" className="doc-card-letter">
              <img src={r.letter} alt={`מכתב הסכמה - ${r.name}`} loading="lazy" />
            </a>
            <img src={r.portrait} alt={r.name} loading="lazy" className="doc-card-portrait" />
            <h3 className="doc-card-name">{r.name}</h3>
            <p className="doc-card-role">{r.role}</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
