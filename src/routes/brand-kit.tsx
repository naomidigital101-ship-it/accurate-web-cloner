import { createFileRoute } from "@tanstack/react-router";

import { PageShell } from "@/components/PageShell";
import { publicDb } from "@/lib/supabase.server";
import { SITE_URL } from "@/lib/site";

const URL = `${SITE_URL}/brand-kit`;
const TITLE = "ערכת מותג וחומרים להורדה | קשר של תפילין";
const DESC =
  "לוגואים, תמונות ומסמכים רשמיים של מיזם קשר של תפילין ועמותת אור חדש - להורדה לשימוש עיתונאים, שותפים ומתנדבים.";

type Asset = {
  id: string;
  url: string;
  title: string | null;
  description: string | null;
  file_name: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  folder: string;
};

/** רק קבצים שסומנו מפורשות כציבוריים. ברירת המחדל היא פנימי. */
async function readPublicAssets(): Promise<Asset[]> {
  try {
    const { data, error } = await publicDb()
      .from("media")
      .select("id,url,title,description,file_name,mime_type,size_bytes,folder")
      .eq("is_public", true)
      .order("folder")
      .order("sort_order");
    if (error || !data) return [];
    return data as Asset[];
  } catch {
    return [];
  }
}

export const Route = createFileRoute("/brand-kit")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  loader: async () => ({ assets: await readPublicAssets() }),
  component: BrandKitPage,
});

function human(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function BrandKitPage() {
  const { assets } = Route.useLoaderData();

  const groups = new Map<string, Asset[]>();
  for (const a of assets) {
    if (!groups.has(a.folder)) groups.set(a.folder, []);
    groups.get(a.folder)!.push(a);
  }

  return (
    <PageShell title="ערכת מותג">
      <div className="a11y-doc">
        <p>
          כאן מרוכזים החומרים הרשמיים של מיזם <b>'קשר של תפילין'</b> ועמותת <b>אור חדש</b> -
          לוגואים, תמונות ומסמכים. אפשר להוריד ולהשתמש בהם לצורך כתבות, שיתופי פעולה ופעילות
          התנדבותית.
        </p>
        <p className="bk-note">
          נשמח שתשמרו על הלוגו כפי שהוא - בלי מתיחה, שינוי צבע או הוספת אלמנטים. לשימוש מסחרי
          או לכל שימוש שאינו קידום המיזם, יש לפנות אלינו מראש.
        </p>

        {assets.length === 0 ? (
          <div className="bk-empty">
            <b>החומרים בהכנה</b>
            <p>
              בינתיים אפשר לפנות אלינו ונשלח את מה שדרוש: <a href="tel:0546713966">054-6713966</a>
            </p>
          </div>
        ) : (
          [...groups.entries()].map(([folder, items]) => (
            <section key={folder}>
              <h2>{folder}</h2>
              <div className="bk-grid">
                {items.map((a) => {
                  const isImg = (a.mime_type ?? "").startsWith("image/");
                  return (
                    <a key={a.id} href={a.url} download className="bk-item">
                      <span className="bk-thumb">
                        {isImg ? (
                          <img src={a.url} alt={a.title ?? a.file_name ?? ""} loading="lazy" />
                        ) : (
                          <b>{(a.file_name ?? "").split(".").pop()?.toUpperCase() || "קובץ"}</b>
                        )}
                      </span>
                      <span className="bk-meta">
                        <b>{a.title ?? a.file_name}</b>
                        {a.description && <span>{a.description}</span>}
                        <em>הורדה{a.size_bytes ? ` · ${human(a.size_bytes)}` : ""}</em>
                      </span>
                    </a>
                  );
                })}
              </div>
            </section>
          ))
        )}

        <h2>פרטים רשמיים לציטוט</h2>
        <ul>
          <li><b>שם המיזם:</b> קשר של תפילין</li>
          <li><b>הגוף המפעיל:</b> עמותת אור חדש (ע"ר 580703965)</li>
          <li><b>מייסד ויו"ר:</b> הרב עמיחי איל</li>
          <li><b>כתובת:</b> ארץ חמדה 33, בית אל</li>
          <li><b>טלפון לפניות תקשורת:</b> <a href="tel:0546713966">054-6713966</a></li>
        </ul>
      </div>
    </PageShell>
  );
}
