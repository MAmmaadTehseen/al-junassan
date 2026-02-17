"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { slugify } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { Product, Category } from "@/types";

interface ProductFormProps {
  product?: Product;
  categories: Category[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const isEditing = !!product;

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    compare_at_price: product?.compare_at_price?.toString() || "",
    category_id: product?.category_id || "",
    gender: product?.gender || "unisex",
    material: product?.material || "",
    weight: product?.weight || "",
    images: product?.images?.join("\n") || "",
    in_stock: product?.in_stock ?? true,
    is_featured: product?.is_featured ?? false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "name" && !isEditing) {
      setForm((prev) => ({ ...prev, slug: slugify(value) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const data = {
      name: form.name,
      slug: form.slug,
      description: form.description || null,
      price: parseInt(form.price),
      compare_at_price: form.compare_at_price ? parseInt(form.compare_at_price) : null,
      category_id: form.category_id || null,
      gender: form.gender,
      material: form.material || null,
      weight: form.weight || null,
      images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
      in_stock: form.in_stock,
      is_featured: form.is_featured,
    };

    let result;
    if (isEditing) {
      result = await supabase.from("products").update(data).eq("id", product.id);
    } else {
      result = await supabase.from("products").insert(data);
    }

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <Input
        id="name"
        name="name"
        label="Product Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <Input
        id="slug"
        name="slug"
        label="Slug"
        value={form.slug}
        onChange={handleChange}
        required
      />
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={form.description}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="price"
          name="price"
          label="Price (PKR)"
          type="number"
          value={form.price}
          onChange={handleChange}
          required
        />
        <Input
          id="compare_at_price"
          name="compare_at_price"
          label="Compare at Price (PKR)"
          type="number"
          value={form.compare_at_price}
          onChange={handleChange}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1.5">
            Category
          </label>
          <select
            id="category_id"
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1.5">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
          >
            <option value="unisex">Unisex</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="material"
          name="material"
          label="Material"
          value={form.material}
          onChange={handleChange}
        />
        <Input
          id="weight"
          name="weight"
          label="Weight"
          value={form.weight}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1.5">
          Image URLs (one per line)
        </label>
        <textarea
          id="images"
          name="images"
          rows={3}
          value={form.images}
          onChange={handleChange}
          placeholder="https://example.com/image1.jpg"
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 font-mono text-sm"
        />
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="in_stock"
            checked={form.in_stock}
            onChange={handleChange}
            className="w-4 h-4 accent-gold-500"
          />
          <span className="text-sm font-medium text-gray-700">In Stock</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="is_featured"
            checked={form.is_featured}
            onChange={handleChange}
            className="w-4 h-4 accent-gold-500"
          />
          <span className="text-sm font-medium text-gray-700">Featured</span>
        </label>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 p-3 rounded">{error}</p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </span>
          ) : isEditing ? (
            "Update Product"
          ) : (
            "Create Product"
          )}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
