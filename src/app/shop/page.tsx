import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getProducts } from "@/lib/queries/products";
import { getCategories } from "@/lib/queries/categories";
import { ShopFilters } from "./ShopFilters";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse our collection of premium luxury jewelry. Rings, necklaces, bracelets, and pendants for men and women.",
};

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    gender?: string;
    search?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts({
      category: params.category,
      gender: params.gender,
      search: params.search,
    }),
    getCategories(),
  ]);

  return (
    <section className="pt-28 pb-20 min-h-screen">
      <Container>
        <SectionHeading
          title="Our Collection"
          subtitle="Explore our exquisite range of handcrafted jewelry"
        />
        <ShopFilters categories={categories} />
        <ProductGrid products={products} />
      </Container>
    </section>
  );
}
