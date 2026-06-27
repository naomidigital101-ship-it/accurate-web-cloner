import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden text-white min-h-[100vh] flex items-center">
      {/* Background video */}
      <div className="absolute inset-0 overflow-hidden">
        <iframe
          src="https://player.vimeo.com/video/906687611?background=1&autoplay=1&loop=1&muted=1&autopause=0&controls=0&dnt=1"
          title="רקע וידאו"
          allow="autoplay; fullscreen"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] h-[56.25vw] min-w-full min-h-full pointer-events-none border-0"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-teal-dark/55 via-teal-deep/55 to-teal/55 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,oklch(0.42_0.08_210/0.5)_85%)]" />
      </div>

      <div className="relative w-full pt-28 pb-40 lg:pt-32 lg:pb-52 px-4 lg:px-8 max-w-7xl mx-auto text-center">
        <img
          src="/__l5e/assets-v1/a5b0cc1f-d4c2-4469-8883-c4132453799d/hero-title.svg"
          alt="קשר של תפילין"
          className="mx-auto w-full max-w-[420px] sm:max-w-[560px] md:max-w-[720px] lg:max-w-[900px] h-auto drop-shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
        />

        <p className="font-display font-bold text-3xl md:text-5xl lg:text-6xl mt-6 text-white drop-shadow-md">
          מיזם של ערבות הדדית וזיכוי הרבים
        </p>

        <div className="inline-flex mt-8 px-8 py-3 rounded-full bg-gradient-orange shadow-soft">
          <span className="text-white font-bold text-lg md:text-xl">
            חילקנו מעל <span className="font-black">1,300</span> זוגות תפילין
          </span>
        </div>

        <p className="mt-8 max-w-2xl mx-auto text-lg md:text-2xl text-white/95 leading-relaxed">
          מטרתינו לעזור לכל יהודי שרוצה להתחיל להניח תפילין ולהיות יותר מחובר לה' יתברך.
        </p>

        <div className="mt-10 flex flex-wrap gap-5 justify-center">
          <Button asChild size="lg" className="rounded-full bg-teal hover:bg-teal-deep text-ink font-bold text-lg md:text-xl px-10 h-14 shadow-soft">
            <a href="#request">מתעניין בתפילין</a>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full bg-transparent hover:bg-white/10 text-white border-white/70 hover:text-white font-bold text-lg md:text-xl px-10 h-14">
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
