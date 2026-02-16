import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, Package, MapPin, Phone, CreditCard } from "lucide-react";

const statusVariant = {
  pending: "warning" as const,
  confirmed: "gold" as const,
  shipped: "default" as const,
  delivered: "success" as const,
  cancelled: "danger" as const,
};

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!order) notFound();

  return (
    <section className="pt-28 pb-20 min-h-screen">
      <Container>
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 text-luxury-gray hover:text-gold-600 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-2xl font-bold text-luxury-black">
              Order {order.order_number}
            </h1>
            <p className="text-sm text-luxury-gray mt-1">
              Placed on{" "}
              {new Date(order.created_at).toLocaleDateString("en-PK", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <Badge variant={statusVariant[order.status as keyof typeof statusVariant] || "default"}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
              <div className="p-5 border-b border-gray-100">
                <h2 className="font-heading font-bold">Order Items</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {order.order_items.map((item: { id: string; product_name: string; product_price: number; quantity: number; total: number }) => (
                  <div key={item.id} className="p-5 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-luxury-black">{item.product_name}</p>
                      <p className="text-sm text-luxury-gray">
                        {formatPrice(item.product_price)} x {item.quantity}
                      </p>
                    </div>
                    <p className="font-heading font-bold">{formatPrice(item.total)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-luxury-cream rounded-lg p-5">
              <h3 className="font-heading font-bold mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-luxury-gray">Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-luxury-gray">Shipping</span>
                  <span>{order.shipping_cost === 0 ? "FREE" : formatPrice(order.shipping_cost)}</span>
                </div>
                <div className="border-t border-gray-300 pt-2 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-gold-600">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-100 p-5 space-y-4">
              <h3 className="font-heading font-bold">Delivery Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Package className="w-4 h-4 text-gold-500 mt-0.5" />
                  <span>{order.customer_name}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-gold-500 mt-0.5" />
                  <span>{order.customer_phone}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gold-500 mt-0.5" />
                  <span>{order.shipping_address}, {order.city}</span>
                </div>
                <div className="flex items-start gap-3">
                  <CreditCard className="w-4 h-4 text-gold-500 mt-0.5" />
                  <span>Cash on Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
