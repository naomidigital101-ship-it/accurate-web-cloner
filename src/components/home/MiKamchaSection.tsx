import { Button } from "@/components/ui/button";

export function MiKamchaSection() {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div className="rounded-full overflow-hidden shadow-card aspect-square max-w-md mx-auto">
          <img
            src="https://tefilin.or-hadash.org.il/wp-content/uploads/2024/01/jewish-torah-bar-mitzvah-bar-mitzvah-torah-reading-min.webp"
            alt="כותל המערבי"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-teal-deep">מי כעמך ישראל</h2>
          <div className="mt-5 space-y-4 text-ink leading-relaxed">
            <p>
              בגמרא (ברכות ו'.) מובא שגם הקב"ה מניח תפילין, ובתפילין האלו כתוב הפסוק
              <span className="font-bold"> "מי כעמך ישראל גוי אחד בארץ"</span>.
              ומכאן יש ללמוד על הקשר של מצוות תפילין לאחדות עם ישראל – גוי <span className="font-bold">אחד</span> בארץ.
              בכוחה של מצוות תפילין לחבר בין יהודי ליהודי, בערבות הדדית, כשאחד מזכה את רעהו.
            </p>
            <p>
              <span className="font-bold">כמה גדולה הזכות של מי שתורם תפילין ומזכה יהודי אחר לקיים מצוות תפילין!</span>{" "}
              במעשה זה של זיכוי הרבים ואחדות ישראל הוא כביכול כותב את ה'תפילין דמארי עלמא'…
            </p>
          </div>
          <Button asChild size="lg" className="mt-7 rounded-full bg-teal hover:bg-mint-hover text-navy font-bold px-10 h-12">
            <a href="#donate">למסירת/תרומת תפילין</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
