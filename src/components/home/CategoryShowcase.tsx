import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/types";

interface CategoryShowcaseProps {
  categories: Category[];
}

export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  if (categories.length === 0) return null;

  return (
    <section className="py-20 bg-luxury-cream">
      <Container>
        <SectionHeading
          title="Our Collections"
          subtitle="Explore our curated categories of fine jewelry"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative aspect-[3/4] rounded-lg overflow-hidden bg-luxury-black"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/80 via-luxury-black/20 to-transparent z-10" />
              <div className="absolute inset-0 bg-gold-500/5 group-hover:bg-gold-500/10 transition-colors z-10" />
              <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <h3 className="font-heading text-lg font-semibold text-white mb-1">
                  {cat.name}
                </h3>
                <span className="text-gold-400 text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
