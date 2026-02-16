"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { contactSchema, type ContactFormData } from "@/lib/validators";
import { CONTACT, SOCIAL_LINKS } from "@/lib/constants";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Loader2,
  CheckCircle,
  Instagram,
  Facebook,
} from "lucide-react";

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSubmitted(true);
      reset();
    } catch {
      setError("Something went wrong. Please try again or contact us via WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="pt-28 pb-20">
      {/* Hero */}
      <div className="bg-luxury-black py-16">
        <Container>
          <div className="text-center">
            <p className="text-gold-400 text-sm uppercase tracking-[0.3em] mb-4">
              Get in Touch
            </p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">
              Contact Us
            </h1>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-16 grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <SectionHeading title="Send a Message" align="left" />
            {submitted ? (
              <div className="text-center py-10">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="font-heading text-xl font-bold mb-2">
                  Message Sent!
                </h3>
                <p className="text-luxury-gray mb-4">
                  We&apos;ll get back to you as soon as possible.
                </p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Input
                  id="name"
                  label="Full Name"
                  placeholder="Your name"
                  error={errors.name?.message}
                  {...register("name")}
                />
                <Input
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  error={errors.email?.message}
                  {...register("email")}
                />
                <Input
                  id="phone"
                  label="Phone (Optional)"
                  placeholder="03XXXXXXXXX"
                  error={errors.phone?.message}
                  {...register("phone")}
                />
                <div className="w-full">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-luxury-black mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    {...register("message")}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-red-500 bg-red-50 p-3 rounded">{error}</p>
                )}

                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4" /> Send Message
                    </span>
                  )}
                </Button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <SectionHeading title="Contact Information" align="left" />

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-gold-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-luxury-black mb-1">Phone</h3>
                  <a
                    href={`tel:${CONTACT.phone}`}
                    className="text-luxury-gray hover:text-gold-600 transition"
                  >
                    {CONTACT.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-gold-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-luxury-black mb-1">Email</h3>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="text-luxury-gray hover:text-gold-600 transition"
                  >
                    {CONTACT.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-gold-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-luxury-black mb-1">Location</h3>
                  <p className="text-luxury-gray">{CONTACT.address}</p>
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${CONTACT.whatsapp}?text=Hi! I have a question about Al Junassan jewelry.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-500 text-white px-6 py-4 rounded-lg hover:bg-green-600 transition w-fit"
            >
              <MessageCircle className="w-6 h-6" />
              <div>
                <p className="font-medium">Chat on WhatsApp</p>
                <p className="text-sm text-green-100">Quick response guaranteed</p>
              </div>
            </a>

            {/* Social */}
            <div>
              <h3 className="font-medium text-luxury-black mb-3">Follow Us</h3>
              <div className="flex gap-4">
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-luxury-gray hover:text-gold-500 transition"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-luxury-gray hover:text-gold-500 transition"
                >
                  <Facebook className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
