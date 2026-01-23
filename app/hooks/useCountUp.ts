'use client';

import { useEffect, useState, useRef } from 'react';

export interface UseCountUpOptions {
  /** Starting value, default 0 */
  start?: number;
  /** End value to count up to */
  end: number;
  /** Duration of animation in ms, default 2000 */
  duration?: number;
  /** Whether to start the animation, default false */
  startCounting?: boolean;
  /** Easing function, default 'easeOutCubic' */
  easing?: 'linear' | 'easeOutCubic' | 'easeOutQuart';
  /** Suffix to append (e.g., '+', '%'), default '' */
  suffix?: string;
  /** Prefix to prepend (e.g., '$'), default '' */
  prefix?: string;
}

// Easing functions
const easingFunctions = {
  linear: (t: number) => t,
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeOutQuart: (t: number) => 1 - Math.pow(1 - t, 4),
};

/**
 * Hook for animating a number counting up.
 * Works well with useScrollReveal for scroll-triggered counter animations.
 *
 * @example
 * ```tsx
 * const { ref, isVisible } = useScrollReveal();
 * const count = useCountUp({ end: 100, startCounting: isVisible, suffix: '+' });
 *
 * return <span ref={ref}>{count}</span>;
 * ```
 */
export function useCountUp(options: UseCountUpOptions): string {
  const {
    start = 0,
    end,
    duration = 2000,
    startCounting = false,
    easing = 'easeOutCubic',
    suffix = '',
    prefix = '',
  } = options;

  const [count, setCount] = useState(start);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion && startCounting) {
      setCount(end);
      return;
    }

    if (!startCounting || hasStartedRef.current) return;

    hasStartedRef.current = true;
    const easingFn = easingFunctions[easing];

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easingFn(progress);

      const currentValue = Math.floor(start + (end - start) * easedProgress);
      setCount(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [startCounting, start, end, duration, easing]);

  return `${prefix}${count}${suffix}`;
}

export default useCountUp;
