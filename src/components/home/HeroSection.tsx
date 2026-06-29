export function HeroSection() {
  return (
    <section
      dir="rtl"
      className="relative overflow-hidden text-white min-h-[100svh] flex items-center justify-center"
    >
      {/* Background video */}
      <div className="absolute inset-0 overflow-hidden">
        <iframe
          src="https://player.vimeo.com/video/906687611?background=1&autoplay=1&loop=1&muted=1&autopause=0&controls=0&dnt=1"
          title="רקע וידאו"
          allow="autoplay; fullscreen"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] h-[56.25vw] min-w-full min-h-full pointer-events-none border-0"
        />
        {/* Teal overlay — matches original deep turquoise mood */}
        <div className="absolute inset-0 bg-[#0d6b6b]/55 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,60,70,0)_0%,rgba(0,40,55,0.55)_100%)]" />
      </div>

      {/* Center content */}
      <div className="relative w-full px-4 lg:px-8 max-w-[1200px] mx-auto text-center pt-28 md:pt-32 pb-28">
        {/* Big graphic title */}
        <img
          src="/__l5e/assets-v1/a5b0cc1f-d4c2-4469-8883-c4132453799d/hero-title.svg"
          alt="קשר של תפילין"
          className="mx-auto w-full max-w-[340px] sm:max-w-[480px] md:max-w-[620px] lg:max-w-[720px] h-auto drop-shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
        />

        {/* Subtitle */}
        <h2 className="font-sans font-extrabold text-2xl md:text-[34px] leading-tight mt-4 text-white drop-shadow-md">
          מיזם של ערבות הדדית וזיכוי הרבים
        </h2>

        {/* Orange pill badge */}
        <div className="mt-6 flex justify-center">
          <span
            className="inline-block rounded-full px-7 py-2.5 text-white font-bold text-base md:text-lg shadow-[0_8px_20px_rgba(0,0,0,0.25)]"
            style={{
              background:
                "linear-gradient(90deg, #F9B233 0%, #F37C2E 50%, #E65A38 100%)",
            }}
          >
            חילקנו מעל{" "}
            <span className="font-black text-xl md:text-2xl align-middle">
              1,300
            </span>{" "}
            זוגות תפילין
          </span>
        </div>

        {/* Paragraph */}
        <p className="mt-6 max-w-[640px] mx-auto text-base md:text-xl text-white font-medium leading-relaxed">
          מטרתינו לעזור לכל יהודי שרוצה להתחיל להניח תפילין ולהיות יותר מחובר
          לה' יתברך.
        </p>

        {/* CTA buttons */}
        <div className="mt-7 flex flex-wrap gap-3 justify-center">
          <a href="#request" className="btn-e btn-mint">
            מתעניין בתפילין
          </a>
          <a href="#donate" className="btn-e btn-outline-light">
            לתרומת תפילין
          </a>
        </div>
      </div>

      {/* Bottom white wave */}
      <svg
        className="absolute bottom-0 inset-x-0 w-full h-[80px] md:h-[110px] text-background"
        viewBox="0 0 1440 110"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M0,60 C320,120 720,0 1080,40 C1260,60 1380,80 1440,70 L1440,110 L0,110 Z"
        />
      </svg>
    </section>
  );
}
