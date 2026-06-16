import { ArrowLeft } from "lucide-react";

const cards = [
  {
    title: "הסכמות רבנים",
    href: "#agreements",
    img: "https://vangus-cdn.com/tefilin.or-hadash.org.il/wp-content/uploads/2024/04/%D7%9E%D7%9B%D7%AA%D7%91-%D7%94%D7%A1%D7%9B%D7%9E%D7%94-%D7%9E%D7%94%D7%A8%D7%91-%D7%96%D7%99%D7%9C%D7%91%D7%A8%D7%A9%D7%98%D7%99%D7%99%D7%9F-scaled.webp",
  },
  {
    title: "מכתבי תודה",
    href: "#letters",
    img: "https://vangus-cdn.com/tefilin.or-hadash.org.il/wp-content/uploads/2024/04/-%D7%AA%D7%95%D7%93%D7%94-%D7%90%D7%9E%D7%90-%D7%9C%D7%97%D7%99%D7%99%D7%9C-e1712736869916.webp",
  },
];

export function FeatureCards() {
  return (
    <section className="py-16 px-4 bg-cream">
      <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-6">
        {cards.map((c) => (
          <a
            key={c.title}
            href={c.href}
            className="group relative aspect-[4/3] rounded-3xl overflow-hidden shadow-card"
          >
            <img
              src={c.img}
              alt={c.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-6 flex items-center justify-between text-white">
              <h3 className="font-display font-black text-3xl">{c.title}</h3>
              <span className="size-12 rounded-full bg-teal flex items-center justify-center group-hover:bg-orange transition-colors">
                <ArrowLeft className="size-5 text-ink" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
