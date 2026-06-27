import { Button } from "@/components/ui/button";

export function DonationBanner() {
  return (
    <section id="contribute" className="relative overflow-hidden text-white">
      <div className="absolute inset-0">
        <img
          src="https://tefilin.or-hadash.org.il/wp-content/uploads/2024/01/cropped-hand-wrapped-tefillin-min.webp"
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-teal-dark/80 via-teal-deep/75 to-teal-dark/85 mix-blend-multiply" />
      </div>
      <div className="relative max-w-3xl mx-auto py-20 px-4 text-center">
        <h2 className="font-display font-black text-4xl md:text-5xl drop-shadow-md">היו שותפים</h2>
        <p className="mt-5 text-lg leading-relaxed">
          השותפות שלך <span className="font-bold text-orange-soft">חשובה לנו!</span> עלויות הפרויקט גבוהות והוא מתקיים
          הודות לשותפים רבים שלוקחים חלק בזיכוי הרבים שאין כמותו. תרום עכשיו, ובזכותך עוד יהודי יניח תפילין!
        </p>
        <p className="mt-3 text-sm text-white/80">התרומה מוכרת לצרכי מס</p>
        <Button asChild size="lg" variant="outline" className="mt-8 rounded-full bg-transparent border-white text-white hover:bg-white hover:text-teal-dark font-bold px-12 h-12">
          <a href="#donate-money">לתרומה</a>
        </Button>
      </div>
    </section>
  );
}
