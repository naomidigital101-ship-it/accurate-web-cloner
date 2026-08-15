import type { LeadStats } from "@/lib/api/stats.functions";

const MONTHS_HE = ["ינו", "פבר", "מרץ", "אפר", "מאי", "יוני", "יולי", "אוג", "ספט", "אוק", "נוב", "דצמ"];

function label(ym: string) {
  const [y, m] = ym.split("-");
  return `${MONTHS_HE[Number(m) - 1]} ${y.slice(2)}`;
}

/**
 * הגרף מיועד לבעל עסק שלא קורא מספרים כמקצוע.
 * לכן: אין צירים, אין אחוזים - עמודה לכל חודש, מספר מעליה, ומשפט אחד שמסביר
 * מה קרה. ההשוואה היא לחודש הקודם, לא לממוצע, כי זה מה שאדם באמת שואל.
 */
export function LeadsDashboard({ stats }: { stats: LeadStats }) {
  const max = Math.max(1, ...stats.monthly.map((m) => m.requests + m.donations));
  const diff = stats.thisMonth - stats.lastMonth;

  const recent = stats.monthly.slice(-3).reduce((a, m) => a + m.requests + m.donations, 0);
  const before = stats.monthly.slice(-6, -3).reduce((a, m) => a + m.requests + m.donations, 0);
  const collapsed = before >= 30 && recent < before * 0.4;

  return (
    <>
      {collapsed && (
        <div className="dash-alert">
          <b>שימו לב - ירידה חדה בפניות</b>
          <p>
            בשלושת החודשים האחרונים התקבלו <b>{recent}</b> פניות, לעומת <b>{before}</b> בשלושת
            החודשים שלפניהם. כדאי לבדוק שהטפסים באתר עובדים ושהאתר מופיע בחיפוש.
          </p>
        </div>
      )}

      <div className="dash-tiles">
        <div className="dash-tile dash-tile-accent">
          <span className="dash-num">{stats.newCount}</span>
          <span className="dash-lbl">ממתינות לטיפול</span>
          <span className="dash-sub">{stats.newCount === 0 ? "הכל טופל" : "פניות שטרם נגעו בהן"}</span>
        </div>
        <div className="dash-tile">
          <span className="dash-num">{stats.thisMonth}</span>
          <span className="dash-lbl">החודש</span>
          <span className={`dash-sub ${diff >= 0 ? "up" : "down"}`}>
            {diff === 0 ? "כמו בחודש שעבר" : diff > 0 ? `${diff}+ מהחודש שעבר` : `${diff} מהחודש שעבר`}
          </span>
        </div>
        <div className="dash-tile">
          <span className="dash-num">{stats.requests}</span>
          <span className="dash-lbl">מבקשים תפילין</span>
          <span className="dash-sub">מכלל הזמן</span>
        </div>
        <div className="dash-tile">
          <span className="dash-num">{stats.donations}</span>
          <span className="dash-lbl">מציעים תפילין</span>
          <span className="dash-sub">
            {stats.donations > 0 ? `${Math.round(stats.requests / stats.donations)} מבקשים לכל תורם` : "—"}
          </span>
        </div>
        <div className="dash-tile">
          <span className="dash-num">{stats.needsShipping}</span>
          <span className="dash-lbl">מבקשים משלוח</span>
          <span className="dash-sub">השאר אוספים בעצמם</span>
        </div>
        <div className="dash-tile">
          <span className="dash-num">{stats.repeatContacts}</span>
          <span className="dash-lbl">פנו יותר מפעם</span>
          <span className="dash-sub">אותו מספר טלפון</span>
        </div>
      </div>

      <section className="adm-panel">
        <h2>פניות לפי חודש</h2>
        <p className="dash-hint">
          כל עמודה היא חודש. הכחול - מבקשים תפילין, המנטה - מציעים תפילין.
        </p>
        <div className="dash-chart" role="img" aria-label="גרף פניות לפי חודש">
          {stats.monthly.map((m) => {
            const t = m.requests + m.donations;
            return (
              <div key={m.month} className="dash-bar-col" title={`${label(m.month)}: ${t} פניות`}>
                <span className="dash-bar-num">{t || ""}</span>
                <div className="dash-bar-stack" style={{ height: `${(t / max) * 150 + 2}px` }}>
                  <span className="dash-bar-donate" style={{ flexBasis: `${t ? (m.donations / t) * 100 : 0}%` }} />
                  <span className="dash-bar-request" style={{ flexBasis: `${t ? (m.requests / t) * 100 : 100}%` }} />
                </div>
                <span className="dash-bar-lbl">{label(m.month)}</span>
              </div>
            );
          })}
        </div>
      </section>

      <div className="dash-cols">
        <section className="adm-panel">
          <h2>מאיפה הפונים</h2>
          {stats.cities.length === 0 ? (
            <p className="adm-muted">אין עדיין נתוני יישוב.</p>
          ) : (
            <ul className="dash-list">
              {stats.cities.map((c) => (
                <li key={c.name}>
                  <span>{c.name}</span>
                  <b>{c.count}</b>
                  <i style={{ width: `${(c.count / stats.cities[0].count) * 100}%` }} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="adm-panel">
          <h2>למי מיועדות התפילין</h2>
          {stats.targets.length === 0 ? (
            <p className="adm-muted">אין עדיין נתונים.</p>
          ) : (
            <ul className="dash-list">
              {stats.targets.map((t) => (
                <li key={t.name}>
                  <span>{t.name}</span>
                  <b>{t.count}</b>
                  <i style={{ width: `${(t.count / stats.targets[0].count) * 100}%` }} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
