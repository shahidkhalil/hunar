import Link from "next/link";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { LogoWithText } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="bg-charcoal text-cream mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <LogoWithText size="sm" className="text-cream" />
            </div>
            <p className="text-cream/80 text-sm">
              Hand-crafted crochet products made with love and care. Each piece tells a story.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop?gender=WOMEN" className="text-cream/80 hover:text-cream">
                  Women
                </Link>
              </li>
              <li>
                <Link href="/shop?gender=MEN" className="text-cream/80 hover:text-cream">
                  Men
                </Link>
              </li>
              <li>
                <Link href="/shop?isNew=true" className="text-cream/80 hover:text-cream">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/shop?isBestseller=true" className="text-cream/80 hover:text-cream">
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-cream/80 hover:text-cream">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-cream/80 hover:text-cream">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="text-cream/80 hover:text-cream">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="text-cream/80 hover:text-cream">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Stay Connected</h4>
            <p className="text-cream/80 text-sm mb-4">
              Subscribe to get special offers and updates.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 rounded-2xl bg-cream/10 border border-cream/20 text-cream placeholder:text-cream/50 focus:outline-none focus:border-gold"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 rounded-2xl bg-gold text-charcoal font-medium hover:bg-gold/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-cream/60 text-sm">
            © 2024 Hunar. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a
              href="https://www.instagram.com/hunarofficial1/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/60 hover:text-cream"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61567349956375"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/60 hover:text-cream"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/60 hover:text-cream"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
