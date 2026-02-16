import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { GenderShowcase } from "@/components/home/GenderShowcase";
import { TrustBadges } from "@/components/home/TrustBadges";
import { Newsletter } from "@/components/home/Newsletter";
import { getFeaturedProducts } from "@/lib/queries/products";
import { getCategories } from "@/lib/queries/categories";

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getFeaturedProducts(8),
    getCategories(),
  ]);

  return (
    <>
      <HeroSection />
      <CategoryShowcase categories={categories} />
      <FeaturedProducts products={products} />
      <GenderShowcase />
      <TrustBadges />
      <Newsletter />
    </>
  );
}
