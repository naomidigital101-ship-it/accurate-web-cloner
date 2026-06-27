import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "מה בדיוק אתם עושים ומה המטרה של הפרויקט?", a: "אנחנו אוספים תפילין משומשות או חדשות, מחדשים אותן ומחלקים בחינם ליהודים שרוצים להתחיל להניח תפילין. המטרה: לחבר עוד יהודי למצוות תפילין ולזהותו." },
  { q: "למי מסרתם תפילין, אפשר דוגמא?", a: "חלקנו תפילין לחיילים, בני בר מצווה, מתחזקים, אנשים מבוגרים שמעולם לא הניחו, וכן יהודים מקהילות בכל הארץ." },
  { q: "האם כל תפילין שאתם מקבלים מגיעים בסוף למישהו שיניח אותם?", a: 'כן, כל זוג תפילין כשר עובר בדיקה והגהה במכון סת"ם מחמיר, ולאחר חידוש מחולק למי שביקש.' },
  { q: "זה בתשלום? כמה?", a: "בקשת תפילין היא בחינם לחלוטין. הפרויקט מתקיים בזכות תורמים." },
  { q: 'יש לי תפילין של סבא שלי ז"ל, אבל קשה לי למסור אותם למישהו אחר.', a: "אנחנו מבינים את הרגישות. אפשר להתייעץ איתנו ולהחליט יחד מה הדרך הנכונה ביותר." },
  { q: "יש לי תפילין בבית, אבל אני לא יודע אם הן כשרות, זה יכול לעזור?", a: 'בהחלט! נשמח לבדוק עבורך במכון סת"ם, ואם אפשר לחדש אותן – נחדש ונחלק.' },
  { q: "אין לי זוג תפילין לתת אבל אני רוצה להשתתף במצווה.", a: "אפשר לתרום כסף לפרויקט – כל תרומה מאפשרת לרכוש ולחדש זוג נוסף." },
  { q: "למה דווקא תפילין?", a: 'מצוות תפילין נקראת "אות" – היא מחברת את האדם לאמונה ולמצוות. זו מצווה יומיומית שמלווה את היהודי כל חייו.' },
];

export function FaqSection() {
  return (
    <section id="faq" className="py-20 px-4 bg-background">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <p className="font-display font-bold text-2xl text-ink">יש לכם</p>
          <h2 className="font-display font-black text-6xl md:text-7xl text-teal-deep leading-none">שאלה?</h2>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="bg-card border border-border rounded-2xl px-5 shadow-card">
              <AccordionTrigger className="text-right font-display font-bold text-ink hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-ink/80 leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
