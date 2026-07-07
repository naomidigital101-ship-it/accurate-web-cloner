import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/en/request-for-tefillin")({
  head: () => ({ meta: [{ title: "Request for Tefillin | The Tefillin Tie Initiative" }] }),
  component: Page,
});

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
          {options.map((o) => (<option key={o} value={o}>{o}</option>))}
        </select>
      </div>
    </div>
  );
}

const NOTE = "When sending the request, no use will be made of the information you entered except for the association's technical needs.";

function EnRequestForm() {
  const [step, setStep] = useState(1);
  const [sent, setSent] = useState(false);
  if (sent) return <p className="form-card-sub" role="status">The form has been sent successfully. Thank you!</p>;
  return (
    <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
      {step === 1 && (
        <div className="e-form-fields">
          <SelectField label="Who are the tefillin for?" col={50} name="target" options={["a soldier", "Bar Mitzvah", "getting stronger", "Other"]} />
          <SelectField label="writing by hand" col={50} name="hand" options={["right", "left"]} />
          <SelectField label="Delivery method" col={100} name="delivery" options={["I can come pick up the tefillin", "Request delivery (extra charge)"]} />
          <div className="e-field-group col-100">
            <div className="e-form-buttons">
              <button type="button" className="e-btn-step" onClick={() => setStep(2)}>next</button>
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
              <button type="button" className="e-btn-step e-btn-prev" onClick={() => setStep(1)}>previous</button>
              <button type="button" className="e-btn-step" onClick={() => setStep(3)}>next</button>
            </div>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="e-form-fields">
          <Field label="phone" col={40} type="tel" name="phone" required />
          <Field label="Email" col={60} type="email" name="email" required />
          <div className="e-field-group col-100"><p className="e-form-note">{NOTE}</p></div>
          <div className="e-field-group col-100">
            <div className="e-form-buttons">
              <button type="button" className="e-btn-step e-btn-prev" onClick={() => setStep(2)}>previous</button>
              <button type="submit" className="e-btn-step">שליחת בקשה</button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

function Page() {
  return (
    <PageShell title="Request for Tefillin" en>
      <div className="formpage-wrap">
        <div className="form-card">
          <h2 className="form-card-title">Want to lay your own tefillin?</h2>
          <p className="form-card-sub">Please fill out the attached form so we can help you get your own tefillin!</p>
          <EnRequestForm />
        </div>
      </div>
    </PageShell>
  );
}
