'use client';

import { cn } from '@/app/utils';
import Section from '@/app/components/Section';
import FadeIn from '@/app/components/FadeIn/FadeIn';
import { useTranslations } from 'next-intl';
import { OpenInNew } from '@mui/icons-material';

export interface InspirationSectionProps {
  /** Custom class name for the container */
  className?: string;
}

/** Colour swatch data representing the inspired palette */
interface ColourSwatch {
  hex: string;
  labelKey: 'colour_hawker' | 'colour_dessert' | 'colour_restaurant';
}

const STRAITS_TIMES_ARTICLE_URL =
  'https://www.straitstimes.com/multimedia/graphics/2023/08/singapore-in-colour/index.html';

const COLOUR_SWATCHES: ColourSwatch[] = [
  { hex: '#FF6B6B', labelKey: 'colour_hawker' },
  { hex: '#4CAF50', labelKey: 'colour_dessert' },
  { hex: '#FF9800', labelKey: 'colour_restaurant' },
];

const ctaButtonStyles = cn(
  'inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-200',
  'bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700',
  'max-sm:px-4 max-sm:py-2 max-sm:text-xs',
);

export default function InspirationSection({ className }: InspirationSectionProps) {
  const t = useTranslations('AboutPage');

  return (
    <Section
      title={t('inspiration_label')}
      id="inspiration"
      background="white"
      className={cn('px-0', className)}
    >
      <FadeIn>
        <div className="flex flex-col gap-6">
          {/* Attribution Title */}
          <div className="flex flex-col gap-1">
            <h4 className="text-xl md:text-2xl font-semibold text-gray-800">
              {t('inspiration_title')}
            </h4>
            <p className="text-sm md:text-base text-gray-600">{t('inspiration_author')}</p>
          </div>

          {/* Description */}
          <p className="text-base text-gray-600 leading-relaxed max-w-2xl">
            {t('inspiration_description')}
          </p>

          {/* Colour Palette */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-gray-700">{t('inspiration_palette_label')}</p>
            <div className="flex gap-4 max-sm:gap-3">
              {COLOUR_SWATCHES.map((swatch) => (
                <div key={swatch.hex} className="flex flex-col items-center gap-2">
                  <div
                    className="w-16 h-16 md:w-20 md:h-20 rounded-lg shadow-md"
                    style={{ backgroundColor: swatch.hex }}
                    role="img"
                    aria-label={`${t(swatch.labelKey)} colour swatch: ${swatch.hex}`}
                  />
                  <span className="text-xs md:text-sm text-gray-600 font-medium">
                    {t(swatch.labelKey)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-2">
            <a
              href={STRAITS_TIMES_ARTICLE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={ctaButtonStyles}
              aria-label={`${t('inspiration_cta')} (opens in new tab)`}
            >
              <span>{t('inspiration_cta')}</span>
              <OpenInNew fontSize="small" aria-hidden="true" />
            </a>
          </div>
        </div>
      </FadeIn>
    </Section>
  );
}
