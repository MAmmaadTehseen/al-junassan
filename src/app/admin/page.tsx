import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { Package, ShoppingCart, DollarSign, MessageSquare } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: productsCount },
    { count: ordersCount },
    { data: orders },
    { count: messagesCount },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("is_read", false),
  ]);

  const { data: revenueData } = await supabase.from("orders").select("total").in("status", ["confirmed", "shipped", "delivered"]);
  const totalRevenue = revenueData?.reduce((sum: number, o: any) => sum + o.total, 0) || 0;

  const stats = [
    { label: "Total Products", value: productsCount || 0, icon: Package, color: "text-blue-600 bg-blue-50" },
    { label: "Total Orders", value: ordersCount || 0, icon: ShoppingCart, color: "text-green-600 bg-green-50" },
    { label: "Revenue", value: formatPrice(totalRevenue), icon: DollarSign, color: "text-gold-600 bg-gold-50" },
    { label: "Unread Messages", value: messagesCount || 0, icon: MessageSquare, color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg p-5 border shadow-sm">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-5 border-b">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
        </div>
        {orders && orders.length > 0 ? (
          <div className="divide-y">
            {orders.map((order: any) => (
              <div key={order.id} className="p-5 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{order.order_number}</p>
                  <p className="text-sm text-gray-500">{order.customer_name} &middot; {order.city}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatPrice(order.total)}</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    order.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                    order.status === "shipped" ? "bg-purple-100 text-purple-700" :
                    order.status === "delivered" ? "bg-green-100 text-green-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-gray-400">No orders yet</div>
        )}
      </div>
    </div>
  );
}
