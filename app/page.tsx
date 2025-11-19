import LoveLetter from "./components/LoveLetter";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating hearts */}
        {Array.from({ length: 8 }).map((_, i) => {
          const delay = i * 0.5;
          const duration = 15 + (i % 3) * 5;
          const left = 10 + ((i * 12) % 80);
          return (
            <div
              key={i}
              className="absolute opacity-20 animate-float-heart"
              style={{
                left: `${left}%`,
                top: `${20 + ((i * 15) % 60)}%`,
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
              }}
            >
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-pink-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          );
        })}
      </div>

      <LoveLetter />
    </div>
  );
}
