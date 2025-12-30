import { getGmapUrl } from '@/app/utils';
import { Map, ArrowForward } from '@mui/icons-material';
import { useTranslations } from 'next-intl';

export default function GoogleMapsBanner() {
  const t = useTranslations('GMapBanner');
  const url = getGmapUrl() || '';

  return (
    <div className="relative w-full">
      {/* Banner Container */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative bg-linear-to-r from-primary to-outramorange rounded-xl p-3 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] group"
      >
        {/* Decorative Background Circle */}
        <div
          className="absolute top-[-50%] right-[-10%] w-[200px] h-[200px] bg-goldenmile opacity-10 rounded-full pointer-events-none"
          aria-hidden="true"
        />

        {/* Content Wrapper */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
          {/* Icon */}
          <div className="shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
            <Map className="text-primary" sx={{ fontSize: 32 }} aria-hidden="true" />
          </div>

          {/* Text Content */}
          <div className="flex-1 text-center sm:text-left text-white">
            <span className="text-lg font-bold mb-2">{t('explore_complete_collection')}</span>
            <p className="text-xs opacity-95 leading-relaxed">
              {t('google_maps_banner_description')}
            </p>
          </div>

          {/* CTA Button */}
          <div className="shrink-0">
            <div className="bg-white text-primary px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 shadow-md transition-all duration-300 group-hover:bg-goldenmile group-hover:scale-105">
              <span>{t('view_full_list')}</span>
              <ArrowForward
                className="transition-transform group-hover:translate-x-1"
                sx={{ fontSize: 18 }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* Screen Reader Text */}
        <span className="sr-only">{t('google_maps_banner_sr_description')}</span>
      </a>
    </div>
  );
}
