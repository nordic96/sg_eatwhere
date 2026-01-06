'use client';

import { cn } from '@/app/utils';
import Section from '@/app/components/Section';
import TechBadge, { TechBadgeProps } from './TechBadge';
import FadeIn from '@/app/components/FadeIn/FadeIn';
import { useTranslations } from 'next-intl';
import { GitHub, BugReport } from '@mui/icons-material';
import {
  siHuggingface,
  siNextdotjs,
  siReact,
  siTailwindcss,
  siThreedotjs,
  siTypescript,
} from 'simple-icons';

export interface TechStackSectionProps {
  /** List of technologies to display */
  technologies?: TechBadgeProps[];
  /** GitHub repository URL */
  githubUrl?: string;
  /** Custom class name for the container */
  className?: string;
}

const GITHUB_REPO_URL = 'https://github.com/nordic96/sg_eatwhere';
const GITHUB_ISSUES_URL = 'https://github.com/nordic96/sg_eatwhere/issues';

const DEFAULT_TECHNOLOGIES: TechBadgeProps[] = [
  {
    ...siNextdotjs,
    description: 'App framework',
  },
  {
    ...siReact,
    description: 'UI library',
  },
  {
    ...siThreedotjs,
    description: '3D graphics',
  },
  {
    ...siTypescript,
    description: 'Type safety',
  },
  {
    ...siTailwindcss,
    description: 'Styling',
  },
  {
    ...siHuggingface,
    description: 'AI / Machine Learning',
  },
];

const ctaButtonStyles =
  'flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 max-sm:px-4 max-sm:py-2 max-sm:text-xs';

const primaryCtaStyles = cn(
  ctaButtonStyles,
  'bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700',
);

const secondaryCtaStyles = cn(
  ctaButtonStyles,
  'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400',
);

export default function TechStackSection({
  technologies = DEFAULT_TECHNOLOGIES,
  githubUrl = GITHUB_REPO_URL,
  className,
}: TechStackSectionProps) {
  const t = useTranslations('AboutPage');

  return (
    <Section
      title={t('tech_title')}
      id="tech-stack"
      background={'white'}
      className={cn('rounded-lg mt-8', className)}
    >
      <FadeIn>
        <div className="flex flex-col gap-8">
          {/* Tech Badges Grid */}
          <div className="flex flex-wrap justify-center gap-4">
            {technologies.map((tech) => (
              <TechBadge key={tech.slug} {...tech} />
            ))}
          </div>

          {/* Description */}
          <blockquote className="text-center text-gray-600 italic max-w-2xl mx-auto px-4 text-base max-sm:text-sm leading-relaxed">
            {t('tech_desc')}
          </blockquote>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 max-sm:gap-3">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={primaryCtaStyles}
              aria-label={t('tech_star_github')}
            >
              <GitHub fontSize="small" />
              <span>{t('tech_star_github')}</span>
            </a>
            <a
              href={GITHUB_ISSUES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={secondaryCtaStyles}
              aria-label={t('tech_report_issue')}
            >
              <BugReport fontSize="small" />
              <span>{t('tech_report_issue')}</span>
            </a>
          </div>
        </div>
      </FadeIn>
    </Section>
  );
}
