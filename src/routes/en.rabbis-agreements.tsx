import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

const cdn = "/wp/uploads";

type Rabbi = { name: string; role: string; letter: string; portrait: string };

const rabbis: Rabbi[] = [
  { name: "Rabbi Eliakim Lebanon", role: "Rabbi of Samaria and head of Yeshiva Alon Mora", letter: `${cdn}/2024/04/מכתב-ברכה-הרב-אליקים-לבנון-scaled.webp`, portrait: `${cdn}/2024/05/הרב-אליקים-לבנון.jpg` },
  { name: "Rabbi Yehoshua Katz", role: "The rabbi of Maale Edumim", letter: `${cdn}/2024/04/מכתב-ברכה-הרב-יהושע-כץ-מודפס-scaled.webp`, portrait: `${cdn}/2024/05/הרב_יהושע_כץ.png` },
  { name: "Rabbi Zalman Baruch Melamed", role: "Rosh Yeshiva Beit El", letter: `${cdn}/2024/04/מכתב-ברכה-הרב-זלמן-ברוך-מלמד-scaled.webp`, portrait: `${cdn}/2024/04/הרב-זלמן-מלמד-2.jpeg` },
  { name: "Rav David Yosef", role: "Former Sephardic Chief Rabbi of Israel", letter: `${cdn}/2026/05/מכתב-מהראשלצ.png`, portrait: `${cdn}/2026/05/הרב-דוד-יוסף-min.webp` },
  { name: "Rabbi Yitzhak Zilberstein", role: "Ramat Elhanan neighborhood rabbi, Bnei Brak", letter: `${cdn}/2024/04/מכתב-הסכמה-מהרב-זילברשטיין-scaled.webp`, portrait: `${cdn}/2024/04/רב-זילברמן-3-1.webp` },
  { name: "Rav Shlomo Amar", role: "Former Sephardic Chief Rabbi of Israel", letter: `${cdn}/2024/05/הרב-עמר-min-1.webp`, portrait: `${cdn}/2024/05/רב-עמר-2-min.webp` },
  { name: "Rav Asher Weiss", role: "Founder and rosh beit hamidrash 'Darchi Torah' and the 'Darchei Horaa' av beit din", letter: `${cdn}/2024/06/הרב-אשר-וייס-ערוך-2.png`, portrait: `${cdn}/2024/06/הרב-אשר-2-min.webp` },
];

export const Route = createFileRoute("/en/rabbis-agreements")({
  head: () => ({ meta: [{ title: "Rabbis agreements | The Tefillin Tie Initiative" }] }),
  component: Page,
});

function Page() {
  return (
    <PageShell title="RABBIS AGREEMENTS" en>
      <div className="doc-grid">
        {rabbis.map((r) => (
          <div key={r.name} className="doc-card">
            <a href={r.letter} target="_blank" rel="noopener" className="doc-card-letter">
              <img src={r.letter} alt={`Letter of approval - ${r.name}`} loading="lazy" />
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
