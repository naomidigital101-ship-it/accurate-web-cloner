import { useCallback, useEffect, useMemo, useState } from "react";

import { getAccessToken } from "@/lib/supabase-browser";
import { listAll, saveRow, deleteRow, reorder } from "@/lib/api/content.functions";

export type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "lines" | "number" | "url" | "image" | "select" | "date";
  options?: { value: string; label: string }[];
  hint?: string;
  required?: boolean;
  full?: boolean;
};

export type ManagerProps = {
  table: string;
  title: string;
  subtitle: string;
  fields: FieldDef[];
  /** עמודות הטבלה ברשימה */
  columns: { key: string; label: string }[];
  /** ערכי ברירת מחדל לשורה חדשה */
  defaults?: Record<string, unknown>;
  /** האם יש הפרדת שפה */
  bilingual?: boolean;
};

type Row = Record<string, unknown> & { id: string };

const EMPTY = "—";

export function ContentManager({ table, title, subtitle, fields, columns, defaults = {}, bilingual }: ManagerProps) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [lang, setLang] = useState<"he" | "en">("he");
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [draft, setDraft] = useState<Record<string, unknown>>({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErr(null);
    try {
      const accessToken = await getAccessToken();
      setRows((await listAll({ data: { accessToken, table } })) as Row[]);
    } catch {
      setErr("טעינת הנתונים נכשלה.");
    }
  }, [table]);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = useMemo(
    () => (rows ?? []).filter((r) => !bilingual || r.lang === lang),
    [rows, bilingual, lang],
  );

  const openNew = () => {
    setDraft({ status: "published", ...(bilingual ? { lang } : {}), ...defaults });
    setEditing("new");
    setMsg(null);
  };
  const openEdit = (r: Row) => {
    setDraft({ ...r });
    setEditing(r);
    setMsg(null);
  };

  const save = async () => {
    setBusy(true);
    setErr(null);
    try {
      const accessToken = await getAccessToken();
      const values = { ...draft };
      delete values.id;
      await saveRow({
        data: { accessToken, table, id: editing === "new" ? undefined : (editing as Row).id, values },
      });
      setEditing(null);
      setMsg("נשמר בהצלחה.");
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "השמירה נכשלה.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (r: Row) => {
    if (!window.confirm("למחוק את הפריט? הפעולה אינה הפיכה.")) return;
    setBusy(true);
    try {
      const accessToken = await getAccessToken();
      await deleteRow({ data: { accessToken, table, id: r.id } });
      await load();
    } catch {
      setErr("המחיקה נכשלה. ייתכן שרק מנהל רשאי למחוק.");
    } finally {
      setBusy(false);
    }
  };

  const move = async (idx: number, dir: -1 | 1) => {
    const list = [...visible];
    const j = idx + dir;
    if (j < 0 || j >= list.length) return;
    [list[idx], list[j]] = [list[j], list[idx]];
    setRows((prev) => {
      if (!prev) return prev;
      const others = prev.filter((r) => !list.some((l) => l.id === r.id));
      return [...list, ...others];
    });
    const accessToken = await getAccessToken();
    await reorder({ data: { accessToken, table, ids: list.map((r) => r.id) } });
    await load();
  };

  return (
    <>
      <header className="adm-head">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </header>

      <div className="adm-toolbar">
        {bilingual && (
          <div className="adm-langswitch">
            <button type="button" className={lang === "he" ? "on" : ""} onClick={() => setLang("he")}>עברית</button>
            <button type="button" className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>אנגלית</button>
          </div>
        )}
        <button type="button" className="adm-primary adm-add" onClick={openNew}>+ הוספה</button>
      </div>

      {err && <p className="adm-err">{err}</p>}
      {msg && <p className="adm-msg">{msg}</p>}

      {rows === null ? (
        <p className="adm-muted">טוען…</p>
      ) : visible.length === 0 ? (
        <div className="adm-empty">
          <b>אין פריטים להצגה</b>
          <p>אפשר להוסיף פריט ראשון בכפתור למעלה.</p>
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th style={{ width: 70 }}>סדר</th>
                {columns.map((c) => <th key={c.key}>{c.label}</th>)}
                <th>מצב</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {visible.map((r, i) => (
                <tr key={r.id}>
                  <td className="adm-order">
                    <button type="button" onClick={() => void move(i, -1)} disabled={i === 0} aria-label="העלאה">▲</button>
                    <button type="button" onClick={() => void move(i, 1)} disabled={i === visible.length - 1} aria-label="הורדה">▼</button>
                  </td>
                  {columns.map((c) => (
                    <td key={c.key}>
                      {c.key.endsWith("_url") || c.key === "img" || c.key === "logo_url" ? (
                        r[c.key] ? <img src={String(r[c.key])} alt="" className="adm-thumb" loading="lazy" /> : EMPTY
                      ) : (
                        <span className="adm-clip">{String(r[c.key] ?? EMPTY)}</span>
                      )}
                    </td>
                  ))}
                  <td>
                    <span className={`adm-pill${r.status === "published" ? " on" : ""}`}>
                      {r.status === "published" ? "מפורסם" : "טיוטה"}
                    </span>
                  </td>
                  <td className="adm-rowactions">
                    <button type="button" className="adm-linkbtn" onClick={() => openEdit(r)}>עריכה</button>
                    <button type="button" className="adm-linkbtn adm-danger" onClick={() => void remove(r)} disabled={busy}>מחיקה</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="adm-modal" role="dialog" aria-modal="true" aria-label="עריכת פריט">
          <div className="adm-modal-box">
            <div className="adm-modal-head">
              <h2>{editing === "new" ? "פריט חדש" : "עריכת פריט"}</h2>
              <button type="button" onClick={() => setEditing(null)} aria-label="סגירה">×</button>
            </div>

            <div className="adm-form">
              {bilingual && (
                <label className="full">
                  שפה
                  <select value={String(draft.lang ?? "he")} onChange={(e) => setDraft({ ...draft, lang: e.target.value })}>
                    <option value="he">עברית</option>
                    <option value="en">אנגלית</option>
                  </select>
                </label>
              )}

              {fields.map((f) => (
                <label key={f.key} className={f.full ? "full" : undefined}>
                  {f.label}
                  {f.hint && <em>{f.hint}</em>}
                  {f.type === "textarea" || f.type === "lines" ? (
                    <textarea
                      rows={f.type === "lines" ? 10 : 4}
                      value={
                        f.type === "lines"
                          ? ((draft[f.key] as string[]) ?? []).join("\n\n")
                          : String(draft[f.key] ?? "")
                      }
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          [f.key]:
                            f.type === "lines"
                              ? e.target.value.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean)
                              : e.target.value,
                        })
                      }
                    />
                  ) : f.type === "select" ? (
                    <select value={String(draft[f.key] ?? "")} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}>
                      {(f.options ?? []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  ) : (
                    <input
                      type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                      dir={f.type === "url" || f.type === "image" ? "ltr" : undefined}
                      value={String(draft[f.key] ?? "")}
                      onChange={(e) =>
                        setDraft({ ...draft, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value })
                      }
                    />
                  )}
                  {(f.type === "image" || f.key.endsWith("_url")) && draft[f.key] ? (
                    <img src={String(draft[f.key])} alt="" className="adm-preview" />
                  ) : null}
                </label>
              ))}

              <label>
                מצב פרסום
                <select value={String(draft.status ?? "published")} onChange={(e) => setDraft({ ...draft, status: e.target.value })}>
                  <option value="published">מפורסם</option>
                  <option value="draft">טיוטה</option>
                </select>
              </label>
            </div>

            <div className="adm-modal-foot">
              <button type="button" className="adm-primary" onClick={() => void save()} disabled={busy}>
                {busy ? "שומר…" : "שמירה"}
              </button>
              <button type="button" className="adm-linkbtn" onClick={() => setEditing(null)}>ביטול</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
