import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";

export const Route = createFileRoute("/en/")({
  head: () => ({
    meta: [
      { title: "The Tefillin Tie Initiative | Ohr Chadash" },
      {
        name: "description",
        content:
          "Kesher Shel Tefillin — Ohr Chadash's initiative connecting Jews who wish to begin wearing Tefillin with donors of unused Tefillin.",
      },
      { property: "og:title", content: "The Tefillin Tie Initiative | Ohr Chadash" },
      {
        property: "og:description",
        content:
          "Mutual responsibility and collective benefit — connecting one Jew who wants to begin wearing Tefillin with another whose Tefillin are unused.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://accurate-web-cloner.lovable.app/en/the-tefillin-tie-initiative/" },
    ],
    links: [{ rel: "canonical", href: "https://accurate-web-cloner.lovable.app/en/the-tefillin-tie-initiative/" }],
  }),
  component: EnPage,
});

/* ============================================================
 * HERO (LTR)
 * ============================================================ */
function EnHero() {
  const [videoOn, setVideoOn] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const on = () => setInteracted(true);
    const evs = ["scroll", "pointerdown", "touchstart", "keydown"] as const;
    evs.forEach((e) => window.addEventListener(e, on, { once: true, passive: true }));
    return () => evs.forEach((e) => window.removeEventListener(e, on));
  }, []);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (!String(e.origin).includes("vimeo.com")) return;
      try {
        const d = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (d.event === "ready") {
          iframeRef.current?.contentWindow?.postMessage(
            JSON.stringify({ method: "addEventListener", value: "playProgress" }),
            "*",
          );
        }
        if (d.event === "playProgress" || d.event === "play") setVideoOn(true);
      } catch {
        /* not vimeo json */
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  return (
    <section dir="ltr" className="hero-e text-white">
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              "url('/wp/assets/jewish-torah-bar-mitzvah-bar-mitzvah-torah-reading-min.webp') 50% 50% / cover",
          }}
        />
        {interacted && (
          <iframe
            ref={iframeRef}
            id="herovideo-en"
            src="https://player.vimeo.com/video/906687611?background=1&autoplay=1&loop=1&muted=1&autopause=0&controls=0&dnt=1&api=1&player_id=herovideo-en"
            title="Background video"
            allow="autoplay; fullscreen"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] h-[56.25vw] min-w-full min-h-full pointer-events-none border-0"
            style={{ opacity: videoOn ? 1 : 0, transition: "opacity 0.6s" }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(at top left, #67FFD1 0%, #009FE3 100%)",
            mixBlendMode: "multiply",
          }}
        />
      </div>

      <div className="hero-e-inner">
        <div className="hero-title-icon" role="img" aria-label="Kesher Shel Tefillin">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 566.93 368.5"><defs><style>{`.ht-1{fill:#009fe3;stroke-width:0}.ht-2{fill:#fff;stroke-width:0}`}</style></defs><path className="ht-2" d="M234.8,69.02c-5.11.16-8.5.44-10.19.84.52-1.13.6-3.89.24-8.29-.36-4.41-1.69-9.46-3.98-15.17,1.49,1.57,3.62,2.59,6.39,3.08s6.27.72,10.49.72h76.64c5.87.16,10.03,1.29,12.48,3.41,2.45,2.11,3.46,5.52,3.01,10.22,0,.64-.13,4.25-.39,10.82-.26,6.58,1.18,11.57,4.31,14.99,1.37,2.93,1.83,6.49,1.39,10.67-.44,4.18-1.09,8.06-1.93,11.64-.76-4.54-2.55-9.49-5.37-14.83-1.61-2.25-2.11-5.22-1.51-8.89.6-3.68.82-6.38.66-8.11-.96-7.2-6.83-10.89-17.61-11.1h-74.65Z"/><path className="ht-2" d="M345.27,50.63c3.26.28,6.15.12,8.68-.48-1.49,5.11-1.97,11.28-1.45,18.51-1,1.05-2.37,1.89-4.1,2.53.52,1,.48,3.48-.12,7.42-.24,3.98.61,6.85,2.56,8.62s5.22,3.52,9.8,5.25c1.61.32,5.53-.87,11.76-3.59,6.23-2.71,11.28-5.6,15.14-8.68,3.86-3.07,6.05-5.41,6.57-7.02,0-1.49-1.15-2.69-3.44-3.62s-6.57-1.17-12.84-.72c2.17-7.16,2.47-14.59.9-22.31h.06c2.33,2.45,6.99,3.68,13.99,3.68,3.7.48,5.55,3.1,5.55,7.87s-1.64,12.69-4.92,23.79c-3.28,11.1-9.11,18.93-17.52,23.49s-13.81,6.88-16.22,6.96c-1.57.32-4.26-1.95-8.08-6.81-3.82-4.86-5.65-13.39-5.49-25.57-1.05-5.95-4.18-9.73-9.41-11.34,1.61-7.28,1.69-14.67.24-22.19,2.29,2.53,5.07,3.94,8.32,4.22ZM374.22,50.63c-1.45,5.67-1.91,11.74-1.39,18.21-4.62,3.66-7.82,9.09-9.59,16.28-.6-2.53-.88-4.94-.84-7.24s.3-4.86.78-7.72c-2.53-.36-4.54-.9-6.03-1.63,1.45-11.18,1.51-18.57.18-22.19,3.42,3.1,9.04,4.52,16.88,4.28Z"/><path className="ht-2" d="M412.47,69.02c-5.11.16-8.5.44-10.19.84.52-1.13.6-3.89.24-8.29-.36-4.41-1.69-9.46-3.98-15.17,1.49,1.57,3.62,2.59,6.39,3.08s6.27.72,10.49.72h25.93c7.84.04,11.6,2.25,11.28,6.63,0,3.18-.54,9.54-1.63,19.09-1.09,9.55-4.55,16.5-10.4,20.86-5.85,4.36-9.14,8.05-9.86,11.06-.28-2.29-.37-6.16-.27-11.61.1-5.44,3.22-10.05,9.37-13.8s9.11-6.87,8.86-9.32-3.01-3.82-8.32-4.1h-27.92ZM421.63,140.42c1.09-5.31-.96-13.2-6.12-23.67-5.17-10.47-7.8-18.12-7.9-22.94-.1-4.82.84-10.99,2.81-18.51-.64,5.35,1.54,13.41,6.54,24.18,5,10.77,7.75,18.39,8.26,22.85s-.69,10.49-3.59,18.09Z"/><path className="ht-2" d="M235.64,100.89h20.58c2.63.09,4.28,1.01,4.93,2.78.66,1.77.98,5.85.98,12.24s-.82,10.65-2.46,12.75c-1.64,2.1-3.22,4.21-4.75,6.34-1.53,2.12-2.64,3.83-3.32,5.1-.68,1.27-1.42,3.2-2.23,5.77h-.04c-.41-3.18-.56-6.27-.45-9.25.1-2.98.46-5.01,1.08-6.1.62-1.08,2.53-3.27,5.73-6.55,3.2-3.29,4.7-5.05,4.5-5.28-.43-2.37-2.01-3.66-4.73-3.86h-21.14c-3.04-.29-4.69-4.37-4.95-12.24-.23-5.56,1.29-9.67,4.56-12.36,3.27-2.67,7.3-3.51,12.09-2.49,4.79,1.01,8.72,1.52,11.79,1.52-2.89,1.85-5.07,4.7-6.51,8.55-6.66-3.85-11.68-5.48-15.07-4.89-3.39.6-5.06,2.08-5.02,4.45.05,2.37,1.53,3.55,4.45,3.52Z"/><path className="ht-2" d="M269.77,101.19c2.34.2,4.43.09,6.25-.35-1.07,3.68-1.42,8.12-1.04,13.33-.72.75-1.71,1.36-2.95,1.82.38.72.35,2.5-.09,5.34-.17,2.87.44,4.94,1.85,6.21,1.4,1.27,3.75,2.53,7.05,3.78,1.16.23,3.98-.63,8.47-2.58,4.49-1.96,8.12-4.04,10.9-6.25,2.78-2.22,4.36-3.9,4.73-5.06,0-1.07-.82-1.94-2.47-2.61-1.65-.67-4.73-.84-9.25-.52,1.56-5.15,1.78-10.51.65-16.06h.04c1.68,1.77,5.04,2.65,10.07,2.65,2.66.35,3.99,2.24,3.99,5.66s-1.18,9.14-3.54,17.13c-2.36,7.99-6.57,13.63-12.62,16.91-6.05,3.29-9.94,4.96-11.68,5.02-1.13.23-3.07-1.4-5.82-4.91-2.75-3.5-4.07-9.64-3.95-18.41-.75-4.28-3.01-7-6.77-8.16,1.16-5.24,1.22-10.57.17-15.98,1.65,1.82,3.65,2.84,5.99,3.04ZM290.61,101.19c-1.04,4.08-1.37,8.45-1,13.11-3.33,2.63-5.63,6.54-6.9,11.72-.43-1.82-.64-3.56-.61-5.21.03-1.65.22-3.5.56-5.56-1.82-.26-3.27-.65-4.34-1.17,1.04-8.05,1.09-13.37.13-15.98,2.46,2.23,6.51,3.26,12.16,3.08Z"/><path className="ht-2" d="M49.79,216.12c.97,10.05,2.16,17.57,3.57,22.56,1.41,4.99,4.62,13.94,9.65,26.84,5.02,12.9,7.64,22.64,7.84,29.24.2,6.6-1.58,15.73-5.33,27.39-.74-5.5-1.71-10.59-2.91-15.28-1.21-4.69-3.28-10.87-6.23-18.54-2.95-7.67-5.38-14.34-7.28-20-1.91-5.66-2.58-14.12-2.01-25.38.57-11.26-1.16-21.52-5.18-30.81-4.02-9.28-10.39-13.52-19.09-12.71,4.02-9.45,3.98-22.38-.1-38.79,5.89,4.76,12.7,7.39,20.4,7.89,7.7.51,12.76.39,15.18-.35-1.68,9.18-1.51,19.77.5,31.76-6.97.74-9.97,6.13-9,16.18Z"/><path className="ht-2" d="M62.96,161.25c3.08,3.42,7.97,5.5,14.67,6.23,13.6-.4,22.07,2.71,25.43,9.35,3.35,6.63,4.62,16.88,3.82,30.75s-2.61,22.75-5.43,26.63c.87-6.23.62-12.43-.75-18.59-1.37-6.16-4.22-10.45-8.55-12.86-4.32-2.41-12.11-2.78-23.36-1.11.6-3.08.85-7.67.76-13.77-.1-6.09-2.3-14.97-6.58-26.63Z"/><path className="ht-2" d="M122.65,198.74c-7.03-.67-10.85-9.78-11.46-27.34-.54-12.86,2.98-22.4,10.55-28.59,7.57-6.19,23.6-7.79,48.09-4.77,24.49,3.01,40.28,3.86,47.38,2.51-6.7,4.29-11.73,10.89-15.07,19.8-42.21-10.92-67.23-15.19-75.07-12.81-7.84,2.38-11.71,6.32-11.61,11.81.1,5.5,3.53,8.21,10.3,8.14h158.19c6.09.2,9.9,2.51,11.4,6.93,1.51,4.42,2.43,14.37,2.77,29.85.33,15.48-5.01,28.11-16.03,37.89-11.02,9.78-17.37,19.6-19.04,29.45h-.1c-1.74-7.24-2.56-15.01-2.46-23.32.1-8.31,5.68-16.85,16.73-25.63,11.05-8.78,16.35-13.77,15.88-14.97-1-5.49-4.66-8.47-10.95-8.94H122.65Z"/><path className="ht-2" d="M301.55,161.25c3.08,3.42,7.97,5.5,14.67,6.23,13.6-.4,22.07,2.71,25.43,9.35,3.35,6.63,4.62,16.88,3.82,30.75s-2.61,22.75-5.43,26.63c.87-6.23.62-12.43-.75-18.59-1.37-6.16-4.22-10.45-8.55-12.86-4.32-2.41-12.11-2.78-23.36-1.11.6-3.08.85-7.67.76-13.77-.1-6.09-2.3-14.97-6.58-26.63Z"/><path className="ht-2" d="M406.44,167.48c8.04.14,13.5,1.83,16.38,5.07,2.88,3.25,3.95,7.02,3.22,11.31-2.01,17.15-1.95,28.46.2,33.92,2.14,5.46,5.02,11.04,8.64,16.74-3.82,6.17-6.67,17.29-8.54,33.37-34.44.67-58.86,3.75-73.26,9.25,4.42-9.38,6.4-20.13,5.93-32.26,19.9-4.42,41.24-6.5,64.02-6.23-1.41-4.62-2.33-8.12-2.76-10.5-.44-2.38-.17-7.81.8-16.28.97-8.48-3.77-12.82-14.22-13.02h-37.79c-2.55.6-3.97,1.93-4.27,3.97-.31,2.04.68,3.36,2.96,3.97,2.28.6,9.65.6,22.11,0-3.55,7.17-4.59,15.68-3.12,25.53-13.27.4-22.81,2.81-28.64,7.24,2.01-2.54,3.95-5.02,5.83-7.44-3.62-2.07-5.51-6.55-5.68-13.41-.16-6.87,1.29-13.68,4.37-20.45-5.23-6.83-7.02-12.82-5.38-17.94,1.64-5.13,2.97-11.54,3.97-19.25,2.28,4.36,5.73,6.5,10.35,6.43h34.87Z"/><path className="ht-2" d="M514.49,167.48c5.89.34,10.08,1.61,12.56,3.82,2.48,2.21,3.82,4.56,4.02,7.03.2,2.48-.64,12.63-2.51,30.45-.4,5.36,1.99,11.07,7.19,17.14,5.19,6.06,7.99,11.19,8.39,15.37.4,4.19-.64,12.31-3.12,24.37-.8-7.17-3.63-14.25-8.49-21.25-4.86-7-7.81-11.98-8.84-14.93-1.04-2.95-.72-8.54.95-16.78,1.67-8.24-3.69-12.86-16.08-13.87h-48.74c-10.52.27-17.19.74-20,1.41,1.41-4.02,2.36-8.86,2.87-14.52.5-5.66-1.53-13.85-6.08-24.57,2.48,2.61,6.03,4.32,10.65,5.13s10.45,1.21,17.49,1.21h49.75ZM467.45,201.05c-.8,4.22-.6,9.16.6,14.83,1.21,5.66,5.29,12.04,12.26,19.14-4.76,8.38-7.4,20.04-7.94,34.97-13.13.33-24.72,2.14-34.77,5.43,2.95-9.51,4.18-20.47,3.72-32.86,7.1-1.94,13.43-3.01,18.99-3.22-1.41-14.34.97-27.1,7.14-38.29Z"/><path className="ht-1" d="M263.61,278.1c3.09,8.08,9.4,9.4,9.4,9.4,0,0-6.31,1.32-9.4,9.4-3.09-8.08-9.4-9.4-9.4-9.4,0,0,6.31-1.32,9.4-9.4Z"/><path className="ht-1" d="M393.98,278.1c3.09,8.08,9.4,9.4,9.4,9.4,0,0-6.31,1.32-9.4,9.4-3.09-8.08-9.4-9.4-9.4-9.4,0,0,6.31-1.32,9.4-9.4Z"/></svg>
        </div>

        <h2 className="hero-subtitle">Mutual Responsibility and Collective Benefit</h2>

        <p className="hero-par">
          Our objective: to connect between a Jew who wishes to begin wearing Tefillin, and one who has Tefillin that are not in use.
        </p>
      </div>

      <div className="hero-shape" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none">
          <path d="M500,97C126.7,96.3,0.8,19.8,0,0v100l1000,0V1C1000,19.4,873.3,97.8,500,97z" />
        </svg>
      </div>
    </section>
  );
}

