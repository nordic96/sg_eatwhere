import { CDN_BASE } from '@/app/config/cdn';
import { cn, getGmapUrl } from '@/app/utils';
import { Map, Check, ArrowForward } from '@mui/icons-material';
import { useTranslations } from 'next-intl';

export default function GoogleMapsHeroSection() {
  const t = useTranslations('LandingPage');
  const url = getGmapUrl();
  if (!url) {
    return null;
  }
  const imageUrl = `${CDN_BASE}/resources/images/map_gemini.png`;
  return (
    <div
      style={{
        backgroundImage: `url('${imageUrl}')`,
      }}
      className={cn(
        'bg-no-repeat bg-contain bg-center',
        'w-full flex justify-center items-center relative mx-auto lg:py-32 md:py-20 max-sm:py-16 md:px-16',
      )}
    >
      <div className="grid grid-cols-1 max-w-6xl md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl z-50">
        {/* Left Side: Feature List */}
        <div className="bg-gradient-to-br from-primary to-outramorange p-8 md:p-12 text-white flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('your_complete_singapore_food_guide')}
          </h2>
          <p className="text-base opacity-95 leading-relaxed mb-8">
            {t('access_full_curated_collection')}
          </p>

          {/* Feature List */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center shrink-0 mt-0.5">
                <Check sx={{ fontSize: 16, color: 'white' }} />
              </div>
              <span className="text-sm">{t('feature_100_plus_locations')}</span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center shrink-0 mt-0.5">
                <Check sx={{ fontSize: 16, color: 'white' }} />
              </div>
              <span className="text-sm">{t('feature_turn_by_turn')}</span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center shrink-0 mt-0.5">
                <Check sx={{ fontSize: 16, color: 'white' }} />
              </div>
              <span className="text-sm">{t('feature_live_hours')}</span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center shrink-0 mt-0.5">
                <Check sx={{ fontSize: 16, color: 'white' }} />
              </div>
              <span className="text-sm">{t('feature_hidden_gems')}</span>
            </div>
          </div>
        </div>

        {/* Right Side: CTA */}
        <div className="bg-white p-8 md:p-12 flex flex-col justify-center items-center text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-outramorange rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <Map sx={{ fontSize: 40, color: 'white' }} />
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('google_maps_collection')}</h3>

          <p className="text-sm text-gray-600 mb-8 max-w-xs">{t('ten_years_discoveries')}</p>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-outramorange text-white px-8 py-4 rounded-xl font-bold text-base shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105"
            aria-label={'View Complete food collection on Google Maps'}
          >
            {t('open_collection')}
            <ArrowForward sx={{ fontSize: 20 }} />
          </a>

          <p className="text-xs text-gray-500 mt-4">{t('opens_in_google_maps')}</p>
        </div>
      </div>
    </div>
  );
}
