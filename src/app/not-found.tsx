import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="pt-28 pb-20 min-h-screen flex items-center">
      <Container>
        <div className="max-w-md mx-auto text-center">
          <h1 className="font-heading text-8xl font-bold text-gold-500 mb-4">
            404
          </h1>
          <h2 className="font-heading text-2xl font-bold text-luxury-black mb-3">
            Page Not Found
          </h2>
          <p className="text-luxury-gray mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
            <Link href="/shop">
              <Button variant="outline">Browse Shop</Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
