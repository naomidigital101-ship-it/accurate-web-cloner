export function InterviewSection() {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-display font-bold text-2xl md:text-3xl text-ink mb-8">
          צפו בראיון של הרב עמיחי אייל שמציג את המיזם "קשר של תפילין":
        </h2>
        <div className="aspect-video rounded-2xl overflow-hidden shadow-card border-4 border-teal/30">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/aQYiyBfycrc"
            title='הרב עמיחי אייל מציג את המיזם "קשר של תפילין" - ערוץ 7'
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
