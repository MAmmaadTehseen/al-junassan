"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, Loader2, Package, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { ORDER_STATUSES } from "@/lib/constants";

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("id", id)
        .single();
      setOrder(data);
      setLoading(false);
    };
    fetchOrder();
  }, [id, supabase]);

  const updateStatus = async (status: string) => {
    setUpdating(true);
    await supabase.from("orders").update({ status }).eq("id", id);
    setOrder((prev: any) => ({ ...prev, status }));
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!order) {
    return <div className="text-center py-20 text-gray-400">Order not found</div>;
  }

  const statusVariant: Record<string, "warning" | "gold" | "default" | "success" | "danger"> = {
    pending: "warning", confirmed: "gold", shipped: "default", delivered: "success", cancelled: "danger",
  };

  return (
    <div>
      <Link href="/admin/orders" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{order.order_number}</h1>
          <p className="text-sm text-gray-500">
            {new Date(order.created_at).toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <Badge variant={statusVariant[order.status] || "default"} className="text-sm px-3 py-1">
          {order.status}
        </Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Items */}
        <div className="md:col-span-2 bg-white rounded-lg border shadow-sm">
          <div className="p-4 border-b font-bold text-gray-900">Order Items</div>
          <div className="divide-y">
            {order.order_items?.map((item: any) => (
              <div key={item.id} className="p-4 flex justify-between">
                <div>
                  <p className="font-medium text-gray-900">{item.product_name}</p>
                  <p className="text-sm text-gray-400">{formatPrice(item.product_price)} x {item.quantity}</p>
                </div>
                <p className="font-bold">{formatPrice(item.total)}</p>
              </div>
            ))}
          </div>
          <div className="p-4 border-t bg-gray-50 space-y-1 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{order.shipping_cost === 0 ? "FREE" : formatPrice(order.shipping_cost)}</span></div>
            <div className="flex justify-between font-bold text-base pt-2 border-t"><span>Total</span><span>{formatPrice(order.total)}</span></div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg border shadow-sm p-4 space-y-3">
            <h3 className="font-bold text-gray-900">Customer</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><Package className="w-4 h-4 text-gray-400" />{order.customer_name}</div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" />{order.customer_phone}</div>
              {order.customer_email && <div className="text-gray-500">{order.customer_email}</div>}
              <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-gray-400 mt-0.5" /><span>{order.shipping_address}, {order.city}</span></div>
            </div>
            {order.notes && (
              <div className="pt-2 border-t">
                <p className="text-xs text-gray-400 mb-1">Notes:</p>
                <p className="text-sm text-gray-600">{order.notes}</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border shadow-sm p-4">
            <h3 className="font-bold text-gray-900 mb-3">Update Status</h3>
            <div className="space-y-2">
              {ORDER_STATUSES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => updateStatus(s.value)}
                  disabled={updating || order.status === s.value}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition cursor-pointer disabled:opacity-50 ${
                    order.status === s.value
                      ? "bg-gold-50 text-gold-700 font-medium"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
