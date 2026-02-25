"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface StatItem {
  target: number;
  suffix: string;
  label: string;
}

const STATS: StatItem[] = [
  { target: 500, suffix: "+", label: "Properties Listed" },
  { target: 1000, suffix: "+", label: "Happy Customers" },
  { target: 14, suffix: "", label: "Builder Partners" },
  { target: 1, suffix: "", label: "City (Bangalore)" },
];

function useCountUp(target: number, shouldStart: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!shouldStart) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out quad for smooth deceleration
      const easedProgress = 1 - (1 - progress) * (1 - progress);
      setCount(Math.floor(easedProgress * target));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      }
    };

    frameRef.current = requestAnimationFrame(step);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [shouldStart, target, duration]);

  return count;
}

function StatCounter({ stat }: { stat: StatItem }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const count = useCountUp(stat.target, isVisible);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
        {count}
        {stat.suffix}
      </div>
      <p className="mt-2 text-sm font-medium text-white/70 md:text-base">
        {stat.label}
      </p>
    </div>
  );
}

export function StatsCounter() {
  return (
    <section className="bg-gradient-to-r from-[#1B3A5C] to-[#152d47] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
          {STATS.map((stat) => (
            <StatCounter key={stat.label} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
