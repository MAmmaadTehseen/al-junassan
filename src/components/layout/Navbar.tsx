"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Container } from "@/components/ui/Container";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled || !isHome
          ? "bg-luxury-black/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      )}
    >
      <Container>
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="font-heading text-2xl md:text-3xl font-bold text-gold-500 tracking-wide">
              {SITE_NAME}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium tracking-wide uppercase transition-colors duration-200",
                  pathname === link.href
                    ? "text-gold-500"
                    : "text-white/80 hover:text-gold-400"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {/* Auth */}
            {!loading && (
              <div className="hidden md:block relative">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-1 text-white/80 hover:text-gold-400 transition-colors cursor-pointer"
                    >
                      <User className="w-5 h-5" />
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                        <Link
                          href="/account"
                          className="block px-4 py-2 text-sm text-luxury-black hover:bg-gold-50"
                        >
                          My Account
                        </Link>
                        <Link
                          href="/account/orders"
                          className="block px-4 py-2 text-sm text-luxury-black hover:bg-gold-50"
                        >
                          My Orders
                        </Link>
                        <button
                          onClick={signOut}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/auth/login"
                    className="text-white/80 hover:text-gold-400 transition-colors"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                )}
              </div>
            )}

            {/* Cart */}
            <Link href="/cart" className="relative text-white/80 hover:text-gold-400 transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold-500 text-luxury-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-white/80 hover:text-gold-400 transition-colors cursor-pointer"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-luxury-black/98 backdrop-blur-md animate-slide-in-left">
          <Container>
            <nav className="py-6 space-y-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block text-base font-medium tracking-wide uppercase transition-colors",
                    pathname === link.href
                      ? "text-gold-500"
                      : "text-white/80 hover:text-gold-400"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-white/10">
                {user ? (
                  <>
                    <Link
                      href="/account"
                      className="block text-white/80 hover:text-gold-400 py-2"
                    >
                      My Account
                    </Link>
                    <Link
                      href="/account/orders"
                      className="block text-white/80 hover:text-gold-400 py-2"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={signOut}
                      className="text-red-400 hover:text-red-300 py-2 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="flex gap-4">
                    <Link
                      href="/auth/login"
                      className="text-gold-500 hover:text-gold-400 font-medium"
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="text-white/80 hover:text-gold-400"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
