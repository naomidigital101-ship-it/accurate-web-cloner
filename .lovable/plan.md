# תיקון כפתורים 1:1 לאתר המקורי

חילצתי מ-`public/wp/css/post-10.css` את ההגדרות המדויקות של כל כפתור באתר המקורי וגיליתי שהמימוש הנוכחי שלי שגוי בכמה נקודות מהותיות.

## הבעיה העיקרית

הגדרתי את `btn-mint` (הכפתור הראשי של ה-Hero) כרקע מנטה עם טקסט נייבי — אבל **באתר המקורי הכפתור הוא לבן עם טקסט בתכלת (#009FE3)**, והופך למנטה רק ב-hover. זה הבדל ויזואלי משמעותי שגורם לכל ה-Hero להיראות שונה.

## מה חולץ מהמקור (post-10.css)

### Variant A — "Hero White" (a7f2958, e80d39e, 88ee652, f9cbe0e)
מופיע ב-Hero, סקציית "איך זה עובד", "על מצוות תפילין" ועוד.
```text
background:    #FFFFFF
color:         #009FE3   (sky blue)
font:          "Maadim OS" 18px / bold / line-height 0.9em
padding:       14px 20px 10px 20px   (mobile: 12px 20px 8px 24px)
border-radius: 12px
wrapper shadow: 0 5px 10px rgba(0,0,0,0.17)
hover bg:      #67FFD1
hover color:   #060633   (text)
hover border:  #67FFD1
hover shadow:  0 20px 50px rgba(103,255,209,0.53)
```

### Variant B — "Mint Solid CTA" (999cd9f)
כפתור התרומה הגדול בבאנר.
```text
background:    #67FFD1
color:         #060633
font:          "Maadim OS" 22px / bold / line-height 1.4em / letter-spacing 1px
border:        2px solid #67FFD1
border-radius: 12px
box-shadow:    0 10px 30px rgba(103,255,209,0.82)
mobile:        font-size 18px
```

### Variant C — "Ghost Outline" (c70dd6d)
```text
background:    transparent
font:          "Maadim OS" 22px / bold / letter-spacing 1px
border:        2px solid (current color)
border-radius: 12px
mobile:        font-size 18px
```

### Variant D — "Form Submit" (d32b220)
```text
font:          "Maadim OS" 20px / 600
border:        2px solid
border-radius: 10px
mobile:        font-size 18px / line-height 1.2em
```

## תיקונים

### 1. `src/styles.css` — שכתוב מחלקות הכפתורים
- **`.btn-mint`** → להחליף לשם נכון יותר אך לשמור backwards-compat: רקע לבן, טקסט `#009FE3`, פינות 12px, padding `14px 20px 10px`, `box-shadow:0 5px 10px rgba(0,0,0,.17)`. ב-hover: רקע `#67FFD1`, טקסט `#060633`, shadow `0 20px 50px rgba(103,255,209,.53)`. הסרת ה-`transform: translateY` (לא קיים במקור).
- **הוספת `.btn-mint-solid`** חדש לבאנר התרומה (Variant B): רקע מנטה, טקסט נייבי, 22px, letter-spacing 1px, border 2px מנטה, shadow `0 10px 30px rgba(103,255,209,.82)`.
- **`.btn-outline-light`** → להוסיף letter-spacing 1px, font-size 22px (18px במובייל), line-height 1.4em כדי להתאים ל-Variant C.
- **`.btn-form`** → להוריד מ-`background: accent` ל-נטרלי (לא קיים רקע ב-CSS המקורי על השדה הזה — Elementor משתמש בצבע ברירת מחדל). font 20px/600, radius 10px, border 2px. במובייל font 18px.
- **`.btn-outline-navy` / `.btn-navy`** → התאמת font-weight ל-bold ו-letter-spacing 1px במידת הצורך (Variant C/B navy).
- הוספת media query למובייל לכל הכפתורים (font-size 18px, padding 12px 20px 8px 24px).
- הסרת `font-family: var(--font-display)` כפול והכרזה מפורשת על `"Maadim OS"` כדי שהפונט יהיה זהה למקור.

### 2. החלפת שימושים בקומפוננטות
- **`HeroSection.tsx`** — הכפתורים "לבקשת תפילין" ו"למסירת/תרומת תפילין" כיום משתמשים ב-`btn-mint`. הם נשארים על `btn-mint` אחרי השכתוב (שעכשיו = לבן→מנטה), כך שיתאימו ל-a7f2958/e80d39e המקוריים.
- **`DonationBanner.tsx`** — להחליף את ה-CTA הראשי מ-`btn-mint` ל-`btn-mint-solid` החדש (זה ה-999cd9f במקור).
- **`MiKamchaSection.tsx`, `AboutTefilinSection.tsx`, `FounderSection.tsx`** — לוודא שה-CTA הלבן משתמש ב-`btn-mint` (Variant A) ושכפתור משני משתמש ב-`btn-outline-navy` עם הגדלים המעודכנים.
- **`RequestForm.tsx`, `DonateTefilinForm.tsx`** — כפתורי "הבא/הקודם" יישארו `btn-form`, כפתור "שליחה" סופי יקבל `btn-mint-solid` (כך זה במקור).

### 3. בדיקה ויזואלית
- אחרי השינוי, פתיחת `/` ו-`/branding` והשוואה לסקרינשוט של המקור: לבדוק צבע ברירת מחדל (לבן), צבע hover (מנטה), shadow לפני ואחרי hover, מידות פונט במובייל ובדסקטופ.

## נושאים פתוחים

1. **פונט `Maadim OS`** — באתר המקורי שם המשפחה הוא `"Maadim OS"` בעוד שאצלנו ייתכן שהפונט נטען כ-`"Maadim"`. אם זה המצב, אצטרך להוסיף alias `font-family: "Maadim OS"` ל-`@font-face` ב-`src/styles.css` כדי שהמראה יהיה זהה לחלוטין.
2. **לא נוגעים** ב-Header/Footer/Sections עצמם — רק במחלקות הכפתורים ובשימוש בהן.
