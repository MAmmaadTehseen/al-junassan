import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-luxury-black overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,175,55,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(212,175,55,0.2),transparent_50%)]" />
      </div>

      <Container className="relative z-10 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gold-400 text-sm md:text-base uppercase tracking-[0.3em] mb-6 animate-fade-in">
            Premium Luxury Jewelry
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 animate-fade-in-up">
            Elegance Redefined,{" "}
            <span className="text-gold-gradient">Luxury Delivered</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl mb-10 max-w-xl mx-auto animate-fade-in-up">
            Discover exquisite handcrafted jewelry that celebrates your unique
            style. Premium quality, delivered across Pakistan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
            <Link href="/shop">
              <Button size="lg" className="text-base tracking-wide">
                Shop Now
              </Button>
            </Link>
            <Link href="/shop?gender=women">
              <Button
                variant="outline"
                size="lg"
                className="text-base tracking-wide border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                Explore Collections
              </Button>
            </Link>
          </div>
        </div>
      </Container>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gold-500/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-gold-500 rounded-full" />
        </div>
      </div>
    </section>
  );
}
