"use client";

import { useEffect, useRef, useState } from "react";

interface StatItem {
  target: number;
  suffix: string;
  label: string;
}

const STATS: StatItem[] = [
  { target: 500, suffix: "+", label: "Properties Listed" },
  { target: 1000, suffix: "+", label: "Happy Customers" },
  { target: 14, suffix: "+", label: "Builder Partners" },
  { target: 0, suffix: "%", label: "Buyer Commission" },
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
    <div ref={ref} className="relative py-2">
      <div className="text-3xl font-bold tabular-nums text-white md:text-4xl">
        {count}
        <span className="text-copper-light">{stat.suffix}</span>
      </div>
      <p className="mt-1 text-[13px] text-white/50">
        {stat.label}
      </p>
    </div>
  );
}

export function StatsCounter() {
  return (
    <section className="relative overflow-hidden bg-navy py-12 md:py-14 grain-overlay">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="relative">
              <StatCounter stat={stat} />
              {i < STATS.length - 1 && (
                <div className="absolute right-0 top-1/2 hidden h-8 w-px -translate-y-1/2 bg-white/10 md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
