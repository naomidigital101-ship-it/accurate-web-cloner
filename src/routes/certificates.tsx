import { createFileRoute } from "@tanstack/react-router";

import { PageShell } from "@/components/PageShell";
import { publicDb } from "@/lib/supabase.server";
import { SITE_URL } from "@/lib/site";

const URL = `${SITE_URL}/certificates`;
const TITLE = "אישורי העמותה | קשר של תפילין";
const DESC =
  "האישורים הרשמיים של עמותת אורחדש, המפעילה את מיזם קשר של תפילין - אישור ניהול תקין ומסמכים נוספים.";

type Cert = {
  id: string;
  title: string;
  issuer: string | null;
  description: string | null;
  valid_from: string | null;
  valid_until: string | null;
  file_url: string | null;
  thumb_url: string | null;
};

async function readCertificates(): Promise<Cert[]> {
  try {
    const { data, error } = await publicDb()
      .from("certificates")
      .select("id,title,issuer,description,valid_from,valid_until,file_url,thumb_url")
      .eq("status", "published")
      .order("sort_order");
    if (error || !data) return [];
    return data as Cert[];
  } catch {
    return [];
  }
}

export const Route = createFileRoute("/certificates")({
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
  loader: async () => ({ certs: await readCertificates() }),
  component: CertificatesPage,
});

function heDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("he-IL", { year: "numeric", month: "long" });
}

function CertificatesPage() {
  const { certs } = Route.useLoaderData();

  return (
    <PageShell title="אישורי העמותה">
      <div className="a11y-doc">
        <p>
          מיזם <b>'קשר של תפילין'</b> מופעל על ידי <b>עמותת אור חדש</b>, עמותה רשומה שמספרה{" "}
          <b>580703965</b>. כאן מרוכזים האישורים הרשמיים של העמותה, כדי שכל תורם יוכל לבדוק
          בעצמו למי הוא נותן.
        </p>

        {certs.length === 0 ? (
          <div className="bk-empty">
            <b>האישורים בהעלאה</b>
            <p>
              בינתיים אפשר לבקש אותם ישירות: <a href="tel:0546713966">054-6713966</a>
            </p>
          </div>
        ) : (
          <div className="cert-grid">
            {certs.map((c) => {
              const until = heDate(c.valid_until);
              return (
                <article key={c.id} className="cert-item">
                  {c.thumb_url && (
                    <a href={c.file_url ?? c.thumb_url} target="_blank" rel="noopener" className="cert-thumb">
                      <img src={c.thumb_url} alt={c.title} loading="lazy" decoding="async" />
                    </a>
                  )}
                  <div className="cert-body">
                    <h2>{c.title}</h2>
                    {c.issuer && <p className="cert-issuer">{c.issuer}</p>}
                    {c.description && <p>{c.description}</p>}
                    {until && <p className="cert-valid">בתוקף עד {until}</p>}
                    {c.file_url && (
                      <a href={c.file_url} target="_blank" rel="noopener" className="cert-link">
                        צפייה באישור המלא
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <h2>שקיפות</h2>
        <p>
          כעמותה רשומה, הדוחות הכספיים והמילוליים של עמותת אור חדש מוגשים לרשם העמותות וזמינים
          לעיון הציבור. לכל שאלה בנושא ניהול המיזם או ייעוד התרומות, נשמח לענות:{" "}
          <a href="tel:0546713966">054-6713966</a>.
        </p>
      </div>
    </PageShell>
  );
}
