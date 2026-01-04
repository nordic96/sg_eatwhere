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
  const containerStyles = cn(
    'py-8 md:py-12 px-4 md:px-0',
    backgroundStyles[background],
    className,
  );

  const titleStyles = cn(
    'text-xl md:text-2xl font-bold text-gray-800',
    showTitleUnderline && 'border-b-[3px] border-primary pb-2 mb-6 inline-block',
    !showTitleUnderline && 'mb-4',
    titleClassName,
  );

  return (
    <section id={id} className={containerStyles} aria-labelledby={title ? `${id}-title` : undefined}>
      {title && (
        <h3 id={id ? `${id}-title` : undefined} className={titleStyles}>
          {title}
        </h3>
      )}
      <div className="section-content">{children}</div>
    </section>
  );
}
