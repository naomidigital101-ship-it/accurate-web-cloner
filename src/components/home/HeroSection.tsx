import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden text-white">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://tefilin.or-hadash.org.il/wp-content/uploads/2024/06/AdobeStock_817584046-min.webp"
          alt="הנחת תפילין"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-teal-dark/55 via-teal-deep/55 to-teal/55 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,oklch(0.42_0.08_210/0.5)_85%)]" />
      </div>

      <div className="relative pt-28 pb-32 lg:pt-36 lg:pb-44 px-4 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="font-display font-black leading-[0.92] text-white drop-shadow-[0_6px_30px_rgba(0,0,0,0.35)]">
          <span className="block text-[clamp(3.5rem,11vw,9rem)]">קשר של</span>
          <span className="block text-[clamp(4.5rem,15vw,13rem)] -mt-3">תפילין</span>
        </h1>

        <div className="flex items-center justify-center gap-4 mt-6 text-[oklch(0.72_0.18_220)]">
          <span className="text-2xl">✦</span>
          <span className="text-2xl">✦</span>
        </div>

        <p className="font-display font-bold text-2xl md:text-4xl mt-3 text-white drop-shadow-md">
          מיזם של ערבות הדדית וזיכוי הרבים
        </p>

        <div className="inline-flex mt-7 px-7 py-2.5 rounded-full bg-gradient-orange shadow-soft">
          <span className="text-white font-bold text-base md:text-lg">
            חילקנו מעל <span className="font-black">1,300</span> זוגות תפילין
          </span>
        </div>

        <p className="mt-7 max-w-xl mx-auto text-base md:text-lg text-white/95 leading-relaxed">
          מטרתינו לעזור לכל יהודי שרוצה להתחיל להניח תפילין ולהיות יותר מחובר לה' יתברך.
        </p>

        <div className="mt-7 flex flex-wrap gap-4 justify-center">
          <Button asChild size="lg" className="rounded-full bg-teal hover:bg-teal-deep text-ink font-bold text-base px-8 h-12 shadow-soft">
            <a href="#request">מתעניין בתפילין</a>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full bg-transparent hover:bg-white/10 text-white border-white/70 hover:text-white font-bold text-base px-8 h-12">
            <a href="#donate">לתרומת תפילין</a>
          </Button>
        </div>
      </div>

      {/* Bottom curve */}
      <svg className="absolute bottom-0 inset-x-0 w-full text-background" viewBox="0 0 1440 140" preserveAspectRatio="none" aria-hidden="true">
        <path fill="currentColor" d="M0,40 Q720,200 1440,40 L1440,140 L0,140 Z" />
      </svg>
    </section>
  );
}
