import { useState } from "react";

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

export function RequestForm() {
  const [step, setStep] = useState(1);
  const [sent, setSent] = useState(false);
  if (sent) return <p className="form-card-sub" role="status">הטופס נשלח בהצלחה. תודה רבה!</p>;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div className="e-form-fields">
        {step === 1 && (
          <>
            <SelectField label="למי מיועדות התפילין" col={50} name="target" options={["חייל", "בר מצוה", "מתחזק", "אחר"]} />
            <SelectField label="כותב ביד" col={50} name="hand" options={["ימין", "שמאל"]} />
            <SelectField label="שיטת אספקה" col={100} name="delivery" options={["אוכל להגיע לאסוף את התפילין", "מבקש משלוח (בתוספת תשלום)"]} />
            <NextButton onClick={() => setStep(2)} />
          </>
        )}
        {step === 2 && (
          <>
            <Field label="שם פרטי" col={50} name="first" required />
            <Field label="שם משפחה" col={50} name="last" required />
            <Field label="כתובת למסירה" col={60} name="address" />
            <Field label="עיר/ישוב" col={40} name="city" />
            <PrevNextRow onPrev={() => setStep(1)} onNext={() => setStep(3)} />
          </>
        )}
        {step === 3 && (
          <>
            <Field label="טלפון" col={40} type="tel" name="phone" required />
            <Field label="אימייל" col={60} type="email" name="email" required />
            <Note />
            <PrevNextRow onPrev={() => setStep(2)} submitLabel="שליחת בקשה" />
          </>
        )}
      </div>
    </form>
  );
}

export function DonateForm() {
  const [step, setStep] = useState(1);
  const [sent, setSent] = useState(false);
  if (sent) return <p className="form-card-sub" role="status">הטופס נשלח בהצלחה. תודה רבה!</p>;
  return (
    <form
      className="donate-form"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div className="e-form-fields">
        {step === 1 && (
          <>
            <Field label="שם מלא" col={100} name="name" required />
            <Field label="כתובת לאיסוף" col={60} name="pickup" />
            <SelectField label="מצב התפילין" col={40} name="condition" options={["חדש", "משומש", "פגום/ישן מאוד"]} />
            <NextButton onClick={() => setStep(2)} />
          </>
        )}
        {step === 2 && (
          <>
            <Field label="אימייל" col={60} type="email" name="email" required />
            <Field label="טלפון" col={40} type="tel" name="phone" required />
            <TextareaField label="רוצים להוסיף הקדשה?" col={100} name="dedication" />
            <Note />
            <PrevNextRow onPrev={() => setStep(1)} submitLabel="שליחה" />
          </>
        )}
      </div>
    </form>
  );
}

export function FormTabsSection() {
  const [tab, setTab] = useState<"request" | "donate">("request");
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
            <p className="form-card-sub">אנא מלא את הטופס המצורף כדי שנוכל לעזור לך לקבל תפילין משלך!</p>
            <RequestForm />
          </div>
        ) : (
          <div className="form-card" role="tabpanel" aria-label="יש לך תפילין מיותרות?">
            <h2 className="form-card-title">יש לך תפילין מיותרות?</h2>
            <p className="form-card-sub">אנא מלא את הטופס כדי שתוכל לקיים בהם מצוה חשובה וזיכוי הרבים!</p>
            <DonateForm />
          </div>
        )}
      </div>
    </section>
  );
}
