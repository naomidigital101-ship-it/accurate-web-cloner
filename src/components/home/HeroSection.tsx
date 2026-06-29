export function HeroSection() {
  return (
    <section
      dir="rtl"
      className="relative w-full overflow-hidden text-white"
      style={{ height: "100vh", minHeight: 680 }}
    >
      {/* Background video */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base blue layer */}
        <div className="absolute inset-0" style={{ background: "#009FE3" }} />
        <iframe
          src="https://player.vimeo.com/video/906687611?background=1&autoplay=1&loop=1&muted=1&autopause=0&controls=0&dnt=1"
          title="רקע וידאו"
          allow="autoplay; fullscreen"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] h-[56.25vw] min-w-full min-h-full pointer-events-none border-0"
          style={{ objectFit: "cover" }}
        />
        {/* Blue tint over video */}
        <div
          className="absolute inset-0"
          style={{ background: "#009FE3", opacity: 0.55, mixBlendMode: "multiply" }}
        />
        {/* Contrast overlay for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,80,130,0.35) 0%, rgba(0,40,80,0.55) 100%)",
          }}
        />
      </div>

      {/* Center content */}
      <div
        className="relative z-[2] flex flex-col items-center justify-center text-center px-4"
        style={{ paddingTop: 110, paddingBottom: 90, transform: "translateY(-10px)" }}
      >
        {/* Big graphic title */}
        <img
          src="/__l5e/assets-v1/a5b0cc1f-d4c2-4469-8883-c4132453799d/hero-title.svg"
          alt="קשר של תפילין"
          className="mx-auto w-[685px] h-[362px] max-w-full drop-shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
        />

        {/* Subtitle */}
        <h2 className="font-sans font-extrabold text-xl md:text-[30px] leading-tight mt-5 text-white drop-shadow-md">
          מיזם של ערבות הדדית וזיכוי הרבים
        </h2>

        {/* Orange pill badge */}
        <div className="mt-5">
          <span
            className="inline-block rounded-full px-7 py-2.5 text-white font-bold text-base md:text-lg shadow-[0_8px_20px_rgba(0,0,0,0.25)]"
            style={{
              background:
                "linear-gradient(90deg, #F9B233 0%, #F37C2E 50%, #E65A38 100%)",
            }}
          >
            חילקנו מעל{" "}
            <span className="font-black text-2xl md:text-3xl align-middle mx-1">
              1,300
            </span>{" "}
            זוגות תפילין
          </span>
        </div>

        {/* Paragraph */}
        <p className="mt-5 max-w-[640px] mx-auto text-base md:text-xl text-white font-medium leading-relaxed drop-shadow">
          מטרתנו לעזור לכל יהודי שרוצה להתחיל להניח תפילין ולהיות יותר מחובר
          לה' יתברך.
        </p>

        {/* CTA buttons */}
        <div className="mt-7 flex flex-wrap gap-3 justify-center">
          <a
            href="#request"
            className="inline-block rounded-full px-8 py-3 font-bold text-base md:text-lg transition-colors"
            style={{ background: "#67FFD1", color: "#2D2E83" }}
          >
            מתעניין בתפילין
          </a>
          <a
            href="#donate"
            className="inline-block rounded-full px-8 py-3 font-bold text-base md:text-lg border-2 border-white text-white hover:bg-white/10 transition-colors"
          >
            לתרומת תפילין
          </a>
        </div>
      </div>

      {/* Bottom inverted (concave) rounded separator */}
      <svg
        className="absolute pointer-events-none"
        style={{
          bottom: 0,
          left: "-10%",
          width: "120%",
          height: 200,
          zIndex: 3,
        }}
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 Q720,200 1440,0 L1440,200 L0,200 Z"
          fill="white"
        />
      </svg>
    </section>
  );
}
