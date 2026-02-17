import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { Plus, Edit } from "lucide-react";
import { DeleteCategoryButton } from "./DeleteCategoryButton";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("display_order");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <Link href="/admin/categories/new">
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Category
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 font-medium text-gray-600">Name</th>
              <th className="text-left p-4 font-medium text-gray-600">Slug</th>
              <th className="text-left p-4 font-medium text-gray-600">Order</th>
              <th className="text-right p-4 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories?.map((cat: any) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">{cat.name}</td>
                <td className="p-4 text-gray-500">{cat.slug}</td>
                <td className="p-4 text-gray-500">{cat.display_order}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/categories/${cat.id}/edit`} className="text-gray-400 hover:text-blue-600">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <DeleteCategoryButton categoryId={cat.id} categoryName={cat.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!categories || categories.length === 0) && (
          <div className="p-10 text-center text-gray-400">No categories yet</div>
        )}
      </div>
    </div>
  );
}
