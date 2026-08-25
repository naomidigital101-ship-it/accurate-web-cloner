import { useCallback, useEffect, useState } from "react";

/**
 * באנר הסכמה לעוגיות.
 * הבחירה נשמרת ב-localStorage ונאכפת בפועל - תוכן מוטמע מצד שלישי (YouTube)
 * לא נטען כלל עד שניתנה הסכמה מפורשת. בלי אכיפה הבאנר הוא קישוט בלבד.
 */

export type Consent = {
  necessary: true;
  functional: boolean;
  embeds: boolean;
  analytics: boolean;
  decidedAt: string;
};

const KEY = "cookie-consent-v1";

/**
 * מוחקת בפועל כל אחסון לא-הכרחי. נקראת כשהמשתמש דוחה קטגוריה,
 * כדי שדחייה גם תנקה מה שכבר נשמר ולא רק תמנע טעינה עתידית.
 * עוגיות ה-session של שרת האחסון הן הכרחיות ואינן נמחקות.
 */
function purgeNonEssential() {
  try {
    for (const k of Object.keys(window.localStorage)) {
      if (k !== KEY) window.localStorage.removeItem(k);
    }
  } catch {
    /* מצב פרטי */
  }
  try {
    window.sessionStorage.clear();
  } catch {
    /* מצב פרטי */
  }
  // ניקוי המחלקות שסרגל הנגישות הותיר על המסמך, אחרת ההעדפה נמחקה אך עדיין מוצגת
  const r = document.documentElement;
  [...r.classList].filter((c) => c.startsWith("a11y-")).forEach((c) => r.classList.remove(c));
  document.body.style.zoom = "";
  document.querySelectorAll<HTMLElement>("[data-a11y-fs]").forEach((el) => {
    el.style.fontSize = "";
    delete el.dataset.a11yFs;
  });
}

export function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

function write(c: Consent) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(c));
  } catch {
    /* מצב פרטי */
  }
  window.dispatchEvent(new CustomEvent("cookie-consent-changed", { detail: c }));
}

/** הוק לשימוש ברכיבים שמטמיעים תוכן חיצוני */
export function useConsent() {
  const [c, setC] = useState<Consent | null>(null);
  useEffect(() => {
    setC(readConsent());
    const on = (e: Event) => setC((e as CustomEvent<Consent>).detail);
    window.addEventListener("cookie-consent-changed", on);
    return () => window.removeEventListener("cookie-consent-changed", on);
  }, []);
  return c;
}

