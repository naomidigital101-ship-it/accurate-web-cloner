import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useCallback, useEffect, useState } from "react";

import { getAccessToken } from "@/lib/supabase-browser";
import { leadCounts, listLeads, updateLead } from "@/lib/api/leads.functions";

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
  supplied_at: string | null;
  repeat_count: number;
  created_at: string;
  /** העמוד באתר שבו מולא הטופס */
  form_page: string | null;
  /** הערוץ שממנו הגיע הגולש לאתר */
  referer: string | null;
};

type Counts = { requestsNew: number; donationsNew: number; requests: number; donations: number };

/**
 * שם קריא לעמוד שבו מולא הטופס.
 *
 * "/" הוא הטופס בלשוניות שבעמוד הבית, ולא עמוד ייעודי - וזו בדיוק ההשוואה
 * שמעניינת: האם הטופס בעמוד הבית מייצר יותר פניות מהעמוד הייעודי.
 */
const PAGE_LABEL: Record<string, string> = {
  "/": "עמוד הבית",
  "/request": "בקשת תפילין",
  "/give": "מסירת תפילין",
  "/donate": "תרומה",
  "/en": "עמוד הבית באנגלית",
  "/en/request-for-tefillin": "בקשה - אנגלית",
  "/en/request-to-donate-tefillin": "מסירה - אנגלית",
};

function pageLabel(p: string | null): string {
  if (!p) return "";
  const clean = p.split("?")[0].replace(/\/$/, "") || "/";
  return PAGE_LABEL[clean] ?? clean;
}

const STATUS: Record<Lead["status"], string> = {
  new: "ממתינה לטיפול",
  in_progress: "בטיפול",
  done: "טופלה",
  spam: "ספאם",
};

/**
 * שני התורים הם פעולות הפוכות: מבקש מקבל תפילין, מוסר נותן אותם.
 * ערבוב שלהם ברשימה אחת מכריח את בעל העסק להחליט מחדש בכל שורה מה לעשות,
 * ולכן ברירת המחדל היא תור המבקשים שממתינות לטיפול.
 */
const QUEUES = [
  { key: "request", label: "מבקשים תפילין" },
  { key: "donate", label: "מוסרים תפילין" },
  { key: "all", label: "הכל" },
] as const;
type QueueKey = (typeof QUEUES)[number]["key"];

