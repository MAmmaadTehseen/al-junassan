"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { slugify } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { Category } from "@/types";

interface CategoryFormProps {
  category?: Category;
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const isEditing = !!category;

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    image_url: category?.image_url || "",
    display_order: category?.display_order?.toString() || "0",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
      image_url: form.image_url || null,
      display_order: parseInt(form.display_order) || 0,
    };

    const result = isEditing
      ? await supabase.from("categories").update(data).eq("id", category.id)
      : await supabase.from("categories").insert(data);

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }

    router.push("/admin/categories");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
      <Input id="name" name="name" label="Category Name" value={form.name} onChange={handleChange} required />
      <Input id="slug" name="slug" label="Slug" value={form.slug} onChange={handleChange} required />
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
        <textarea id="description" name="description" rows={3} value={form.description} onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500" />
      </div>
      <Input id="image_url" name="image_url" label="Image URL" value={form.image_url} onChange={handleChange} />
      <Input id="display_order" name="display_order" label="Display Order" type="number" value={form.display_order} onChange={handleChange} />

      {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Saving...</span> : isEditing ? "Update Category" : "Create Category"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
