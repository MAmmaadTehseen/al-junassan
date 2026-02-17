import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export function GenderShowcase() {
  return (
    <section className="py-20 bg-luxury-white">
      <Container>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative group overflow-hidden rounded-xl bg-luxury-black aspect-[4/5] md:aspect-[3/4] flex items-end">
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/50 to-transparent" />
            <div className="relative z-10 p-8 md:p-10">
              <p className="text-gold-400 text-sm uppercase tracking-widest mb-2">
                For Her
              </p>
              <h3 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
                Women&apos;s Collection
              </h3>
              <p className="text-white/60 mb-6 max-w-sm">
                Elegant necklaces, stunning rings, and timeless bracelets
                crafted for the modern woman.
              </p>
              <Link href="/shop?gender=women">
                <Button
                  variant="outline"
                  className="border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-luxury-black"
                >
                  Explore <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative group overflow-hidden rounded-xl bg-luxury-black aspect-[4/5] md:aspect-[3/4] flex items-end">
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/50 to-transparent" />
            <div className="relative z-10 p-8 md:p-10">
              <p className="text-gold-400 text-sm uppercase tracking-widest mb-2">
                For Him
              </p>
              <h3 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
                Men&apos;s Collection
              </h3>
              <p className="text-white/60 mb-6 max-w-sm">
                Bold rings, sophisticated chains, and premium accessories for
                the distinguished gentleman.
              </p>
              <Link href="/shop?gender=men">
                <Button
                  variant="outline"
                  className="border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-luxury-black"
                >
                  Explore <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
