const articles = [
  {
    title: "ארגון 'קשר של תפילין' – ככה זה עובד בשטח",
    source: "הידברות",
    date: "28.9.25",
    logo: "https://tefilin.or-hadash.org.il/wp-content/uploads/2026/06/לוגו-הידברות.webp",
  },
  {
    title: "כתבה במגזין אתנחתא",
    source: "מגזין אתנחתא",
    date: 'ג\' תשרי תשפ"ו · 25.09.25',
    logo: "https://tefilin.or-hadash.org.il/wp-content/uploads/2025/10/אתנחתא.png",
  },
  {
    title: 'כתבה על קשר של תפילין בעיתון של כפר חב"ד',
    source: 'עיתון כפר חב"ד',
    date: "21/05/2025",
    logo: "https://tefilin.or-hadash.org.il/wp-content/uploads/2025/05/כפר-חבד.jpg",
  },
  {
    title: "גם לזוג התפילין הישנות שלכם יש ייעוד חשוב | מיזם 'קשר של תפילין' – כסף אנושי, פרק 5",
    source: "103FM",
    date: "21/04/2025",
    logo: "https://tefilin.or-hadash.org.il/wp-content/uploads/2025/05/103FM.jpg",
  },
];

export function PressSection() {
  return (
    <section id="press" className="py-20 px-4 bg-background">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display font-black text-4xl md:text-5xl text-teal-deep text-center mb-10 leading-tight">
          כתבות
          <br />
          <span className="text-ink">בתקשורת</span>
        </h2>

        <div className="space-y-4">
          {articles.map((a, i) => (
            <article
              key={i}
              className="bg-card rounded-2xl p-4 shadow-card border border-border flex items-center gap-4 hover:border-teal transition-colors"
            >
              <div className="shrink-0 size-20 rounded-xl overflow-hidden bg-white grid place-items-center border border-border">
                <img src={a.logo} alt={a.source} className="w-full h-full object-contain p-1" loading="lazy" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-base md:text-lg text-ink leading-snug">{a.title}</h3>
                <p className="text-xs text-muted-foreground mt-1.5">
                  <span className="inline-block size-3 rounded-full bg-teal/40 mr-1 align-middle" />
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
