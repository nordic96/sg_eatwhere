'use client';

import { cn } from '@/app/utils';
import { useScrollReveal, UseScrollRevealOptions } from '@/app/hooks/useScrollReveal';
import { ClassValue } from 'clsx';
import { PropsWithChildren, useEffect, useState } from 'react';

export type FadeInDirection = 'up' | 'down' | 'left' | 'right' | 'none';

export interface FadeInProps {
  /** Additional CSS classes */
  className?: string | ClassValue;
  /** Whether to use scroll-triggered animation (default: false for backwards compatibility) */
  scrollTrigger?: boolean;
  /** Direction to fade in from (default: 'up') */
  direction?: FadeInDirection;
  /** Animation duration in ms (default: 700) */
  duration?: number;
  /** Delay before animation starts in ms (default: 0) */
  delay?: number;
  /** Intersection Observer options for scroll trigger */
  scrollOptions?: UseScrollRevealOptions;
}

const directionStyles: Record<FadeInDirection, { initial: string; visible: string }> = {
  up: {
    initial: 'translate-y-5',
    visible: 'translate-y-0',
  },
  down: {
    initial: '-translate-y-5',
    visible: 'translate-y-0',
  },
  left: {
    initial: 'translate-x-5',
    visible: 'translate-x-0',
  },
  right: {
    initial: '-translate-x-5',
    visible: 'translate-x-0',
  },
  none: {
    initial: '',
    visible: '',
  },
};

/**
 * FadeIn component for smooth reveal animations.
 * Supports both mount-triggered and scroll-triggered animations.
 *
 * @example
 * // Mount-triggered (original behavior)
 * <FadeIn>Content</FadeIn>
 *
 * @example
 * // Scroll-triggered with direction
 * <FadeIn scrollTrigger direction="up" delay={200}>
 *   Content that fades in when scrolled into view
 * </FadeIn>
 */
export default function FadeIn({
  children,
  className,
  scrollTrigger = false,
  direction = 'up',
  duration = 700,
  delay = 0,
  scrollOptions,
}: PropsWithChildren<FadeInProps>) {
  // For mount-triggered animation (backwards compatible)
  const [mountLoaded, setMountLoaded] = useState<boolean>(false);

  // For scroll-triggered animation
  const { ref, isVisible, prefersReducedMotion } = useScrollReveal<HTMLDivElement>({
    delay,
    ...scrollOptions,
  });

  useEffect(() => {
    if (!scrollTrigger) {
      const timer = delay > 0 ? setTimeout(() => setMountLoaded(true), delay) : null;
      if (!timer) setMountLoaded(true);
      return () => {
        if (timer) clearTimeout(timer);
      };
    }
  }, [scrollTrigger, delay]);

  // Determine visibility based on mode
  const isLoaded = scrollTrigger ? isVisible : mountLoaded;

  // If user prefers reduced motion, skip animations
  const skipAnimation = prefersReducedMotion;

  const { initial, visible } = directionStyles[direction];

  const baseStyle = cn(
    'transition-all ease-out',
    !skipAnimation && `duration-${duration}`,
  );

  const animationStyle = skipAnimation
    ? 'opacity-100'
    : cn(
        isLoaded ? 'opacity-100' : 'opacity-0',
        isLoaded ? visible : initial,
      );

  // Use inline style for custom duration since Tailwind doesn't support arbitrary duration classes
  const style = skipAnimation ? {} : { transitionDuration: `${duration}ms` };

  return (
    <div
      ref={scrollTrigger ? ref : undefined}
      className={cn(baseStyle, animationStyle, className)}
      style={style}
    >
      {children}
    </div>
  );
}
