



export function HeroSection() {
  return (
    <section className="relative overflow-hidden text-white h-screen flex items-center justify-center">
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

      <div className="relative w-full px-4 lg:px-8 max-w-6xl mx-auto text-center pt-20 pb-16">
        <img
          src="/__l5e/assets-v1/a5b0cc1f-d4c2-4469-8883-c4132453799d/hero-title.svg"
          alt="קשר של תפילין"
          className="mx-auto w-full max-w-[320px] sm:max-w-[420px] md:max-w-[520px] lg:max-w-[600px] h-auto drop-shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
        />

        <h2 className="font-display font-black text-2xl md:text-3xl mt-3 text-white drop-shadow-md leading-tight">
          מיזם של ערבות הדדית וזיכוי הרבים
        </h2>

        <div className="inline-flex mt-5 px-6 py-2 rounded-full bg-gradient-orange shadow-soft">
          <span className="text-white font-bold text-base md:text-lg">
            חילקנו מעל <span className="font-black">1,300</span> זוגות תפילין
          </span>
        </div>

        <p className="mt-5 max-w-2xl mx-auto text-base md:text-xl text-white/95 leading-relaxed">
          מטרתינו לעזור לכל יהודי שרוצה להתחיל להניח תפילין ולהיות יותר מחובר לה' יתברך.
        </p>

        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <a href="#request" className="btn-e btn-mint">
            מתעניין בתפילין
          </a>
          <a href="#donate" className="btn-e btn-outline-light">
            לתרומת תפילין
          </a>
        </div>
      </div>

      {/* Bottom curve */}
      <svg className="absolute bottom-0 inset-x-0 w-full text-background" viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true">
        <path fill="currentColor" d="M0,30 Q720,140 1440,30 L1440,100 L0,100 Z" />
      </svg>
    </section>
  );
}