function fmt(iso: string) {
  return new Date(iso).toLocaleString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function nameOf(r: Lead) {
  return r.full_name || [r.first_name, r.last_name].filter(Boolean).join(" ") || "ללא שם";
}

const CSV_COLUMNS: [string, (r: Lead) => string][] = [
  ["תאריך", (r) => fmt(r.created_at)],
  ["סוג", (r) => (r.kind === "request" ? "בקשת תפילין" : "מסירת תפילין")],
  ["סטטוס", (r) => STATUS[r.status]],
  ["שם", nameOf],
  ["טלפון", (r) => r.phone ?? ""],
  ["אימייל", (r) => r.email ?? ""],
  ["יישוב", (r) => r.city ?? ""],
  ["כתובת", (r) => r.address ?? ""],
  ["למי מיועדות", (r) => r.target ?? ""],
  ["יד כותבת", (r) => r.hand ?? ""],
  ["אספקה", (r) => r.delivery ?? ""],
  ["מצב התפילין", (r) => r.condition ?? ""],
  ["הקדשה", (r) => r.dedication ?? ""],
  ["סופק", (r) => (r.supplied_at ? "כן" : "")],
  ["מספר פניות מאותו טלפון", (r) => String(r.repeat_count)],
  ["עמוד הפנייה", (r) => pageLabel(r.form_page)],
  ["ערוץ הגעה", (r) => r.referer ?? ""],
];

/** אקסל בעברית קורא UTF-8 רק עם BOM, ובלעדיו כל הטקסט יוצא ג'יבריש */
function toCsv(rows: Lead[]) {
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = [CSV_COLUMNS.map(([h]) => esc(h)).join(",")];
  for (const r of rows) lines.push(CSV_COLUMNS.map(([, f]) => esc(f(r))).join(","));
  return "﻿" + lines.join("\r\n");
}

function LeadsPage() {
  const [rows, setRows] = useState<Lead[] | null>(null);
  const [counts, setCounts] = useState<Counts | null>(null);
  const [queue, setQueue] = useState<QueueKey>("request");
  const [status, setStatus] = useState<"all" | Lead["status"]>("new");
  const [search, setSearch] = useState("");
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErr(null);
    try {
      const accessToken = await getAccessToken();
      const [list, c] = await Promise.all([
        listLeads({ data: { accessToken, status, kind: queue, search: term || undefined } }),
        leadCounts({ data: { accessToken } }),
      ]);
      setRows(list as Lead[]);
      setCounts(c as Counts);
    } catch {
      setErr("טעינת הפניות נכשלה.");
    }
  }, [status, queue, term]);

  useEffect(() => {
    void load();
  }, [load]);

  const patch = async (id: string, body: { status?: Lead["status"]; supplied?: boolean }) => {
    setBusy(true);
    try {
      const accessToken = await getAccessToken();
      await updateLead({ data: { accessToken, id, ...body } });
      await load();
    } catch {
      setErr("העדכון נכשל.");
    } finally {
      setBusy(false);
    }
  };

  const exportCsv = async () => {
    setBusy(true);
    try {
      const accessToken = await getAccessToken();
      const all = (await listLeads({
        data: { accessToken, status, kind: queue, search: term || undefined, limit: 20000 },
      })) as Lead[];
      const url = URL.createObjectURL(new Blob([toCsv(all)], { type: "text/csv;charset=utf-8" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `פניות-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setErr("הייצוא נכשל.");
    } finally {
      setBusy(false);
    }
  };

  const queueCount = (k: QueueKey) => {
    if (!counts) return null;
    if (k === "request") return status === "new" ? counts.requestsNew : counts.requests;
    if (k === "donate") return status === "new" ? counts.donationsNew : counts.donations;
    return null;
  };

  return (
    <>
      <header className="adm-head">
        <h1>פניות</h1>
        <p>כל מי שמילא טופס באתר. ברירת המחדל היא מה שממתין לטיפול - כדי שלא תיפול פנייה בין הכיסאות.</p>
      </header>

      <div className="adm-queues">
        {QUEUES.map((q) => {
          const n = queueCount(q.key);
          return (
            <button
              key={q.key}
              type="button"
              className={queue === q.key ? "on" : ""}
              onClick={() => setQueue(q.key)}
            >
              {q.label}
              {n !== null && <span className="adm-qnum">{n}</span>}
            </button>
          );
        })}
      </div>

      <div className="adm-filters">
        <div>
          <span>סטטוס</span>
          {(["new", "in_progress", "done", "all", "spam"] as const).map((s) => (
            <button key={s} type="button" className={status === s ? "on" : ""} onClick={() => setStatus(s)}>
              {s === "all" ? "הכל" : STATUS[s]}
            </button>
          ))}
        </div>
        <div className="adm-search">
          <input
            type="search"
            value={search}
            placeholder="חיפוש שם, טלפון, מייל או יישוב"
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setTerm(search.trim())}
          />
          <button type="button" onClick={() => setTerm(search.trim())}>חיפוש</button>
          {term && (
            <button type="button" onClick={() => { setSearch(""); setTerm(""); }}>ניקוי</button>
          )}
        </div>
        <div>
          <button type="button" disabled={busy || !rows?.length} onClick={() => void exportCsv()}>
            ייצוא לאקסל
          </button>
        </div>
      </div>

      {err && <p className="adm-err">{err}</p>}

      {rows === null ? (
        <p className="adm-muted">טוען…</p>
      ) : rows.length === 0 ? (
        <div className="adm-empty">
          <b>{status === "new" ? "אין פניות שממתינות לטיפול" : "אין פניות להצגה"}</b>
          <p>
            {status === "new"
              ? "כל הפניות בתור הזה טופלו. פנייה חדשה מהאתר תופיע כאן מיד."
              : "אפשר לשנות את הסינון למעלה כדי לראות פניות אחרות."}
          </p>
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>תאריך</th>
                <th>שם</th>
                {queue === "all" && <th>סוג</th>}
                <th>טלפון</th>
                <th>אספקה</th>
                <th>סטטוס</th>
                <th>סופק</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const leftHand = (r.hand ?? "").includes("שמאל") || (r.hand ?? "").toLowerCase().includes("left");
                const shipping =
                  (r.delivery ?? "").includes("משלוח") || (r.delivery ?? "").toLowerCase().includes("delivery");
                return (
                  <Fragment key={r.id}>
                    <tr className={r.status === "new" ? "is-new" : undefined}>
                      <td className="adm-nowrap">{fmt(r.created_at)}</td>
                      <td>
                        <b>{nameOf(r)}</b>
                        {r.lang === "en" && <span className="adm-tag">EN</span>}
                        {r.repeat_count > 1 && (
                          <span className="adm-tag is-repeat" title="אותו מספר טלפון פנה יותר מפעם אחת">
                            פנה כבר {r.repeat_count} פעמים
                          </span>
                        )}
                      </td>
                      {queue === "all" && <td>{r.kind === "request" ? "מבקש" : "מוסר"}</td>}
                      <td className="adm-nowrap" dir="ltr">
                        {r.phone ? <a href={`tel:${r.phone}`}>{r.phone}</a> : "—"}
                      </td>
                      <td>
                        {leftHand && <span className="adm-tag is-hand">יד שמאל</span>}
                        {shipping && <span className="adm-tag is-ship">משלוח</span>}
                        {!leftHand && !shipping && <span className="adm-muted">—</span>}
                      </td>
                      <td>
                        <select
                          value={r.status}
                          disabled={busy}
                          onChange={(e) => void patch(r.id, { status: e.target.value as Lead["status"] })}
                        >
                          {(Object.keys(STATUS) as Lead["status"][]).map((s) => (
                            <option key={s} value={s}>{STATUS[s]}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <label className="adm-check" title="סימון שהתפילין נמסרו בפועל - מזין את המונה באתר">
                          <input
                            type="checkbox"
                            checked={Boolean(r.supplied_at)}
                            disabled={busy}
                            onChange={(e) => void patch(r.id, { supplied: e.target.checked })}
                          />
                          <span />
                        </label>
                      </td>
                      <td>
                        <button type="button" className="adm-linkbtn" onClick={() => setOpen(open === r.id ? null : r.id)}>
                          {open === r.id ? "סגירה" : "פרטים"}
                        </button>
                      </td>
                    </tr>
                    {open === r.id && (
                      <tr className="adm-detail">
                        <td colSpan={queue === "all" ? 8 : 7}>
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
                              ["סופק בתאריך", r.supplied_at ? fmt(r.supplied_at) : null],
                              ["עמוד הפנייה", pageLabel(r.form_page)],
                              ["ערוץ הגעה", r.referer],
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
                              <a
                                href={`https://wa.me/${r.phone.replace(/\D/g, "").replace(/^0/, "972")}`}
                                target="_blank"
                                rel="noopener"
                              >
                                פתיחת שיחה בוואטסאפ
                              </a>
                            )}
                            {r.email && <a href={`mailto:${r.email}`}>שליחת מייל</a>}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
