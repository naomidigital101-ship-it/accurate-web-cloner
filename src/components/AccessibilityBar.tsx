import { useCallback, useEffect, useRef, useState } from "react";

/**
 * סרגל נגישות צף, זמין מכל עמוד באתר.
 * כל ההעדפות נשמרות ב-localStorage ומוחלות מחדש בכל טעינה.
 */

type Prefs = {
  textScale: number;      // 1 = 100%
  pageZoom: number;       // 1 = 100%
  lineHeight: number;     // 0 = ללא שינוי
  letterSpacing: number;  // px, 0 = ללא שינוי
  contrast: "" | "dark" | "light" | "invert" | "gray";
  readableFont: boolean;
  links: boolean;
  headings: boolean;
  bigCursor: boolean;
  guide: boolean;
  mask: boolean;
  stopAnim: boolean;
  focus: boolean;
  align: "" | "start" | "center";
};

const DEFAULTS: Prefs = {
  textScale: 1,
  pageZoom: 1,
  lineHeight: 0,
  letterSpacing: 0,
  contrast: "",
  readableFont: false,
  links: false,
  headings: false,
  bigCursor: false,
  guide: false,
  mask: false,
  stopAnim: false,
  focus: false,
  align: "",
};

const KEY = "a11y-prefs-v1";
const TEXT_SEL =
  "p,li,a,span,h1,h2,h3,h4,h5,h6,button,label,input,select,textarea,td,th,figcaption,dt,dd,blockquote,small,strong,b,em";

