import { useState } from "react";

function Field({ label, col, type = "text", name, required = false }: { label: string; col: 100 | 60 | 50 | 40; type?: string; name: string; required?: boolean }) {
  return (
    <div className={`e-field-group col-${col}`}>
      <label className="e-field-label" htmlFor={name}>{label}</label>
      <input className="e-field" type={type} id={name} name={name} required={required} size={1} />
    </div>
  );
}

function SelectField({ label, col, name, options }: { label: string; col: 100 | 60 | 50 | 40; name: string; options: string[] }) {
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

export function RequestForm() {
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
        <SelectField label="למי מיועדות התפילין" col={50} name="target" options={["חייל", "בר מצוה", "מתחזק", "אחר"]} />
        <SelectField label="כותב ביד" col={50} name="hand" options={["ימין", "שמאל"]} />
        <SelectField label="שיטת אספקה" col={100} name="delivery" options={["אוכל להגיע לאסוף את התפילין", "מבקש משלוח (בתוספת תשלום)"]} />
        <Field label="שם פרטי" col={50} name="first" required />
        <Field label="שם משפחה" col={50} name="last" required />
        <Field label="כתובת למסירה" col={60} name="address" />
        <Field label="עיר/ישוב" col={40} name="city" />
        <Field label="טלפון" col={40} type="tel" name="phone" required />
        <Field label="אימייל" col={60} type="email" name="email" required />
        <div className="e-field-group col-100"><p className="e-form-note">{NOTE}</p></div>
        <div className="e-field-group col-100">
          <div className="e-form-buttons">
            <button type="submit" className="e-btn-step">שליחת בקשה</button>
          </div>
        </div>
      </div>
    </form>
  );
}

export function DonateForm() {
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
        <Field label="שם מלא" col={100} name="name" required />
        <Field label="כתובת לאיסוף" col={60} name="pickup" />
        <SelectField label="מצב התפילין" col={40} name="condition" options={["חדש", "משומש", "פגום/ישן מאוד"]} />
        <Field label="אימייל" col={60} type="email" name="email" required />
        <Field label="טלפון" col={40} type="tel" name="phone" required />
        <Field label="רוצים להוסיף הקדשה?" col={100} name="dedication" />
        <div className="e-field-group col-100"><p className="e-form-note">{NOTE}</p></div>
        <div className="e-field-group col-100">
          <div className="e-form-buttons">
            <button type="submit" className="e-btn-step">שליחה</button>
          </div>
        </div>
      </div>
    </form>
  );
}

export function FormTabsSection() {
  return (
    <section id="form" dir="rtl" className="forms-e forms-e-dual">
      <div className="form-card">
        <h2 className="form-card-title">רוצה להניח תפילין משלך?</h2>
        <p className="form-card-sub">אנא מלא את הטופס המצורף כדי שנוכל לעזור לך לקבל תפילין משלך!</p>
        <RequestForm />
      </div>
      <div className="form-card">
        <h2 className="form-card-title">יש לך תפילין מיותרות?</h2>
        <p className="form-card-sub">אנא מלא את הטופס כדי שתוכל לקיים בהם מצוה חשובה וזיכוי הרבים!</p>
        <DonateForm />
      </div>
    </section>
  );
}
