import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/branding")({
  head: () => ({
    meta: [
      { title: "מיתוג | קשר של תפילין" },
      { name: "description", content: "מדריך מיתוג מדויק שחולץ ישירות מ-Elementor Kit של האתר המקורי." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BrandingPage,
});

/* ====== Elementor Kit (elementor-kit-7) — Source of Truth ====== */
const KIT = {
  primary: "#F9B233",           // --e-global-color-primary (כתום)
  secondary: "#2D2E83",         // --e-global-color-secondary (נייבי)
  text: "#060633",              // --e-global-color-text (נייבי עמוק)
  accent: "#67FFD1",            // --e-global-color-accent (מנטה)
  linkSky: "#009FE3",           // --e-global-color-7e4c9b0
  white: "#FFFFFF",             // --e-global-color-f8e3ee1
  // נוספים שחולצו מסקציות בפועל:
  mintLight: "#BDFFEB",
  cardSkyAlpha: "#009FE3AD",    // קלף טופס שקוף
  cardSkyMid: "#009FE38C",
  pageBgSoft: "#C3E7F6",
  badgeOrangeEnd: "#E65A38",
} as const;

const TYPO = {
  primary:   { family: "Maadim OS", weight: 900, size: "6vw / 60px mobile", lh: "0.9em" },
  secondary: { family: "Maadim OS", weight: "bold", size: "4vw / 40px mobile", lh: "1em" },
  text:      { family: "Maadim OS", weight: 400, size: "18px", lh: "1.4em" },
  accent:    { family: "Maadim OS", weight: "bold", size: "18px", lh: "1.4em" },
};

const RADII = [10, 12, 17, 20, 50, 100, 200, 600, 1000];

const SHADOWS = [
  { name: "Card / רך", css: "0px 3px 9px 0px rgba(0,0,0,0.1)" },
  { name: "Button / בינוני", css: "0px 5px 15px 0px rgba(0,0,0,0.2)" },
  { name: "Section / חזק", css: "0px 10px 30px 0px rgba(0,0,0,0.2)" },
  { name: "Hero card", css: "0px 20px 40px 0px rgba(0,0,0,0.2)" },
  { name: "Form card (שקוף)", css: "0px 25px 50px 0px rgba(0,0,0,0.2)" },
  { name: "Mint glow רך", css: "0px 0px 40px 0px #67FFD1" },
  { name: "Mint glow חזק", css: "0px 10px 30px 0px rgba(103,255,209,0.82)" },
  { name: "Mint glow ענק", css: "0px 20px 50px 0px rgba(103,255,209,0.53)" },
];

const GRADIENTS = [
  { name: "Hero overlay (multiply)", css: "radial-gradient(at top left, #67FFD1 0%, #009FE3 100%)", note: "סקשן הירו — overlay על הוידאו, blend mode: multiply" },
  { name: "Badge מספרי", css: "linear-gradient(135deg, #F9B233 0%, #E65A38 100%)", note: "באדג' פיל לסטטיסטיקה (1,300 זוגות)" },
  { name: "Overlay כהה לתמונה", css: "linear-gradient(180deg, #060633B5 0%, #06063300 100%)", note: "כיסוי כותרת על תמונת רקע" },
  { name: "Page transition", css: "radial-gradient(at center center, #FFFFFF 50%, #C3E7F6 100%)", note: "מעבר בין עמודים" },
  { name: "Section נייבי", css: "linear-gradient(180deg, #009FE300 0%, #2D2E83 100%)", note: "מעבר משמיים לנייבי" },
];

function Swatch({ name, hex, label, note }: { name: string; hex: string; label?: string; note?: string }) {
  const txt = ["#FFFFFF", "#FFFFFF00"].includes(hex) ? "#2D2E83" : "#FFFFFF";
  return (
    <div className="rounded-xl overflow-hidden border border-border shadow-sm">
      <div className="h-24 flex flex-col justify-end p-3" style={{ background: hex, color: txt }}>
        <span className="font-black">{name}</span>
        {label && <span className="text-xs opacity-90">{label}</span>}
      </div>
      <div className="p-3 bg-white text-sm flex justify-between items-center">
        <span className="text-muted-foreground text-xs">{note}</span>
        <code className="font-mono text-xs">{hex}</code>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid md:grid-cols-[240px_1fr] gap-4 items-start py-5 border-b border-border last:border-0">
      <div className="text-sm font-bold text-[#2D2E83]">{label}</div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="block bg-slate-50 border border-border rounded-md p-3 text-xs font-mono text-slate-800 whitespace-pre-wrap" dir="ltr">
      {children}
    </code>
  );
}

function HoverDemo({
  label, normal, hover,
}: { label: string; normal: React.CSSProperties; hover: React.CSSProperties }) {
  const [h, setH] = useState(false);
  return (
    <button
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ transition: "all 0.3s ease", fontFamily: '"Maadim OS", Maadim, sans-serif', cursor: "pointer", ...(h ? { ...normal, ...hover } : normal) }}
    >
      {label}
    </button>
  );
}

function BrandingPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-[#F7FAFC] py-12 px-4" style={{ fontFamily: '"Maadim OS", Maadim, sans-serif' }}>
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="text-5xl font-black text-[#2D2E83]">מדריך מיתוג — מקור: Elementor Kit</h1>
          <p className="mt-3 text-lg text-slate-600">
            כל הערכים בעמוד זה חולצו ישירות מ-<code dir="ltr">elementor-kit-7</code> ומסקציית עמוד הבית (<code dir="ltr">post-10.css</code>) של האתר המקורי.
          </p>
        </header>

        {/* Global Colors */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-border">
          <h2 className="text-3xl font-black text-[#2D2E83] mb-2">צבעים גלובליים (Elementor Globals)</h2>
          <p className="text-sm text-slate-500 mb-6">השמות הפנימיים מ-Elementor.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Swatch name="Primary" hex={KIT.primary} label="--e-global-color-primary" note="כתום — אייקונים, באדג'ים" />
            <Swatch name="Secondary" hex={KIT.secondary} label="--e-global-color-secondary" note="נייבי — כותרות / טקסט" />
            <Swatch name="Text" hex={KIT.text} label="--e-global-color-text" note="נייבי עמוק — טקסט גוף" />
            <Swatch name="Accent" hex={KIT.accent} label="--e-global-color-accent" note="מנטה — CTA ראשי" />
            <Swatch name="Link Sky" hex={KIT.linkSky} label="--e-global-color-7e4c9b0" note="כחול קישור / כותרות גדולות" />
            <Swatch name="White" hex={KIT.white} label="--e-global-color-f8e3ee1" note="רקע / טקסט על כהה" />
          </div>

          <h3 className="text-xl font-black text-[#2D2E83] mt-8 mb-4">צבעי סקשנים נוספים</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Swatch name="Mint Light" hex={KIT.mintLight} note="hover למנטה" />
            <Swatch name="Sky Alpha" hex={KIT.cardSkyAlpha} note="כרטיס טופס שקוף (#009FE3AD)" />
            <Swatch name="Page Bg Soft" hex={KIT.pageBgSoft} note="page transition" />
            <Swatch name="Badge Orange End" hex={KIT.badgeOrangeEnd} note="סוף גרדיאנט הבאדג'" />
          </div>
        </section>

        {/* Typography */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-border">
          <h2 className="text-3xl font-black text-[#2D2E83] mb-6">טיפוגרפיה (Elementor Globals)</h2>
          <Row label="Primary — כותרות ענק (H1/Hero)">
            <div className="text-[60px] leading-[0.9] font-black text-[#F9B233]">קשר של תפילין</div>
            <Code>{`font-family: "Maadim OS", Sans-serif;
font-size: 6vw (desktop) / 60px (≤767px);
font-weight: 900;
line-height: 0.9em;
color: #F9B233; /* primary */`}</Code>
          </Row>

          <Row label="Secondary — כותרות סקשנים (H2)">
            <div className="text-[40px] leading-[1em] font-bold text-[#2D2E83]">הסיפורים שלנו</div>
            <Code>{`font-family: "Maadim OS", Sans-serif;
font-size: 4vw (desktop) / 40px (≤767px);
font-weight: bold (700);
line-height: 1em;
color: #2D2E83; /* secondary */`}</Code>
          </Row>

          <Row label="Text — טקסט גוף">
            <p className="text-[18px] leading-[1.4em] font-normal text-[#060633] max-w-prose">
              מיזם של ערבות הדדית וזיכוי הרבים. עד היום חילקנו מעל 1,300 זוגות תפילין ליהודים בכל הארץ.
            </p>
            <Code>{`font-family: "Maadim OS", Sans-serif;
font-size: 18px;
font-weight: 400;
line-height: 1.4em;
color: #060633; /* text */`}</Code>
          </Row>

          <Row label="Accent — קישורים / תוכן בולט">
            <a href="#" className="text-[18px] font-bold leading-[1.4em] text-[#009FE3]">למידע נוסף ←</a>
            <Code>{`font-family: "Maadim OS", Sans-serif;
font-size: 18px;
font-weight: bold;
line-height: 1.4em;`}</Code>
          </Row>

          <Row label="טבלת סיכום">
            <div className="overflow-auto">
              <table className="w-full text-sm border-collapse" dir="ltr">
                <thead className="bg-slate-50">
                  <tr><th className="p-2 text-left border">Token</th><th className="p-2 text-left border">Family</th><th className="p-2 text-left border">Size</th><th className="p-2 text-left border">Weight</th><th className="p-2 text-left border">LH</th></tr>
                </thead>
                <tbody>
                  {Object.entries(TYPO).map(([k, v]) => (
                    <tr key={k}><td className="p-2 border">{k}</td><td className="p-2 border">{v.family}</td><td className="p-2 border">{v.size}</td><td className="p-2 border">{String(v.weight)}</td><td className="p-2 border">{v.lh}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Row>
        </section>

        {/* Gradients */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-border">
          <h2 className="text-3xl font-black text-[#2D2E83] mb-6">גרדיאנטים מדויקים</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {GRADIENTS.map((g) => (
              <div key={g.name} className="rounded-xl overflow-hidden border border-border">
                <div className="h-32" style={{ background: g.css }} />
                <div className="p-4 bg-white">
                  <div className="font-bold text-[#2D2E83]">{g.name}</div>
                  <div className="text-xs text-slate-500 mt-1">{g.note}</div>
                  <code className="block text-xs mt-2 bg-slate-50 p-2 rounded" dir="ltr">{g.css}</code>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Border Radius */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-border">
          <h2 className="text-3xl font-black text-[#2D2E83] mb-2">Border Radius בשימוש בפועל</h2>
          <p className="text-sm text-slate-500 mb-6">כל ערכי הפינות שמופיעים ב-CSS של עמוד הבית.</p>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {RADII.map((r) => (
              <div key={r} className="aspect-square bg-[#67FFD1]/60 border border-[#2D2E83]/20 grid place-items-center text-[#2D2E83] font-black text-sm text-center p-2" style={{ borderRadius: r > 100 ? 9999 : r }}>
                {r >= 1000 ? "Pill" : `${r}px`}
                <span className="text-xs font-normal mt-1 opacity-70">{r === 10 && "טפסים"}{r === 12 && "כפתורי Hero"}{r === 20 && "כרטיסים"}{r === 1000 && "באדג'"}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Shadows */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-border">
          <h2 className="text-3xl font-black text-[#2D2E83] mb-6">הצללות מ-Elementor</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {SHADOWS.map((s) => (
              <div key={s.name} className="p-6 rounded-2xl bg-white" style={{ boxShadow: s.css }}>
                <div className="font-bold text-[#2D2E83]">{s.name}</div>
                <code className="block text-[10px] mt-2 text-slate-500" dir="ltr">{s.css}</code>
              </div>
            ))}
          </div>
        </section>

        {/* Buttons - Real Elementor */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-border">
          <h2 className="text-3xl font-black text-[#2D2E83] mb-6">כפתורים (מצבי normal + hover)</h2>

          <Row label="Primary CTA — Hero (מנטה)">
            <div className="flex flex-wrap items-center gap-6">
              <HoverDemo
                label="מתעניין בתפילין"
                normal={{ background: KIT.accent, color: KIT.secondary, borderRadius: 12, padding: "10px 20px", fontWeight: 700, fontSize: 16, border: "none", boxShadow: SHADOWS[6].css }}
                hover={{ background: KIT.mintLight, color: KIT.text, boxShadow: SHADOWS[7].css }}
              />
              <span className="text-xs text-slate-500">העבירי עכבר ↑</span>
            </div>
            <Code>{`/* normal */
background: #67FFD1; color: #2D2E83;
border-radius: 12px;
padding: 10px 20px;
font: 700 16px "Maadim OS";
box-shadow: 0 10px 30px rgba(103,255,209,0.82);
transition: 0.3s;

/* hover */
background: #BDFFEB; color: #060633;
box-shadow: 0 20px 50px rgba(103,255,209,0.53);`}</Code>
          </Row>

          <Row label="Form CTA (הבא / שליחה)">
            <HoverDemo
              label="המשך לשלב הבא"
              normal={{ background: KIT.accent, color: KIT.secondary, borderRadius: 10, padding: "0 24px", height: 48, fontWeight: 600, fontSize: 20, border: "none" }}
              hover={{ background: KIT.mintLight }}
            />
            <Code>{`background: #67FFD1; color: #2D2E83;
border-radius: 10px;
height: 48px; padding: 0 24px;
font: 600 20px "Maadim OS";`}</Code>
          </Row>

          <Row label="Outline על רקע כהה (Hero)">
            <div className="p-6 rounded-xl flex items-center gap-4" style={{ background: KIT.secondary }}>
              <HoverDemo
                label="לתרומת תפילין"
                normal={{ background: "transparent", color: KIT.white, border: `2px solid ${KIT.white}`, borderRadius: 12, padding: "8px 20px", fontWeight: 700, fontSize: 16 }}
                hover={{ background: KIT.white, color: KIT.secondary }}
              />
            </div>
            <Code>{`background: transparent; color: #FFFFFF;
border: 2px solid #FFFFFF;
border-radius: 12px;
padding: 8px 20px;
font: 700 16px "Maadim OS";

/* hover */ background: #FFFFFF; color: #2D2E83;`}</Code>
          </Row>

          <Row label='באדג&apos; סטטיסטיקה (פיל מגרדיאנט)'>
            <div className="inline-block px-6 py-2.5 text-white font-normal text-base" style={{ background: `linear-gradient(135deg, ${KIT.primary} 0%, ${KIT.badgeOrangeEnd} 100%)`, borderRadius: 1000 }}>
              1,300 זוגות תפילין חולקו
            </div>
            <Code>{`background: linear-gradient(135deg, #F9B233 0%, #E65A38 100%);
border-radius: 1000px;
padding: 10px;
color: #FFFFFF;
font: 400 16px/1em "Maadim OS";`}</Code>
          </Row>
        </section>

        {/* Forms */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-border">
          <h2 className="text-3xl font-black text-[#2D2E83] mb-6">טפסים</h2>

          <Row label="כרטיס טופס (Hero — שקוף על וידאו)">
            <div className="p-5 max-w-md text-white" style={{ background: KIT.cardSkyAlpha, borderRadius: 20, boxShadow: SHADOWS[4].css }}>
              <h3 className="text-[32px] font-bold leading-[1em] text-center mb-4" style={{ fontFamily: '"Maadim OS"' }}>רוצה להניח תפילין?</h3>
              <div className="space-y-3">
                <input placeholder="שם מלא" className="w-full h-11 rounded-[10px] px-4 text-[#2D2E83] text-[18px]" style={{ background: "#FFFFFF" }} />
                <input placeholder="טלפון" className="w-full h-11 rounded-[10px] px-4 text-[#2D2E83] text-[18px]" style={{ background: "#FFFFFF" }} />
                <button className="w-full" style={{ background: KIT.accent, color: KIT.secondary, borderRadius: 10, height: 48, fontWeight: 600, fontSize: 20 }}>
                  לשליחה
                </button>
              </div>
            </div>
            <Code>{`/* card */
background: #009FE3AD; /* sky 68% */
border-radius: 20px;
padding: 20px;
box-shadow: 0 25px 50px rgba(0,0,0,0.2);

/* title */
font: 700 32px/1em "Maadim OS"; color: #FFFFFF; text-align: center;

/* input */
background: #FFFFFF; color: #2D2E83;
border-radius: 10px; height: 44px; padding: 0 16px;
font: 400 18px "Maadim OS";`}</Code>
          </Row>
        </section>

        {/* Spacing */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-border">
          <h2 className="text-3xl font-black text-[#2D2E83] mb-6">ריווח ומיכלים</h2>
          <Row label="Container max-width">
            <Code>{`Desktop: 1140px
Tablet (≤1024): 1024px
Mobile (≤767): 767px`}</Code>
          </Row>
          <Row label="ריווח בין widgets">
            <Code>{`margin-block-end: 20px;
--widgets-spacing: 20px 20px;`}</Code>
          </Row>
          <Row label="Section padding (Hero)">
            <Code>{`padding-top: 80px;
padding-bottom: 140px;
min-height: 75vh;`}</Code>
          </Row>
          <Row label="מעברים (Transitions)">
            <Code>{`/* Elementor default */
transition: background 0.3s, color 0.3s, border 0.3s,
            box-shadow 0.3s, transform 0.3s;`}</Code>
          </Row>
        </section>
      </div>
    </div>
  );
}
