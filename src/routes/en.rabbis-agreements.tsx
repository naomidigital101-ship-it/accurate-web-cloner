import { thumb, thumbFallback } from "@/lib/thumb";
import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { readRabbis } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

const cdn = "/wp/uploads";

type Rabbi = { name: string; role: string; letter: string; portrait: string };

export const rabbis: Rabbi[] = [
  { name: "Rav Asher Weiss", role: "Founder and rosh beit hamidrash 'Darchi Torah' and the 'Darchei Horaa' av beit din", letter: `${cdn}/2024/06/הרב-אשר-וייס-ערוך-2.webp`, portrait: `${cdn}/2024/06/הרב-אשר-2-min.webp` },
  { name: "Rav Shlomo Amar", role: "Former Sephardic Chief Rabbi of Israel", letter: `${cdn}/2024/05/הרב-עמר-min-1.webp`, portrait: `${cdn}/2024/05/רב-עמר-2-min.webp` },
  { name: "Rabbi Yitzhak Zilberstein", role: "Ramat Elhanan neighborhood rabbi, Bnei Brak", letter: `${cdn}/2024/04/מכתב-הסכמה-מהרב-זילברשטיין-scaled.webp`, portrait: `${cdn}/2024/04/רב-זילברמן-3-1.webp` },
  { name: "Rav David Yosef", role: "Rishon LeZion", letter: `${cdn}/2026/05/מכתב-מהראשלצ.webp`, portrait: `${cdn}/2026/05/הרב-דוד-יוסף-min.webp` },
  { name: "Rabbi Eliakim Lebanon", role: "Rabbi of Samaria and head of Yeshiva Alon Mora", letter: `${cdn}/2024/04/מכתב-ברכה-הרב-אליקים-לבנון-scaled.webp`, portrait: `${cdn}/2024/05/הרב-אליקים-לבנון.jpg` },
  { name: "Rabbi Yehoshua Katz", role: "The rabbi of Maale Edumim", letter: `${cdn}/2024/04/מכתב-ברכה-הרב-יהושע-כץ-מודפס-scaled.webp`, portrait: `${cdn}/2024/05/הרב_יהושע_כץ.webp` },
  { name: "Rabbi Zalman Baruch Melamed", role: "Rosh Yeshiva Beit El", letter: `${cdn}/2024/04/מכתב-ברכה-הרב-זלמן-ברוך-מלמד-scaled.webp`, portrait: `${cdn}/2024/04/הרב-זלמן-מלמד-2.jpeg` },
  { name: "Rabbi Aharon Biton", role: "Kabbalist, Rosh Yeshiva of Chovevei Tzion, Jerusalem - Nachlaot", letter: `${cdn}/2025/05/הרב-ביטון.jpg`, portrait: `${cdn}/2025/05/-של-WhatsApp‏-2025-05-18-בשעה-15.23.53_bd7ce066-e1754304458496.jpg` },
  { name: "Rabbi Shlomo Yehuda Beeri (\"HaYenuka\")", role: "The Yenuka", letter: `${cdn}/2025/05/ברכה-והצלחה.jpg`, portrait: `${cdn}/2025/05/הינוקא.jpg` },
];

export const Route = createFileRoute("/en/rabbis-agreements")({
  head: () => ({
    meta: [
      { title: "Rabbis' Letters of Approval | The Tefillin Tie Initiative" },
      { name: "description", content: "Letters of endorsement from leading rabbis - Rav Asher Weiss, Rav Amar, Rav Zilberstein, Rav David Yosef, Rabbi Biton, the Yenuka and more - for the Tefillin Tie Initiative." },
      { property: "og:title", content: "Rabbis' Letters of Approval | The Tefillin Tie Initiative" },
      { property: "og:description", content: "Letters of endorsement from leading rabbis - Rav Asher Weiss, Rav Amar, Rav Zilberstein, Rav David Yosef, Rabbi Biton, the Yenuka and more - for the Tefillin Tie Initiative." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: `${SITE_URL}/en/rabbis-agreements` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/en/rabbis-agreements` }],
  }),
  loader: async () => ({ rabbis: await readRabbis("en") }),
  component: Page,
});

function Page() {
  const { rabbis: fromDb } = Route.useLoaderData();
  const list = fromDb
    ? fromDb.map((r) => ({ name: r.name, role: r.role ?? "", letter: r.letter_url ?? "", portrait: r.portrait_url ?? "" }))
    : rabbis;
  return (
    <PageShell title="RABBIS AGREEMENTS" en>
      <div className="doc-grid">
        {list.map((r) => (
          <div key={r.name} className="doc-card">
            <a href={r.letter} target="_blank" rel="noopener" className="doc-card-letter">
              <img src={thumb(r.letter)} onError={(e) => thumbFallback(e, r.letter)} alt={`Letter of approval - ${r.name}`} loading="lazy" decoding="async" />
            </a>
            <img src={thumb(r.portrait)} onError={(e) => thumbFallback(e, r.portrait)} alt={r.name} loading="lazy" className="doc-card-portrait" decoding="async" />
            <h3 className="doc-card-name">{r.name}</h3>
            <p className="doc-card-role">{r.role}</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
