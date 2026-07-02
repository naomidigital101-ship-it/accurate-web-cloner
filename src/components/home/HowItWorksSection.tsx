import { useEffect, useState } from "react";

const steps = [
  { title: "אוספים", text: "אוספים את התפילין מבית התורם או על ידי הבאת התפילין לנקודת איסוף." },
  { title: "בודקים", text: "ומגיהים את פרשיות התפילין שנאספו, במכוני הסת\"ם המחמירים ביותר." },
  { title: "מחדשים", text: "את הבתים, או מחליפים את הישנים בחדשים, וכן מחליפים רצועות וקופסאות חדשות. הכל בהתאמה אישית למבקש התפילין." },
  { title: "מחלקים", text: "את התפלין, ומביאים עד לבית המבקש, או לנקודת החלוקה, בתיאום מראש." },
];

const slides = [
  "https://tefilin.or-hadash.org.il/wp-content/uploads/2024/01/%D7%AA%D7%9E%D7%95%D7%A0%D7%94-%D7%A9%D7%9C-WhatsApp%E2%80%8F-2024-01-28-%D7%91%D7%A9%D7%A2%D7%94-13.38.37_c078ad2d.jpg",
  "https://tefilin.or-hadash.org.il/wp-content/uploads/2024/01/%D7%A7%D7%A9%D7%AA-1-min.webp",
  "https://tefilin.or-hadash.org.il/wp-content/uploads/2024/01/%D7%AA%D7%9E%D7%95%D7%A0%D7%94-%D7%A9%D7%9C-WhatsApp%E2%80%8F-2024-01-22-%D7%91%D7%A9%D7%A2%D7%94-17.46.08_77e1df03.jpg",
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