/* ============================================================
 * FORMS (LTR)
 * ============================================================ */
const EN_NOTE =
  "When sending the request, no use will be made of the information you entered except for the association's technical needs.";

function EnField({
  label,
  col,
  type = "text",
  name,
  required = false,
}: {
  label: string;
  col: 100 | 60 | 50 | 40;
  type?: string;
  name: string;
  required?: boolean;
}) {
  return (
    <div className={`e-field-group col-${col}`}>
      <label className="e-field-label" htmlFor={name}>
        {label}
      </label>
      <input className="e-field" type={type} id={name} name={name} required={required} size={1} />
    </div>
  );
}

function EnSelectField({
  label,
  col,
  name,
  options,
}: {
  label: string;
  col: 100 | 60 | 50 | 40;
  name: string;
  options: string[];
}) {
  return (
    <div className={`e-field-group col-${col}`}>
      <label className="e-field-label" htmlFor={name}>
        {label}
      </label>
      <div className="e-select-wrap">
        <select className="e-field e-select" id={name} name={name}>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function EnRequestForm() {
  const [step, setStep] = useState(1);
  const [sent, setSent] = useState(false);
  if (sent)
    return (
      <p className="form-card-sub" role="status">
        Your request has been sent. Thank you!
      </p>
    );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      {step === 1 && (
        <div className="e-form-fields">
          <EnSelectField
            label="Who are the tefillin for?"
            col={50}
            name="target"
            options={["a soldier", "Bar Mitzvah", "getting stronger", "Other"]}
          />
          <EnSelectField label="writing by hand" col={50} name="hand" options={["right", "left"]} />
          <EnSelectField
            label="Delivery method"
            col={100}
            name="delivery"
            options={["I can come pick up the tefillin", "Request delivery (extra charge)"]}
          />
          <div className="e-field-group col-100">
            <div className="e-form-buttons">
              <button type="button" className="e-btn-step" onClick={() => setStep(2)}>
                next
              </button>
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="e-form-fields">
          <EnField label="First name" col={50} name="first" />
          <EnField label="Last Name" col={50} name="last" />
          <EnField label="Delivery address" col={60} name="address" />
          <EnField label="city/town" col={40} name="city" />
          <div className="e-field-group col-100">
            <div className="e-form-buttons">
              <button type="button" className="e-btn-step e-btn-prev" onClick={() => setStep(1)}>
                previous
              </button>
              <button type="button" className="e-btn-step" onClick={() => setStep(3)}>
                next
              </button>
            </div>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="e-form-fields">
          <EnField label="phone" col={40} type="tel" name="phone" required />
          <EnField label="Email" col={60} type="email" name="email" required />
          <div className="e-field-group col-100">
            <p className="e-form-note">{EN_NOTE}</p>
          </div>
          <div className="e-field-group col-100">
            <div className="e-form-buttons">
              <button type="button" className="e-btn-step e-btn-prev" onClick={() => setStep(2)}>
                previous
              </button>
              <button type="submit" className="e-btn-step">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

function EnDonateForm() {
  const [step, setStep] = useState(1);
  const [sent, setSent] = useState(false);
  if (sent)
    return (
      <p className="form-card-sub" role="status">
        Your form has been sent. Thank you!
      </p>
    );
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
          <EnField label="full name" col={100} name="name" />
          <EnField label="address for pick up" col={60} name="pickup" />
          <EnSelectField
            label="condition of the tefillin"
            col={40}
            name="condition"
            options={["New", "Used", "Damaged/very old"]}
          />
          <div className="e-field-group col-100">
            <div className="e-form-buttons">
              <button type="button" className="e-btn-step" onClick={() => setStep(2)}>
                next
              </button>
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="e-form-fields">
          <EnField label="Email" col={60} type="email" name="email" required />
          <EnField label="phone" col={40} type="tel" name="phone" required />
          <EnField label="Want to add a dedication?" col={100} name="dedication" />
          <div className="e-field-group col-100">
            <p className="e-form-note">{EN_NOTE}</p>
          </div>
          <div className="e-field-group col-100">
            <div className="e-form-buttons">
              <button type="button" className="e-btn-step e-btn-prev" onClick={() => setStep(1)}>
                previous
              </button>
              <button type="submit" className="e-btn-step">
                send
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

function EnFormTabs() {
  const [tab, setTab] = useState<"request" | "donate">("request");
  return (
    <section id="form" dir="ltr" className="forms-e">
      <div className="form-tabs-heading" role="tablist" aria-label="Forms">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "request"}
          className="form-tab"
          onClick={() => setTab("request")}
        >
          Request for Tefillin
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "donate"}
          className="form-tab"
          onClick={() => setTab("donate")}
        >
          Request to Donate Tefillin
        </button>
      </div>

      {tab === "request" && (
        <div role="tabpanel" className="form-card">
          <EnRequestForm />
        </div>
      )}
      {tab === "donate" && (
        <div role="tabpanel" className="form-card">
          <EnDonateForm />
        </div>
      )}
    </section>
  );
}

/* ============================================================
 * Interview (LTR)
 * ============================================================ */
function EnInterview() {
  return (
    <section dir="ltr" className="iv-e">
      <div className="iv-video-col">
        <p className="iv-intro">
          Watch the interview of Rabbi Amichai Eyal presenting the "Kesher Shel Tefillin" (Tefillin Tie Initiatve) project:
        </p>
        <div className="iv-video">
          <iframe
            src="https://www.youtube.com/embed/qZQoZjFso2I"
            title="Rabbi Amichai Eyal presenting the Kesher Shel Tefillin project"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
      <div className="iv-cards-col">
        <a href="/en/rabbis-agreements" className="iv-card" style={{ backgroundColor: "#2D2E83" }}>
          <span className="iv-card-overlay" aria-hidden="true" />
          <span className="iv-card-img">
            <img
              src="/wp/img/מכתב-הסכמה-מהרב-זילברשטיין-212x300.webp"
              alt="Rabbis agreements"
              loading="lazy"
            />
          </span>
          <h2 className="iv-card-title">Rabbis agreements</h2>
        </a>
        <a href="/en/thank-you-letters" className="iv-card" style={{ backgroundColor: "#009FE3" }}>
          <span className="iv-card-overlay" aria-hidden="true" />
          <span className="iv-card-img">
            <img
              src="/wp/img/-תודה-אמא-לחייל-e1712736869916-218x300.webp"
              alt="Thank you letters"
              loading="lazy"
            />
          </span>
          <h2 className="iv-card-title">Thank you letters</h2>
        </a>
      </div>
    </section>
  );
}

/* ============================================================
 * Stories (LTR) — no press column
 * ============================================================ */
const enStories = [
  {
    title: "DIVINE PROVIDENCE IN KIBBUTZ NIR OZ",
    href: "https://tefilin.or-hadash.org.il/en/tefilin/divine-providence-in-kibbutz-nir-oz/",
    img: "/wp/uploads/2024/05/Nir_Oz_-_01.jpg",
  },
  {
    title: "AFTER FOUR MIRACLES, G-D LEFT HIM NO CHOICE",
    href: "https://tefilin.or-hadash.org.il/en/tefilin/after-four-miracles-g-d-left-him-no-choice/",
    img: "/wp/uploads/2024/04/נובה.jpg",
  },
  {
    title: "PARENTS TO THE RESCUE",
    href: "https://tefilin.or-hadash.org.il/en/tefilin/parents-to-the-rescue/",
    img: "/wp/uploads/2024/01/תפילין-1-חתוך-min-1.webp",
  },
  {
    title: "THE COOPERATIVE FATHER – TO A POINT",
    href: "https://tefilin.or-hadash.org.il/en/tefilin/the-cooperative-father-to-a-point/",
    img: "/wp/img/7-225x300-1.png",
  },
  {
    title: "THE WHISPERED REQUEST",
    href: "https://tefilin.or-hadash.org.il/en/tefilin/the-whispered-request/",
    img: "/wp/assets/tallit-tefillin-white-background-min.webp",
  },
];

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 448 512" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M313.941 216H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12h301.941v46.059c0 21.382 25.851 32.09 40.971 16.971l86.059-86.059c9.373-9.373 9.373-24.569 0-33.941l-86.059-86.059c-15.119-15.119-40.971-4.411-40.971 16.971V216z" />
    </svg>
  );
}

function EnStories() {
  return (
    <section dir="ltr" className="st-e">
      <div className="st-wrap">
        <div className="st-main">
          <div className="st-head">
            <h2 className="st-title">The Stories</h2>
            <div className="st-subrow">
              <h2 className="st-subtitle">Behind the Tefillin</h2>
              <a href="/stories" className="st-all-btn">
                <span>For all the stories</span>
                <ArrowRightIcon />
              </a>
            </div>
          </div>
          <div className="st-grid">
            {enStories.map((s, i) => (
              <a
                key={i}
                href={s.href}
                className={i === 0 ? "st-card st-card-big" : "st-card"}
                style={{ backgroundImage: `url('${s.img}')` }}
              >
                <span className="st-card-panel">
                  <h3 className="st-card-title">{s.title}</h3>
                </span>
              </a>
            ))}
          </div>
        </div>
        <aside className="press-col">
          <h2 className="press-title">In the Media</h2>
          {enPress.map((p, i) => (
            <a key={i} href={p.href} target="_blank" rel="noopener" className="press-item">
              {p.img ? (
                <span
                  className="press-item-logo"
                  style={{ backgroundImage: `url('${p.img}')` }}
                />
              ) : (
                <span
                  className="press-item-logo"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#060633",
                    color: "#fff",
                    fontFamily: "\"Maadim\", \"Maadim OS\", sans-serif",
                    fontWeight: 700,
                    fontSize: 14,
                    letterSpacing: 1,
                  }}
                >
                  {p.logoText}
                </span>
              )}
              <span className="press-item-body">
                <span className="press-item-title">{p.title}</span>
                <span className="press-item-meta">
                  <b>{p.source}</b>
                  <span>{p.date}</span>
                </span>
              </span>
            </a>
          ))}
        </aside>
      </div>
    </section>
  );
}


