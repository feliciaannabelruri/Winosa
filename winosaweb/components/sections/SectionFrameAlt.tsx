export default function SectionFrameAlt({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <section
      className="relative bg-cover bg-center"
      style={{ backgroundImage: "url('/bg/section-4.jpg')" }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 pt-24 pb-16">
        <div className="glass-card rounded-none p-10 max-w-md">
          <h2 className="text-4xl font-bold text-black mb-4">
            Join Our Culture
          </h2>
          <p className="text-gray-800">
            Grow your career with a supportive global team.
          </p>
        </div>
      </div>

      {/* FOOTER */}
      {children}
    </section>
  );
}