export function CookieConsent({ en = false }: { en?: boolean } = {}) {
  const [show, setShow] = useState(false);
  const [custom, setCustom] = useState(false);
  const [functional, setFunctional] = useState(true);
  const [embeds, setEmbeds] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  const t = (he: string, eng: string) => (en ? eng : he);

  useEffect(() => {
    if (!readConsent()) setShow(true);
    const reopen = () => {
      const c = readConsent();
      setFunctional(c?.functional ?? true);
      setEmbeds(c?.embeds ?? false);
      setAnalytics(c?.analytics ?? false);
      setCustom(true);
      setShow(true);
    };
    window.addEventListener("cookie-consent-reopen", reopen);
    return () => window.removeEventListener("cookie-consent-reopen", reopen);
  }, []);

  const decide = useCallback(
    (f: boolean, e: boolean, a: boolean) => {
    // דחייה חייבת גם למחוק מה שכבר נשמר, לא רק למנוע טעינה עתידית
    if (!f) purgeNonEssential();
    write({ necessary: true, functional: f, embeds: e, analytics: a, decidedAt: new Date().toISOString() });
    setShow(false);
    setCustom(false);
  }, []);

  if (!show) return null;

  return (
    <div
      className={`cc-root${en ? " cc-ltr" : ""}`}
      dir={en ? "ltr" : "rtl"}
      role="dialog"
      aria-modal="false"
      aria-label={t("הודעה על שימוש בעוגיות", "Cookie notice")}
    >
      <div className="cc-box">
        <h2 className="cc-title">{t("אנחנו משתמשים בעוגיות", "We use cookies")}</h2>

        {!custom ? (
          <p className="cc-text">
            {t(
              "האתר עושה שימוש בעוגיות הכרחיות להפעלתו, ובעוגיות נוספות לשמירת העדפות, להצגת תוכן מוטמע כמו סרטוני וידאו ולמדידת תנועה באתר. אין באתר עוגיות פרסום או ריטרגטינג.",
              "This site uses cookies that are necessary for it to work, plus optional ones that remember your preferences, allow embedded content such as videos, and measure site traffic. There are no advertising or retargeting cookies on this site.",
            )}
          </p>
        ) : (
          <div className="cc-cats">
            <div className="cc-cat">
              <div className="cc-cat-head">
                <b>{t("עוגיות הכרחיות", "Necessary cookies")}</b>
                <span className="cc-always">{t("תמיד פעילות", "Always on")}</span>
              </div>
              <p>
                {t(
                  "נדרשות לתפעול השוטף של האתר ולאבטחתו. בלעדיהן האתר לא יפעל כראוי.",
                  "Required for the site to run and stay secure. Without them the site will not work properly.",
                )}
              </p>
            </div>

            <div className="cc-cat">
              <div className="cc-cat-head">
                <b>{t("העדפות ותפקוד", "Preferences")}</b>
                <label className={`cc-switch${functional ? " on" : ""}`}>
                  <input
                    type="checkbox"
                    checked={functional}
                    onChange={(e) => setFunctional(e.target.checked)}
                    aria-label={t("הפעלת עוגיות העדפות", "Enable preference cookies")}
                  />
                  <span />
                  <em>{functional ? t("פעיל", "On") : t("כבוי", "Off")}</em>
                </label>
              </div>
              <p>
                {t(
                  "שמירה מקומית של הגדרות שבחרתם, למשל הגדרות סרגל הנגישות. המידע נשמר בדפדפן שלכם בלבד, וכיבוי האפשרות מוחק אותו מיד.",
                  "Stores the settings you choose, such as your accessibility toolbar preferences. Kept in your browser only, and switching this off deletes it immediately.",
                )}
              </p>
            </div>

            <div className="cc-cat">
              <div className="cc-cat-head">
                <b>{t("מדידה וסטטיסטיקה", "Analytics")}</b>
                <label className={`cc-switch${analytics ? " on" : ""}`}>
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    aria-label={t("הפעלת עוגיות מדידה", "Enable analytics cookies")}
                  />
                  <span />
                  <em>{analytics ? t("פעיל", "On") : t("כבוי", "Off")}</em>
                </label>
              </div>
              <p>
                {t(
                  "Google Analytics, לספירת מבקרים והבנת אילו עמודים מעניינים. אם לא תאשרו, הסקריפט לא נטען כלל ולא מועבר מידע לגוגל.",
                  "Google Analytics, to count visitors and understand which pages are of interest. If you decline, the script is not loaded at all and no data is sent to Google.",
                )}
              </p>
            </div>

            <div className="cc-cat">
              <div className="cc-cat-head">
                <b>{t("תוכן מוטמע מצד שלישי", "Embedded third-party content")}</b>
                <label className={`cc-switch${embeds ? " on" : ""}`}>
                  <input
                    type="checkbox"
                    checked={embeds}
                    onChange={(e) => setEmbeds(e.target.checked)}
                    aria-label={t("הפעלת תוכן מוטמע", "Enable embedded content")}
                  />
                  <span />
                  <em>{embeds ? t("פעיל", "On") : t("כבוי", "Off")}</em>
                </label>
              </div>
              <p>
                {t(
                  "סרטוני YouTube המוטמעים באתר. אם לא תאשרו, הסרטונים לא ייטענו כלל ולא יועבר מידע ל-YouTube.",
                  "YouTube videos embedded in the site. If you decline, the videos are not loaded at all and no data is sent to YouTube.",
                )}
              </p>
            </div>
          </div>
        )}

        <div className="cc-btns">
          <button type="button" className="cc-btn cc-accept" onClick={() => decide(true, true, true)}>
            {t("אישור הכל", "Accept all")}
          </button>
          <button type="button" className="cc-btn cc-reject" onClick={() => decide(false, false, false)}>
            {t("דחיית הכל", "Reject all")}
          </button>
          {!custom ? (
            <button type="button" className="cc-btn cc-custom" onClick={() => setCustom(true)}>
              {t("התאמה אישית", "Customise")}
            </button>
          ) : (
            <button type="button" className="cc-btn cc-custom" onClick={() => decide(functional, embeds, analytics)}>
              {t("שמירת הבחירה", "Save my choice")}
            </button>
          )}
        </div>

        <a href={en ? "/en/privacy" : "/privacy"} className="cc-link">
          {t("למדיניות הפרטיות המלאה", "Read the full privacy policy")}
        </a>
      </div>
    </div>
  );
}

/** כפתור/קישור לפתיחה מחדש של הבחירה - לשימוש בפוטר ובמדיניות הפרטיות */
export function CookieSettingsLink({ en = false, className }: { en?: boolean; className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event("cookie-consent-reopen"))}
    >
      {en ? "Cookie settings" : "הגדרות עוגיות"}
    </button>
  );
}
