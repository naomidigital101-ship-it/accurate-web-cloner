const galleryImages = Array.from({ length: 28 }, (_, i) => `/wp/uploads/gallery/g${i + 1}`);
const exts = ["webp","webp","jpg","jpg","webp","jpg","jpg","jpg","jpg","jpg","png","jpg","jpg","jpg","webp","webp","jpg","webp","webp","jpg","jpg","webp","jpg","webp","jpg","webp","jpg","jpg"];

export function Footer() {
  return (
    <footer dir="rtl" className="footer-e">
      <div className="footer-gallery">
        {galleryImages.map((src, i) => (
          <img key={i} src={`${src}.${exts[i]}`} alt="" loading="lazy" className="footer-gallery-img" />
        ))}
      </div>
      <div className="footer-strip">
        <p className="footer-rights">כל הזכויות שמורות</p>
        <div className="footer-brand">
          <a href="/" aria-label="אור חדש - דף הבית">
            <img src="/wp/img/אור-חדש-לוגו-01.svg" alt="אור חדש" className="footer-logo" />
          </a>
          <p className="footer-tagline">פרויקט תרומה והנגשת תפילין מהודרות לכל יהודי שמבקש</p>
        </div>
      </div>
    </footer>
  );
}
