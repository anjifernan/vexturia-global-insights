import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import SearchBar from "@/components/home/SearchBar";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import ValueProposition from "@/components/home/ValueProposition";
import VextaBanner from "@/components/home/VextaBanner";
import QuickCategories from "@/components/home/QuickCategories";
import Testimonials from "@/components/home/Testimonials";
import CTAFinal from "@/components/home/CTAFinal";

export default function Index() {
  return (
    <Layout>
      <HeroSection />
      <SearchBar />
      <FeaturedProperties />
      <ValueProposition />
      <VextaBanner />
      <QuickCategories />
      <Testimonials />
      <CTAFinal />
    </Layout>
  );
}
