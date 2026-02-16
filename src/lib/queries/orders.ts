import { createClient } from "@/lib/supabase/server";
import type { Order, OrderWithItems } from "@/types";

export async function createOrder(orderData: {
  user_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  shipping_address: string;
  city: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  notes?: string;
  items: {
    product_id: string;
    product_name: string;
    product_price: number;
    quantity: number;
    total: number;
  }[];
}) {
  const supabase = await createClient();

  // Get next order number
  const { data: countData } = await supabase
    .from("orders")
    .select("id", { count: "exact" });

  const orderNumber = `AJ-${String((countData?.length || 0) + 1).padStart(5, "0")}`;

  const { items, ...orderInfo } = orderData;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      ...orderInfo,
      order_number: orderNumber,
      payment_method: "cod",
      status: "pending",
    })
    .select()
    .single();

  if (orderError) {
    throw new Error(orderError.message);
  }

  const orderItems = items.map((item) => ({
    ...item,
    order_id: order.id,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  return order as Order;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }

  return data as Order[];
}

export async function getOrderById(orderId: string): Promise<OrderWithItems | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .single();

  if (error) {
    console.error("Error fetching order:", error);
    return null;
  }

  return data as OrderWithItems;
}
