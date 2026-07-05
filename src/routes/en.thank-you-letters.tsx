import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

const cdn = "/wp/uploads";

type Letter = { title: string; sub?: string; img: string };

const letters: Letter[] = [
  { title: "Thank you letter from Ramat Tamir sheltered housing", img: `${cdn}/2026/05/מכתב-תודה-דיור-מוגן.jpg` },
  { title: "Letter of thanks from the Jewish community in Romania", sub: "From the president of the Jewish community in Romania", img: `${cdn}/2026/05/הקהילה-היהודית-ברומניה-min.webp` },
  { title: "Letter of thanks from Rabbi Eitan Eckstein", sub: "Manager of Retorno", img: `${cdn}/2026/05/איתן-אקשטיין-רטורנו.png` },
  { title: "A letter from the air force base chief", img: `${cdn}/2024/04/מכתב-תודה-רב-בסיס-חיל-האוויר-scaled.webp` },
  { title: "A letter from the day center to the elderly", img: `${cdn}/2024/04/-תודה-מרכז-יום-לקשיש-e1712736849999.webp` },
  { title: "A letter from the commander of the camp of Zirifin", img: `${cdn}/2024/04/מכתב-תודה-מפקד-מחנה-צריפין.webp` },
  { title: "A letter from the commander of the Nachshon Battalion", img: `${cdn}/2024/04/מכתב-תודה-מפקד-גדוד-נחשון-scaled.webp` },
  { title: "A heartfelt thank you letter to the brothers", img: `${cdn}/2024/04/מכתב-תודה-לב-לאחים-scaled.webp` },
  { title: "A letter from Rabbi Amihud – Shiloh", img: `${cdn}/2024/04/מכתב-תודה-הרב-עמיהוד-שילה-scaled.webp` },
  { title: "Thank you letter from a soldier’s mother", img: `${cdn}/2024/04/-תודה-אמא-לחייל-e1712736869916.webp` },
  { title: "A letter of thanks from a father to a Bar Mitzvah boy", img: `${cdn}/2024/04/-תודה-אבא-לנער-בר-מצווה-e1712736886112.webp` },
  { title: "A letter from the Ma’ale Adumim Institute", img: `${cdn}/2024/04/מכתב-תודה-אמית-מעלה-אדומים-scaled.webp` },
  { title: "A letter from the Shavas Major of the Northern Command", img: `${cdn}/2024/04/מכתב-תודה-רב-פיקוד-צפון-שבס-scaled.webp` },
  { title: "Letter of thanks Gerin Hadar Haifa", img: `${cdn}/2024/05/724fe94c-38e8-4850-a72c-05ddc02d1dd4_1.jpg` },
];

export const Route = createFileRoute("/en/thank-you-letters")({
  head: () => ({ meta: [{ title: "Thank you letters | The Tefillin Tie Initiative" }] }),
  component: Page,
});

function Page() {
  return (
    <PageShell title="Thank you letters" en>
      <div className="doc-grid">
        {letters.map((l, i) => (
          <div key={i} className="doc-card">
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
