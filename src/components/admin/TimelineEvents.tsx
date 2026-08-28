import { useState } from "react";

import { getAccessToken } from "@/lib/supabase-browser";
import {
  CATEGORIES,
  deleteTimelineEvent,
  saveTimelineEvent,
  type TimelineEvent,
} from "@/lib/api/timeline.functions";

/**
 * ניהול ציוני הדרך שמופיעים מתחת לגרף.
 *
 * יושב באותו מסך של הגרף ולא בעמוד נפרד: רושמים אירוע בדיוק ברגע שמסתכלים
 * על קפיצה בגרף ותוהים מה גרם לה. עמוד נפרד היה אומר שאף אחד לא ירשום.
 */

export const CAT_LABEL: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c.label]),
);

const today = () => new Date().toISOString().slice(0, 10);

export function TimelineEvents({
  events,
  onChanged,
}: {
  events: TimelineEvent[];
  onChanged: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TimelineEvent | null>(null);
  const [date, setDate] = useState(today());
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState<string>("site");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const reset = () => {
    setEditing(null);
    setDate(today());
    setTitle("");
    setNote("");
    setCategory("site");
    setErr(null);
  };

  const startEdit = (e: TimelineEvent) => {
    setEditing(e);
    setDate(e.event_date.slice(0, 10));
    setTitle(e.title);
    setNote(e.note ?? "");
    setCategory(e.category);
    setOpen(true);
    setErr(null);
  };

  const save = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!title.trim()) return setErr("צריך כותרת קצרה - מה קרה.");
    setBusy(true);
    setErr(null);
    try {
      const accessToken = await getAccessToken();
      await saveTimelineEvent({
        data: {
          accessToken,
          id: editing?.id,
          event_date: date,
          title: title.trim(),
          note: note.trim() || undefined,
          category: category as TimelineEvent["category"],
        },
      });
      reset();
      setOpen(false);
      onChanged();
    } catch {
      setErr("השמירה נכשלה. נסו שוב.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (e: TimelineEvent) => {
    if (!confirm(`למחוק את "${e.title}"?`)) return;
    try {
      const accessToken = await getAccessToken();
      await deleteTimelineEvent({ data: { accessToken, id: e.id } });
      onChanged();
    } catch {
      setErr("המחיקה נכשלה.");
    }
  };

  return (
    <div className="tl-wrap">
      <div className="tl-head">
        <h3>מה קרה ומתי</h3>
        <button
          type="button"
          className="adm-linkbtn"
          onClick={() => {
            reset();
            setOpen((o) => !o);
          }}
        >
          {open && !editing ? "ביטול" : "הוספת ציון דרך"}
        </button>
      </div>

      <p className="adm-muted tl-intro">
        הגרף מראה כמה פניות היו בכל חודש, אבל לא למה. רשמו כאן שינויים באתר,
        קמפיינים, כתבות ואירועים - והם יסומנו מתחת לחודש שלהם, כך שאפשר לראות
        מה קרה סביב כל קפיצה או ירידה.
      </p>

      {open && (
        <form className="tl-form" onSubmit={save}>
          <label>
            <span>תאריך</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </label>
          <label>
            <span>סוג</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label className="tl-form-wide">
            <span>מה קרה</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="למשל: עלה האתר החדש"
              maxLength={120}
              required
            />
          </label>
          <label className="tl-form-wide">
            <span>פירוט (לא חובה)</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              maxLength={1000}
              placeholder="פרטים שיעזרו להיזכר בעוד חצי שנה"
            />
          </label>
          {err && <p className="adm-err tl-form-wide">{err}</p>}
          <div className="tl-form-actions tl-form-wide">
            <button type="submit" className="adm-btn" disabled={busy}>
              {busy ? "שומר…" : editing ? "עדכון" : "הוספה"}
            </button>
            {editing && (
              <button
                type="button"
                className="adm-linkbtn"
                onClick={() => {
                  reset();
                  setOpen(false);
                }}
              >
                ביטול
              </button>
            )}
          </div>
        </form>
      )}

      {events.length === 0 ? (
        <p className="adm-muted">עדיין לא נרשם אף ציון דרך.</p>
      ) : (
        <ul className="tl-list">
          {events.map((e) => (
            <li key={e.id}>
              <span className={`tl-dot tl-dot-${e.category}`} aria-hidden="true" />
              <div className="tl-list-main">
                <b>{e.title}</b>
                <span className="tl-meta">
                  {new Date(e.event_date).toLocaleDateString("he-IL")} · {CAT_LABEL[e.category] ?? e.category}
                </span>
                {e.note && <span className="tl-note">{e.note}</span>}
              </div>
              <div className="tl-list-actions">
                <button type="button" className="adm-linkbtn" onClick={() => startEdit(e)}>
                  עריכה
                </button>
                <button type="button" className="adm-linkbtn" onClick={() => remove(e)}>
                  מחיקה
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
