"use client";

import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

export default function CartPage() {
  const { items, totalItems, subtotal, removeItem, updateQuantity } = useCart();

  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shippingCost;

  if (items.length === 0) {
    return (
      <section className="pt-28 pb-20 min-h-screen">
        <Container>
          <div className="max-w-md mx-auto text-center py-20">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h1 className="font-heading text-2xl font-bold text-luxury-black mb-3">
              Your Cart is Empty
            </h1>
            <p className="text-luxury-gray mb-8">
              Looks like you haven&apos;t added any jewelry to your cart yet.
            </p>
            <Link href="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="pt-28 pb-20 min-h-screen">
      <Container>
        <h1 className="font-heading text-3xl font-bold text-luxury-black mb-2">
          Shopping Cart
        </h1>
        <p className="text-luxury-gray mb-8">{totalItems} item(s) in your cart</p>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-white rounded-lg border border-gray-100 shadow-sm"
              >
                <Link href={`/product/${item.slug}`} className="flex-shrink-0">
                  <div className="relative w-24 h-24 rounded-md overflow-hidden bg-luxury-cream">
                    <Image
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.slug}`}>
                    <h3 className="font-medium text-luxury-black hover:text-gold-600 transition-colors truncate">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="font-heading text-gold-600 font-bold mt-1">
                    {formatPrice(item.price)}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 hover:bg-gray-100 transition cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 py-1 text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 hover:bg-gray-100 transition cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-600 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-heading font-bold text-luxury-black">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-luxury-cream rounded-lg p-6 sticky top-24">
              <h2 className="font-heading text-xl font-bold text-luxury-black mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-luxury-gray">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-luxury-gray">Shipping</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}
                  </span>
                </div>
                {shippingCost > 0 && (
                  <p className="text-xs text-gold-600">
                    Free shipping on orders above {formatPrice(FREE_SHIPPING_THRESHOLD)}
                  </p>
                )}
                <div className="border-t border-gray-300 pt-3 flex justify-between">
                  <span className="font-heading font-bold text-lg">Total</span>
                  <span className="font-heading font-bold text-lg text-gold-600">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
              <Link href="/checkout" className="block mt-6">
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>
              <Link
                href="/shop"
                className="flex items-center justify-center gap-2 mt-4 text-sm text-luxury-gray hover:text-gold-600 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
