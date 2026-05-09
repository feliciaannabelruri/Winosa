import React from 'react';

// Taruh interface ini di types/portfolio.ts kalau udah ada, atau biarkan di sini
export interface Testimony {
  name:    string;
  role:    string;
  content: string;
  rating:  number;
}

interface Props {
  testimonials: Testimony[];
}

const TestimonialsSection: React.FC<Props> = ({ testimonials }) => {
  // Auto-hidden kalau kosong — konsisten sama Gallery & section lain
  if (!testimonials?.length) return null;

  return (
    <section className="py-16 px-6 md:px-12 lg:px-20">
      {/* Section header */}
      <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">
        What clients say
      </p>
      <h2 className="text-3xl md:text-4xl font-display font-bold text-dark mb-10">
        Client Testimonials
      </h2>

      {/* Horizontal scroll cards */}
      <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:-mx-12 md:px-12 lg:-mx-20 lg:px-20">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="snap-start flex-shrink-0 w-72 md:w-80 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4"
          >
            {/* Nama & role di atas */}
            <div>
              <p className="text-sm font-semibold text-dark">{t.name}</p>
              {t.role && (
                <p className="text-xs text-gray-400 mt-0.5">{t.role}</p>
              )}
            </div>

            {/* Bintang */}
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  className={`text-base ${star <= t.rating ? 'text-amber-400' : 'text-gray-200'}`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Tanda kutip dekoratif */}
            <span className="text-5xl font-serif text-gray-100 leading-none select-none">
              "
            </span>

            {/* Isi testimony */}
            <p className="text-sm text-gray-500 leading-relaxed italic -mt-4 flex-1">
              {t.content}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;