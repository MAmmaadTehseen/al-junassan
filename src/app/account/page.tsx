import { redirect } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/Container";
import { Package, Settings, User } from "lucide-react";

export const metadata: Metadata = {
  title: "My Account",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirect=/account");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <section className="pt-28 pb-20 min-h-screen">
      <Container>
        <h1 className="font-heading text-3xl font-bold text-luxury-black mb-2">
          My Account
        </h1>
        <p className="text-luxury-gray mb-10">
          Welcome back, {profile?.full_name || user.email}
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <Link
            href="/account/orders"
            className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-gold-200 transition group"
          >
            <Package className="w-8 h-8 text-gold-500 mb-4" />
            <h3 className="font-heading text-lg font-semibold text-luxury-black mb-1">
              My Orders
            </h3>
            <p className="text-sm text-luxury-gray">
              Track your orders and view order history
            </p>
          </Link>

          <Link
            href="/account/settings"
            className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-gold-200 transition group"
          >
            <Settings className="w-8 h-8 text-gold-500 mb-4" />
            <h3 className="font-heading text-lg font-semibold text-luxury-black mb-1">
              Profile Settings
            </h3>
            <p className="text-sm text-luxury-gray">
              Update your name, phone, and address
            </p>
          </Link>

          <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
            <User className="w-8 h-8 text-gold-500 mb-4" />
            <h3 className="font-heading text-lg font-semibold text-luxury-black mb-1">
              Account Info
            </h3>
            <p className="text-sm text-luxury-gray">{user.email}</p>
            {profile?.phone && (
              <p className="text-sm text-luxury-gray mt-1">{profile.phone}</p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
