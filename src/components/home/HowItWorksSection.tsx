import { useEffect, useState } from "react";

const steps = [
  { title: "אוספים", text: "אוספים את התפילין מבית התורם או על ידי הבאת התפילין לנקודת איסוף." },
  { title: "בודקים", text: "ומגיהים את פרשיות התפילין שנאספו, במכוני הסת\"ם המחמירים ביותר." },
  { title: "מחדשים", text: "את הבתים, או מחליפים את הישנים בחדשים, וכן מחליפים רצועות וקופסאות חדשות. הכל בהתאמה אישית למבקש התפילין." },
  { title: "מחלקים", text: "את התפלין, ומביאים עד לבית המבקש, או לנקודת החלוקה, בתיאום מראש." },
];

const slides = [
  "/wp/uploads/2024/01/%D7%AA%D7%9E%D7%95%D7%A0%D7%94-%D7%A9%D7%9C-WhatsApp%E2%80%8F-2024-01-28-%D7%91%D7%A9%D7%A2%D7%94-13.38.37_c078ad2d.jpg",
  "/wp/uploads/2024/01/%D7%A7%D7%A9%D7%AA-1-min.webp",
  "/wp/uploads/2024/01/%D7%AA%D7%9E%D7%95%D7%A0%D7%94-%D7%A9%D7%9C-WhatsApp%E2%80%8F-2024-01-22-%D7%91%D7%A9%D7%A2%D7%94-17.46.08_77e1df03.jpg",
];

export function HowItWorksSection() {
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 2500);
    return () => clearInterval(t);
  }, []);
  return (
    <section dir="rtl" className="how-e">
      <div className="how-steps">
        <h2 className="e-h2-navy how-center">איך זה מתבצע?</h2>
        {steps.map((s, i) => (
          <div key={s.title} className="how-step">
            <h3 className="how-step-title">{s.title}</h3>
            <p className="how-step-text">{s.text}</p>
            {i < steps.length - 1 && (
              <img src="/wp/img/חוצץ-משולש.png" alt="" className="how-divider" loading="lazy" />
            )}
          </div>
        ))}
      </div>
      <div className="how-visual">
        <div className="how-slideshow">
          {slides.map((src, i) => (
            <span
              key={src}
              className={`how-slide ${i === slide ? "on" : ""}`}
              style={{ backgroundImage: `url('${src}')` }}
            />
          ))}
          <span className="how-slideshow-overlay" aria-hidden="true" />
          <span className="how-arrow" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="62" height="75" viewBox="0 0 62 75" fill="none"><path d="M45.6391 74.4042C46.4201 75.1852 47.6865 75.1852 48.4675 74.4042L61.1954 61.6763C61.9765 60.8952 61.9765 59.6289 61.1954 58.8478C60.4144 58.0668 59.1481 58.0668 58.367 58.8478L47.0533 70.1616L35.7396 58.8478C34.9586 58.0668 33.6922 58.0668 32.9112 58.8478C32.1301 59.6289 32.1301 60.8952 32.9112 61.6763L45.6391 74.4042ZM0.797441 4.78474C8.62726 3.2312 19.5576 4.56039 28.5715 13.8905C37.6314 23.2681 45.0533 41.0337 45.0533 72.99H49.0533C49.0533 40.5202 41.5249 21.5412 31.4483 11.1112C21.3258 0.633736 8.93354 -0.907545 0.0189654 0.86122L0.797441 4.78474Z" fill="white"/></svg>
          </span>
        </div>
        <div className="how-ba">
          <figure className="how-ba-before">
            <img src="/wp/img/לפני-1-min.webp" alt="לפני" loading="lazy" />
            <figcaption>לפני</figcaption>
          </figure>
          <figure className="how-ba-after">
            <img src="/wp/img/אחרי-1-min.webp" alt="אחרי" loading="lazy" />
            <figcaption>אחרי</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
