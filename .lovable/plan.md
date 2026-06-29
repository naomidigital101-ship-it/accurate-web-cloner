## בנייה פיזית של עמוד הבית ב-React 1:1

המטרה: להחליף את המירור (`mirror-body.html` + `dangerouslySetInnerHTML`) בעמוד React מלא שמשחזר את `tefilin.or-hadash.org.il` 1:1, עם שליטה מלאה על הקוד, ה-SEO, וההתאמה לנייד.

### גישה כללית
- שמירה על אותם נכסים (תמונות, פונטים, SVG) שכבר ירדו ל-`public/wp/`.
- שימוש בטוקנים הקיימים מ-`elementor-kit-7` (Navy `#2D2E83`, Mint `#67FFD1`, Sky `#009FE3`, Yellow `#F9B233`, Text `#060633`) ובפונט Maadim OS.
- בניית כל סקציה כקומפוננטת React עצמאית תחת `src/components/home/`, עם Tailwind v4 בלבד (ללא Elementor CSS).
- ניקוי הקבצים הזרים של Elementor משרשרת הטעינה — שמירה רק על הפונטים והתמונות.

### סקציות (לפי סדר באתר המקורי)
1. **Header** — Sticky, רקע Navy חצי-שקוף + גרדיאנט, לוגו עגול תלוי מתחת לקו, תפריט Maadim 600/16px, hover מנטה, drawer במובייל.
2. **Hero** — וידאו Vimeo ברקע (כיסוי מלא), שכבת overlay כהה, תמונת כותרת SVG (`hero-title.svg`) ממורכזת, שני כפתורים (לבן→מנטה).
3. **About / מה זה תפילין** — שתי עמודות: תמונה ברדיוס גדול + טקסט + CTA מנטה.
4. **HowItWorks** — שלושה צעדים ממוספרים (כרטיסים עם רקע Sky בהיר, מספר בגדול, אייקון).
5. **RequestForm** — טופס בקשה רב-שלבי, כפתורי `.btn-form`, ולידציה עם sonner.
6. **DonationBanner** — באנר Navy עם וידאו/תמונה ברקע + CTA מנטה.
7. **DonateTefilinForm** — טופס תרומת תפילין יד שנייה.
8. **Stories** — גריד 3 עמודות של סיפורים אישיים עם תמונה+שם+ציטוט.
9. **Interviews** — שני embed של YouTube + כותרת.
10. **Rabbis / הסכמות** — קרוסלת ציטוטים של רבנים, רקע cream.
11. **Letters** — גריד תמונות של מכתבי תודה (lightbox פשוט).
12. **Press** — לוגואי מדיה + כותרות כתבות.
13. **FAQ** — Accordion (shadcn).
14. **Founder** — תמונה + ביוגרפיה של מייסד המיזם.
15. **Footer** — Navy, לוגו אור חדש, תפריט, זכויות יוצרים.

### עבודה טכנית
- `src/routes/index.tsx`: להסיר את `dangerouslySetInnerHTML` ואת כל ה-STYLESHEETS, להחזיר רינדור של קומפוננטות `<Header/> <main>...</main> <Footer/>`.
- `src/styles.css`: לוודא טוקני `@theme` (color-navy, color-mint, color-sky, color-yellow, color-ink, color-cream) + פונט Maadim OS כברירת מחדל + מחלקות `.btn-mint` / `.btn-form` (קיימות).
- שימוש מחדש בקומפוננטות הקיימות (`HeroSection`, `RequestForm`, `Stories`, וכו') לאחר רענון עיצובי כדי שיתאימו בדיוק לסטיילים שחולצו מאלמנטור.
- בדיקה ב-Playwright מול האתר המקורי (צילומי מסך side-by-side ב-1280 ובמובייל) ל-QA פדנטי.

### SEO ונגישות
- `<title>`, `<meta description>`, canonical, og: ב-`Route.head()`.
- H1 אחד (תמונת כותרת תקבל `alt` עברי), היררכיית H2/H3, `aria-label` בעברית לכל אינטראקטיבי.
- כל התמונות עם `loading="lazy"` ו-`alt` תיאורי.

### תוצר סופי
עמוד `/` שנראה כמו האתר המקורי אבל מורכב 100% מ-React + Tailwind, ללא תלות בקבצי Elementor.