/* ============================================================
 * In the Media (LTR)
 * ============================================================ */
type EnPressItem = {
  title: string;
  source: string;
  date: string;
  href: string;
  img?: string;
  logoText?: string;
};

const enPress: EnPressItem[] = [
  {
    title: "How Hamas Brought Jews Back to Judaism",
    source: "HAMODIA",
    date: "27/10/2024",
    href: "https://tefilin.or-hadash.org.il/wp-content/uploads/2024/10/DOC-20241014-WA0012..pdf",
    logoText: "HAMODIA",
  },
  {
    title: "“כתבה בעיתון בשבע “מהדקים את הקשר",
    source: "עיתון ב7",
    date: "16/08/2024",
    href: "https://www.inn.co.il/news/646944",
    img: "/wp/uploads/2024/09/ערוץ-7-1.jpg",
  },
  {
    title: "strapper together",
    source: "Mishpacha Magazine",
    date: "MARCH 5, 2024",
    href: "https://mishpacha.com/strapped-together/",
    img: "/wp/uploads/2024/05/לוגו-עיתון-משפחה-עברית.webp",
  },
  {
    title: "Uniting the Jewish People through the mitzva of tefillin",
    source: "7Israel National News",
    date: "Jun 17, 2024, 12:00",
    href: "https://www.israelnationalnews.com/news/388053",
    img: "/wp/uploads/2024/09/ערוץ-7-1.jpg",
  },
];




