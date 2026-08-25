export function AboutMitzvaSection() {
  return (
    <section dir="rtl" className="mitzva-e">
      <div className="mitzva-text">
        <h2 className="e-h2-navy">על מצות תפילין</h2>
        <p className="e-body-navy">
          בפרשיות התפילין כתובים הפסוקים שבהם עיקרי האמונה בה' יתברך ובהם:{" "}
          <b>"שמע ישראל ה' אלוקינו ה' אחד. ואהבת את ה' אלוקיך בכל לבבך ובכל נפשך ובכל מאדך…"</b>.
        </p>
        <p className="e-body-navy">
          את התפילין ציווה אותנו הבורא להניח על הראש כנגד המח ועל היד כנגד הלב, שהם עיקר חיות
          הגוף והנפש, כדי שהמח והלב שלנו, יהיו מחוברים וקשורים לאמונה והדבקות בה' ונקבל עול
          מלכות שמיים. לכן מצוות תפילין היא אחת משלוש המצוות הנקראות 'אות' (בנוסף לשבת וברית
          מילה) כי היא מחברת את האדם לאמונה בה' לתורה ולמצוות כולם.
        </p>
        <a href="/request" className="e-btn-white">לבקשת תפילין</a>
      </div>
      <div className="mitzva-img">
        <img src="/wp/img/תפילין-4-חתוך-min-1.webp" alt="תפילין" loading="lazy" decoding="async" width="1400" height="1050" />
      </div>
    </section>
  );
}
