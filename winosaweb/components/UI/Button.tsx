"use client";

import Link from "next/link";

type Variant = "dark" | "light";

type ButtonProps = {
  text: string;
  href?: string;
  variant?: Variant;
  onClick?: () => void;
  className?: string;
};

export default function Button({
  text,
  href,
  variant = "dark",
  onClick,
  className = "",
}: ButtonProps) {

  const base = `
    inline-flex items-center justify-center
    px-8 py-3
    rounded-full
    font-semibold
    border
    bg-transparent
    transition-all duration-300
  `;

  const variants = {
    dark: `
      border-black text-black
      hover:bg-black/20
    `,
    light: `
      border-white text-white
      hover:bg-white/20
    `,
  };

  const style = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={style}>
        {text}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={style}>
      {text}
    </button>
  );
}
