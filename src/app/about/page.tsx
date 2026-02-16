import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Gem, Heart, Star, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Al Junassan - a premium luxury jewelry brand offering elegant and affordable jewelry across Pakistan.",
};

export default function AboutPage() {
  return (
    <section className="pt-28 pb-20">
      {/* Hero */}
      <div className="bg-luxury-black py-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gold-400 text-sm uppercase tracking-[0.3em] mb-4">
              Our Story
            </p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
              Crafting Elegance Since Day One
            </h1>
            <p className="text-white/60 text-lg leading-relaxed">
              Al Junassan was born from a passion for exquisite craftsmanship and
              a vision to make luxury jewelry accessible to everyone across Pakistan.
            </p>
          </div>
        </Container>
      </div>

      {/* Brand Story */}
      <Container>
        <div className="py-20 max-w-3xl mx-auto">
          <SectionHeading title="The Al Junassan Story" align="left" />
          <div className="prose prose-lg text-luxury-gray space-y-6">
            <p>
              At Al Junassan, we believe that everyone deserves to wear jewelry
              that makes them feel extraordinary. Our collections are inspired by
              the rich heritage of Middle Eastern luxury, blended with modern
              design sensibilities that resonate with the contemporary Pakistani
              lifestyle.
            </p>
            <p>
              Each piece in our collection is carefully curated and crafted using
              premium materials, ensuring that our customers receive jewelry that
              is not only beautiful but built to last. From elegant rings and
              necklaces to bold men&apos;s accessories, every item tells a story of
              sophistication and style.
            </p>
            <p>
              We take pride in offering premium quality jewelry at prices that
              don&apos;t break the bank. Our commitment to affordability without
              compromising on quality sets us apart in the Pakistani jewelry
              market.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="py-16 border-t border-gray-200">
          <SectionHeading
            title="Our Values"
            subtitle="What drives us every day"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Gem,
                title: "Premium Quality",
                description:
                  "We use only the finest materials, ensuring each piece meets our exacting standards.",
              },
              {
                icon: Heart,
                title: "Customer First",
                description:
                  "Your satisfaction is our priority. We go above and beyond to make you happy.",
              },
              {
                icon: Star,
                title: "Elegant Design",
                description:
                  "Our designs blend Middle Eastern luxury with modern aesthetics.",
              },
              {
                icon: Award,
                title: "Affordable Luxury",
                description:
                  "Premium jewelry that doesn't require a premium budget.",
              },
            ].map((value) => (
              <div key={value.title} className="text-center">
                <value.icon className="w-10 h-10 text-gold-500 mx-auto mb-4" />
                <h3 className="font-heading text-lg font-semibold text-luxury-black mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-luxury-gray">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission */}
        <div className="py-16 border-t border-gray-200">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-3xl font-bold text-luxury-black mb-6">
              Our Mission
            </h2>
            <div className="h-0.5 w-16 bg-gold-500 mx-auto mb-6" />
            <p className="text-lg text-luxury-gray leading-relaxed">
              To make premium, elegantly crafted jewelry accessible to every man
              and woman in Pakistan, delivering luxury experiences through
              exceptional products, outstanding service, and the convenience of
              cash on delivery nationwide.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
