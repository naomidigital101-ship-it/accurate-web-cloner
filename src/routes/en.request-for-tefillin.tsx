import { createFileRoute } from "@tanstack/react-router";
import { leadSource } from "@/lib/lead-source";
import { useRef, useState } from "react";

import { submitLead } from "@/lib/api/leads.functions";
import { track } from "@/lib/analytics";
import { PageShell } from "@/components/PageShell";
import { SITE_URL } from "@/lib/site";
import { HONEYPOT_STYLE } from "@/lib/honeypot";

export const Route = createFileRoute("/en/request-for-tefillin")({
  head: () => ({
    meta: [
      { title: "Request Tefillin | The Tefillin Tie Initiative" },
      { name: "description", content: "Want to start wearing tefillin? Fill out a short form and we will provide a kosher, high-quality pair - for soldiers, Bar Mitzvah boys and anyone strengthening their observance." },
      { property: "og:title", content: "Request Tefillin | The Tefillin Tie Initiative" },
      { property: "og:description", content: "Want to start wearing tefillin? Fill out a short form and we will provide a kosher, high-quality pair - for soldiers, Bar Mitzvah boys and anyone strengthening their observance." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: `${SITE_URL}/en/request-for-tefillin` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/en/request-for-tefillin` }],
  }),
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


/**
 * הטופס רב-שלבי ומסיר שדות מה-DOM בין שלבים, לכן שומרים ערכים בכל מעבר.
 * תוויות שלב 2 נשארות בעברית - כך במקור, החלטת לקוח. רק השליחה מחוברת.
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

function HoneyPot() {
  return (
    <div aria-hidden="true" style={HONEYPOT_STYLE}>
      <label htmlFor="website">website</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

function EnRequestForm() {
  const [step, setStep] = useState(1);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { values, capture } = useMultiStepValues();
  const started = useRef(false);
  const onStart = () => {
    if (started.current) return;
    started.current = true;
    track("form_start", { form_type: "request", lang: "en" });
  };
  const go = (n: number) => {
    capture(formRef.current);
    setStep(n);
    track("form_step", { form_type: "request", step: n, lang: "en" });
  };
  if (sent) return <p className="form-card-sub" role="status">The form has been sent successfully. Thank you!</p>;
  return (
    <form ref={formRef}
      onFocus={onStart}
      onInput={onStart}
      onSubmit={async (e) => {
        e.preventDefault();
        capture(formRef.current);
        setBusy(true);
        setErr(null);
        try {
          await submitLead({ data: { kind: "request", lang: "en", ...values.current, ...leadSource() } });
          track("lead_request", {
            form_type: "request",
            lang: "en",
            target: values.current.target,
            hand: values.current.hand,
            delivery: values.current.delivery,
            value: 1,
          });
          setSent(true);
        } catch {
          track("form_error", { form_type: "request", lang: "en" });
          setErr("Sending failed. Please try again or call +972-54-6713966.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <HoneyPot />
      {step === 1 && (
        <div className="e-form-fields">
          <SelectField label="Who are the tefillin for?" col={50} name="target" options={["a soldier", "Bar Mitzvah", "getting stronger", "Other"]} />
          <SelectField label="writing by hand" col={50} name="hand" options={["right", "left"]} />
          <SelectField label="Delivery method" col={100} name="delivery" options={["I can come pick up the tefillin", "Request delivery (extra charge)"]} />
          <div className="e-field-group col-100">
            <div className="e-form-buttons">
              <button type="button" className="e-btn-step" onClick={() => go(2)}>next</button>
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="e-form-fields">
          <Field label="שם פרטי" col={50} name="first_name" />
          <Field label="שם משפחה" col={50} name="last_name" />
          <Field label="כתובת למסירה" col={60} name="address" />
          <Field label="עיר/ישוב" col={40} name="city" />
          <div className="e-field-group col-100">
            <div className="e-form-buttons">
              <button type="button" className="e-btn-step e-btn-prev" onClick={() => go(1)}>previous</button>
              <button type="button" className="e-btn-step" onClick={() => go(3)}>next</button>
            </div>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="e-form-fields">
          <Field label="phone" col={40} type="tel" name="phone" required />
          <Field label="Email" col={60} type="email" name="email" required />
          <div className="e-field-group col-100"><p className="e-form-note">{NOTE}</p></div>
          {err && <div className="e-field-group col-100"><p className="e-form-note" role="alert" style={{ color: "#b3261e", fontWeight: 700 }}>{err}</p></div>}
          <div className="e-field-group col-100">
            <div className="e-form-buttons">
              <button type="button" className="e-btn-step e-btn-prev" onClick={() => go(2)}>previous</button>
              <button type="submit" className="e-btn-step" disabled={busy}>שליחת בקשה</button>
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
          <EnRequestForm />
        </div>
      </div>
    </PageShell>
  );
}
