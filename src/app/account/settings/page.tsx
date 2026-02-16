"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { profileSchema, type ProfileFormData } from "@/lib/validators";
import { Loader2, CheckCircle } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login?redirect=/account/settings");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        reset({
          full_name: profile.full_name || "",
          phone: profile.phone || "",
          city: profile.city || "",
          address: profile.address || "",
        });
      }

      setLoading(false);
    };

    loadProfile();
  }, [supabase, router, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setSaving(true);
    setSaved(false);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: data.full_name,
        phone: data.phone || null,
        city: data.city || null,
        address: data.address || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    setSaving(false);

    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (loading) {
    return (
      <section className="pt-28 pb-20 min-h-screen">
        <Container>
          <div className="max-w-lg mx-auto text-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gold-500 mx-auto" />
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="pt-28 pb-20 min-h-screen">
      <Container>
        <div className="max-w-lg mx-auto">
          <h1 className="font-heading text-3xl font-bold text-luxury-black mb-2">
            Profile Settings
          </h1>
          <p className="text-luxury-gray mb-8">
            Update your personal information
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              id="full_name"
              label="Full Name"
              placeholder="Your full name"
              error={errors.full_name?.message}
              {...register("full_name")}
            />
            <Input
              id="phone"
              label="Phone Number"
              placeholder="03XXXXXXXXX"
              error={errors.phone?.message}
              {...register("phone")}
            />
            <Input
              id="city"
              label="City"
              placeholder="e.g. Lahore, Karachi"
              error={errors.city?.message}
              {...register("city")}
            />
            <Input
              id="address"
              label="Default Address"
              placeholder="House/Flat no, Street, Area"
              error={errors.address?.message}
              {...register("address")}
            />

            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </span>
              ) : saved ? (
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Saved!
                </span>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </div>
      </Container>
    </section>
  );
}
