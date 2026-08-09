import type { CSSProperties } from "react";

/**
 * הסתרת שדה מלכודת הבוטים.
 *
 * הגרסה הקודמת השתמשה ב-position:absolute עם left:-9999px. ה-direction המחושב
 * של השורש הוא rtl בכל האתר (ה-CSS דורס את התכונה dir ב-html), ולכן גלישה שמאלה
 * הופכת לשטח גלילה אמיתי: כל עמוד עם טופס קיבל כ-9,500 פיקסלים של גלילה אופקית,
 * ורכיבים ברוחב 100% - כמו הפוטר - כיסו רק את רוחב החלון ולא את המסמך.
 *
 * גזירה ב-clip לא מייצרת גלישה בשום כיוון. השדה נשאר ב-DOM ונשלח עם הטופס,
 * כך שהמלכודת ממשיכה לעבוד - עדיף כאן על display:none, שבוטים רבים מדלגים עליו.
 */
export const HONEYPOT_STYLE: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  border: 0,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
};
