import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { DeleteProductButton } from "./DeleteProductButton";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, category:categories(name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link href="/admin/products/new">
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">Product</th>
                <th className="text-left p-4 font-medium text-gray-600">Category</th>
                <th className="text-left p-4 font-medium text-gray-600">Price</th>
                <th className="text-left p-4 font-medium text-gray-600">Gender</th>
                <th className="text-left p-4 font-medium text-gray-600">Status</th>
                <th className="text-right p-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products?.map((product: any) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-400">{product.slug}</p>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">
                    {product.category?.name || "—"}
                  </td>
                  <td className="p-4 font-medium">{formatPrice(product.price)}</td>
                  <td className="p-4 capitalize text-gray-600">{product.gender}</td>
                  <td className="p-4">
                    <Badge variant={product.in_stock ? "success" : "danger"}>
                      {product.in_stock ? "In Stock" : "Out of Stock"}
                    </Badge>
                    {product.is_featured && (
                      <Badge variant="gold" className="ml-1">Featured</Badge>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-gray-400 hover:text-blue-600 transition"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeleteProductButton productId={product.id} productName={product.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(!products || products.length === 0) && (
          <div className="p-10 text-center text-gray-400">No products yet</div>
        )}
      </div>
    </div>
  );
}
