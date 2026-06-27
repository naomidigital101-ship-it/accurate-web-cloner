import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/branding")({
  head: () => ({
    meta: [
      { title: "מיתוג | קשר של תפילין" },
      { name: "description", content: "מדריך מיתוג: צבעים, טיפוגרפיה, כפתורים, טפסים והצללות לפי האתר המקורי." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BrandingPage,
});

const palette = [
  { name: "Primary / שמיים", hex: "#73CAF0", text: "#2D2E83" },
  { name: "Secondary / מנטה", hex: "#67FFD1", text: "#2D2E83" },
  { name: "Text / כחול עמוק", hex: "#2D2E83", text: "#FFFFFF" },
  { name: "רקע", hex: "#FFFFFF", text: "#2D2E83" },
];

function Swatch({ name, hex, text }: { name: string; hex: string; text: string }) {
  return (
    <div className="rounded-xl overflow-hidden border border-border shadow-sm">
      <div className="h-24 flex items-end p-3" style={{ background: hex, color: text }}>
        <span className="font-bold">{name}</span>
      </div>
      <div className="p-3 bg-white text-sm flex justify-between">
        <span className="text-muted-foreground">HEX</span>
        <code className="font-mono">{hex}</code>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid md:grid-cols-[220px_1fr] gap-4 items-start py-5 border-b border-border last:border-0">
      <div className="text-sm font-bold text-[#2D2E83]">{label}</div>
      <div>{children}</div>
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

function BrandingPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-[#F7FAFC] py-12 px-4" style={{ fontFamily: "Maadim, sans-serif" }}>
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="text-5xl font-black text-[#2D2E83]">מדריך מיתוג</h1>
          <p className="mt-3 text-lg text-slate-600">
            מתועד מתוך האתר המקורי <span dir="ltr">tefilin.or-hadash.org.il</span> באמצעות Firecrawl + צילומי מסך.
          </p>
        </header>

        {/* Colors */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-border">
          <h2 className="text-3xl font-black text-[#2D2E83] mb-6">פלטת צבעים</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {palette.map((c) => <Swatch key={c.hex} {...c} />)}
          </div>
        </section>

        {/* Typography */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-border">
          <h2 className="text-3xl font-black text-[#2D2E83] mb-6">טיפוגרפיה</h2>
          <Row label="פונט ראשי">
            <div className="space-y-2">
              <div className="text-4xl font-black text-[#2D2E83]">Maadim OS — מעדים</div>
              <p className="text-sm text-slate-600">משמש לכל הכותרות והטקסט. 9 משקלים (Thin → Black).</p>
            </div>
          </Row>
          <Row label="גדלים">
            <ul className="space-y-2 text-[#2D2E83]">
              <li className="text-[38px] font-black leading-tight">H1 / 38px Black</li>
              <li className="text-[28px] font-bold">H2 / 28px Bold</li>
              <li className="text-[20px] font-semibold">Subhead / 20px SemiBold</li>
              <li className="text-[18px]">Body / 18px Regular</li>
            </ul>
          </Row>
        </section>

        {/* Buttons */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-border">
          <h2 className="text-3xl font-black text-[#2D2E83] mb-6">כפתורים</h2>

          <Row label="Primary CTA (מנטה)">
            <div className="flex flex-wrap items-center gap-6">
              <button
                style={{
                  background: "#67FFD1", color: "#2D2E83",
                  borderRadius: "10px", height: "40px", padding: "0 24px",
                  fontWeight: 600, fontSize: "20px", fontFamily: "Maadim, sans-serif",
                  border: "2px solid transparent",
                }}
              >
                מתעניין בתפילין
              </button>
              <img src="/branding/el_2.png" alt="צילום כפתור ראשי" className="h-12 border border-border rounded" />
            </div>
            <Code>{`background: #67FFD1
color: #2D2E83
border-radius: 10px
height: 40px
padding: 0 24px
font: 600 20px "Maadim OS"
border: 2px solid transparent
box-shadow: none`}</Code>
          </Row>

          <Row label="Secondary CTA (כחול עמוק)">
            <div className="flex flex-wrap items-center gap-6">
              <button
                style={{
                  background: "#2D2E83", color: "#FFFFFF",
                  borderRadius: "20px", padding: "10px 24px",
                  fontWeight: 600, fontSize: "18px", fontFamily: "Maadim, sans-serif",
                  boxShadow: "rgba(0, 0, 0, 0.2) 0px 5px 15px 0px",
                }}
              >
                הסכמות רבנים
              </button>
              <img src="/branding/el_3.png" alt="צילום כפתור משני" className="h-16 border border-border rounded" />
            </div>
            <Code>{`background: #2D2E83
color: #FFFFFF
border-radius: 20px
padding: 10px 24px
box-shadow: 0 5px 15px rgba(0,0,0,0.2)`}</Code>
          </Row>

          <Row label="Outline (על רקע כהה)">
            <div className="p-6 rounded-xl" style={{ background: "#2D2E83" }}>
              <button
                style={{
                  background: "transparent", color: "#FFFFFF",
                  borderRadius: "10px", height: "40px", padding: "0 24px",
                  border: "2px solid rgba(255,255,255,0.8)",
                  fontWeight: 600, fontSize: "20px", fontFamily: "Maadim, sans-serif",
                }}
              >
                לתרומת תפילין
              </button>
            </div>
          </Row>
        </section>

        {/* Forms */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-border">
          <h2 className="text-3xl font-black text-[#2D2E83] mb-6">טפסים</h2>
          <Row label="Input">
            <input
              type="text"
              placeholder="שם מלא"
              style={{
                width: "100%", maxWidth: 360, height: 48,
                borderRadius: "10px", padding: "0 16px",
                background: "#FFFFFF", color: "#2D2E83",
                border: "1px solid #E2E8F0", fontFamily: "Maadim, sans-serif", fontSize: 16,
              }}
            />
            <Code>{`background: #FFFFFF
color: #2D2E83
border-radius: 10px
border: 1px solid #E2E8F0
padding: 0 16px
height: 48px`}</Code>
          </Row>
          <Row label="כרטיס טופס">
            <div className="rounded-3xl p-8 bg-white shadow-[0_10px_40px_rgba(45,46,131,0.08)] border border-slate-100 max-w-md">
              <h3 className="font-black text-2xl text-[#2D2E83] mb-4">רוצה תפילין?</h3>
              <div className="space-y-3">
                <input placeholder="שם" className="w-full h-11 rounded-[10px] px-4 border border-slate-200" />
                <input placeholder="טלפון" className="w-full h-11 rounded-[10px] px-4 border border-slate-200" />
                <button style={{ background: "#67FFD1", color: "#2D2E83", borderRadius: 10, height: 44, width: "100%", fontWeight: 700 }}>
                  שליחה
                </button>
              </div>
            </div>
            <Code>{`border-radius: 24px
background: #FFFFFF
box-shadow: 0 10px 40px rgba(45,46,131,0.08)
padding: 32px`}</Code>
          </Row>
        </section>

        {/* Shadows & radii */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-border">
          <h2 className="text-3xl font-black text-[#2D2E83] mb-6">הצללות ופינות</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Shadow / כפתור", css: "0 5px 15px rgba(0,0,0,0.2)" },
              { name: "Shadow / כרטיס", css: "0 10px 40px rgba(45,46,131,0.08)" },
              { name: "Shadow / hero text", css: "0 10px 40px rgba(0,0,0,0.35)" },
            ].map((s) => (
              <div key={s.name} className="p-6 rounded-xl bg-white" style={{ boxShadow: s.css }}>
                <div className="font-bold text-[#2D2E83]">{s.name}</div>
                <code className="block text-xs mt-2 text-slate-500" dir="ltr">{s.css}</code>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-4 mt-8">
            {[6, 10, 20, 24].map((r) => (
              <div key={r} className="aspect-square bg-[#67FFD1]/40 border border-[#2D2E83]/20 grid place-items-center text-[#2D2E83] font-bold" style={{ borderRadius: r }}>
                {r}px
              </div>
            ))}
          </div>
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
