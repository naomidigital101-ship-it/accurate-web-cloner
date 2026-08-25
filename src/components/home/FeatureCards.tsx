import { ArrowLeft } from "lucide-react";

const cards = [
  {
    title: "הסכמות רבנים",
    href: "/agreements",
    img: "/wp/uploads/2024/01/מכתב-הסכמה-מהרב-זילברשטיין-scaled.webp",
    gradient: "from-[oklch(0.28_0.08_265)] to-[oklch(0.42_0.12_255)]",
  },
  {
    title: "מכתבי תודה",
    href: "/מכתבי-תודה",
    img: "/wp/uploads/2024/01/-תודה-אמא-לחייל-e1712736869916.webp",
    gradient: "from-[oklch(0.55_0.15_230)] to-[oklch(0.75_0.13_220)]",
  },
];

export function FeatureCards() {
  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-7">
        {cards.map((c) => (
          <a
            key={c.title}
            href={c.href}
            className={`group relative overflow-hidden rounded-3xl shadow-card bg-gradient-to-br ${c.gradient} h-44 md:h-52 flex items-center pr-8`}
          >
            <div className="relative z-10 text-white flex items-center gap-3">
              <h3 className="font-display font-black text-3xl md:text-4xl">{c.title}</h3>
              <span className="size-10 rounded-full bg-white/15 grid place-items-center group-hover:bg-orange transition-colors">
                <ArrowLeft className="size-5 text-white" />
              </span>
            </div>
            <img
              src={c.img}
              alt={c.title}
              loading="lazy"
              className="absolute -left-6 -bottom-6 h-[130%] w-auto object-contain drop-shadow-2xl rotate-[8deg] group-hover:rotate-[4deg] transition-transform duration-500" decoding="async" />
          </a>
        ))}
      </div>
    </section>
  );
}
