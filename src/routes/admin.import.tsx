import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";

import { getAccessToken } from "@/lib/supabase-browser";
import { importLeads } from "@/lib/api/stats.functions";
import { parseElementorCsv, type ParsedLead } from "@/lib/csv-leads";

export const Route = createFileRoute("/admin/import")({ component: ImportPage });

const BATCH = 400;

function ImportPage() {
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [done, setDone] = useState<{ parsed: number; inserted: number; spam: number } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const say = (m: string) => setLog((l) => [...l, m]);

  const run = async (files: FileList) => {
    setBusy(true);
    setErr(null);
    setLog([]);
    setDone(null);
    try {
      const all: ParsedLead[] = [];
      for (const f of Array.from(files)) {
        const text = await f.text();
        const { rows, skipped } = parseElementorCsv(text);
        say(`${f.name} - נקראו ${rows.length} פניות${skipped ? `, דולגו ${skipped}` : ""}`);
        all.push(...rows);
      }
      if (all.length === 0) throw new Error("לא נמצאו פניות בקבצים. ודאו שאלה קובצי CSV מייצוא Elementor.");

      const spam = all.filter((r) => r.status === "spam").length;
      say(`סה"כ ${all.length} פניות, מתוכן ${spam} סומנו כספאם`);

      const accessToken = await getAccessToken();
      let inserted = 0;
      for (let i = 0; i < all.length; i += BATCH) {
        const slice = all.slice(i, i + BATCH);
        const res = await importLeads({ data: { accessToken, rows: slice } });
        inserted += res.inserted;
        say(`נשלחו ${Math.min(i + BATCH, all.length)} מתוך ${all.length}…`);
      }
      setDone({ parsed: all.length, inserted, spam });
      say("הייבוא הסתיים.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "הייבוא נכשל.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <>
      <header className="adm-head">
        <h1>ייבוא פניות מהאתר הישן</h1>
        <p>העלאת קובצי הייצוא של הטפסים מוורדפרס, כדי שכל ההיסטוריה תופיע במסך הפניות.</p>
      </header>

      <section className="adm-panel">
        <h2>איך עושים את זה</h2>
        <ol className="imp-steps">
          <li>באתר הישן: <b>Elementor → Submissions</b>, לוחצים <b>Export</b> ומורידים CSV לכל טופס.</li>
          <li>בוחרים כאן את כל הקבצים יחד - אפשר לסמן כמה בבת אחת.</li>
          <li>
            אפשר להריץ שוב את אותם קבצים בלי חשש: פנייה שכבר יובאה לא תיווצר פעמיים.
          </li>
        </ol>

        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          multiple
          disabled={busy}
          onChange={(e) => e.target.files?.length && void run(e.target.files)}
        />
      </section>

      {err && <p className="adm-err">{err}</p>}

      {log.length > 0 && (
        <section className="adm-panel">
          <h2>מהלך הייבוא</h2>
          <ul className="imp-log">
            {log.map((l, i) => <li key={i}>{l}</li>)}
          </ul>
          {done && (
            <div className="imp-done">
              <b>נקראו {done.parsed} פניות · נוספו {done.inserted} חדשות · {done.spam} סומנו כספאם</b>
              <p>
                {done.inserted === 0
                  ? "כל הפניות בקובץ כבר היו במערכת, ולכן לא נוספה אף שורה."
                  : "אפשר לראות אותן עכשיו במסך הפניות."}
              </p>
            </div>
          )}
        </section>
      )}

      <section className="adm-panel">
        <h2>מה קורה לנתונים</h2>
        <ul className="imp-notes">
          <li>הפניות המיובאות מסומנות כ<b>טופלו</b>, כדי שלא יתערבבו עם פניות חדשות שממתינות.</li>
          <li>פניות שנראות כספאם (הצעות עסקיות, מספרים זרים) מסומנות אוטומטית כספאם.</li>
          <li>תאריך הפנייה המקורי נשמר, כך שהגרפים מציגים את ההיסטוריה האמיתית.</li>
          <li>הקובץ נקרא בדפדפן שלכם. הוא לא נשמר בשום מקום מלבד הפניות עצמן.</li>
        </ul>
      </section>
    </>
  );
}
