import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";

import { getAccessToken } from "@/lib/supabase-browser";
import { listSettings, saveSettings } from "@/lib/api/content.functions";

export const Route = createFileRoute("/admin/settings")({ component: SettingsPage });

type Setting = {
  key: string;
  value: string | null;
  label: string;
  group_name: string;
  input_type: string;
  sort_order: number;
};

function SettingsPage() {
  const [rows, setRows] = useState<Setting[] | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const accessToken = await getAccessToken();
      const list = (await listSettings({ data: { accessToken } })) as Setting[];
      setRows(list);
      setDraft(Object.fromEntries(list.map((s) => [s.key, s.value ?? ""])));
    } catch {
      setErr("טעינת ההגדרות נכשלה.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const groups = useMemo(() => {
    const m = new Map<string, Setting[]>();
    for (const r of rows ?? []) {
      if (!m.has(r.group_name)) m.set(r.group_name, []);
      m.get(r.group_name)!.push(r);
    }
    return [...m.entries()];
  }, [rows]);

  const dirty = useMemo(
    () => (rows ?? []).filter((r) => (r.value ?? "") !== (draft[r.key] ?? "")),
    [rows, draft],
  );

  const save = async () => {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const accessToken = await getAccessToken();
      await saveSettings({
        data: {
          accessToken,
          changes: dirty.map((r) => ({ key: r.key, value: draft[r.key] === "" ? null : draft[r.key] })),
        },
      });
      setMsg(`נשמרו ${dirty.length} שינויים. השינוי מופיע באתר מיד.`);
      await load();
    } catch {
      setErr("השמירה נכשלה.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <header className="adm-head">
        <h1>הגדרות האתר</h1>
        <p>הערכים כאן מוזנים לכל מקום שבו הם מופיעים באתר - טלפון, כתובת, קישורי תרומה ופרטי המייסד.</p>
      </header>

      {err && <p className="adm-err">{err}</p>}
      {msg && <p className="adm-msg">{msg}</p>}

      {rows === null ? (
        <p className="adm-muted">טוען…</p>
      ) : (
        <>
          {groups.map(([group, items]) => (
            <section key={group} className="adm-panel">
              <h2>{group}</h2>
              <div className="adm-form">
                {items.map((s) => (
                  <label key={s.key} className={s.input_type === "url" ? "full" : undefined}>
                    {s.label}
                    <em>{s.key}</em>
                    <input
                      type={s.input_type === "number" ? "number" : "text"}
                      dir={["url", "email", "tel", "number"].includes(s.input_type) ? "ltr" : undefined}
                      value={draft[s.key] ?? ""}
                      onChange={(e) => setDraft({ ...draft, [s.key]: e.target.value })}
                      placeholder={s.value === null ? "לא הוגדר" : undefined}
                    />
                  </label>
                ))}
              </div>
            </section>
          ))}

          <div className="adm-sticky-save">
            <span>{dirty.length === 0 ? "אין שינויים לשמירה" : `${dirty.length} שינויים ממתינים`}</span>
            <button type="button" className="adm-primary" disabled={busy || dirty.length === 0} onClick={() => void save()}>
              {busy ? "שומר…" : "שמירת השינויים"}
            </button>
          </div>
        </>
      )}
    </>
  );
}
