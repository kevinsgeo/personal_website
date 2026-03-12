"use client";

export default function Particles({ count = 80 }: { count?: number }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <Particle key={i} index={i} />
      ))}
    </div>
  );
}

function Particle({ index }: { index: number }) {
  const size = 1 + (index % 3);
  const left = (index * 13 + 7) % 100;
  const duration = 6 + (index % 14);
  const delay = (index * 0.4) % 12;
  const startY = 100 + (index % 30);
  const brightness = 0.15 + (index % 6) * 0.07;
  const drift = (index % 2 === 0 ? 1 : -1) * (5 + (index % 10));

  return (
    <div
      className="absolute rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        bottom: `-${size}px`,
        backgroundColor: `rgba(0, 255, 65, ${brightness})`,
        animation: `floatUp${index} ${duration}s ${delay}s linear infinite`,
      }}
    >
      <style jsx>{`
        @keyframes floatUp${index} {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-${startY}vh) translateX(${drift}px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