function load(): Prefs {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

/** מכפיל את גודל הגופן של אלמנטי טקסט, תוך שמירת הערך המקורי כדי שאפשר יהיה לאפס */
function applyTextScale(scale: number) {
  const nodes = document.querySelectorAll<HTMLElement>(TEXT_SEL);
  nodes.forEach((el) => {
    if (el.closest(".a11y-root")) return;
    let base = el.dataset.a11yFs;
    if (base === undefined) {
      base = String(parseFloat(getComputedStyle(el).fontSize) || 0);
      el.dataset.a11yFs = base;
    }
    const n = parseFloat(base);
    if (!n) return;
    if (scale === 1) el.style.fontSize = "";
    else el.style.fontSize = `${(n * scale).toFixed(2)}px`;
  });
}

function Btn({
  on,
  onClick,
  children,
}: {
  on?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button type="button" className={`a11y-opt${on ? " on" : ""}`} onClick={onClick} aria-pressed={!!on}>
      {children}
    </button>
  );
}

export function AccessibilityBar({ en = false }: { en?: boolean } = {}) {
  const [open, setOpen] = useState(false);
  const [p, setP] = useState<Prefs>(DEFAULTS);
  const [ready, setReady] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const t = (he: string, eng: string) => (en ? eng : he);

  useEffect(() => {
    setP(load());
    setReady(true);
  }, []);

  // החלת ההעדפות על המסמך
  useEffect(() => {
    if (!ready) return;
    const r = document.documentElement;
    r.classList.toggle("a11y-hc-dark", p.contrast === "dark");
    r.classList.toggle("a11y-hc-light", p.contrast === "light");
    r.classList.toggle("a11y-invert", p.contrast === "invert");
    r.classList.toggle("a11y-gray", p.contrast === "gray");
    r.classList.toggle("a11y-readable", p.readableFont);
    r.classList.toggle("a11y-links", p.links);
    r.classList.toggle("a11y-headings", p.headings);
    r.classList.toggle("a11y-cursor", p.bigCursor);
    r.classList.toggle("a11y-stopanim", p.stopAnim);
    r.classList.toggle("a11y-focus", p.focus);
    r.classList.toggle("a11y-line", p.lineHeight > 0);
    r.classList.toggle("a11y-letter", p.letterSpacing > 0);
    r.classList.toggle("a11y-align-start", p.align === "start");
    r.classList.toggle("a11y-align-center", p.align === "center");
    r.style.setProperty("--a11y-line", String(p.lineHeight || 1.5));
    r.style.setProperty("--a11y-letter", `${p.letterSpacing}px`);
    document.body.style.zoom = p.pageZoom === 1 ? "" : String(p.pageZoom);
    applyTextScale(p.textScale);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(p));
    } catch {
      /* מצב פרטי - ההעדפות פשוט לא יישמרו */
    }
  }, [p, ready]);

  // מדריך קריאה ומסכת קריאה
  useEffect(() => {
    if (!ready || (!p.guide && !p.mask)) return;
    const guide = document.createElement("div");
    guide.className = "a11y-guide";
    const mask1 = document.createElement("div");
    mask1.className = "a11y-mask";
    const mask2 = document.createElement("div");
    mask2.className = "a11y-mask";
    if (p.guide) document.body.appendChild(guide);
    if (p.mask) {
      document.body.appendChild(mask1);
      document.body.appendChild(mask2);
    }
    const move = (e: MouseEvent) => {
      if (p.guide) guide.style.top = `${e.clientY}px`;
      if (p.mask) {
        mask1.style.cssText += `;top:0;height:${Math.max(0, e.clientY - 60)}px;`;
        mask2.style.cssText += `;top:${e.clientY + 60}px;bottom:0;height:auto;`;
      }
    };
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      [guide, mask1, mask2].forEach((n) => n.remove());
    };
  }, [p.guide, p.mask, ready]);

  // Escape לסגירה + מלכודת פוקוס בתוך הפאנל
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const f = panelRef.current.querySelectorAll<HTMLElement>("button,a[href],input");
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("button")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const set = useCallback(<K extends keyof Prefs>(k: K, v: Prefs[K]) => setP((s) => ({ ...s, [k]: v })), []);
  const toggle = useCallback((k: keyof Prefs) => setP((s) => ({ ...s, [k]: !s[k] })), []);
  /** שינוי יחסי של ערך מספרי. חייב updater פונקציונלי - אחרת לחיצות רצופות נדרסות. */
  const bump = useCallback(
    (k: "textScale" | "pageZoom", delta: number) =>
      setP((s) => ({ ...s, [k]: +Math.min(2, Math.max(0.8, s[k] + delta)).toFixed(2) })),
    [],
  );

  const reset = useCallback(() => {
    document.querySelectorAll<HTMLElement>(TEXT_SEL).forEach((el) => {
      el.style.fontSize = "";
      delete el.dataset.a11yFs;
    });
    document.body.style.zoom = "";
    setP(DEFAULTS);
  }, []);

  const active = ready && JSON.stringify(p) !== JSON.stringify(DEFAULTS);

  return (
    <div className={`a11y-root${en ? " a11y-ltr" : ""}`} dir={en ? "ltr" : "rtl"}>
      <button
        ref={btnRef}
        type="button"
        className={`a11y-fab${active ? " a11y-fab-active" : ""}`}
        aria-label={t("פתיחת סרגל נגישות", "Open accessibility toolbar")}
        aria-expanded={open}
        aria-controls="a11y-panel"
        onClick={() => setOpen((o) => !o)}
      >
        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
          <path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm9 5.5c0 .6-.4 1-1 1l-5 .6v4.2l1.9 6.5c.2.6-.2 1.2-.8 1.4-.6.2-1.2-.2-1.4-.8L12 14.9l-1.7 5.5c-.2.6-.8 1-1.4.8-.6-.2-1-.8-.8-1.4L10 13.3V9.1L5 8.5a1 1 0 0 1 .2-2l5.4.6h2.8l5.4-.6c.6-.1 1.1.3 1.2.9v.1z" />
        </svg>
      </button>

      {open && (
        <div
          ref={panelRef}
          id="a11y-panel"
          className="a11y-panel"
          role="dialog"
          aria-modal="false"
          aria-label={t("סרגל נגישות", "Accessibility toolbar")}
        >
          <div className="a11y-head">
            <h2>{t("נגישות", "Accessibility")}</h2>
            <button type="button" className="a11y-close" onClick={() => setOpen(false)} aria-label={t("סגירה", "Close")}>
              ×
            </button>
          </div>

          <div className="a11y-body">
            <h3>{t("טקסט", "Text")}</h3>
            <div className="a11y-stepper">
              <span>{t("גודל טקסט", "Text size")}</span>
              <div>
                <button type="button" onClick={() => bump("textScale", -0.1)} aria-label={t("הקטנת טקסט", "Decrease text size")}>−</button>
                <b>{Math.round(p.textScale * 100)}%</b>
                <button type="button" onClick={() => bump("textScale", 0.1)} aria-label={t("הגדלת טקסט", "Increase text size")}>+</button>
              </div>
            </div>
            <div className="a11y-stepper">
              <span>{t("זום עמוד", "Page zoom")}</span>
              <div>
                <button type="button" onClick={() => bump("pageZoom", -0.1)} aria-label={t("הקטנת זום", "Zoom out")}>−</button>
                <b>{Math.round(p.pageZoom * 100)}%</b>
                <button type="button" onClick={() => bump("pageZoom", 0.1)} aria-label={t("הגדלת זום", "Zoom in")}>+</button>
              </div>
            </div>
            <div className="a11y-grid">
              <Btn on={p.lineHeight > 0} onClick={() => set("lineHeight", p.lineHeight ? 0 : 2)}>{t("ריווח שורות", "Line spacing")}</Btn>
              <Btn on={p.letterSpacing > 0} onClick={() => set("letterSpacing", p.letterSpacing ? 0 : 2)}>{t("ריווח אותיות", "Letter spacing")}</Btn>
              <Btn on={p.readableFont} onClick={() => toggle("readableFont")}>{t("גופן קריא", "Readable font")}</Btn>
              <Btn on={p.align === "start"} onClick={() => set("align", p.align === "start" ? "" : "start")}>{t("יישור לצד", "Align to side")}</Btn>
              <Btn on={p.align === "center"} onClick={() => set("align", p.align === "center" ? "" : "center")}>{t("יישור למרכז", "Align center")}</Btn>
            </div>

            <h3>{t("צבעים", "Colours")}</h3>
            <div className="a11y-grid">
              <Btn on={p.contrast === "dark"} onClick={() => set("contrast", p.contrast === "dark" ? "" : "dark")}>{t("ניגודיות כהה", "Dark contrast")}</Btn>
              <Btn on={p.contrast === "light"} onClick={() => set("contrast", p.contrast === "light" ? "" : "light")}>{t("ניגודיות בהירה", "Light contrast")}</Btn>
              <Btn on={p.contrast === "invert"} onClick={() => set("contrast", p.contrast === "invert" ? "" : "invert")}>{t("היפוך צבעים", "Invert colours")}</Btn>
              <Btn on={p.contrast === "gray"} onClick={() => set("contrast", p.contrast === "gray" ? "" : "gray")}>{t("גווני אפור", "Greyscale")}</Btn>
            </div>

            <h3>{t("ניווט וקריאה", "Navigation & reading")}</h3>
            <div className="a11y-grid">
              <Btn on={p.links} onClick={() => toggle("links")}>{t("הדגשת קישורים", "Highlight links")}</Btn>
              <Btn on={p.headings} onClick={() => toggle("headings")}>{t("הדגשת כותרות", "Highlight headings")}</Btn>
              <Btn on={p.focus} onClick={() => toggle("focus")}>{t("הדגשת פוקוס", "Emphasise focus")}</Btn>
              <Btn on={p.bigCursor} onClick={() => toggle("bigCursor")}>{t("סמן גדול", "Large cursor")}</Btn>
              <Btn on={p.guide} onClick={() => toggle("guide")}>{t("מדריך קריאה", "Reading guide")}</Btn>
              <Btn on={p.mask} onClick={() => toggle("mask")}>{t("מסכת קריאה", "Reading mask")}</Btn>
              <Btn on={p.stopAnim} onClick={() => toggle("stopAnim")}>{t("עצירת אנימציות", "Stop animations")}</Btn>
            </div>

            <div className="a11y-foot">
              <button type="button" className="a11y-reset" onClick={reset}>
                {t("איפוס כל ההגדרות", "Reset all settings")}
              </button>
              <a href={en ? "/en/accessibility" : "/accessibility"} className="a11y-statement">
                {t("להצהרת הנגישות המלאה", "Full accessibility statement")}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
