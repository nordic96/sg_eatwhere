import { cn } from '@/app/utils';

export interface SectionProps {
  /** Section title displayed with accent styling */
  title?: string;
  /** Content to render inside the section */
  children: React.ReactNode;
  /** Background color variant */
  background?: 'white' | 'gray' | 'accent';
  /** Optional ID for anchor linking */
  id?: string;
  /** Whether to show the decorative title underline */
  showTitleUnderline?: boolean;
  /** Additional CSS classes for the container */
  className?: string;
  /** Additional CSS classes for the title */
  titleClassName?: string;
}

const backgroundStyles = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  accent: 'bg-red-50',
};

export default function Section({
  title,
  children,
  background = 'white',
  id,
  showTitleUnderline = true,
  className,
  titleClassName,
}: SectionProps) {
  const containerStyles = cn('py-8 md:py-8 px-4', backgroundStyles[background], className);

  const titleStyles = cn(
    'text-xl md:text-2xl font-bold text-gray-800',
    showTitleUnderline && 'border-b-[3px] border-primary pb-2 mb-6 inline-block',
    !showTitleUnderline && 'mb-4',
    titleClassName,
  );

  const titleId = id && title ? `${id}-title` : undefined;
  return (
    <section id={id} className={containerStyles} aria-labelledby={titleId}>
      {title && (
        <h3 id={titleId} className={titleStyles}>
          {title}
        </h3>
      )}
      <div className="section-content">{children}</div>
    </section>
  );
}
