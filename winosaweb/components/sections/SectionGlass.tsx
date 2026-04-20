export default function SectionGlass() {
  return (
    <section
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/bg/section-3.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-20 min-h-screen flex items-center justify-center">
        <div className="glass-card rounded-none p-20 max-w-3xl text-center">
          <h2 className="text-4xl font-bold text-black mb-6">
            Work With Purpose
          </h2>
          <p className="text-gray-900 text-lg">
            Meaningful projects, real growth, real collaboration.
          </p>
        </div>
      </div>
    </section>
  );
}
