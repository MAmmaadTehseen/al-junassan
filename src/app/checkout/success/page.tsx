import Link from "next/link";
import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CheckCircle, Package, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Order Placed Successfully",
};

interface SuccessPageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const orderNumber = params.order || "";

  return (
    <section className="pt-28 pb-20 min-h-screen">
      <Container>
        <div className="max-w-lg mx-auto text-center py-10">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />

          <h1 className="font-heading text-3xl font-bold text-luxury-black mb-3">
            Order Placed Successfully!
          </h1>

          {orderNumber && (
            <p className="text-lg text-luxury-gray mb-2">
              Order Number: <span className="font-bold text-gold-600">{orderNumber}</span>
            </p>
          )}

          <p className="text-luxury-gray mb-8">
            Thank you for your order. Our team will contact you shortly to
            confirm your order details.
          </p>

          <div className="bg-luxury-cream rounded-lg p-6 mb-8 space-y-4 text-left">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-gold-500 flex-shrink-0" />
              <p className="text-sm text-luxury-gray">
                Your order will be delivered via <strong>Cash on Delivery</strong> across Pakistan.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gold-500 flex-shrink-0" />
              <p className="text-sm text-luxury-gray">
                Our team will call you to confirm the order and delivery details.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/account/orders">
              <Button variant="outline">View My Orders</Button>
            </Link>
            <Link href="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
