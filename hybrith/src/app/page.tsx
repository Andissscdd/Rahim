import Link from "next/link";
import React from "react";

export default function Landing() {
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-black via-purple-800 to-green-600 animate-gradient-xy">
      {/* Animated blurred blob background */}
      <div className="pointer-events-none absolute -inset-64 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_60%)] opacity-40 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <h1 className="text-white text-6xl md:text-8xl font-extrabold drop-shadow-md select-none tracking-tight">
          HYBRITH
        </h1>
        <p className="mt-4 text-xl md:text-2xl text-white/80 max-w-xl">
          La fusion ultime des expériences sociales : vidéos virales & amitiés
          authentiques.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/signup"
            className="rounded-full bg-violet-600 hover:bg-violet-700 active:scale-95 transition-transform text-white font-semibold px-8 py-3 shadow-lg"
          >
            Créer un compte
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-transform backdrop-blur text-white font-semibold px-8 py-3 border border-white/30 shadow-lg"
          >
            Se connecter
          </Link>
        </div>
      </div>

      {/* Gradient animation */}
      <style jsx>{`
        @keyframes gradient-xy {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-xy {
          background-size: 200% 200%;
          animation: gradient-xy 10s ease infinite;
        }
      `}</style>
    </div>
  );
}
