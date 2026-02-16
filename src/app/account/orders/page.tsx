import { redirect } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import { Package } from "lucide-react";

export const metadata: Metadata = {
  title: "My Orders",
};

const statusVariant = {
  pending: "warning" as const,
  confirmed: "gold" as const,
  shipped: "default" as const,
  delivered: "success" as const,
  cancelled: "danger" as const,
};

export default async function OrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirect=/account/orders");

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <section className="pt-28 pb-20 min-h-screen">
      <Container>
        <h1 className="font-heading text-3xl font-bold text-luxury-black mb-2">
          My Orders
        </h1>
        <p className="text-luxury-gray mb-10">Track and manage your orders</p>

        {!orders || orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="font-heading text-xl font-bold mb-2">No orders yet</h2>
            <p className="text-luxury-gray mb-6">
              Start shopping to see your orders here.
            </p>
            <Link
              href="/shop"
              className="text-gold-600 hover:text-gold-700 font-medium"
            >
              Browse Collection
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="block bg-white rounded-lg p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-gold-200 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-heading font-bold text-luxury-black">
                      {order.order_number}
                    </p>
                    <p className="text-sm text-luxury-gray mt-1">
                      {new Date(order.created_at).toLocaleDateString("en-PK", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={statusVariant[order.status as keyof typeof statusVariant] || "default"}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                    <span className="font-heading font-bold text-gold-600">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
