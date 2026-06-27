import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/branding")({
  head: () => ({
    meta: [
      { title: "מיתוג | קשר של תפילין" },
      { name: "description", content: "מדריך מיתוג מלא: צבעים, פונטים, כפתורים, מצבי hover, טפסים והצללות לפי האתר המקורי." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BrandingPage,
});

const palette = [
  { name: "Primary / שמיים", hex: "#73CAF0", text: "#2D2E83", note: "Header / accent" },
  { name: "Link sky", hex: "#009FE3", text: "#FFFFFF", note: "קישורים בולטים" },
  { name: "Mint CTA", hex: "#67FFD1", text: "#2D2E83", note: "כפתור ראשי" },
  { name: "Mint hover", hex: "#BDFFEB", text: "#060633", note: "מצב hover לכפתור" },
  { name: "Navy text", hex: "#2D2E83", text: "#FFFFFF", note: "טקסט / כפתור משני" },
  { name: "Deep navy", hex: "#060633", text: "#FFFFFF", note: "Hover text / כותרות כהות" },
  { name: "רקע", hex: "#FFFFFF", text: "#2D2E83", note: "רקע כללי" },
];

function Swatch({ name, hex, text, note }: { name: string; hex: string; text: string; note?: string }) {
  return (
    <div className="rounded-xl overflow-hidden border border-border shadow-sm">
      <div className="h-24 flex items-end p-3" style={{ background: hex, color: text }}>
        <span className="font-bold">{name}</span>
      </div>
      <div className="p-3 bg-white text-sm flex justify-between items-center">
        <span className="text-muted-foreground text-xs">{note}</span>
        <code className="font-mono">{hex}</code>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid md:grid-cols-[220px_1fr] gap-4 items-start py-5 border-b border-border last:border-0">
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
      style={{ transition: "0.3s", fontFamily: "Maadim, sans-serif", ...(h ? { ...normal, ...hover } : normal) }}
    >
      {label}
    </button>
  );
}

function BrandingPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-[#F7FAFC] py-12 px-4" style={{ fontFamily: "Maadim, sans-serif" }}>
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="text-5xl font-black text-[#2D2E83]">מדריך מיתוג</h1>
          <p className="mt-3 text-lg text-slate-600">
            תועד 1:1 מהאתר המקורי <span dir="ltr">tefilin.or-hadash.org.il</span> כולל מצבי hover, מעברים, צללים וצבעי קישורים.
          </p>
        </header>

        {/* Colors */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-border">
          <h2 className="text-3xl font-black text-[#2D2E83] mb-6">פלטת צבעים</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {palette.map((c) => <Swatch key={c.hex} {...c} />)}
          </div>
        </section>

        {/* Typography */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-border">
          <h2 className="text-3xl font-black text-[#2D2E83] mb-6">טיפוגרפיה</h2>
          <Row label="פונט ראשי">
            <div className="text-4xl font-black text-[#2D2E83]">Maadim OS — מעדים</div>
            <p className="text-sm text-slate-600">כל הכותרות והטקסט. 9 משקלים (Thin → Black). Fallback: sans-serif.</p>
          </Row>
          <Row label="גדלים מהאתר">
            <ul className="space-y-2 text-[#2D2E83]">
              <li className="text-[38.4px] font-black leading-tight">H2 / 38.4px · 900</li>
              <li className="text-[20px] font-semibold leading-7">Button / 20px · 600</li>
              <li className="text-[18px] font-semibold leading-[21.6px]">Body & Input / 18px · 600</li>
              <li className="text-[16px] font-bold leading-6">Small / 16px · 700</li>
            </ul>
          </Row>
        </section>

        {/* Buttons */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-border">
          <h2 className="text-3xl font-black text-[#2D2E83] mb-6">כפתורים & Hover</h2>

          <Row label="Primary CTA (מנטה)">
            <div className="flex flex-wrap items-center gap-6">
              <HoverDemo
                label="שליחת בקשה"
                normal={{
                  background: "#67FFD1", color: "#2D2E83", borderRadius: 10,
                  padding: "0 24px", height: 48, fontWeight: 600, fontSize: 20,
                  border: "2px solid transparent",
                }}
                hover={{ background: "#BDFFEB", color: "#060633" }}
              />
              <span className="text-xs text-slate-500">העבירי עכבר ↑</span>
            </div>
            <Code>{`/* normal */
background: #67FFD1; color: #2D2E83;
border: 2px solid transparent;
border-radius: 10px; height: 48px; padding: 0 24px;
font: 600 20px/28px "Maadim OS";
transition: 0.3s;

/* hover */
background: #BDFFEB; color: #060633;`}</Code>
          </Row>

          <Row label="Secondary Outline (כחול)">
            <div className="flex flex-wrap items-center gap-6">
              <HoverDemo
                label="הקודם"
                normal={{
                  background: "transparent", color: "#2D2E83",
                  border: "2px solid #2D2E83", borderRadius: 10,
                  padding: "0 24px", height: 48, fontWeight: 600, fontSize: 20,
                }}
                hover={{ background: "#2D2E83", color: "#FFFFFF" }}
              />
            </div>
            <Code>{`background: transparent; color: #2D2E83;
border: 2px solid #2D2E83;
border-radius: 10px; height: 48px; padding: 0 24px;

/* hover */ background: #2D2E83; color: #FFFFFF;`}</Code>
          </Row>

          <Row label="Outline על רקע כהה (Hero)">
            <div className="p-6 rounded-xl flex items-center gap-4" style={{ background: "#2D2E83" }}>
              <HoverDemo
                label="לתרומת תפילין"
                normal={{
                  background: "transparent", color: "#FFFFFF",
                  border: "2px solid #FFFFFF", borderRadius: 12,
                  padding: "0 24px", height: 48, fontWeight: 600, fontSize: 20,
                }}
                hover={{ background: "#FFFFFF", color: "#2D2E83" }}
              />
            </div>
            <Code>{`background: transparent; color: #FFFFFF;
border: 2px solid #FFFFFF;
border-radius: 12px;

/* hover */ background: #FFFFFF; color: #2D2E83;`}</Code>
          </Row>

          <Row label="כפתור כרטיס (לבן עם טקסט שמיים)">
            <HoverDemo
              label="לכל הסיפורים"
              normal={{
                background: "#FFFFFF", color: "#009FE3", borderRadius: 12,
                padding: "14px 20px 10px", fontWeight: 700, fontSize: 18,
                border: "none", boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
              }}
              hover={{ background: "#009FE3", color: "#FFFFFF" }}
            />
            <Code>{`background: #FFFFFF; color: #009FE3;
border-radius: 12px;
padding: 14px 20px 10px;
font: 700 18px "Maadim OS";
box-shadow: 0 5px 15px rgba(0,0,0,0.08);`}</Code>
          </Row>

          <Row label="קישור טקסטואלי">
            <a href="#" className="inline-block" style={{ color: "#2D2E83", fontWeight: 600, fontSize: 16, borderBottom: "1px solid #2D2E83", paddingBottom: 3 }}>
              לסיפור המלא ←
            </a>
            <Code>{`color: #2D2E83; font: 600 16px "Maadim OS";
border-bottom: 1px solid #2D2E83;
padding-bottom: 3px;`}</Code>
          </Row>
        </section>

        {/* Forms */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-border">
          <h2 className="text-3xl font-black text-[#2D2E83] mb-6">טפסים</h2>
          <Row label="Input / Textarea">
            <input
              type="text" placeholder="שם מלא"
              style={{
                width: "100%", maxWidth: 360, height: 44,
                borderRadius: 10, padding: "8px 16px",
                background: "#FFFFFF", color: "#2D2E83",
                border: "1px solid #E2E8F0",
                fontFamily: "Maadim, sans-serif", fontWeight: 600, fontSize: 18,
              }}
            />
            <Code>{`background: #FFFFFF; color: #2D2E83;
border-radius: 10px;
padding: 8px 16px;
font: 600 18px/21.6px "Maadim OS";
border: 1px solid #E2E8F0;  /* באתר המקור ללא border נראה */
transition: 0.3s;`}</Code>
          </Row>
          <Row label="כרטיס טופס">
            <div className="rounded-3xl p-8 bg-white shadow-[0_10px_40px_rgba(45,46,131,0.08)] border border-slate-100 max-w-md">
              <h3 className="font-black text-2xl text-[#2D2E83] mb-4">רוצה תפילין?</h3>
              <div className="space-y-3">
                <input placeholder="שם" className="w-full h-11 rounded-[10px] px-4 border border-slate-200 text-[#2D2E83]" />
                <input placeholder="טלפון" className="w-full h-11 rounded-[10px] px-4 border border-slate-200 text-[#2D2E83]" />
                <button style={{ background: "#67FFD1", color: "#2D2E83", borderRadius: 10, height: 48, width: "100%", fontWeight: 600, fontSize: 20 }}>
                  שליחה
                </button>
              </div>
            </div>
            <Code>{`border-radius: 24px;
background: #FFFFFF;
box-shadow: 0 10px 40px rgba(45,46,131,0.08);
padding: 32px;`}</Code>
          </Row>
        </section>

        {/* Shadows */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-border">
          <h2 className="text-3xl font-black text-[#2D2E83] mb-6">הצללות, פינות ומעברים</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Shadow / כפתור עדין", css: "0 5px 15px rgba(0,0,0,0.08)" },
              { name: "Shadow / כפתור חזק", css: "0 5px 15px rgba(0,0,0,0.2)" },
              { name: "Shadow / כרטיס", css: "0 10px 40px rgba(45,46,131,0.08)" },
              { name: "Shadow / סקשן עליון", css: "0 20px 60px rgba(45,46,131,0.12)" },
              { name: "Shadow / Hero טקסט", css: "0 10px 40px rgba(0,0,0,0.35)" },
              { name: "Shadow / Focus ring", css: "0 0 0 3px rgba(115,202,240,0.35)" },
            ].map((s) => (
              <div key={s.name} className="p-6 rounded-xl bg-white" style={{ boxShadow: s.css }}>
                <div className="font-bold text-[#2D2E83]">{s.name}</div>
                <code className="block text-xs mt-2 text-slate-500" dir="ltr">{s.css}</code>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-black text-[#2D2E83] mt-10 mb-4">Border radius</h3>
          <div className="grid grid-cols-5 gap-4">
            {[6, 10, 12, 20, 24].map((r) => (
              <div key={r} className="aspect-square bg-[#67FFD1]/40 border border-[#2D2E83]/20 grid place-items-center text-[#2D2E83] font-bold" style={{ borderRadius: r }}>
                {r}px
              </div>
            ))}
          </div>

          <h3 className="text-xl font-black text-[#2D2E83] mt-10 mb-4">מעברים (Transitions)</h3>
          <Code>{`/* כל הכפתורים והקישורים */
transition: 0.3s ease;

/* כפתור Elementor המלא: */
transition: background 0.3s, color 0.3s, border 0.3s,
            box-shadow 0.3s, transform 0.3s;`}</Code>
        </section>

        {/* Sections */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-border">
          <h2 className="text-3xl font-black text-[#2D2E83] mb-6">סקציות (Sections)</h2>
          <Row label="Hero כהה">
            <div className="rounded-xl p-8 text-white" style={{ background: "linear-gradient(180deg, #2D2E83 0%, #060633 100%)" }}>
              <div className="text-2xl font-black">קשר של תפילין</div>
              <p className="opacity-90 mt-2">רקע גרדיאנט כחול עמוק → נייבי עמוק, overlay על וידאו.</p>
            </div>
            <Code>{`background: linear-gradient(180deg, #2D2E83 0%, #060633 100%);
/* + video overlay: rgba(45,46,131,0.55) */`}</Code>
          </Row>
          <Row label="סקשן בהיר עם הצללה עליונה">
            <div className="rounded-xl p-8 bg-white" style={{ boxShadow: "0 -10px 40px rgba(45,46,131,0.06)" }}>
              <div className="text-[#2D2E83] font-bold">תוכן רגיל על רקע לבן</div>
            </div>
          </Row>
          <Row label="סקשן מנטה">
            <div className="rounded-xl p-8" style={{ background: "#67FFD1", color: "#2D2E83" }}>
              <div className="font-black text-xl">איך זה מתבצע?</div>
            </div>
            <Code>{`background: #67FFD1; color: #2D2E83;`}</Code>
          </Row>
        </section>

        {/* Full screenshot reference */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-border">
          <h2 className="text-3xl font-black text-[#2D2E83] mb-6">צילום מסך של האתר המקורי</h2>
          <p className="text-sm text-slate-600 mb-4">נלקח באמצעות Firecrawl כהפניה ויזואלית.</p>
          <img src="/branding/full.png" alt="צילום מסך של האתר המקורי" className="w-full rounded-xl border border-border" />
        </section>
      </div>
    </div>
  );
}
