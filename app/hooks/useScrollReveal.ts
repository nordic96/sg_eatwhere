'use client';

import { useEffect, useRef, useState, useCallback, MutableRefObject } from 'react';

export interface UseScrollRevealOptions {
  /** Threshold for intersection (0-1), default 0.1 */
  threshold?: number;
  /** Root margin for earlier/later trigger, default '0px' */
  rootMargin?: string;
  /** Only trigger once, default true */
  once?: boolean;
  /** Delay before animation starts (ms), default 0 */
  delay?: number;
}

export interface UseScrollRevealReturn<T extends HTMLElement> {
  /** Ref to attach to the element */
  ref: React.RefObject<T | null>;
  /** Whether the element is visible/has been revealed */
  isVisible: boolean;
  /** Whether reduced motion is preferred */
  prefersReducedMotion: boolean;
}

/**
 * Hook for scroll-triggered reveal animations using Intersection Observer.
 * Respects user's prefers-reduced-motion preference.
 *
 * @example
 * ```tsx
 * const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
 *
 * return (
 *   <div
 *     ref={ref}
 *     className={cn(
 *       'transition-all duration-700',
 *       isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
 *     )}
 *   >
 *     Content
 *   </div>
 * );
 * ```
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {},
): UseScrollRevealReturn<T> {
  const { threshold = 0.1, rootMargin = '0px', once = true, delay = 0 } = options;

  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  // Track timeout for cleanup to prevent memory leak
  const timeoutRef: MutableRefObject<ReturnType<typeof setTimeout> | null> = useRef(null);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // If reduced motion is preferred, show immediately
  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
    }
  }, [prefersReducedMotion]);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      const [entry] = entries;

      if (entry.isIntersecting) {
        if (delay > 0) {
          // Clear any existing timeout before setting a new one
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
        } else {
          setIsVisible(true);
        }

        if (once) {
          observer.disconnect();
        }
      } else if (!once) {
        // Clear pending timeout when element leaves view
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        setIsVisible(false);
      }
    },
    [once, delay],
  );

  useEffect(() => {
    // Skip if reduced motion is preferred
    if (prefersReducedMotion) return;

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
      // Clean up any pending timeout to prevent memory leak
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [threshold, rootMargin, handleIntersection, prefersReducedMotion]);

  return { ref, isVisible, prefersReducedMotion };
}

export default useScrollReveal;
