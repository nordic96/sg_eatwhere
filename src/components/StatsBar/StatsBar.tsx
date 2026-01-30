'use client';

import { cn } from '@/utils';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useCountUp } from '@/hooks/useCountUp';

export interface StatItem {
  /** The stat value (e.g., "10+", "100+") */
  value: string;
  /** The stat label (e.g., "Years", "Spots") */
  label: string;
  /** Optional icon to display */
  icon?: React.ReactNode;
  /** Numeric value for counter animation (parsed from value if not provided) */
  numericValue?: number;
  /** Suffix for counter (e.g., "+", "%") */
  suffix?: string;
}

export interface StatsBarProps {
  /** Array of stat items to display */
  stats: StatItem[];
  /** Layout variant: 'default' for responsive, 'compact' for always grid */
  variant?: 'default' | 'compact';
  /** Additional CSS classes */
  className?: string;
  /** Enable counter animation on scroll */
  animateOnScroll?: boolean;
  /** Duration for counter animation in ms */
  animationDuration?: number;
  /** Stagger delay between items in ms */
  staggerDelay?: number;
}

/** Parse numeric value and suffix from stat value string */
function parseStatValue(value: string): { numeric: number; suffix: string } {
  const match = value.match(/^(\d+)(.*)$/);
  if (match) {
    return { numeric: parseInt(match[1], 10), suffix: match[2] || '' };
  }
  return { numeric: 0, suffix: value };
}

/** Individual stat item with counter animation */
function AnimatedStatItem({
  stat,
  index,
  isVisible,
  animationDuration,
  staggerDelay,
}: {
  stat: StatItem;
  index: number;
  isVisible: boolean;
  animationDuration: number;
  staggerDelay: number;
}) {
  const { numeric, suffix } =
    stat.numericValue !== undefined
      ? { numeric: stat.numericValue, suffix: stat.suffix || '' }
      : parseStatValue(stat.value);

  const animatedValue = useCountUp({
    end: numeric,
    startCounting: isVisible,
    duration: animationDuration,
    suffix,
  });

  const itemStyles = cn(
    'flex flex-col items-center justify-center p-4 rounded-lg',
    'bg-gray-50 transition-all duration-500',
    'hover:bg-gray-100 hover:shadow-sm',
    // Staggered fade-in
    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
  );

  const valueStyles = cn(
    'text-3xl md:text-3xl lg:text-3xl font-bold',
    'text-primary bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent',
  );

  const labelStyles = cn('text-sm md:text-base text-gray-600 font-medium mt-1');

  const iconStyles = cn('text-primary mb-2 text-xl md:text-2xl');

  return (
    <div
      key={`${stat.label}-${index}`}
      className={itemStyles}
      role="listitem"
      style={{ transitionDelay: `${index * staggerDelay}ms` }}
    >
      {stat.icon && <span className={iconStyles}>{stat.icon}</span>}
      <span className={valueStyles}>{animatedValue}</span>
      <span className={labelStyles}>{stat.label}</span>
    </div>
  );
}

/** Individual stat item without animation */
function StaticStatItem({ stat, index }: { stat: StatItem; index: number }) {
  const itemStyles = cn(
    'flex flex-col items-center justify-center p-4 rounded-lg',
    'bg-gray-50 transition-all duration-200',
    'hover:bg-gray-100 hover:shadow-sm',
  );

  const valueStyles = cn(
    'text-3xl md:text-3xl lg:text-3xl font-bold',
    'text-primary bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent',
  );

  const labelStyles = cn('text-sm md:text-base text-gray-600 font-medium mt-1');

  const iconStyles = cn('text-primary mb-2 text-xl md:text-2xl');

  return (
    <div key={`${stat.label}-${index}`} className={itemStyles} role="listitem">
      {stat.icon && <span className={iconStyles}>{stat.icon}</span>}
      <span className={valueStyles}>{stat.value}</span>
      <span className={labelStyles}>{stat.label}</span>
    </div>
  );
}

export default function StatsBar({
  stats,
  variant = 'default',
  className,
  animateOnScroll = false,
  animationDuration = 2000,
  staggerDelay = 100,
}: StatsBarProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({
    threshold: 0.2,
  });

  const containerStyles = cn(
    'w-full',
    variant === 'default'
      ? 'grid grid-cols-2 gap-4 md:flex md:flex-row md:justify-start md:gap-4 lg:gap-8'
      : 'grid grid-cols-2 gap-4',
    className,
  );

  return (
    <div
      ref={animateOnScroll ? ref : undefined}
      className={containerStyles}
      role="list"
      aria-label="Statistics"
    >
      {stats.map((stat, index) =>
        animateOnScroll ? (
          <AnimatedStatItem
            key={`${stat.label}-${index}`}
            stat={stat}
            index={index}
            isVisible={isVisible}
            animationDuration={animationDuration}
            staggerDelay={staggerDelay}
          />
        ) : (
          <StaticStatItem key={`${stat.label}-${index}`} stat={stat} index={index} />
        ),
      )}
    </div>
  );
}
