export function Footer() {
  return (
    <footer className="bg-ink text-white/85 py-12 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center md:text-right">
        <div>
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <div className="size-14 rounded-full bg-white flex items-center justify-center">
              <span className="font-display text-teal-deep text-[10px] font-bold leading-tight text-center">
                קשר של<br />תפילין
              </span>
            </div>
            <span className="font-display text-2xl font-bold text-white">אור חדש</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            מיזם של ערבות הדדית וזיכוי הרבים - מחלקים תפילין לכל יהודי שרוצה להתחבר.
          </p>
        </div>

        <div>
          <h4 className="font-display font-bold text-white text-lg mb-3">ניווט מהיר</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#request" className="hover:text-teal transition-colors">בקשת תפילין</a></li>
            <li><a href="#donate" className="hover:text-teal transition-colors">תרומת תפילין</a></li>
            <li><a href="#stories" className="hover:text-teal transition-colors">סיפורים</a></li>
            <li><a href="#press" className="hover:text-teal transition-colors">כתבות בתקשורת</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold text-white text-lg mb-3">יצירת קשר</h4>
          <p className="text-sm">עמותת אור חדש</p>
          <p className="text-sm mt-1">tefilin@or-hadash.org.il</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-white/15 text-center text-xs text-white/60">
        © {new Date().getFullYear()} עמותת אור חדש · כל הזכויות שמורות
      </div>
    </footer>
  );
}
