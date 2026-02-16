"use client";

import { useState } from "react";
import { ShoppingBag, Minus, Plus, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/types";
import { getImageUrl } from "@/lib/utils";

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: getImageUrl(product.images?.[0] || null),
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-luxury-black">Quantity:</span>
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-2 hover:bg-gray-100 transition cursor-pointer"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 py-2 text-center min-w-[3rem] font-medium">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="px-3 py-2 hover:bg-gray-100 transition cursor-pointer"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAdd}
        size="lg"
        className="w-full"
        disabled={!product.in_stock}
      >
        {added ? (
          <span className="flex items-center gap-2">
            <Check className="w-5 h-5" />
            Added to Cart!
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            {product.in_stock ? "Add to Cart" : "Out of Stock"}
          </span>
        )}
      </Button>
    </div>
  );
}
