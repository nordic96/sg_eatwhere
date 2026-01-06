import { cn } from '@/app/utils';
import { Email, GitHub, LinkedIn } from '@mui/icons-material';
import Home from '@mui/icons-material/Home';

interface SocialLink {
  href: string;
  icon: React.ReactNode;
  label: string;
  ariaLabel: string;
}

export interface NameCardProps {
  /** Show text labels below icons */
  showLabels?: boolean;
  /** Layout style: compact (icons only) or expanded (with labels) */
  variant?: 'compact' | 'expanded';
  /** Optional email address to display */
  email?: string;
  /** Additional CSS classes */
  className?: string;
}

const defaultSocialLinks: SocialLink[] = [
  {
    href: 'https://www.linkedin.com/in/gi-hun-ko-863619184/',
    icon: <LinkedIn />,
    label: 'LinkedIn',
    ariaLabel: 'Visit LinkedIn profile',
  },
  {
    href: 'https://github.com/nordic96',
    icon: <GitHub />,
    label: 'GitHub',
    ariaLabel: 'Visit GitHub profile',
  },
  {
    href: 'https://stephenghk.com',
    icon: <Home />,
    label: 'Portfolio',
    ariaLabel: 'Visit portfolio website',
  },
];

export default function NameCard({
  showLabels = false,
  variant = 'compact',
  email,
  className,
}: NameCardProps) {
  const isExpanded = variant === 'expanded' || showLabels;

  const socialLinks = [...defaultSocialLinks];

  // Add email link if provided
  if (email) {
    socialLinks.push({
      href: `mailto:${email}`,
      icon: <Email />,
      label: 'Email',
      ariaLabel: `Send email to ${email}`,
    });
  }

  const linkBaseStyles = cn(
    'flex items-center gap-2 text-gray-700 transition-all duration-200 ease-in-out',
    'hover:text-primary hover:scale-110',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md',
    isExpanded && 'flex-col',
  );

  const iconStyles = 'text-2xl';
  const labelStyles =
    'text-xs font-medium text-gray-500 group-hover:text-primary transition-colors';

  return (
    <div
      className={cn(
        'flex items-center',
        isExpanded ? 'mt-4 gap-4 flex-wrap justify-start' : 'gap-1',
        className,
      )}
      role="navigation"
      aria-label="Social links"
    >
      {socialLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(linkBaseStyles, 'group')}
          aria-label={link.ariaLabel}
        >
          <span className={iconStyles}>{link.icon}</span>
          {isExpanded && <span className={labelStyles}>{link.label}</span>}
        </a>
      ))}
    </div>
  );
}
