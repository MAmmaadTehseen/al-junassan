"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { checkoutSchema, type CheckoutFormData } from "@/lib/validators";
import { formatPrice } from "@/lib/utils";
import { SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { Truck, CreditCard, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shippingCost;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  if (items.length === 0) {
    return (
      <section className="pt-28 pb-20 min-h-screen">
        <Container>
          <div className="text-center py-20">
            <h1 className="font-heading text-2xl font-bold mb-3">No items in cart</h1>
            <p className="text-luxury-gray mb-6">Add some items before checking out.</p>
            <Button onClick={() => router.push("/shop")}>Go to Shop</Button>
          </div>
        </Container>
      </section>
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          user_id: user?.id,
          email: user?.email,
          items: items.map((item) => ({
            product_id: item.id,
            product_name: item.name,
            product_price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity,
          })),
          subtotal,
          shipping_cost: shippingCost,
          total,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to place order");
      }

      clearCart();
      router.push(`/checkout/success?order=${result.order_number}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="pt-28 pb-20 min-h-screen">
      <Container>
        <h1 className="font-heading text-3xl font-bold text-luxury-black mb-2">
          Checkout
        </h1>
        <div className="flex items-center gap-2 mb-8">
          <CreditCard className="w-5 h-5 text-gold-500" />
          <span className="text-gold-600 font-medium">Cash on Delivery Only</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm space-y-5">
                <h2 className="font-heading text-xl font-bold">Delivery Information</h2>

                <Input
                  id="fullName"
                  label="Full Name"
                  placeholder="Enter your full name"
                  error={errors.fullName?.message}
                  {...register("fullName")}
                />

                <Input
                  id="phone"
                  label="Phone Number"
                  placeholder="03XXXXXXXXX"
                  error={errors.phone?.message}
                  {...register("phone")}
                />

                <Input
                  id="city"
                  label="City"
                  placeholder="e.g. Lahore, Karachi, Islamabad"
                  error={errors.city?.message}
                  {...register("city")}
                />

                <Input
                  id="address"
                  label="Full Address"
                  placeholder="House/Flat no, Street, Area"
                  error={errors.address?.message}
                  {...register("address")}
                />

                <div className="w-full">
                  <label htmlFor="notes" className="block text-sm font-medium text-luxury-black mb-1.5">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    placeholder="Any special instructions..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    {...register("notes")}
                  />
                </div>
              </div>

              {/* COD Notice */}
              <div className="flex items-center gap-3 bg-gold-50 p-4 rounded-lg">
                <Truck className="w-6 h-6 text-gold-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-luxury-black">Cash on Delivery</p>
                  <p className="text-sm text-luxury-gray">
                    Flat delivery across Pakistan. Pay when you receive your order.
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-luxury-cream rounded-lg p-6 sticky top-24">
                <h2 className="font-heading text-xl font-bold text-luxury-black mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-luxury-gray truncate mr-2">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-medium flex-shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-gray-300 pt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-luxury-gray">Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-luxury-gray">Shipping</span>
                      <span>{shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}</span>
                    </div>
                    <div className="flex justify-between font-heading font-bold text-lg pt-2 border-t border-gray-300">
                      <span>Total</span>
                      <span className="text-gold-600">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <p className="mt-4 text-sm text-red-500 bg-red-50 p-3 rounded">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full mt-6"
                  size="lg"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Placing Order...
                    </span>
                  ) : (
                    "Place Order (COD)"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Container>
    </section>
  );
}
