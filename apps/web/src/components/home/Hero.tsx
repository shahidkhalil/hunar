import Link from "next/link";
import Image from "next/image";
import { Button } from "@hunar/ui";

export function Hero() {
  return (
    <section className="relative h-[600px] md:h-[700px] bg-cream">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=700&fit=crop&crop=center"
          alt="Hand-crafted crochet products background"
          fill
          className="object-cover opacity-85"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/50 via-charcoal/30 to-transparent" />
      </div>

      <div className="relative container-custom h-full flex items-center">
        <div className="max-w-xl text-white">
          <h1 className="heading-1 mb-4 text-balance drop-shadow-lg">
            Hand-Crafted with Love
          </h1>
          <p className="text-lg md:text-xl mb-8 text-balance opacity-95 drop-shadow-md">
            Discover our collection of artisanal crochet pieces for women and men.
            Each item is uniquely crafted with care and attention to detail.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/shop?gender=WOMEN">
              <Button size="lg" className="bg-white text-charcoal hover:bg-white/90 shadow-lg">
                Shop Women
              </Button>
            </Link>
            <Link href="/shop?gender=MEN">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-charcoal shadow-lg backdrop-blur-sm">
                Shop Men
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