/* ============================================================
 * About (LTR)
 * ============================================================ */
function EnAbout() {
  return (
    <section dir="ltr" className="about-e">
      <div className="about-imgs">
        <div className="about-photo about-photo-top">
          <div className="about-photo-inner">
            <img src="/wp/img/פתח-תקוה.jpg" alt="" loading="lazy" />
          </div>
        </div>
        <div className="about-bigblock" aria-hidden="true">
          <span className="about-bigblock-overlay" />
        </div>
        <div className="about-photo about-photo-bottom">
          <div className="about-photo-inner2">
            <img src="/wp/assets/קשת-9-min-e1706093310964.webp" alt="" loading="lazy" />
          </div>
        </div>
      </div>
      <div className="about-text">
        <h2 className="e-h2-navy">Kesher Shel Tefillin - The Tefillin Tie Initiative</h2>
        <p className="e-body-navy">
          The goal of the <b>Tefillin Tie Initiative</b> is to connect between one who wishes to
          begin donning Tefillin, and one who is in possession of Tefillin that are not being
          used. Via this initiative, both of them merit something important: The recipient of the
          Tefillin merits to fulfill this important mitzvah, and the donor merits to have his
          Tefillin in use every day.
        </p>
      </div>
    </section>
  );
}

/* ============================================================
 * How Does It Work (LTR)
 * ============================================================ */
