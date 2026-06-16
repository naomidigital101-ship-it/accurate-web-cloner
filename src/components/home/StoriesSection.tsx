import { Button } from "@/components/ui/button";
import { Quote } from "lucide-react";

const stories = [
  { quote: "חשוב לי שהילדים שלי יראו שאני מניח תפילין כל יום, כי זה מה שיחבר אותם לזהות ולשורשים שלהם.", name: "אליאור", city: "מאשקלון" },
  { quote: "תודה רבה על המצווה הענקית שאתה עושה! חיפשתי תפילין ובאת לי מהשמיים…", name: "דור", city: "מרחובות" },
  { quote: "אני מאוד שמח בהם ואשתדל להניח אותם בכל יום.", name: "יאיר", city: "" },
  { quote: "הרבה זמן לא הקפדתי להניח תפילין ובזכות התרומה זכיתי להניח. שה' יברך אותך שתזכה למצוות.", name: "איתיאל", city: "מראש העין" },
  { quote: "בע\"ה אני אהיה בעוד כמה שבועות בן 90. היום קיבלתי תפילין, ולא יכולתי לבקש מתנה יותר מיוחדת.", name: "מאיר", city: "מירושלים" },
  { quote: "ביקשת סימן? קיבלת! אתה צריך לחזור ולהניח תפילין!", name: "א.", city: "ממעלה אדומים" },
  { quote: "סוף סוף יש לי תפילין! סוף סוף אני יודע להניח תפילין!", name: "א.", city: "מרגבה" },
  { quote: "כהכרת תודה לקב\"ה על הנס שעשה לי קיבלתי על עצמי להניח תפילין כל יום.", name: "קובי", city: "מנתיב העשרה" },
];

export function StoriesSection() {
  return (
    <section id="stories" className="py-20 px-4 bg-background relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-cream to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-12">
          <p className="font-display text-teal-deep font-bold text-xl">הסיפורים</p>
          <h2 className="font-display font-black text-4xl md:text-5xl text-ink mt-1">
            שמאחורי התפילין
          </h2>
          <div className="flex justify-center gap-2 mt-4">
            <span className="text-orange text-xl">✦</span>
            <span className="text-orange text-xl">✦</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stories.map((s, i) => (
            <article
              key={i}
              className="bg-card rounded-2xl p-6 shadow-card border border-border flex flex-col gap-4 hover:-translate-y-1 transition-transform"
            >
              <Quote className="size-8 text-teal" aria-hidden />
              <p className="text-ink leading-relaxed text-sm flex-1">"{s.quote}"</p>
              <footer className="pt-3 border-t border-border">
                <p className="font-bold text-ink">{s.name}</p>
                {s.city && <p className="text-xs text-muted-foreground">{s.city}</p>}
              </footer>
            </article>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-teal hover:bg-teal-deep text-ink font-bold px-10 h-12"
          >
            <a href="#all-stories">לכל הסיפורים</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
