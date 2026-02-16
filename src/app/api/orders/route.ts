import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { fullName, phone, city, address, notes, items, subtotal } = body;

    if (!fullName || !phone || !city || !address || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = subtotal + shippingCost;

    // Get next order number
    const { count } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    const orderNumber = `AJ-${String((count || 0) + 1).padStart(5, "0")}`;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: user.id,
        customer_name: fullName,
        customer_phone: phone,
        customer_email: user.email || null,
        shipping_address: address,
        city,
        subtotal,
        shipping_cost: shippingCost,
        total,
        status: "pending",
        payment_method: "cod",
        notes: notes || null,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order error:", orderError);
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    // Create order items
    const orderItems = items.map((item: { product_id: string; product_name: string; product_price: number; quantity: number; total: number }) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_price: item.product_price,
      quantity: item.quantity,
      total: item.total,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Order items error:", itemsError);
      return NextResponse.json({ error: "Failed to create order items" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      order_number: orderNumber,
      order_id: order.id,
    });
  } catch (error) {
    console.error("Order API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
