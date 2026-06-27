import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FounderSection() {
  return (
    <section className="py-20 px-4 bg-cream">
      <div className="max-w-5xl mx-auto grid md:grid-cols-[260px_1fr] gap-10 items-center">
        <div className="mx-auto md:mx-0">
          <div className="size-60 rounded-full overflow-hidden shadow-card border-4 border-white">
            <img
              src="https://tefilin.or-hadash.org.il/wp-content/uploads/2024/01/עמיחי-פרופיל-ערוך-min.webp"
              alt="הרב עמיחי איל"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
        <div className="text-center md:text-right">
          <p className="font-display text-teal-deep font-bold">מייסד ויו"ר 'אור חדש'</p>
          <h2 className="font-display font-black text-4xl md:text-5xl text-ink mt-1">הרב עמיחי איל</h2>
          <p className="mt-5 text-ink/80 leading-relaxed max-w-xl mx-auto md:mx-0">
            הרב עמיחי איל הקים את עמותת 'אור חדש' מתוך מטרה לחבר יהודים לזהותם, לתורה ולמצוות.
            מיזם 'קשר של תפילין' הוא אחד הפרויקטים המרכזיים של העמותה, ובמסגרתו חולקו עד היום מעל 1,300 זוגות תפילין.
          </p>
          <Button asChild size="lg" className="mt-7 rounded-full bg-teal hover:bg-teal-deep text-ink font-bold px-8 h-12 gap-2">
            <a href="https://wa.me/972000000000" target="_blank" rel="noreferrer">
              <MessageCircle className="size-5" /> ליצירת קשר
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
