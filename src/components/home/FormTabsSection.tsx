import { useRef, useState } from "react";

import { submitLead } from "@/lib/api/leads.functions";
import { track } from "@/lib/analytics";
import { HONEYPOT_STYLE } from "@/lib/honeypot";

/** form_start נשלח פעם אחת בלבד לכל טופס, במגע הראשון של המשתמש בשדה */
function useFormStart(formType: "request" | "donate", lang: "he" | "en") {
  const fired = useRef(false);
  return () => {
    if (fired.current) return;
    fired.current = true;
    track("form_start", { form_type: formType, lang });
  };
}


/**
 * הטפסים רב-שלביים ומסירים שדות מה-DOM בין שלבים, ולכן FormData בשליחה
 * מכיל רק את השלב האחרון. הצילום הזה שומר את הערכים בכל מעבר ומאחד בסוף.
 */
function useMultiStepValues() {
  const values = useRef<Record<string, string>>({});
  const capture = (form: HTMLFormElement | null) => {
    if (!form) return;
    for (const [k, v] of new FormData(form).entries()) {
      if (typeof v === "string" && v.trim() !== "") values.current[k] = v.trim();
    }
  };
  return { values, capture };
}

/** שדה מלכודת לבוטים - מוסתר מהעין ומקוראי מסך, אדם לעולם לא ימלא אותו */
function HoneyPot() {
  return (
    <div aria-hidden="true" style={HONEYPOT_STYLE}>
      <label htmlFor="website">אתר</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

type Col = 100 | 60 | 50 | 40;

function Field({ label, col, type = "text", name, required = false }: { label: string; col: Col; type?: string; name: string; required?: boolean }) {
  return (
    <div className={`e-field-group col-${col}`}>
      <label className="e-field-label" htmlFor={name}>{label}</label>
      <input className="e-field" type={type} id={name} name={name} required={required} size={1} />
    </div>
  );
}

function TextareaField({ label, col, name }: { label: string; col: Col; name: string }) {
  return (
    <div className={`e-field-group col-${col}`}>
      <label className="e-field-label" htmlFor={name}>{label}</label>
      <textarea className="e-field e-textarea" id={name} name={name} rows={3} />
    </div>
  );
}

function SelectField({ label, col, name, options }: { label: string; col: Col; name: string; options: string[] }) {
  return (
    <div className={`e-field-group col-${col}`}>
      <label className="e-field-label" htmlFor={name}>{label}</label>
      <div className="e-select-wrap">
        <select className="e-field e-select" id={name} name={name}>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

const NOTE = "בשליחת הבקשה לא יעשה שום שימוש במידע שהזנתם מלבד לצרכים הטכניים של העמותה.";

function Note() {
  return (
    <div className="e-field-group col-100"><p className="e-form-note">{NOTE}</p></div>
  );
}

function NextButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="e-field-group col-100">
      <div className="e-form-buttons">
        <button type="button" className="e-btn-step" onClick={onClick}>הבא</button>
      </div>
    </div>
  );
}

function PrevNextRow({ onPrev, onNext, submitLabel }: { onPrev: () => void; onNext?: () => void; submitLabel?: string }) {
  return (
    <div className="e-field-group col-100">
      <div className="e-form-buttons">
        <button type="button" className="e-btn-step e-btn-prev" onClick={onPrev}>הקודם</button>
        {submitLabel ? (
          <button type="submit" className="e-btn-step">{submitLabel}</button>
        ) : (
          <button type="button" className="e-btn-step" onClick={onNext}>הבא</button>
        )}
      </div>
    </div>
  );
}

/**
 * onSent מדווח להורה שהטופס נשלח.
 *
 * מצב ה"נשלח" הוא פנימי לטופס, אבל הכותרת ומשפט ההנחיה ("אנא מלא את
 * הטופס...") יושבים בעמוד שמעליו. בלי הדיווח הזה ההנחיה נשארה על המסך
 * מתחת להודעת ההצלחה, כלומר ביקשנו מהגולש למלא טופס שהוא כבר מילא.
 */
export function RequestForm({ onSent }: { onSent?: () => void }) {
  const [step, setStep] = useState(1);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { values, capture } = useMultiStepValues();
  const onStart = useFormStart("request", "he");

  const go = (n: number) => {
    capture(formRef.current);
    setStep(n);
    track("form_step", { form_type: "request", step: n, lang: "he" });
  };

  if (sent) return <p className="form-card-sub" role="status">הטופס נשלח בהצלחה. תודה רבה!</p>;
  return (
    <form
      ref={formRef}
      onFocus={onStart}
      onInput={onStart}
      onSubmit={async (e) => {
        e.preventDefault();
        capture(formRef.current);
        setBusy(true);
        setErr(null);
        try {
          await submitLead({ data: { kind: "request", lang: "he", ...values.current } });
          track("lead_request", {
            form_type: "request",
            lang: "he",
            target: values.current.target,
            hand: values.current.hand,
            delivery: values.current.delivery,
            value: 1,
          });
          setSent(true);
          onSent?.();
        } catch {
          track("form_error", { form_type: "request", lang: "he" });
          setErr("השליחה נכשלה. אפשר לנסות שוב או להתקשר 054-6713966.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <HoneyPot />

      <div className="e-form-fields">
        {step === 1 && (
          <>
            <SelectField label="למי מיועדות התפילין" col={50} name="target" options={["חייל", "בר מצוה", "מתחזק", "אחר"]} />
            <SelectField label="כותב ביד" col={50} name="hand" options={["ימין", "שמאל"]} />
            <SelectField label="שיטת אספקה" col={100} name="delivery" options={["אוכל להגיע לאסוף את התפילין", "מבקש משלוח (בתוספת תשלום)"]} />
            <NextButton onClick={() => go(2)} />
          </>
        )}
        {step === 2 && (
          <>
            <Field label="שם פרטי" col={50} name="first_name" required />
            <Field label="שם משפחה" col={50} name="last_name" required />
            <Field label="כתובת למסירה" col={60} name="address" />
            <Field label="עיר/ישוב" col={40} name="city" />
            <PrevNextRow onPrev={() => go(1)} onNext={() => go(3)} />
          </>
        )}
        {step === 3 && (
          <>
            <Field label="טלפון" col={40} type="tel" name="phone" required />
            <Field label="אימייל" col={60} type="email" name="email" required />
            <Note />
            {err && <div className="e-field-group col-100"><p className="e-form-note" role="alert" style={{ color: "#b3261e", fontWeight: 700 }}>{err}</p></div>}
            <PrevNextRow onPrev={() => go(2)} submitLabel={busy ? "שולח…" : "שליחת בקשה"} />
          </>
        )}
      </div>
    </form>
  );
}

export function DonateForm({ onSent }: { onSent?: () => void }) {
  const [step, setStep] = useState(1);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { values, capture } = useMultiStepValues();
  const onStart = useFormStart("donate", "he");

  const go = (n: number) => {
    capture(formRef.current);
    setStep(n);
    track("form_step", { form_type: "donate", step: n, lang: "he" });
  };

  if (sent) return <p className="form-card-sub" role="status">הטופס נשלח בהצלחה. תודה רבה!</p>;
  return (
    <form
      ref={formRef}
      className="donate-form"
      onFocus={onStart}
      onInput={onStart}
      onSubmit={async (e) => {
        e.preventDefault();
        capture(formRef.current);
        setBusy(true);
        setErr(null);
        try {
          await submitLead({ data: { kind: "donate", lang: "he", ...values.current } });
          track("lead_donate_tefilin", {
            form_type: "donate",
            lang: "he",
            condition: values.current.condition,
            value: 1,
          });
          setSent(true);
          onSent?.();
        } catch {
          track("form_error", { form_type: "donate", lang: "he" });
          setErr("השליחה נכשלה. אפשר לנסות שוב או להתקשר 054-6713966.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <HoneyPot />

      <div className="e-form-fields">
        {step === 1 && (
          <>
            <Field label="שם מלא" col={100} name="full_name" required />
            <Field label="כתובת לאיסוף" col={60} name="address" />
            <SelectField label="מצב התפילין" col={40} name="condition" options={["חדש", "משומש", "פגום/ישן מאוד"]} />
            <NextButton onClick={() => go(2)} />
          </>
        )}
        {step === 2 && (
          <>
            <Field label="אימייל" col={60} type="email" name="email" required />
            <Field label="טלפון" col={40} type="tel" name="phone" required />
            <TextareaField label="רוצים להוסיף הקדשה?" col={100} name="dedication" />
            <Note />
            {err && <div className="e-field-group col-100"><p className="e-form-note" role="alert" style={{ color: "#b3261e", fontWeight: 700 }}>{err}</p></div>}
            <PrevNextRow onPrev={() => go(1)} submitLabel={busy ? "שולח…" : "שליחה"} />
          </>
        )}
      </div>
    </form>
  );
}

export function FormTabsSection() {
  const [tab, setTab] = useState<"request" | "donate">("request");
  // מצב נפרד לכל לשונית: מי ששלח בקשה ועבר ללשונית התרומה עדיין צריך הנחיה
  const [requestSent, setRequestSent] = useState(false);
  const [donateSent, setDonateSent] = useState(false);
  return (
    <section id="form" dir="rtl" className="forms-e forms-tabbed">
      <div className="form-tabs" role="tablist" aria-label="בחירת טופס">
        <button
          type="button"
          role="tab"
          id="form-request"
          aria-selected={tab === "request"}
          className={`form-tab${tab === "request" ? " is-active" : ""}`}
          onClick={() => setTab("request")}
        >
          מתעניין בתפילין
        </button>
        <button
          type="button"
          role="tab"
          id="form-donate"
          aria-selected={tab === "donate"}
          className={`form-tab${tab === "donate" ? " is-active" : ""}`}
          onClick={() => setTab("donate")}
        >
          לתרומת תפילין
        </button>
      </div>

      <div className="form-card-wrap">
        {tab === "request" ? (
          <div className="form-card" role="tabpanel" aria-label="רוצה להניח תפילין משלך?">
            <h2 className="form-card-title">רוצה להניח תפילין משלך?</h2>
            {!requestSent && (
              <p className="form-card-sub">אנא מלא את הטופס המצורף כדי שנוכל לעזור לך לקבל תפילין משלך!</p>
            )}
            <RequestForm onSent={() => setRequestSent(true)} />
          </div>
        ) : (
          <div className="form-card" role="tabpanel" aria-label="יש לך תפילין מיותרות?">
            <h2 className="form-card-title">יש לך תפילין מיותרות?</h2>
            {!donateSent && (
              <p className="form-card-sub">אנא מלא את הטופס כדי שתוכל לקיים בהם מצוה חשובה וזיכוי הרבים!</p>
            )}
            <DonateForm onSent={() => setDonateSent(true)} />
          </div>
        )}
      </div>
    </section>
  );
}
