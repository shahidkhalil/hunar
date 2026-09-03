import Link from "next/link";
import Image from "next/image";
import { Button } from "@hunar/ui";
import { Instagram } from "lucide-react";

const INSTAGRAM_URL = "https://www.instagram.com/hunarofficial1/";

export function ShopCTA() {
  return (
    <section className="section-padding pb-8">
      <div className="container-custom">
        <div className="relative overflow-hidden rounded-3xl bg-brown-warm">
          <div className="absolute inset-0 opacity-20">
            <Image
              src="/brand/cta-crochet-texture.png"
              alt=""
              fill
              className="object-cover"
              aria-hidden
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-brown-warm via-brown-warm/95 to-brown-warm/80" />

          <div className="relative z-10 px-8 py-14 md:px-16 md:py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-lg">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4 text-balance">
                Ready to wear something made just for you?
              </h2>
              <p className="text-white/85 text-lg">
                Browse the full collection or DM us on Instagram for custom requests.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link href="/shop">
                <Button size="lg" className="bg-white text-charcoal hover:bg-white/90">
                  Start shopping
                </Button>
              </Link>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/50 text-white hover:bg-white hover:text-charcoal gap-2"
                >
                  <Instagram className="h-4 w-4" />
                  @hunarofficial1
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
