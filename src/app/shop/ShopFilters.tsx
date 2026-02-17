"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";

interface ShopFiltersProps {
  categories: Category[];
}

export function ShopFilters({ categories }: ShopFiltersProps) {
  return (
    <Suspense>
      <ShopFiltersInner categories={categories} />
    </Suspense>
  );
}

function ShopFiltersInner({ categories }: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const activeGender = searchParams.get("gender") || "";

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="mb-10 space-y-4">
      <div className="flex flex-wrap gap-2 justify-center">
        {[
          { label: "All", value: "" },
          { label: "Men", value: "men" },
          { label: "Women", value: "women" },
        ].map((g) => (
          <button
            key={g.value}
            onClick={() => updateFilter("gender", g.value)}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer",
              activeGender === g.value
                ? "bg-gold-500 text-luxury-black"
                : "bg-luxury-cream text-luxury-black hover:bg-gold-100"
            )}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => updateFilter("category", "")}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm transition-all cursor-pointer",
            !activeCategory
              ? "bg-luxury-black text-white"
              : "bg-gray-100 text-luxury-black hover:bg-gray-200"
          )}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => updateFilter("category", cat.slug)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm transition-all cursor-pointer",
              activeCategory === cat.slug
                ? "bg-luxury-black text-white"
                : "bg-gray-100 text-luxury-black hover:bg-gray-200"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
