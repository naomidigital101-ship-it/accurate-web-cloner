import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero text-white">
      {/* Background video */}
      <div className="absolute inset-0">
        <iframe
          title="רקע - הנחת תפילין"
          src="https://player.vimeo.com/video/903193388?background=1&autoplay=1&loop=1&muted=1&controls=0"
          className="absolute inset-0 w-full h-full object-cover scale-110"
          allow="autoplay; fullscreen"
          tabIndex={-1}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-teal-dark/70 via-teal-deep/60 to-teal/70" />
      </div>

      <div className="relative pt-32 pb-40 lg:pt-40 lg:pb-56 px-4 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="font-display font-black leading-[0.95] text-white drop-shadow-2xl">
          <span className="block text-[clamp(3rem,9vw,8rem)]">קשר של</span>
          <span className="block text-[clamp(4rem,12vw,11rem)] -mt-2">תפילין</span>
        </h1>

        <div className="flex items-center justify-center gap-3 mt-6">
          <span className="text-orange text-2xl">✦</span>
          <span className="text-orange text-2xl">✦</span>
        </div>

        <p className="font-display font-bold text-2xl md:text-4xl mt-4">
          מיזם של ערבות הדדית וזיכוי הרבים
        </p>

        <div className="inline-flex mt-8 px-8 py-3 rounded-full bg-gradient-orange shadow-soft">
          <span className="text-white font-bold text-lg md:text-xl">
            חילקנו מעל <span className="font-black">1,000</span> זוגות תפילין
          </span>
        </div>

        <p className="mt-8 max-w-2xl mx-auto text-base md:text-lg text-white/95 leading-relaxed">
          מטרתינו לעזור לכל יהודי שרוצה להתחיל להניח תפילין ולהיות יותר מחובר לה' יתברך.
        </p>

        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-teal hover:bg-teal-deep text-ink font-bold text-base px-8 h-12 shadow-soft"
          >
            <a href="#request">מתעניין בתפילין</a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full bg-ink hover:bg-ink/80 text-white border-ink hover:text-white font-bold text-base px-8 h-12"
          >
            <a href="#donate">לתרומת תפילין</a>
          </Button>
        </div>
      </div>

      {/* Bottom wave */}
      <svg
        className="absolute bottom-0 inset-x-0 w-full text-background"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M0,80 C320,140 720,0 1080,60 C1260,90 1380,80 1440,70 L1440,120 L0,120 Z"
        />
      </svg>
    </section>
  );
}
