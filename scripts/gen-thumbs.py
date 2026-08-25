"""
מייצר תמונות ממוזערות לגלריה, למכתבים ולדיוקנאות.

הבעיה: הגלריה מציגה 28 תמונות ברוחב 305 פיקסל, אבל טוענת אותן בגודל מלא -
1400 עד 2048 פיקסל. כך גם כרטיסי המכתבים וההסכמות. זה מגה-בייטים שיורדים
לדפדפן בשביל פיקסלים שלעולם לא מוצגים.

הפתרון הוא לא לרסק את איכות המקור אלא להפריד: ממוזערת לרשת, מקור מלא
ללייטבוקס ולפתיחה בלשונית חדשה. האיכות בצפייה המלאה נשארת בדיוק כפי שהיא.

640px = פי שניים מרוחב התצוגה (305), כלומר חד גם על מסך Retina.
"""
import io, os, sys, urllib.parse
from PIL import Image

PUB = 'public'
apply = '--apply' in sys.argv
THUMB = 640
OUTDIR = os.path.join(PUB, 'wp', 'thumbs')

GALLERY = [f'g{i}' for i in range(1, 29)]
# כל תמונה מעל הסף מקבלת ממוזערת. הכרטיסים באתר - גלריה, מכתבים, הסכמות,
# אישורים - כולם מציגים בסביבות 300 פיקסל ופותחים את המקור בלחיצה.
SRC_ROOTS = ['wp/uploads', 'wp/img', 'wp/assets']
MIN_BYTES = 60 * 1024


def thumb_name(url):
    """/wp/uploads/gallery/g3.jpg -> /wp/thumbs/uploads-gallery-g3.webp"""
    p = urllib.parse.unquote(url).lstrip('/')
    p = p[len('wp/'):] if p.startswith('wp/') else p
    base = os.path.splitext(p)[0].replace('/', '-')
    return '/wp/thumbs/' + base + '.webp'


def build(url):
    src = os.path.join(PUB, urllib.parse.unquote(url).lstrip('/'))
    if not os.path.exists(src):
        return None
    dst_url = thumb_name(url)
    dst = os.path.join(PUB, urllib.parse.unquote(dst_url).lstrip('/'))
    im = Image.open(src)
    im.load()
    im.thumbnail((THUMB, THUMB), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, 'WEBP', quality=80, method=6)
    if apply:
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        io.open(dst, 'wb').write(buf.getvalue())
    return os.path.getsize(src), buf.tell(), dst_url


urls = []
for root in SRC_ROOTS:
    for dp, dn, fn in os.walk(os.path.join(PUB, root)):
        if 'thumbs' in dp:
            continue
        for f in sorted(fn):
            if os.path.splitext(f)[1].lower() not in ('.jpg', '.jpeg', '.png', '.webp'):
                continue
            fp = os.path.join(dp, f)
            if os.path.getsize(fp) < MIN_BYTES:
                continue
            urls.append('/' + os.path.relpath(fp, PUB).replace(os.sep, '/'))

rep = io.open(os.devnull, 'w', encoding='utf-8', newline='\n')
rep.write('הוחל\n\n' if apply else 'הרצת יבש\n\n')
b = a = 0
for u in urls:
    r = build(u)
    if not r:
        rep.write(f'חסר: {u}\n')
        continue
    before, after, dst = r
    b += before
    a += after
    rep.write(f'{before//1024:6d}K -> {after//1024:5d}K   {u}  ->  {dst}\n')
rep.write(f'\nמשקל הגלריה בעמוד: {b/1024/1024:.2f} MB -> {a/1024/1024:.2f} MB '
          f'({100*(b-a)/max(b,1):.0f}% פחות)\n')
rep.close()
print(('הוחל' if apply else 'יבש'), f'{len(urls)} תמונות, {b/1024/1024:.2f} -> {a/1024/1024:.2f} MB')
