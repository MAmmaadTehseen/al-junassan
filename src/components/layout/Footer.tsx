import Link from "next/link";
import { Container } from "@/components/ui/Container";
import {
  SITE_NAME,
  SOCIAL_LINKS,
  CONTACT,
  NAV_LINKS,
  CATEGORIES,
} from "@/lib/constants";
import { Instagram, Facebook, MessageCircle, Send } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-luxury-black text-white/80">
      {/* Delivery Notice Banner */}
      <div className="bg-gold-500 text-luxury-black py-3 text-center">
        <p className="text-sm font-medium tracking-wide">
          Cash on Delivery Available &mdash; Flat Delivery Across Pakistan
        </p>
      </div>

      <Container>
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-2xl font-bold text-gold-500 mb-4">
              {SITE_NAME}
            </h3>
            <p className="text-sm leading-relaxed text-white/60 mb-6">
              Premium luxury jewelry crafted with elegance. Discover exquisite
              rings, necklaces, bracelets, and pendants for men and women.
            </p>
            <div className="flex gap-4">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-gold-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-gold-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-gold-500 transition-colors"
                aria-label="TikTok"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL_LINKS.snapchat}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-gold-500 transition-colors"
                aria-label="Snapchat"
              >
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-gold-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-white mb-4">
              Categories
            </h4>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/shop?category=${cat.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-sm text-white/60 hover:text-gold-500 transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-white mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li>
                <a
                  href={`tel:${CONTACT.phone}`}
                  className="hover:text-gold-500 transition-colors"
                >
                  {CONTACT.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="hover:text-gold-500 transition-colors"
                >
                  {CONTACT.email}
                </a>
              </li>
              <li>{CONTACT.address}</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6 text-center">
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
            Premium jewelry delivered across Pakistan.
          </p>
        </div>
      </Container>
    </footer>
  );
}