const enSteps = [
  {
    title: "Pick-up",
    text: "The Tefillin are picked up from the donor's home, or the donor brings them to the collection point.",
  },
  {
    title: "Checking",
    text: "The Tefillin passages, written on parchment in special writing and with a special quill, are proofread and corrected, in the most stringent Tefillin laboratories.",
  },
  {
    title: "Fixing",
    text: "The Tefillin boxes (known as batim) are renewed, or, if this is not possible, actually replaced with new ones. The straps are also replaced, and new box-cases are also provided, in accordance with the preferences of the person requesting the Tefillin.",
  },
  {
    title: "Delivery",
    text: "The Tefillin are delivered straight to the home of the person who wishes to don them, or to a pick-up point, as agreed in advance.",
  },
];

const enSlides = [
  "/wp/uploads/2024/01/תמונה-של-WhatsApp‏-2024-01-28-בשעה-13.38.37_c078ad2d.jpg",
  "/wp/uploads/2024/01/קשת-1-min.webp",
  "/wp/uploads/2024/01/תמונה-של-WhatsApp‏-2024-01-22-בשעה-17.46.08_77e1df03.jpg",
];

function EnHowItWorks() {
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % enSlides.length), 2500);
    return () => clearInterval(t);
  }, []);
  return (
    <section dir="ltr" className="how-e">
      <div className="how-steps">
        <h2 className="e-h2-navy how-center">How Does it Work?</h2>
        {enSteps.map((s, i) => (
          <div key={s.title} className="how-step">
            <h3 className="how-step-title">{s.title}</h3>
            <p className="how-step-text">{s.text}</p>
            {i < enSteps.length - 1 && (
              <img src="/wp/img/חוצץ-משולש.png" alt="" className="how-divider" loading="lazy" />
            )}
          </div>
        ))}
      </div>
      <div className="how-visual">
        <div className="how-slideshow">
          {enSlides.map((src, i) => (
            <span
              key={src}
              className={`how-slide ${i === slide ? "on" : ""}`}
              style={{ backgroundImage: `url('${src}')` }}
            />
          ))}
          <span className="how-slideshow-overlay" aria-hidden="true" />
        </div>
        <div className="how-ba">
          <figure className="how-ba-before">
            <img src="/wp/img/לפני-1-min.webp" alt="Before" loading="lazy" />
            <figcaption>Before</figcaption>
          </figure>
          <figure className="how-ba-after">
            <img src="/wp/img/אחרי-1-min.webp" alt="after" loading="lazy" />
            <figcaption>after</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
 * About the Tefillin (LTR)
 * ============================================================ */
function EnAboutMitzva() {
  return (
    <section dir="ltr" className="mitzva-e">
      <div className="mitzva-text">
        <h2 className="e-h2-navy">About the Tefillin</h2>
        <p className="e-body-navy">
          Tefillin contain four Torah passages that include the most basic tenets of our faith.
          Most famous among them are Shma Yisrael ("Hear O Israel, the Lord is our G-d, the Lord
          is One") and V'ahavta ("You shall love the Lord your G-d with all your heart, all your
          soul, and all your might…"). The blessed Creator commanded us to place one Tefillin box
          on our head, corresponding to the brain and intelligence, and the second Tefillin box
          on our arm, corresponding to the heart. Mind and heart are the two primary organs that
          sustain our body and soul, and placing the Tefillin there ensures that our entire lives
          are based on faith in G-d. Wearing Tefillin thus helps us accept upon ourselves the
          yoke of the Kingdom of Heaven.
        </p>
        <p className="e-body-navy">
          This is why the mitzvah of Tefillin is one of the only three that the Torah calls a
          "sign" – the other two are Shabbat and circumcision – because it connects a Jew to his
          faith in G-d as well as to the Torah and all its mitzvot.
        </p>
        <a href="/request" className="e-btn-white">
          Request for Tefillin
        </a>
      </div>
      <div className="mitzva-img">
        <img src="/wp/img/תפילין-4-חתוך-min-1.webp" alt="Tefillin" loading="lazy" />
      </div>
    </section>
  );
}

/* ============================================================
 * Mi Kamcha (LTR)
 * ============================================================ */
function EnMiKamcha() {
  return (
    <section dir="ltr" className="mikamcha-e">
      <div className="mikamcha-img">
        <img src="/wp/img/כותל.jpg" alt="The Western Wall" loading="lazy" />
      </div>
      <div className="mikamcha-text">
        <h2 className="e-h2-navy">Who is Like Your Nation Israel?</h2>
        <p className="e-body-navy">
          The Talmud teaches, allegorically, that G-d Himself also dons Tefillin, in which is
          written this verse: "Who is like Your Nation Israel, one people in the land." From here
          we learn that the mitzvah of Tefillin represents the concept of unity within Israel:{" "}
          <b>"One people</b> in the land." Tefillin can connect between one Jew and another, and
          bring about the fulfillment of mutual responsibility as one person benefits another.
        </p>
        <p className="e-body-navy">
          What a great privilege it is to donate Tefillin for another Jew to use and thus fulfill
          this mitzvah! By bringing benefit and merit to another Jew, he is helping to manifest
          Jewish unity, and thus "writing," so to speak, the Tefillin of the Master of the World.
        </p>
        <a href="/give" className="e-btn-white">
          Request to Donate Tefillin
        </a>
      </div>
    </section>
  );
}

/* ============================================================
 * Contributions (LTR)
 * ============================================================ */
function EnContributions() {
  return (
    <section dir="ltr" className="partners-e">
      <span className="partners-overlay" aria-hidden="true" />
      <div className="partners-inner">
        <h2 className="partners-title">Contributions</h2>
        <p className="partners-text">
          <b>Be a Partner with Us!</b> <b>Your partnership is important to us!</b> The costs of
          the Tefillin Tie Initiative are quite substantial, and the project exists thanks to the
          help of our many partners in this unprecedented method of benefiting the community. We
          call upon you to donate now, giving you the merit of enabling another Jew to don
          tefillin!
        </p>
        <p className="partners-note">— Donations are tax-deductible in Israel, the U.S., and Canada. —</p>
        <div className="partners-btns">
          <a href="https://bit.ly/tfil" target="_blank" rel="noopener" className="btn-e btn-outline-light">
            Donate
          </a>
          <a href="https://bit.ly/tfil" target="_blank" rel="noopener" className="btn-e btn-mint-solid">
            Donate
          </a>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
 * Founder (LTR)
 * ============================================================ */
function EnFounder() {
  return (
    <section dir="ltr" className="founder-e">
      <div className="founder-photo">
        <img src="/wp/img/עמיחי-פרופיל-ערוך-min.webp" alt="Rabbi Amichai Eyal" loading="lazy" />
      </div>
      <div className="founder-body">
        <h3 className="founder-role">The Founder and Chairman of the "Ohr Chadash" Organization</h3>
        <h2 className="founder-name">Rabbi Amichai Eyal</h2>
        <p className="founder-text">
          Rabbi Eyal is a resident of Beit El, aged 48, married and the father of eight children.
          He served as a Ra"m [rabbi/teacher] in Yeshivat Bnei Tzvi and in other yeshivot, and
          has an M.A. degree in Educational Systems Administration. In addition to studying
          Torah, Rabbi Eyal directed the Nehora returnee organization and has been involved in
          running projects for returnees-to-Torah in various frameworks for over 20 years.{" "}
          <b>He is the founder, chairman and administrator of the Tefillin Tie Initiative.</b>
        </p>
        <a
          href="https://api.whatsapp.com/send?phone=972546713966"
          target="_blank"
          rel="noopener"
          className="e-btn-white"
        >
          <svg viewBox="0 0 448 512" width="16" height="16" fill="currentColor" aria-hidden="true">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
          </svg>
          contact us
        </a>
      </div>
    </section>
  );
}

/* ============================================================
 * FAQ (LTR)
 * ============================================================ */
const enFaqs = [
  {
    q: "What precisely do you do, and what is the goal of the project?",
    a: 'The Tefillin project of Ohr Chadash receives many requests from Jews who are beginning to strengthen themselves in observing Torah and mitzvot, yet do not have a pair of Tefillin. They cannot afford the thousands of shekels that a new set costs, but very much want to own their own Tefillin so that they can don them every day. At the same time, other people turn to us with their old, unused Tefillin, which we then renew step-by-step, as follows: 1. Checking the parchment passages, the boxes, and the straps. 2. Proofreading and correcting the passages. 3. Renovating and renewing the boxes. 4. Inserting the passages, and painting the boxes (black). 5. Replacing the straps if necessary. The entire process is carried out by expert, professional, G-d-fearing scribes and artisans with many years of experience in the field. The renewed Tefillin are then given to people from all over the country, of all ages, who wish to start putting on Tefillin daily, yet don\'t have their own. Our objective is thus two-fold: To enable more Jews to have the privilege and merit of fulfilling the mitzvah of Tefillin, and to "redeem" old pairs of Tefillin laying unused in a closet or attic.',
  },
  {
    q: "To whom have you given Tefillin, could you give an example?",
    a: 'Sure! You can read, in our "Stories" section, about people who have received Tefillin from us over the last few months, including how they came to the decision to start wearing Tefillin and other details. Recipients include IDF soldiers, men who wish to strengthen their Torah observance, Bar Mitzvah boys, the elderly, and more.',
  },
  {
    q: "Do all the pairs of Tefillin that you receive end up being used?",
    a: "As stated, every pair of Tefillin that we receive is checked by an expert Scribe for Halakhic acceptability in all its detail. In many cases, the Tefillin are already kosher, but have to be fixed and improved. In other cases, the boxes are kosher while the passages are not, or vice-versa. Working correctly, it is sometimes possible to take the kosher passages from an otherwise-unkosher set and place them in the kosher boxes of another pair, so that we end up with Tefillin of high-quality kashrut. As such, even if we receive a non-kosher pair of Tefillin, it can often be renewed and rendered kosher, or parts of it can be used for another set. There are, of course, a few pairs that we receive that, sadly, cannot be fixed, renewed, or used in any way.",
  },
  {
    q: "How much does it cost?",
    a: "The costs of running an enterprise involving so many steps – finding and receiving the Tefillin, checking and renewing the various parts of the Tefillin, and distributing them – are significant. A person who requests and receives from us a high-quality, revamped pair of Tefillin is asked to pay the costs of the work, generally totaling about a quarter, or less, of the price of a new pair of Tefillin. In some cases, when the person cannot afford even this amount, he is afforded the option of paying in installments – and if even that is beyond his ability to pay, he is given the Tefillin at no charge.",
  },
  {
    q: "I have a pair of Tefillin from my late grandfather, but it is hard for me to give them to someone else.",
    a: "It is totally understandable and natural to feel a strong sentimental attachment to the Tefillin that your grandfather of blessed memory used to wear. On second thought, however, if these Tefillin can be used to help another Jew who will then fulfill the mitzvah of wearing Tefillin every day, would this not be a wonderful merit for your late grandfather and for the elevation of his soul? Would your grandfather, who wore these Tefillin daily, not want them to continue to be worn and used for the fulfillment of such an important mitzvah, instead of having them simply lay in a closet…? And of course, you too will gain a great merit, in helping another Jew to wear Tefillin.",
  },
  {
    q: "I have a pair of Tefillin at home, but I don't know if they are kosher — can this help?",
    a: "The Tefillin will have to undergo a thorough examination, and only then can we know if the set is kosher or if it can be brought to a state of high-quality kashrut. However, you can contact us to receive a general idea of the quality of the Tefillin even before we actually examine them.",
  },
  {
    q: "I don't have Tefillin to give, but I want to take part in the mitzvah.",
    a: "Sincere kudos to you! You are privileged to want to take part in such an important mitzvah for the sake of other Jews! You can participate by donating to the Tefillin Tie Initiative of Or Chadash via the link below.",
  },
  {
    q: "Why Tefillin, of all the mitzvot?",
    a: 'Within each of the two Tefillin boxes are four Torah passages that include verses of the most basic tenets of our faith. Most famous among them are Shma Yisrael ("Hear O Israel, the Lord is our G-d, the Lord is One") and V\'ahavta ("You shall love the Lord your G-d with all your heart, all your soul, and all your might…"). G-d commanded us to place Tefillin on our head, corresponding to the brain and intelligence, and also on our arm, corresponding to the heart. Mind and heart are the two primary organs that give life to our body and soul, and placing the Tefillin there ensures that our entire lives are connected to and based on faith in G-d. The mitzvah of donning Tefillin, therefore, is unparalleled in helping us connect to a life of Torah and mitzvot. The Talmud teaches, allegorically, that G-d Himself wears Tefillin. R. Nachman bar Yitzchak is recorded as asking, "What is written in G-d\'s Tefillin?" R. Chiya bar Avin answers that written there is the verse, "Who is like Your Nation Israel, one people in the land." From here we learn two fundamental concepts: First, we see how great is the mitzvah of Tefillin, in that G-d Himself also fulfills it, so to speak – something that we do not find with other mitzvot. Second, we learn the connection between Tefillin and the idea of Jewish unity, for the verse in G-d\'s Tefillin emphasizes "One people in the land." There is nothing like this mitzvah to connect, via the Tefillin Tie, between one Jew and another, and effect our mutual national responsibility with one Jew benefiting another. What a great privilege it is to donate Tefillin so that another Jew can fulfill this mitzvah! By bringing benefit and merit to another Jew, we help manifest Jewish unity, and thus write, so to speak, the very Tefillin of the Master of the World.',
  },
];

function EnFaq() {
  return (
    <section dir="ltr" className="faq-e">
      <h2 className="faq-title-sm">Have a</h2>
      <h2 className="faq-title-lg">Question?</h2>
      <div className="faq-list">
        {enFaqs.map((f) => (
          <details key={f.q} className="faq-item">
            <summary className="faq-q">{f.q}</summary>
            <div className="faq-a">
              <p>{f.a}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
 * Services (LTR)
 * ============================================================ */
const WA_LINK =
  "https://wa.me/972546713966?text=%D7%A9%D7%9C%D7%95%D7%9D%20%D7%A2%D7%9E%D7%99%D7%97%D7%99";

const enServices = [
  {
    title: "Tefillin Gmach",
    more: "More info >>",
    img: "/wp/assets/tallit-tefillin-white-background-min.webp",
    height: 250,
    back:
      "Would you like to found a Tefillin Gmach, or improve an existing one, in your synagogue or community? [A Tefillin Gmach is a system by which one can borrow Tefillin for a day or more.] If so, we have some pointers and tips that are important to know. We will be happy to help you establish or renew such a Gmach, from A to Z, based on our experience in many communities.",
    href: WA_LINK,
    btn: "Contact us",
  },
  {
    title: "fascinating talk on Tefillin",
    more: "More info >>",
    img: "/wp/assets/הרצאה.jpg",
    height: 300,
    back:
      "Want to hear a fascinating talk on Tefillin, accompanied by authentic Tefillin artifacts, for an upcoming Bar Mitzvah, or just to get to know what this mitzah is all about? Perhaps you want to hear what you need to know when buying a first pair of Tefillin? Contact us and we'll be glad to schedule you in for a talk with one of our Tefillin experts!",
    href: WA_LINK,
    btn: "contact us",
  },
  {
    title: "שו\"ת תפילין",
    more: "קרא עוד >>",
    img: "/wp/assets/tallit-tefillin-white-background-min.webp",
    height: 250,
    back: "",
    backTitle: "בקרוב",
    href: "",
    btn: "",
  },
];

function EnServices() {
  return (
    <section dir="ltr" className="svc-e">
      <h2 className="e-h2-navy svc-title">What Else Do We Offer?</h2>
      <div className="svc-row">
        {enServices.map((s) => (
          <div key={s.title} className="svc-flip" style={{ height: s.height }}>
            <div className="svc-flip-inner">
              <div className="svc-front" style={{ backgroundImage: `url('${s.img}')` }}>
                <div className="svc-front-overlay">
                  <h3 className="svc-front-title">{s.title}</h3>
                  <p className="svc-front-more">{s.more}</p>
                </div>
              </div>
              <div className="svc-back">
                {s.backTitle && <h3 className="svc-back-title">{s.backTitle}</h3>}
                {s.back && <p className="svc-back-text">{s.back}</p>}
                {s.href && (
                  <a href={s.href} target="_blank" rel="noopener" className="svc-back-btn">
                    {s.btn}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="svc-shape" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none">
          <path d="M500,97C126.7,96.3,0.8,19.8,0,0v100l1000,0V1C1000,19.4,873.3,97.8,500,97z" />
        </svg>
      </div>
    </section>
  );
}

/* ============================================================
 * PAGE
 * ============================================================ */
function EnPage() {
  return (
    <div dir="ltr" lang="en" className="min-h-screen bg-background en-ltr">
      <Header en />
      <main>
        <EnHero />
        <EnFormTabs />
        <EnInterview />
        <EnStories />

        <EnAbout />
        <EnHowItWorks />
        <EnAboutMitzva />
        <EnMiKamcha />
        <EnContributions />
        <EnFounder />
        <EnFaq />
        <EnServices />
      </main>
      <Footer />
    </div>
  );
}
