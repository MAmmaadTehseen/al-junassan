"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
}

export function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) return;

    setDeleting(true);
    const supabase = createClient();
    await supabase.from("products").delete().eq("id", productId);
    router.refresh();
    setDeleting(false);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-gray-400 hover:text-red-600 transition cursor-pointer disabled:opacity-50"
    >
      {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
