import GoogleMapsHeroSection from '../components/GoogleMapsBanner/GoogleMapHeroSection';
import HeroSection from '../components/HeroSection/HeroSection';
import StorySection from '../components/StorySection/StorySection';

export default function Page() {
  return (
    <div className="flex flex-col gap-32 max-sm:gap-20 mb-40">
      {/** Hero Section */}
      <HeroSection />
      <GoogleMapsHeroSection />
      {/** Story Section */}
      <StorySection />
    </div>
  );
}
