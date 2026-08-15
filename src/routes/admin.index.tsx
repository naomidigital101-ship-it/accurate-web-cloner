import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { getAccessToken } from "@/lib/supabase-browser";
import { getAdminOverview } from "@/lib/api/admin.functions";
import { getLeadStats, type LeadStats } from "@/lib/api/stats.functions";
import { LeadsDashboard } from "@/components/admin/LeadsDashboard";

export const Route = createFileRoute("/admin/")({ component: Overview });

type Counts = Record<string, number>;

const CARDS: { key: string; label: string; to: string; hint: string }[] = [
  { key: "leads_new", label: "פניות חדשות", to: "/admin/leads", hint: "ממתינות לטיפול" },
  { key: "leads", label: "סך הפניות", to: "/admin/leads", hint: "מאז ההשקה" },
  { key: "stories", label: "סיפורים", to: "/admin/stories", hint: "עברית ואנגלית" },
  { key: "rabbi_letters", label: "הסכמות רבנים", to: "/admin/rabbis", hint: "שתי השפות" },
  { key: "press_items", label: "כתבות בתקשורת", to: "/admin/press", hint: "שתי השפות" },
  { key: "certificates", label: "אישורי העמותה", to: "/admin/certificates", hint: "ניהול תקין וכו'" },
  { key: "gallery_images", label: "תמונות בגלריה", to: "/admin/gallery", hint: "גלריית הפוטר" },
  { key: "media", label: "קבצים בספרייה", to: "/admin/media", hint: "חומרי מיתוג ומסמכים" },
];

function Overview() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [months, setMonths] = useState(12);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessToken();
        const [c, s2] = await Promise.all([
          getAdminOverview({ data: { accessToken: token } }),
          getLeadStats({ data: { accessToken: token, months } }),
        ]);
        setCounts(c);
        setStats(s2 as LeadStats);
      } catch {
        setErr("לא הצלחנו לטעון את הנתונים.");
      }
    })();
  }, [months]);

  return (
    <>
      <header className="adm-head">
        <h1>סקירה כללית</h1>
        <p>מצב התוכן והפניות באתר.</p>
      </header>

      {err && <p className="adm-err">{err}</p>}

      {stats && <LeadsDashboard stats={stats} months={months} onMonthsChange={setMonths} />}

      <h2 className="dash-h2">התוכן באתר</h2>

      <div className="adm-cards">
        {CARDS.map((c) => (
          <Link key={c.key} to={c.to} className={`adm-card${c.key === "leads_new" ? " adm-card-accent" : ""}`}>
            <span className="adm-card-num">{counts ? (counts[c.key] ?? 0) : "—"}</span>
            <span className="adm-card-label">{c.label}</span>
            <span className="adm-card-hint">{c.hint}</span>
          </Link>
        ))}
      </div>

      <section className="adm-panel">
        <h2>פעולות מהירות</h2>
        <div className="adm-quick">
          <Link to="/admin/stories">הוספת סיפור חדש</Link>
          <Link to="/admin/press">הוספת כתבה</Link>
          <Link to="/admin/certificates">העלאת אישור</Link>
          <Link to="/admin/settings">עדכון טלפון וקישורי תרומה</Link>
        </div>
      </section>
    </>
  );
}
