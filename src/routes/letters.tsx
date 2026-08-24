import { createFileRoute, redirect } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { SITE_URL } from "@/lib/site";

const cdn = "/wp/uploads";

export type Letter = { title: string; sub?: string | null; img: string };

const letters: Letter[] = [
  { title: "מכתב תודה מפורום 'שקופי הקרב'", sub: "צוות פורום 'שקופי הקרב'", img: `${cdn}/2026/06/WhatsApp-Image-2026-06-25-at-11.08.22.jpeg` },
  { title: "מכתב תודה מקיבוץ כברי", img: `${cdn}/2026/06/Untitled-document-1.webp` },
  { title: "מכתב תודה מדיור מוגן רמת תמיר", sub: "חפצי לייבוביץ", img: `${cdn}/2026/05/מכתב-תודה-דיור-מוגן.jpg` },
  { title: "מכתב תודה מהקהילה היהודית ברומניה", sub: "מנשיא הקהילה הודית ברומניה", img: `${cdn}/2026/05/הקהילה-היהודית-ברומניה-min.webp` },
  { title: "מכתב תודה מהרב איתן אקשטיין", sub: "מנהל רטורנו", img: `${cdn}/2026/05/איתן-אקשטיין-רטורנו.png` },
  { title: "מכתב המלצה מבי\"ס בית אל חטיבת הביניים", sub: "הרב אליעזר קרקובר רב בי\"ס", img: `${cdn}/2025/05/תמונה-של-WhatsApp‏-2025-05-18-בשעה-15.23.54_44db3e8d.jpg` },
  { title: "מכתב תודה מגרעין הדר חיפה", img: `${cdn}/2024/05/724fe94c-38e8-4850-a72c-05ddc02d1dd4_1.jpg` },
  { title: "מכתב מרב שב\"ס של פיקוד הצפון", img: `${cdn}/2024/04/מכתב-תודה-רב-פיקוד-צפון-שבס-scaled.webp` },
  { title: "מכתב מאמי\"ת מעלה אדומים", img: `${cdn}/2024/04/מכתב-תודה-אמית-מעלה-אדומים-scaled.webp` },
  { title: "מכתב תודה מאבא לנער בר-מצוה", img: `${cdn}/2024/04/-תודה-אבא-לנער-בר-מצווה-e1712736886112.webp` },
  { title: "מכתב תודה מאמא של חייל", img: `${cdn}/2024/04/-תודה-אמא-לחייל-e1712736869916.webp` },
  { title: "מכתב מהרב שילה – חיל האוויר", img: `${cdn}/2024/04/מכתב-תודה-הרב-עמיהוד-שילה-scaled.webp` },
  { title: "מכתב תודה מלב לאחים", img: `${cdn}/2024/04/מכתב-תודה-לב-לאחים-scaled.webp` },
  { title: "מכתב ממפקד גדוד נחשון", img: `${cdn}/2024/04/מכתב-תודה-מפקד-גדוד-נחשון-scaled.webp` },
  { title: "מכתב ממפקד מחנה צריפין", img: `${cdn}/2024/04/מכתב-תודה-מפקד-מחנה-צריפין.webp` },
  { title: "מכתב ממרכז היום לקשיש", img: `${cdn}/2024/04/-תודה-מרכז-יום-לקשיש-e1712736849999.webp` },
  { title: "מכתב מרב בסיס חיל האויר", img: `${cdn}/2024/04/מכתב-תודה-רב-בסיס-חיל-האוויר-scaled.webp` },
];

const LETTERS_CANONICAL = `${SITE_URL}/%D7%9E%D7%9B%D7%AA%D7%91%D7%99-%D7%AA%D7%95%D7%93%D7%94`;

export const Route = createFileRoute("/letters")({
  beforeLoad: () => {
    throw redirect({ to: "/מכתבי-תודה" as unknown as "/", replace: true });
  },
  head: () => ({
    meta: [
      { title: "מכתבי תודה ממקבלי תפילין | קשר של תפילין" },
      { name: "description", content: "מכתבי תודה מרגשים מחיילים, מפקדים, רבנים וקהילות שקיבלו תפילין מעמותת אור חדש במסגרת מיזם קשר של תפילין." },
      { property: "og:title", content: "מכתבי תודה ממקבלי תפילין | קשר של תפילין" },
      { property: "og:description", content: "מכתבי תודה מרגשים מחיילים, מפקדים, רבנים וקהילות שקיבלו תפילין מעמותת אור חדש במסגרת מיזם קשר של תפילין." },
      { property: "og:url", content: LETTERS_CANONICAL },
    ],
    links: [{ rel: "canonical", href: LETTERS_CANONICAL }],
  }),
  component: LettersPage,
});

/**
 * הרשימה מגיעה מהאדמין (טבלת thank_you_letters). אם ה-DB ריק או לא זמין
 * מוצג המערך שבקוד, כך שהעמוד לעולם לא מתרוקן.
 */
export function LettersPage({ items }: { items?: Letter[] | null } = {}) {
  const list = items && items.length > 0 ? items : letters;
  return (
    <PageShell title="מכתבי תודה">
      <div className="doc-grid doc-grid-letters">
        {list.map((l, i) => (
          <div key={i} className="doc-card doc-card-natural">
            <a href={l.img} target="_blank" rel="noopener" className="doc-card-letter">
              <img src={l.img} alt={l.title} loading="lazy" />
            </a>
            <h3 className="doc-card-name">{l.title}</h3>
            {l.sub && <p className="doc-card-role">{l.sub}</p>}
          </div>
        ))}
      </div>

    </PageShell>
  );
}
