import HeroSection from '../components/HeroSection/HeroSection';
import StorySection from '../components/StorySection/StorySection';

export default function Page() {
  return (
    <div className="flex flex-col gap-40 mb-40">
      {/** Hero Section */}
      <HeroSection />
      {/** Story Section */}
      <StorySection />
    </div>
  );
}
