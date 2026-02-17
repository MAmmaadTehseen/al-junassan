import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

const statusVariant: Record<string, "warning" | "gold" | "default" | "success" | "danger"> = {
  pending: "warning",
  confirmed: "gold",
  shipped: "default",
  delivered: "success",
  cancelled: "danger",
};

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">Order</th>
                <th className="text-left p-4 font-medium text-gray-600">Customer</th>
                <th className="text-left p-4 font-medium text-gray-600">City</th>
                <th className="text-left p-4 font-medium text-gray-600">Total</th>
                <th className="text-left p-4 font-medium text-gray-600">Status</th>
                <th className="text-left p-4 font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders?.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <Link href={`/admin/orders/${order.id}`} className="font-medium text-blue-600 hover:underline">
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-gray-900">{order.customer_name}</p>
                      <p className="text-xs text-gray-400">{order.customer_phone}</p>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{order.city}</td>
                  <td className="p-4 font-medium">{formatPrice(order.total)}</td>
                  <td className="p-4">
                    <Badge variant={statusVariant[order.status] || "default"}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-gray-500">
                    {new Date(order.created_at).toLocaleDateString("en-PK")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(!orders || orders.length === 0) && (
          <div className="p-10 text-center text-gray-400">No orders yet</div>
        )}
      </div>
    </div>
  );
}
