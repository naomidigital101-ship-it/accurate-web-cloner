import { useState } from "react";

function Field({ label, col, type = "text", name, required = false }: { label: string; col: 100 | 60 | 50 | 40; type?: string; name: string; required?: boolean }) {
  return (
    <div className={`e-field-group col-${col}`}>
      <label className="e-field-label" htmlFor={name}>{label}</label>
      <input className="e-field" type={type} id={name} name={name} required={required} size={1} />
    </div>
  );
}

function RadioGroup({ label, col, name, options }: { label: string; col: 100 | 60 | 50 | 40; name: string; options: string[] }) {
  return (
    <div className={`e-field-group col-${col}`}>
      <span className="e-field-label">{label}</span>
      <div className="e-radio-group">
        {options.map((o) => (
          <label key={o} className="e-radio-option">
            <input type="radio" name={name} value={o} />
            {o}
          </label>
        ))}
      </div>
    </div>
  );
}

const NOTE = "בשליחת הבקשה לא יעשה שום שימוש במידע שהזנתם מלבד לצרכים הטכניים של העמותה.";

function RequestForm() {
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
      {step === 1 && (
        <div className="e-form-fields">
          <RadioGroup label="למי מיועדות התפילין" col={50} name="target" options={["חייל", "בר מצוה", "מתחזק", "אחר"]} />
          <RadioGroup label="כותב ביד" col={50} name="hand" options={["ימין", "שמאל"]} />
          <RadioGroup label="שיטת אספקה" col={100} name="delivery" options={["אוכל להגיע לאסוף את התפילין", "מבקש משלוח (בתוספת תשלום)"]} />
          <div className="e-field-group col-100">
            <div className="e-form-buttons">
              <button type="button" className="e-btn-step" onClick={() => setStep(2)}>הבא</button>
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="e-form-fields">
          <Field label="שם פרטי" col={50} name="first" />
          <Field label="שם משפחה" col={50} name="last" />
          <Field label="כתובת למסירה" col={60} name="address" />
          <Field label="עיר/ישוב" col={40} name="city" />
          <div className="e-field-group col-100">
            <div className="e-form-buttons">
              <button type="button" className="e-btn-step e-btn-prev" onClick={() => setStep(1)}>הקודם</button>
              <button type="button" className="e-btn-step" onClick={() => setStep(3)}>הבא</button>
            </div>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="e-form-fields">
          <Field label="טלפון" col={40} type="tel" name="phone" required />
          <Field label="אימייל" col={60} type="email" name="email" required />
          <div className="e-field-group col-100"><p className="e-form-note">{NOTE}</p></div>
          <div className="e-field-group col-100">
            <div className="e-form-buttons">
              <button type="button" className="e-btn-step e-btn-prev" onClick={() => setStep(2)}>הקודם</button>
              <button type="submit" className="e-btn-step">שליחת בקשה</button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

function DonateForm() {
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
      {step === 1 && (
        <div className="e-form-fields">
          <Field label="שם מלא" col={100} name="name" />
          <Field label="כתובת לאיסוף" col={60} name="pickup" />
          <RadioGroup label="מצב התפילין" col={40} name="condition" options={["חדש", "משומש", "פגום/ישן מאוד"]} />
          <div className="e-field-group col-100">
            <div className="e-form-buttons">
              <button type="button" className="e-btn-step" onClick={() => setStep(2)}>הבא</button>
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="e-form-fields">
          <Field label="אימייל" col={60} type="email" name="email" required />
          <Field label="טלפון" col={40} type="tel" name="phone" required />
          <Field label="רוצים להוסיף הקדשה?" col={100} name="dedication" />
          <div className="e-field-group col-100"><p className="e-form-note">{NOTE}</p></div>
          <div className="e-field-group col-100">
            <div className="e-form-buttons">
              <button type="button" className="e-btn-step e-btn-prev" onClick={() => setStep(1)}>הקודם</button>
              <button type="submit" className="e-btn-step">שליחה</button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

export function FormTabsSection() {
  const [tab, setTab] = useState<"request" | "donate">("request");
  return (
    <section id="form" dir="rtl" className="forms-e">
      <div className="form-tabs-heading" role="tablist" aria-label="טפסים">
        <button
          type="button"
          role="tab"
          id="tab-request"
          aria-selected={tab === "request"}
          aria-controls="panel-request"
          className="form-tab"
          onClick={() => setTab("request")}
        >
          מתעניין בתפילין
        </button>
        <button
          type="button"
          role="tab"
          id="tab-donate"
          aria-selected={tab === "donate"}
          aria-controls="panel-donate"
          className="form-tab"
          onClick={() => setTab("donate")}
        >
          לתרומת תפילין
        </button>
      </div>

      {tab === "request" && (
        <div id="panel-request" role="tabpanel" aria-labelledby="tab-request" className="form-card">
          <h2 className="form-card-title">רוצה להניח תפילין משלך?</h2>
          <p className="form-card-sub">אנא מלא את הטופס המצורף כדי שנוכל לעזור לך לקבל תפילין משלך!</p>
          <RequestForm />
        </div>
      )}
      {tab === "donate" && (
        <div id="panel-donate" role="tabpanel" aria-labelledby="tab-donate" className="form-card">
          <h2 className="form-card-title">יש לך תפילין מיותרות?</h2>
          <p className="form-card-sub">אנא מלא את הטופס כדי שתוכל לקיים בהם מצוה חשובה וזיכוי הרבים!</p>
          <DonateForm />
        </div>
      )}
    </section>
  );
}
