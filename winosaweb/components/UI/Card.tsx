type CardProps = {
  image: string;
  title: string;
  description: string;
  variant?: "services" | "preview";
};

export default function Card({
  image,
  title,
  description,
  variant = "preview",
}: CardProps) {
  if (variant === "services") {
    return (
      <div
        className="
          flex items-center gap-6
          bg-white
          rounded-[28px]
          px-10 py-8
          border border-black
          shadow-[0_12px_30px_rgba(0,0,0,0.15)]
          transition
          hover:shadow-[0_18px_45px_rgba(0,0,0,0.2)]
        "
      >
        <div className="w-24 h-24 flex items-center justify-center">
          <img src={image} className="w-24 h-24" />
        </div>

        <div>
          <h3 className="font-bold text-black text-lg mb-2">
            {title}
          </h3>
          <p className="text-sm text-black/70 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        bg-white
        rounded-xl
        shadow-lg
        hover:shadow-2xl
        transition
        overflow-hidden
      "
    >
      <img
        src={image}
        className="w-full h-[180px] object-cover"
      />

      <div className="p-6">
        <h3 className="font-semibold mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600">
          {description}
        </p>
      </div>
    </div>
  );
}
