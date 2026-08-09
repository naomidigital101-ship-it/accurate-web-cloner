import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useCallback, useEffect, useState } from "react";

import { getAccessToken } from "@/lib/supabase-browser";
import { listLeads, updateLead } from "@/lib/api/leads.functions";

export const Route = createFileRoute("/admin/leads")({ component: LeadsPage });

type Lead = {
  id: string;
  kind: "request" | "donate";
  lang: string;
  status: "new" | "in_progress" | "done" | "spam";
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  target: string | null;
  hand: string | null;
  delivery: string | null;
  condition: string | null;
  dedication: string | null;
  notes: string | null;
  created_at: string;
};

const STATUS: Record<Lead["status"], string> = {
  new: "חדשה",
  in_progress: "בטיפול",
  done: "טופלה",
  spam: "ספאם",
};
const KIND: Record<Lead["kind"], string> = { request: "בקשת תפילין", donate: "מסירת תפילין" };

function fmt(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("he-IL", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function LeadsPage() {
  const [rows, setRows] = useState<Lead[] | null>(null);
  const [status, setStatus] = useState<"all" | Lead["status"]>("all");
  const [kind, setKind] = useState<"all" | Lead["kind"]>("all");
  const [open, setOpen] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErr(null);
    try {
      const token = await getAccessToken();
      setRows((await listLeads({ data: { accessToken: token, status, kind } })) as Lead[]);
    } catch {
      setErr("טעינת הפניות נכשלה.");
    }
  }, [status, kind]);

  useEffect(() => {
    void load();
  }, [load]);

  const setLeadStatus = async (id: string, s: Lead["status"]) => {
    const token = await getAccessToken();
    await updateLead({ data: { accessToken: token, id, status: s } });
    await load();
  };

  return (
    <>
      <header className="adm-head">
        <h1>פניות</h1>
        <p>כל מי שמילא טופס באתר. הפניות נשמרות מרגע השליחה.</p>
      </header>

      <div className="adm-filters">
        <div>
          <span>סטטוס</span>
          {(["all", "new", "in_progress", "done", "spam"] as const).map((s) => (
            <button key={s} type="button" className={status === s ? "on" : ""} onClick={() => setStatus(s)}>
              {s === "all" ? "הכל" : STATUS[s]}
            </button>
          ))}
        </div>
        <div>
          <span>סוג</span>
          {(["all", "request", "donate"] as const).map((k) => (
            <button key={k} type="button" className={kind === k ? "on" : ""} onClick={() => setKind(k)}>
              {k === "all" ? "הכל" : KIND[k]}
            </button>
          ))}
        </div>
      </div>

      {err && <p className="adm-err">{err}</p>}

      {rows === null ? (
        <p className="adm-muted">טוען…</p>
      ) : rows.length === 0 ? (
        <div className="adm-empty">
          <b>אין פניות להצגה</b>
          <p>כשמישהו ימלא טופס באתר, הפנייה תופיע כאן מיד.</p>
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>תאריך</th>
                <th>שם</th>
                <th>סוג</th>
                <th>טלפון</th>
                <th>סטטוס</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <Fragment key={r.id}>
                  <tr className={r.status === "new" ? "is-new" : undefined}>
                    <td className="adm-nowrap">{fmt(r.created_at)}</td>
                    <td>
                      <b>{r.full_name || [r.first_name, r.last_name].filter(Boolean).join(" ") || "ללא שם"}</b>
                      {r.lang === "en" && <span className="adm-tag">EN</span>}
                    </td>
                    <td>{KIND[r.kind]}</td>
                    <td className="adm-nowrap" dir="ltr">
                      {r.phone ? <a href={`tel:${r.phone}`}>{r.phone}</a> : "—"}
                    </td>
                    <td>
                      <select value={r.status} onChange={(e) => void setLeadStatus(r.id, e.target.value as Lead["status"])}>
                        {(Object.keys(STATUS) as Lead["status"][]).map((s) => (
                          <option key={s} value={s}>{STATUS[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button type="button" className="adm-linkbtn" onClick={() => setOpen(open === r.id ? null : r.id)}>
                        {open === r.id ? "סגירה" : "פרטים"}
                      </button>
                    </td>
                  </tr>
                  {open === r.id && (
                    <tr className="adm-detail">
                      <td colSpan={6}>
                        <dl>
                          {([
                            ["אימייל", r.email],
                            ["כתובת", r.address],
                            ["יישוב", r.city],
                            ["למי מיועדות", r.target],
                            ["יד כותבת", r.hand],
                            ["אספקה", r.delivery],
                            ["מצב התפילין", r.condition],
                            ["הקדשה", r.dedication],
                          ] as const)
                            .filter(([, v]) => v)
                            .map(([k, v]) => (
                              <div key={k}>
                                <dt>{k}</dt>
                                <dd>{v}</dd>
                              </div>
                            ))}
                        </dl>
                        <div className="adm-detail-actions">
                          {r.phone && (
                            <a href={`https://wa.me/${r.phone.replace(/\D/g, "").replace(/^0/, "972")}`} target="_blank" rel="noopener">
                              פתיחת שיחה בוואטסאפ
                            </a>
                          )}
                          {r.email && <a href={`mailto:${r.email}`}>שליחת מייל</a>}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
