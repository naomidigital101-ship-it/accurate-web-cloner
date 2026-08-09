import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getAccessToken, getBrowserSupabase } from "@/lib/supabase-browser";
import { listAll, saveRow, deleteRow } from "@/lib/api/content.functions";

export const Route = createFileRoute("/admin/media")({ component: MediaPage });

type Media = {
  id: string;
  url: string;
  file_name: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  alt: string | null;
  folder: string;
  created_at: string;
  is_public: boolean;
  title: string | null;
  description: string | null;
};

const FOLDERS = ["כללי", "לוגואים ומיתוג", "תמונות לאתר", "מסמכים ואישורים", "מכתבים"];

function human(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function MediaPage() {
  const [rows, setRows] = useState<Media[] | null>(null);
  const [folder, setFolder] = useState<string>("הכל");
  const [uploading, setUploading] = useState(0);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [target, setTarget] = useState(FOLDERS[0]);

  const load = useCallback(async () => {
    try {
      const accessToken = await getAccessToken();
      setRows((await listAll({ data: { accessToken, table: "media" } })) as Media[]);
    } catch {
      setErr("טעינת הספרייה נכשלה.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = useMemo(
    () => (rows ?? []).filter((r) => folder === "הכל" || r.folder === folder),
    [rows, folder],
  );

  const upload = async (files: FileList) => {
    setErr(null);
    setMsg(null);
    setUploading(files.length);
    try {
      const sb = await getBrowserSupabase();
      const accessToken = await getAccessToken();
      for (const file of Array.from(files)) {
        // שם ייחודי כדי ששני קבצים באותו שם לא ידרסו זה את זה
        const safe = file.name.replace(/[^\w.\-֐-׿]+/g, "-");
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`;
        const { error: upErr } = await sb.storage.from("media").upload(path, file, {
          cacheControl: "31536000",
          upsert: false,
        });
        if (upErr) throw new Error(upErr.message);
        const { data: pub } = sb.storage.from("media").getPublicUrl(path);
        await saveRow({
          data: {
            accessToken,
            table: "media",
            values: {
              url: pub.publicUrl,
              file_name: file.name,
              mime_type: file.type || null,
              size_bytes: file.size,
              folder: target,
            },
          },
        });
        setUploading((n) => n - 1);
      }
      setMsg("ההעלאה הושלמה.");
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "ההעלאה נכשלה.");
    } finally {
      setUploading(0);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const togglePublic = async (m: Media) => {
    const accessToken = await getAccessToken();
    await saveRow({ data: { accessToken, table: "media", id: m.id, values: { is_public: !m.is_public } } });
    await load();
  };

  const rename = async (m: Media) => {
    const title = window.prompt("שם להצגה בעמוד ההורדות הציבורי:", m.title ?? m.file_name ?? "");
    if (title === null) return;
    const accessToken = await getAccessToken();
    await saveRow({ data: { accessToken, table: "media", id: m.id, values: { title } } });
    await load();
  };

  const remove = async (m: Media) => {
    if (!window.confirm(`למחוק את "${m.file_name ?? m.url}"? הקובץ יימחק לצמיתות.`)) return;
    try {
      const accessToken = await getAccessToken();
      const sb = await getBrowserSupabase();
      const path = m.url.split("/media/").pop();
      if (path) await sb.storage.from("media").remove([decodeURIComponent(path)]);
      await deleteRow({ data: { accessToken, table: "media", id: m.id } });
      await load();
    } catch {
      setErr("המחיקה נכשלה. ייתכן שרק מנהל רשאי למחוק.");
    }
  };

  return (
    <>
      <header className="adm-head">
        <h1>ספריית מדיה</h1>
        <p>
          מקום אחסון לכל החומרים - לוגואים, מסמכים, תעודות ותמונות. קובץ שמסומן כציבורי מופיע
          גם בעמוד <a href="/brand-kit/" target="_blank" rel="noopener">ערכת המותג</a> להורדה.
        </p>
      </header>

      <section className="adm-panel adm-upload">
        <div>
          <h2>העלאת קבצים</h2>
          <p className="adm-muted" style={{ fontSize: 13.5, margin: "4px 0 0" }}>
            עד 25MB לקובץ. אפשר לבחור כמה קבצים יחד.
          </p>
        </div>
        <div className="adm-upload-controls">
          <select value={target} onChange={(e) => setTarget(e.target.value)} aria-label="תיקייה">
            {FOLDERS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
          <input
            ref={fileRef}
            type="file"
            multiple
            onChange={(e) => e.target.files && e.target.files.length > 0 && void upload(e.target.files)}
          />
        </div>
        {uploading > 0 && <p className="adm-msg">מעלה… נותרו {uploading}</p>}
      </section>

      {err && <p className="adm-err">{err}</p>}
      {msg && <p className="adm-msg">{msg}</p>}

      <div className="adm-filters">
        <div>
          <span>תיקייה</span>
          {["הכל", ...FOLDERS].map((f) => (
            <button key={f} type="button" className={folder === f ? "on" : ""} onClick={() => setFolder(f)}>{f}</button>
          ))}
        </div>
      </div>

      {rows === null ? (
        <p className="adm-muted">טוען…</p>
      ) : visible.length === 0 ? (
        <div className="adm-empty">
          <b>אין קבצים בתיקייה הזו</b>
          <p>אפשר להעלות קבצים בטופס למעלה.</p>
        </div>
      ) : (
        <div className="adm-media-grid">
          {visible.map((m) => {
            const isImg = (m.mime_type ?? "").startsWith("image/");
            return (
              <figure key={m.id} className="adm-media-item">
                {isImg ? (
                  <img src={m.url} alt={m.alt ?? ""} loading="lazy" />
                ) : (
                  <span className="adm-media-file">{(m.file_name ?? "").split(".").pop()?.toUpperCase() || "קובץ"}</span>
                )}
                <figcaption>
                  <b title={m.file_name ?? ""}>{m.title ?? m.file_name ?? "ללא שם"}</b>
                  <span>{human(m.size_bytes)} · {m.folder}</span>
                  <label className="bk-toggle">
                    <input type="checkbox" checked={m.is_public} onChange={() => void togglePublic(m)} />
                    <span>{m.is_public ? "ציבורי - מופיע בערכת המותג" : "פנימי בלבד"}</span>
                  </label>
                  <div>
                    <button type="button" className="adm-linkbtn" onClick={() => void navigator.clipboard.writeText(m.url)}>
                      העתקת קישור
                    </button>
                    <button type="button" className="adm-linkbtn" onClick={() => void rename(m)}>שם להצגה</button>
                    <a href={m.url} target="_blank" rel="noopener">פתיחה</a>
                    <button type="button" className="adm-linkbtn adm-danger" onClick={() => void remove(m)}>מחיקה</button>
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>
      )}
    </>
  );
}
