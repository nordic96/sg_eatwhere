import { cn } from '@/app/utils';

export interface StatItem {
  /** The stat value (e.g., "10+", "100+") */
  value: string;
  /** The stat label (e.g., "Years", "Spots") */
  label: string;
  /** Optional icon to display */
  icon?: React.ReactNode;
}

export interface StatsBarProps {
  /** Array of stat items to display */
  stats: StatItem[];
  /** Layout variant: 'default' for responsive, 'compact' for always grid */
  variant?: 'default' | 'compact';
  /** Additional CSS classes */
  className?: string;
}

export default function StatsBar({ stats, variant = 'default', className }: StatsBarProps) {
  const containerStyles = cn(
    'w-full',
    variant === 'default'
      ? 'grid grid-cols-2 gap-4 md:flex md:flex-row md:justify-center md:gap-8 lg:gap-12'
      : 'grid grid-cols-2 gap-4',
    className,
  );

  const itemStyles = cn(
    'flex flex-col items-center justify-center p-4 rounded-lg',
    'bg-gray-50 transition-all duration-200',
    'hover:bg-gray-100 hover:shadow-sm',
  );

  const valueStyles = cn(
    'text-2xl md:text-3xl lg:text-4xl font-bold',
    'text-primary bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent',
  );

  const labelStyles = cn('text-sm md:text-base text-gray-600 font-medium mt-1');

  const iconStyles = cn('text-primary mb-2 text-xl md:text-2xl');

  return (
    <div className={containerStyles} role="list" aria-label="Statistics">
      {stats.map((stat, index) => (
        <div key={`${stat.label}-${index}`} className={itemStyles} role="listitem">
          {stat.icon && <span className={iconStyles}>{stat.icon}</span>}
          <span className={valueStyles}>{stat.value}</span>
          <span className={labelStyles}>{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
