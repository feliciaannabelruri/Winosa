import { useTranslate } from "@/lib/useTranslate";

export default function SectionWhyIndonesia() {
  const { t } = useTranslate();

  return (
    <section
      className="relative min-h-screen bg-cover bg-center py-32"
      style={{ backgroundImage: "url('/bg/section-3.jpg')" }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-20 max-w-7xl mx-auto px-8 text-white">

        {/* TITLE */}
        <h2 className="text-4xl md:text-5xl font-semibold mb-20">
          {t("whyIndonesia", "title")}
        </h2>

        {/* ROW 1 */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">

          {/* TEXT */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">
              {t("whyIndonesia", "row1Title")}
            </h3>
            <p className="text-white/80 leading-relaxed max-w-xl">
              {t("whyIndonesia", "row1Desc")}
            </p>
          </div>

          {/* IMAGE */}
          <div className="flex justify-end">
            <div className="relative w-64 h-64 rounded-full overflow-hidden">
              <img
                src="/why/row1-1.jpg"
                className="absolute inset-0 w-full h-full object-cover crossfade delay-1"
                alt="Growth 1"
              />
              <img
                src="/why/row-2.jpg"
                className="absolute inset-0 w-full h-full object-cover crossfade delay-2"
                alt="Growth 2"
              />
            </div>
          </div>
        </div>

        {/* ROW 2 */}
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* TEXT */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">
             {t("whyIndonesia", "row2Title")}
            </h3>
            <p className="text-white/80 leading-relaxed max-w-xl">
              {t("whyIndonesia", "row2Desc")}
            </p>
          </div>

          {/* IMAGE */}
          <div className="flex justify-end">
            <div className="relative w-64 h-64 rounded-full overflow-hidden">
              <img
                src="/why/row2-1.png"
                className="absolute inset-0 w-full h-full object-cover crossfade delay-1"
                alt="Talent 1"
              />
              <img
                src="/why/row2-2.png"
                className="absolute inset-0 w-full h-full object-cover crossfade delay-2"
                alt="Talent 2"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
