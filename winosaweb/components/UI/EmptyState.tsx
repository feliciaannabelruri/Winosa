"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Search, FolderOpen } from "lucide-react";

type Props = {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  icon?: "search" | "folder";
};

export default function EmptyState({
  title = "No Data Found",
  description = "We couldn’t find what you’re looking for.",
  buttonText,
  buttonLink,
  icon = "search",
}: Props) {
  const Icon = icon === "folder" ? FolderOpen : Search;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full flex flex-col items-center justify-center py-32 text-center"
    >
      {/* Soft gold glow */}
      <div className="relative mb-8">
        <div className="absolute -inset-10 blur-[60px] opacity-40 bg-[radial-gradient(circle,rgba(255,185,0,0.4)_0%,transparent_70%)]" />
        <Icon size={48} strokeWidth={1.5} className="relative text-black" />
      </div>

      <h3 className="text-2xl font-semibold text-black mb-4">
        {title}
      </h3>

      <p className="text-sm text-black/60 max-w-md mb-8">
        {description}
      </p>

      {buttonText && buttonLink && (
        <Link href={buttonLink}>
          <span className="inline-block px-6 py-2 rounded-full border border-black text-sm text-black hover:bg-black/10 transition">
            {buttonText}
          </span>
        </Link>
      )}
    </motion.div>
  );
}
