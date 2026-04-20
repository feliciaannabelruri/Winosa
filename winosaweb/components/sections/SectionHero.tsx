export default function SectionHero() {
  return (
    <section
      className="
        relative min-h-screen bg-cover bg-center
        pt-28 sm:pt-32 md:pt-40 lg:pt-48
      "
      style={{ backgroundImage: "url('/bg/section-1.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-20 max-w-7xl mx-auto px-8">
        <div className="grid md:grid-cols-2 gap-20 items-center">

          {/* TEXT */}
          <div className="text-white max-w-xl animate-fade-up">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Build the Future<br />With WINOSA
            </h1>
            <p className="mt-6 text-lg text-white/90">
              Connecting global companies with Indonesian tech talent.
            </p>
          </div>

          {/* MASKOT FLOATING */}
          <div className="flex justify-center mt-10 md:mt-0">
            <img
              src="/Hero.png"
              alt="WINOSAWEB Mascot"
              className="w-[300px] md:w-[340px] animate-float"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
