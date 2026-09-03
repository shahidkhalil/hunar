import Image from "next/image";
import Link from "next/link";
import { Instagram, ArrowUpRight } from "lucide-react";

const INSTAGRAM_URL = "https://www.instagram.com/hunarofficial1/";

const images = [
  "/brand/social-crochet-01.png",
  "/brand/social-crochet-02.png",
  "/brand/social-crochet-03.png",
  "/brand/social-crochet-04.png",
  "/brand/social-crochet-05.png",
  "/brand/social-crochet-06.png",
  "/brand/social-crochet-01.png",
  "/brand/social-crochet-02.png",
  "/brand/social-crochet-03.png",
  "/brand/social-crochet-04.png",
  "/brand/social-crochet-05.png",
  "/brand/social-crochet-06.png",
];

export function InstagramGrid() {
  return (
    <section className="section-padding bg-cream/40">
      <div className="container-custom mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-brown-warm mb-3">
              <Instagram className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-widest">
                The Hunar aesthetic
              </span>
            </div>
            <h2 className="heading-2 mb-2">Handmade, one stitch at a time</h2>
            <p className="text-charcoal/70 max-w-lg">
              Warm textures, custom colours, and slow-fashion craft — follow{" "}
              <span className="font-medium">@hunarofficial1</span> for real orders and new
              drops from the studio.
            </p>
          </div>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-brown-warm hover:underline underline-offset-4 shrink-0"
          >
            Follow on Instagram
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1 md:gap-1.5">
        {images.map((image, index) => (
          <a
            key={`${image}-${index}`}
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative aspect-square overflow-hidden group"
          >
            <Image
              src={image}
              alt={`Hunar crochet inspiration ${index + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 16vw"
            />
            <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/25 transition-colors flex items-center justify-center">
              <Instagram className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
            </div>
          </a>
        ))}
      </div>

      <div className="container-custom mt-8 text-center">
        <Link
          href="/shop"
          className="text-sm font-medium text-brown-warm hover:underline underline-offset-4"
        >
          Shop the collection →
        </Link>
      </div>
    </section>
  );
}
