import { ChevronDown } from "lucide-react";

const steps = [
  {
    title: "אוספים",
    text: "אוספים את התפילין מבית התורם או על ידי הבאת התפילין לנקודת איסוף.",
    img: "https://tefilin.or-hadash.org.il/wp-content/uploads/2024/01/cropped-hand-wrapped-tefillin-min.webp",
  },
  {
    title: "בודקים",
    text: 'ומגיהים את פרשיות התפילין שנאספו, במכוני הסת"ם המחמירים ביותר.',
    img: "https://tefilin.or-hadash.org.il/wp-content/uploads/2024/01/AdobeStock_93382125-min.webp",
  },
  {
    title: "מחדשים",
    text: "את הבתים, או מחליפים את הישנים בחדשים, וכן מחליפים רצועות וקופסאות חדשות. הכל בהתאמה אישית למבקש התפילין.",
    img: "https://tefilin.or-hadash.org.il/wp-content/uploads/2024/01/midsection-woman-with-tape-rolled-hand-holding-book-min.webp",
  },
  {
    title: "מחלקים",
    text: "את התפילין, ומביאים עד לבית המבקש, או לנקודת החלוקה, בתיאום מראש.",
    img: "https://tefilin.or-hadash.org.il/wp-content/uploads/2025/08/unfocused-people-walking-min.webp",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how" className="py-20 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display font-black text-4xl md:text-5xl text-ink text-center mb-14">
          איך זה מתבצע?
        </h2>

        <div className="space-y-10">
          {steps.map((s, i) => (
            <div key={s.title}>
              <div className={`grid md:grid-cols-2 gap-8 items-center ${i % 2 ? "md:[direction:ltr]" : ""}`}>
                <div className="rounded-3xl overflow-hidden shadow-card aspect-[4/3]">
                  <img src={s.img} alt={s.title} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <div className="text-center md:text-right [direction:rtl]">
                  <h3 className="font-display font-black text-3xl md:text-4xl text-teal-deep">{s.title}</h3>
                  <p className="mt-3 text-ink/80 text-lg leading-relaxed max-w-md mx-auto md:mx-0">{s.text}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="flex justify-center mt-8">
                  <ChevronDown className="size-10 text-teal animate-bounce" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
