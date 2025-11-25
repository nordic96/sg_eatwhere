import IntroSection from "./components/IntroSection";
import ProjectSection from "./components/ProjectSection";
import PublicationSection from "./components/PublicationSection";
import SkillsSection from "./components/SkillsSection";
import withSuspense from "./functions/withSuspense";

function Home() {
  return (
    <div className="flex grow flex-row gap-8">
      <div className="flex grow">
        <IntroSection />
      </div>
      <div className="flex grow flex-col gap-1 w-[550px]">
        <SkillsSection />
        <PublicationSection />
        <ProjectSection />
      </div>
    </div>
  );
}

export default withSuspense(Home, <p>Loading...</p>);
