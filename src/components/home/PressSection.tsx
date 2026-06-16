import { Newspaper } from "lucide-react";

const articles = [
  { title: "כתבה במגזין אתנחתא", source: "מגזין אתנחתא", date: "ג' תשרי תשפ\"ו · 25.09.25" },
  { title: 'כתבה על "קשר של תפילין" בעיתון של כפר חב"ד', source: "עיתון כפר חב\"ד", date: "21/05/2025" },
  { title: "גם לזוג התפילין הישנות שלכם יש ייעוד חשוב | כסף אנושי, פרק 5", source: "103FM", date: "21/04/2025" },
  { title: '"מהדקין את הקשר" - כתבה בעיתון ב7', source: "עיתון ב7", date: "28/08/2024" },
];

export function PressSection() {
  return (
    <section id="press" className="py-20 px-4 bg-cream">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display font-black text-4xl md:text-5xl text-ink text-center mb-12">
          כתבות בתקשורת
        </h2>

        <div className="space-y-4">
          {articles.map((a, i) => (
            <article
              key={i}
              className="bg-white rounded-2xl p-6 shadow-card border border-border flex items-center gap-5 hover:border-teal transition-colors"
            >
              <div className="shrink-0 size-14 rounded-full bg-teal/15 flex items-center justify-center">
                <Newspaper className="size-7 text-teal-deep" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-lg md:text-xl text-ink">{a.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="font-bold">{a.source}</span> · {a.date}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
