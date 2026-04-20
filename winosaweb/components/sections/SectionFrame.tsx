export default function SectionWhyIndonesia() {
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
          Why Indonesia?
        </h2>

        {/* ROW 1 */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">

          {/* TEXT */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">
              Fast growing economy
            </h3>
            <p className="text-white/80 leading-relaxed max-w-xl">
              Indonesia is one of the fastest growing tigers in Southeast Asia. The country has emerged as a prominent economic power in Southeast Asia. Its rapid growth trajectory has cemented its position as a ‘rising tiger’ in the region. The recent growth is particularly visible in the Tech sector, where startups are flourishing and investors are turning their attention to innovative solutions. Think of the rise of e-commerce platforms that are revolutionizing the way Indonesians shop. This has given local entrepreneurs more opportunities to sell their products to a wider audience.
            </p>
          </div>

          {/* IMAGE */}
          <div className="flex justify-end">
            <div className="relative w-64 h-64 rounded-full overflow-hidden">
              <img
                src="/why/row1-1.jpg"
                className="absolute inset-0 w-full h-full object-cover crossfade delay-1"
              />
              <img
                src="/why/row-2.jpg"
                className="absolute inset-0 w-full h-full object-cover crossfade delay-2"
              />
            </div>
          </div>
        </div>

        {/* ROW 2 */}
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* TEXT */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">
             Huge labor potential
            </h3>
            <p className="text-white/80 leading-relaxed max-w-xl">
              With over 270 million inhabitants, many of whom are under 30 years old, Indonesia has a dynamic and growing labour market. This young population brings with it a fresh energy and innovation. This means that there are many talented and well-trained IT professionals available, which is essential for supporting various IT projects.
            </p>
          </div>

          {/* IMAGE */}
          <div className="flex justify-end">
            <div className="relative w-64 h-64 rounded-full overflow-hidden">
              <img
                src="/why/row2-1.png"
                className="absolute inset-0 w-full h-full object-cover crossfade delay-1"
              />
              <img
                src="/why/row2-2.png"
                className="absolute inset-0 w-full h-full object-cover crossfade delay-2"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
