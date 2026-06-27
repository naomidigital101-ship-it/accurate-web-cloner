export function Footer() {
  return (
    <footer
      id="site-footer"
      dir="rtl"
      className="bg-[#2D2E83] text-white py-10 px-4"
    >
      <div className="mx-auto max-w-[1200px] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-3 text-center md:text-right">
          <a href="/" rel="home" aria-label="קשר של תפילין - דף הבית" className="block">
            <img
              src="/wp/img/אור-חדש-לוגו-01.svg"
              alt="קשר של תפילין"
              width={444}
              height={168}
              className="h-20 md:h-24 w-auto"
            />
          </a>
          <p className="text-white/90 text-base md:text-lg font-medium">
            פרויקט תרומה והנגשת תפילין מהודרות לכל יהודי שמבקש
          </p>
        </div>

        <div className="text-white/80 text-sm">
          <p>כל הזכויות שמורות</p>
        </div>
      </div>
    </footer>
  );
}
