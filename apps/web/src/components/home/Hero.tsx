import Link from "next/link";
import Image from "next/image";
import { Button } from "@hunar/ui";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-end overflow-hidden bg-charcoal">
      <Image
        src="/brand/hero-crochet.png"
        alt="Hunar handmade crochet winter collection"
        fill
        className="object-cover object-center scale-105"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-charcoal/20" />

      <div className="relative z-10 w-full container-custom pb-12 md:pb-16 pt-32">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/90 backdrop-blur-sm mb-6">
            Handmade in Pakistan
          </p>
          <h1 className="heading-1 text-white mb-5 text-balance">
            Crochet pieces stitched for you, not off a rack
          </h1>
          <p className="text-base md:text-lg text-white/85 mb-8 max-w-xl leading-relaxed">
            Pick your style, choose your colour, and we hand-make it in 7–10 days.
            Pay half now, half on delivery — simple, trusted, personal.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/shop">
              <Button
                size="lg"
                className="bg-white text-charcoal hover:bg-white/90 shadow-lg gap-2"
              >
                Shop the collection
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/shop?isBestseller=true">
              <Button
                size="lg"
                variant="outline"
                className="border-white/60 text-white hover:bg-white hover:text-charcoal backdrop-blur-sm"
              >
                Best sellers
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
