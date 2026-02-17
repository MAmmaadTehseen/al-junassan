"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Trash2, Loader2 } from "lucide-react";

export function DeleteCategoryButton({ categoryId, categoryName }: { categoryId: string; categoryName: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${categoryName}"? Products in this category will lose their category.`)) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("categories").delete().eq("id", categoryId);
    router.refresh();
    setDeleting(false);
  };

  return (
    <button onClick={handleDelete} disabled={deleting} className="text-gray-400 hover:text-red-600 transition cursor-pointer">
      {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
