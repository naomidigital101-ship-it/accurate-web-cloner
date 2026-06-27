import { Button } from "@/components/ui/button";

export function AboutTefilinSection() {
  return (
    <section className="py-20 px-4 bg-cream relative overflow-hidden">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div className="rounded-3xl overflow-hidden shadow-card">
          <img
            src="https://tefilin.or-hadash.org.il/wp-content/uploads/2025/08/AdobeStock_229166376-min.webp"
            alt="תפילין"
            className="w-full h-full object-cover aspect-[4/3]"
            loading="lazy"
          />
        </div>
        <div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-teal-deep">על מצוות תפילין</h2>
          <div className="mt-5 space-y-4 text-ink leading-relaxed">
            <p>
              בפרשיות התפילין כתובים הפסוקים שבהם עיקרי האמונה בה' יתברך ובהם:
              <span className="font-bold"> "שמע ישראל ה' אלוקינו ה' אחד. ואהבת את ה' אלוקיך בכל לבבך ובכל נפשך ובכל מאדך…"</span>
            </p>
            <p>
              את התפילין ציווה אותנו הבורא להניח על הראש כנגד המח ועל היד כנגד הלב, שהם עיקר חיות הגוף והנפש,
              כדי שהמח והלב שלנו, יהיו מחוברים וקשורים לאמונה והדבקות בה' ונקבל עול מלכות שמיים.
            </p>
            <p>
              לכן מצוות תפילין היא אחת משלוש המצוות הנקראות 'אות' (בנוסף לשבת וברית מילה), כי היא מחברת את האדם
              לאמונה בה' לתורה ולמצוות כולם.
            </p>
          </div>
          <Button asChild size="lg" className="mt-7 rounded-full bg-teal hover:bg-mint-hover text-navy font-bold px-10 h-12">
            <a href="#request">לבקשת תפילין</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
