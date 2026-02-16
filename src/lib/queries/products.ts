import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types";

interface GetProductsParams {
  category?: string;
  gender?: string;
  featured?: boolean;
  limit?: number;
  search?: string;
}

export async function getProducts(params: GetProductsParams = {}): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("in_stock", true)
    .order("created_at", { ascending: false });

  if (params.category) {
    query = query.eq("category:categories.slug", params.category);
  }

  if (params.gender) {
    query = query.in("gender", [params.gender, "unisex"]);
  }

  if (params.featured) {
    query = query.eq("is_featured", true);
  }

  if (params.limit) {
    query = query.limit(params.limit);
  }

  if (params.search) {
    query = query.ilike("name", `%${params.search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }

  return data as Product;
}

export async function getRelatedProducts(
  categoryId: string,
  excludeId: string,
  limit = 4
): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("category_id", categoryId)
    .neq("id", excludeId)
    .eq("in_stock", true)
    .limit(limit);

  if (error) {
    console.error("Error fetching related products:", error);
    return [];
  }

  return data as Product[];
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  return getProducts({ featured: true, limit });
}
