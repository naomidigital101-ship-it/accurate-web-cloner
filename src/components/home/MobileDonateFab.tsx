import { useEffect, useRef, useState } from "react";

/**
 * כפתור תרומה צף - מובייל בלבד, עמוד הבית בלבד.
 * מופיע אחרי שהמשתמש עבר את ההירו, ונעלם כשבאנר "היו שותפים" על המסך
 * כדי שלא יופיעו שני כפתורי תרומה זהים יחד. ניתן לסגירה.
 */
export function MobileDonateFab() {
  const [show, setShow] = useState(false);
  const dismissed = useRef(false);

  useEffect(() => {
    const banner = document.querySelector(".partners-e");
    let bannerVisible = false;

    const update = () => {
      if (dismissed.current) {
        setShow(false);
        return;
      }
      const past = window.scrollY > window.innerHeight * 0.9;
      setShow(past && !bannerVisible);
    };

    const io = banner
      ? new IntersectionObserver(
          ([e]) => {
            bannerVisible = e.isIntersecting;
            update();
          },
          { threshold: 0.15 },
        )
      : null;
    if (io && banner) io.observe(banner);

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      io?.disconnect();
    };
  }, []);

  return (
    <div className={`fab-donate ${show ? "on" : ""}`} dir="rtl" aria-hidden={!show}>
      <a href="/donate/" className="fab-donate-btn" tabIndex={show ? 0 : -1} aria-label="מעבר לעמוד התרומה">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <span>לתרומה</span>
      </a>
      <button
        type="button"
        className="fab-donate-close"
        tabIndex={show ? 0 : -1}
        aria-label="סגירת כפתור התרומה"
        onClick={() => {
          dismissed.current = true;
          setShow(false);
        }}
      >
        <svg viewBox="0 0 1000 1000" width="11" height="11" fill="currentColor" aria-hidden="true">
          <path d="M742 167L500 408 258 167C246 154 233 150 217 150 196 150 179 158 167 167 154 179 150 196 150 212 150 229 154 242 171 254L408 500 167 742C138 771 138 800 167 829 196 858 225 858 254 829L496 587 738 829C750 842 767 846 783 846 800 846 817 842 829 829 842 817 846 804 846 783 846 767 842 750 829 737L588 500 833 258C863 229 863 200 833 171 804 137 775 137 742 167Z" />
        </svg>
      </button>
    </div>
  );
}
