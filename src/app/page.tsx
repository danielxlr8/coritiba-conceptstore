import { MainNavbar } from "@/components/navigation/MainNavbar";
import { HomeHeroSection } from "@/components/home/HomeHeroSection";
import { HomeEditorialCampaignSection } from "@/components/home/HomeEditorialCampaignSection";
import { HomeLatestReleasesSection } from "@/components/home/HomeLatestReleasesSection";
import { HomeCategoriesSection } from "@/components/home/HomeCategoriesSection";
import { HomeBrandStorySection } from "@/components/home/HomeBrandStorySection";
import { HomeMembershipAppSection } from "@/components/home/HomeMembershipAppSection";
import { SiteFooter } from "@/components/navigation/SiteFooter";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-background-dark)] selection:bg-[var(--color-primary)] selection:text-black">
      <MainNavbar />
      <HomeHeroSection />
      <HomeEditorialCampaignSection />
      <HomeLatestReleasesSection />
      <HomeCategoriesSection />
      <HomeBrandStorySection />
      <HomeMembershipAppSection />
      <SiteFooter />
    </main>
  );
}

