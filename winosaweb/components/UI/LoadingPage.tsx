"use client";

export default function LoadingPage() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin" />

        {/* Text */}
        <p className="text-gray-600 text-sm animate-pulse">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
}