import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { getAccessToken } from "@/lib/supabase-browser";
import { seedContent, verifySeed } from "@/lib/api/seed.functions";

export const Route = createFileRoute("/admin/migrate")({ component: MigratePage });

function MigratePage() {
  const [report, setReport] = useState<Record<string, number> | null>(null);
  const [check, setCheck] = useState<{ checked: number; mismatches: string[] } | null>(null);
  const [busy, setBusy] = useState<"" | "seed" | "verify">("");
  const [err, setErr] = useState<string | null>(null);

  const run = async (what: "seed" | "verify") => {
    setBusy(what);
    setErr(null);
    try {
      const accessToken = await getAccessToken();
      if (what === "seed") setReport(await seedContent({ data: { accessToken } }));
      else setCheck(await verifySeed({ data: { accessToken } }));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "הפעולה נכשלה");
    } finally {
      setBusy("");
    }
  };

  return (
    <>
      <header className="adm-head">
        <h1>הגירת תוכן</h1>
        <p>העברת התוכן שכתוב היום בקוד אל תוך מסד הנתונים, כדי שיהיה ניתן לעריכה מכאן.</p>
      </header>

      <section className="adm-panel">
        <h2>שלב 1 - הרצת ההגירה</h2>
        <p className="adm-muted" style={{ fontSize: 14, marginTop: 0 }}>
          מעתיקה סיפורים, הסכמות רבנים וכתבות בתקשורת. אפשר להריץ שוב בבטחה - סיפורים
          מתעדכנים לפי שפה וכתובת, ורבנים וכתבות נזרעים רק אם הטבלה ריקה, כדי לא לדרוס עריכות.
        </p>
        <button type="button" className="adm-primary" style={{ maxWidth: 260 }} disabled={busy !== ""} onClick={() => run("seed")}>
          {busy === "seed" ? "מריץ…" : "הרצת ההגירה"}
        </button>

        {report && (
          <div className="adm-table-wrap" style={{ marginTop: 16 }}>
            <table className="adm-table">
              <thead><tr><th>טבלה</th><th>נמצא ב-DB</th></tr></thead>
              <tbody>
                {Object.entries(report)
                  .filter(([k]) => k.endsWith("_in_db"))
                  .map(([k, v]) => (
                    <tr key={k}><td>{k.replace("_in_db", "")}</td><td><b>{v}</b></td></tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="adm-panel">
        <h2>שלב 2 - אימות מול הקוד</h2>
        <p className="adm-muted" style={{ fontSize: 14, marginTop: 0 }}>
          משווה כל סיפור שב-DB לטקסט שבקוד, תו מול תו. אם משהו לא תואם, הוא יופיע כאן.
        </p>
        <button type="button" className="adm-primary" style={{ maxWidth: 260 }} disabled={busy !== ""} onClick={() => run("verify")}>
          {busy === "verify" ? "בודק…" : "הרצת אימות"}
        </button>

        {check && (
          <div style={{ marginTop: 14 }}>
            {check.mismatches.length === 0 ? (
              <p style={{ color: "#1b7f3b", fontWeight: 700 }}>
                ✓ נבדקו {check.checked} סיפורים, אפס פערים.
              </p>
            ) : (
              <>
                <p style={{ color: "#b3261e", fontWeight: 700 }}>
                  נמצאו {check.mismatches.length} פערים מתוך {check.checked}:
                </p>
                <ul style={{ fontSize: 13.5, lineHeight: 1.7 }}>
                  {check.mismatches.slice(0, 40).map((m) => <li key={m}>{m}</li>)}
                </ul>
              </>
            )}
          </div>
        )}
      </section>

      {err && <p className="adm-err">{err}</p>}
    </>
  );
}
