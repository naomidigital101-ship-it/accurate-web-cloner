import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { getBrowserSupabase, getAccessToken } from "@/lib/supabase-browser";
import { getStaffUser } from "@/lib/api/auth.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "ניהול האתר | קשר של תפילין" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminShell,
});

type Staff = { id: string; email: string | null; roles: string[]; isAdmin: boolean } | null;

const NAV = [
  { to: "/admin", label: "סקירה", exact: true },
  { to: "/admin/leads", label: "פניות" },
  { to: "/admin/stories", label: "סיפורים" },
  { to: "/admin/rabbis", label: "הסכמות רבנים" },
  { to: "/admin/press", label: "כתבות בתקשורת" },
  { to: "/admin/certificates", label: "אישורי העמותה" },
  { to: "/admin/gallery", label: "גלריה" },
  { to: "/admin/services", label: "שירותים" },
  { to: "/admin/faqs", label: "שאלות נפוצות" },
  { to: "/admin/media", label: "ספריית מדיה" },
  { to: "/admin/settings", label: "הגדרות האתר" },
  { to: "/admin/import", label: "ייבוא פניות" },
  { to: "/admin/migrate", label: "הגירת תוכן" },
];

function AdminShell() {
  const [staff, setStaff] = useState<Staff>(null);
  const [checking, setChecking] = useState(true);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const refresh = useCallback(async () => {
    try {
      const token = await getAccessToken();
      const user = token ? await getStaffUser({ data: { accessToken: token } }) : null;
      setStaff(user as Staff);
    } catch {
      setStaff(null);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    let unsub: (() => void) | undefined;
    void getBrowserSupabase().then((sb) => {
      const { data } = sb.auth.onAuthStateChange(() => void refresh());
      unsub = () => data.subscription.unsubscribe();
    });
    return () => unsub?.();
  }, [refresh]);

  if (checking) {
    return (
      <div className="adm-boot" dir="rtl">
        <span className="adm-spinner" aria-hidden="true" />
        <p>בודק הרשאות…</p>
      </div>
    );
  }

  if (!staff) return <LoginScreen onDone={refresh} />;

  return (
    <div className="adm" dir="rtl">
      <aside className="adm-side">
        <div className="adm-brand">
          <img src="/wp/img/לוגו-קשר-של-תפילין-01.svg" alt="" width={36} height={36} />
          <div>
            <b>ניהול האתר</b>
            <span>קשר של תפילין</span>
          </div>
        </div>
        <nav className="adm-nav" aria-label="ניווט ניהול">
          {NAV.map((n) => {
            const active = n.exact ? pathname.replace(/\/$/, "") === "/admin" : pathname.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to} className={`adm-nav-item${active ? " on" : ""}`}>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="adm-user">
          <span className="adm-user-mail">{staff.email}</span>
          <span className="adm-user-role">{staff.isAdmin ? "מנהל" : "עורך"}</span>
          <button
            type="button"
            onClick={async () => {
              const sb = await getBrowserSupabase();
              await sb.auth.signOut();
              await refresh();
            }}
          >
            התנתקות
          </button>
        </div>
        <a href="/" className="adm-back" target="_blank" rel="noopener">
          צפייה באתר ↗
        </a>
      </aside>
      <main className="adm-main">
        <Outlet />
      </main>
    </div>
  );
}

function LoginScreen({ onDone }: { onDone: () => Promise<void> }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const sb = await getBrowserSupabase();
      if (mode === "signup") {
        const { error } = await sb.auth.signUp({ email, password });
        if (error) throw error;
        setMsg("החשבון נוצר. אם נדרש אימות מייל - אשרו את ההודעה ואז התחברו.");
        setMode("login");
      } else {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      await onDone();
    } catch (e2) {
      const m = e2 instanceof Error ? e2.message : "אירעה שגיאה";
      setErr(
        /invalid login/i.test(m)
          ? "מייל או סיסמה שגויים."
          : /already registered/i.test(m)
            ? "המייל כבר רשום. עברו להתחברות."
            : m,
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="adm-login" dir="rtl">
      <form className="adm-login-card" onSubmit={submit}>
        <img src="/wp/img/לוגו-קשר-של-תפילין-01.svg" alt="קשר של תפילין" width={64} height={64} />
        <h1>ניהול האתר</h1>
        <p className="adm-login-sub">
          {mode === "login" ? "התחברו כדי לנהל את תוכן האתר והפניות." : "יצירת חשבון למי שהורשה מראש."}
        </p>

        <label>
          כתובת מייל
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
            dir="ltr"
          />
        </label>
        <label>
          סיסמה
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            minLength={8}
            required
            dir="ltr"
          />
        </label>

        {err && <p className="adm-err" role="alert">{err}</p>}
        {msg && <p className="adm-msg" role="status">{msg}</p>}

        <button type="submit" className="adm-primary" disabled={busy}>
          {busy ? "רגע…" : mode === "login" ? "כניסה" : "יצירת חשבון"}
        </button>
        <button
          type="button"
          className="adm-linkbtn"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setErr(null);
            setMsg(null);
          }}
        >
          {mode === "login" ? "פעם ראשונה? יצירת חשבון" : "כבר יש לי חשבון - להתחברות"}
        </button>

        <p className="adm-login-note">
          הרשאות ניתנות מראש לפי כתובת מייל. הרשמה של מייל שאינו ברשימה לא מקנה גישה לשום דבר.
        </p>
      </form>
    </div>
  );
}
