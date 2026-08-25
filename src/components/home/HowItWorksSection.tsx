import { useEffect, useRef, useState } from "react";

const steps = [
  {
    title: "אוספים",
    text: "אוספים את התפילין מבית התורם או על ידי הבאת התפילין לנקודת איסוף.",
    img: "/wp/img/AdobeStock_229166376-min.webp",
  },
  {
    title: "בודקים",
    text: "ומגיהים את פרשיות התפילין שנאספו, במכוני הסת\"ם המחמירים ביותר.",
    img: "/wp/uploads/2024/01/%D7%A7%D7%A9%D7%AA-1-min.webp",
  },
  {
    title: "מחדשים",
    text: "את הבתים, או מחליפים את הישנים בחדשים, וכן מחליפים רצועות וקופסאות חדשות. הכל בהתאמה אישית למבקש התפילין.",
    img: "/wp/img/AdobeStock_93382125-min.webp",
  },
  {
    title: "מחלקים",
    text: "את התפלין, ומביאים עד לבית המבקש, או לנקודת החלוקה, בתיאום מראש.",
    img: "/wp/img/cropped-hand-wrapped-tefillin-min.webp",
  },
];

export function HowItWorksSection() {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const nodes = stepRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!nodes.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = nodes.indexOf(e.target as HTMLDivElement);
            if (i >= 0) setActive(i);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <section dir="rtl" className="how-e">
      <div className="how-steps">
        <h2 className="e-h2-navy how-center">איך זה מתבצע?</h2>
        {steps.map((s, i) => (
          <div
            key={s.title}
            className={`how-step ${i === active ? "on" : ""}`}
            ref={(el) => {
              stepRefs.current[i] = el;
            }}
          >
            <h2 className="how-step-title">{s.title}</h2>
            <p className="how-step-text">{s.text}</p>
            {i < steps.length - 1 && (
              <img src="/wp/img/חוצץ-משולש.png" alt="" className="how-divider" loading="lazy" decoding="async" width="229" height="50" />
            )}
          </div>
        ))}
      </div>
      <div className="how-visual">
        <div className="how-panel">
          <div className="how-slideshow">
            {steps.map((s, i) => (
              <span
                key={s.img}
                className={`how-slide ${i === active ? "on" : ""}`}
                style={{ backgroundImage: `url('${s.img}')` }}
              />
            ))}
            <span className="how-slideshow-overlay" aria-hidden="true" />
            <span className="how-arrow" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="62" height="75" viewBox="0 0 62 75" fill="none"><path d="M45.6391 74.4042C46.4201 75.1852 47.6865 75.1852 48.4675 74.4042L61.1954 61.6763C61.9765 60.8952 61.9765 59.6289 61.1954 58.8478C60.4144 58.0668 59.1481 58.0668 58.367 58.8478L47.0533 70.1616L35.7396 58.8478C34.9586 58.0668 33.6922 58.0668 32.9112 58.8478C32.1301 59.6289 32.1301 60.8952 32.9112 61.6763L45.6391 74.4042ZM0.797441 4.78474C8.62726 3.2312 19.5576 4.56039 28.5715 13.8905C37.6314 23.2681 45.0533 41.0337 45.0533 72.99H49.0533C49.0533 40.5202 41.5249 21.5412 31.4483 11.1112C21.3258 0.633736 8.93354 -0.907545 0.0189654 0.86122L0.797441 4.78474Z" fill="white"/></svg>
            </span>
          </div>
          <div className="how-ba">
            <figure className="how-ba-before">
              <img src={encodeURI("/wp/img/לפני-1-min-225x300.webp")} alt="תפילין לפני חידוש" loading="lazy" decoding="async" />
              <figcaption>לפני</figcaption>
            </figure>
            <figure className="how-ba-after">
              <img src={encodeURI("/wp/img/אחרי-1-min-225x300.webp")} alt="תפילין אחרי חידוש" loading="lazy" decoding="async" />
              <figcaption>אחרי</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
