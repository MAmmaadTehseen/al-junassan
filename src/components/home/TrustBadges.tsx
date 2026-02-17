import { Container } from "@/components/ui/Container";
import { Truck, Shield, CreditCard, Headphones } from "lucide-react";

const badges = [
  {
    icon: Truck,
    title: "Delivery Across Pakistan",
    description: "Flat rate shipping to every city",
  },
  {
    icon: CreditCard,
    title: "Cash on Delivery",
    description: "Pay when you receive your order",
  },
  {
    icon: Shield,
    title: "Premium Quality",
    description: "Authentic materials guaranteed",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "WhatsApp & phone support",
  },
];

export function TrustBadges() {
  return (
    <section className="py-16 bg-luxury-black">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {badges.map((badge) => (
            <div key={badge.title} className="text-center">
              <badge.icon className="w-10 h-10 text-gold-500 mx-auto mb-3" />
              <h3 className="font-heading text-white font-semibold mb-1">
                {badge.title}
              </h3>
              <p className="text-white/50 text-sm">{badge.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
