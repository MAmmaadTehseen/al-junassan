"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Send } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="py-20 bg-luxury-cream">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-luxury-black mb-4">
            Stay in Touch
          </h2>
          <div className="h-0.5 w-16 bg-gold-500 mx-auto mb-4" />
          <p className="text-luxury-gray mb-8">
            Subscribe to get exclusive offers, new arrival updates, and styling
            tips.
          </p>
          {submitted ? (
            <p className="text-gold-600 font-medium text-lg">
              Thank you for subscribing!
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              />
              <Button type="submit" className="flex items-center gap-2">
                Subscribe <Send className="w-4 h-4" />
              </Button>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
