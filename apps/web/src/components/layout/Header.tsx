"use client";

import Link from "next/link";
import { ShoppingBag, Search, User, Menu } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useState, useEffect } from "react";
import { LogoWithText } from "@/components/ui/Logo";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-brown-warm text-white text-center py-2 text-sm">
        Custom colours · Half advance, half COD · Free shipping over Rs. 5,000
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-cream border-b border-brown-warm/10">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <LogoWithText size="md" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/shop?gender=WOMEN"
                className="text-charcoal hover:text-brown-warm transition-colors"
              >
                Women
              </Link>
              <Link
                href="/shop?gender=MEN"
                className="text-charcoal hover:text-brown-warm transition-colors"
              >
                Men
              </Link>
              <Link
                href="/shop?isNew=true"
                className="text-charcoal hover:text-brown-warm transition-colors"
              >
                New
              </Link>
              <Link
                href="/lookbook"
                className="text-charcoal hover:text-brown-warm transition-colors"
              >
                Lookbook
              </Link>
              <Link
                href="/about"
                className="text-charcoal hover:text-brown-warm transition-colors"
              >
                About
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <Link
                href="/search"
                className="text-charcoal hover:text-brown-warm transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </Link>

              <Link
                href="/account"
                className="text-charcoal hover:text-brown transition-colors hidden md:block"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </Link>

              <Link
                href="/cart"
                className="text-charcoal hover:text-brown transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brown-warm text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              <button
                className="md:hidden text-charcoal"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-brown-warm/10 bg-cream">
            <nav className="container-custom py-4 space-y-4">
              <Link
                href="/shop?gender=WOMEN"
                className="block text-charcoal hover:text-brown transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Women
              </Link>
              <Link
                href="/shop?gender=MEN"
                className="block text-charcoal hover:text-brown transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Men
              </Link>
              <Link
                href="/shop?isNew=true"
                className="block text-charcoal hover:text-brown transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                New
              </Link>
              <Link
                href="/lookbook"
                className="block text-charcoal hover:text-brown transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Lookbook
              </Link>
              <Link
                href="/about"
                className="block text-charcoal hover:text-brown transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/account"
                className="block text-charcoal hover:text-brown transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Account
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
