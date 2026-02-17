import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/product/ProductGrid";
import type { Product } from "@/types";

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-20 bg-luxury-white">
      <Container>
        <SectionHeading
          title="Best Sellers"
          subtitle="Our most loved pieces, handpicked for you"
        />
        <ProductGrid products={products} />
      </Container>
    </section>
  );
}
