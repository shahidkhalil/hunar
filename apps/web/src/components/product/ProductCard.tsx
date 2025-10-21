"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Badge } from "@hunar/ui";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { useWishlistStore } from "@/lib/store";

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const { hasItem, addItem, removeItem } = useWishlistStore();
  const isWishlisted = hasItem(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      removeItem(product.id);
    } else {
      addItem(product.id);
    }
  };

  const imageUrl = getImageUrl(product.images);

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-cream mb-4">
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {product.isNew && <Badge variant="new">New</Badge>}
          {product.isBestseller && <Badge variant="bestseller">Bestseller</Badge>}
          {product.isFeatured && <Badge variant="outline">Featured</Badge>}
          {product.compareAt && product.compareAt > product.price && (
            <Badge variant="limited">Sale</Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
        >
          <Heart
            className={`h-5 w-5 ${
              isWishlisted ? "fill-brown-warm text-brown-warm" : "text-charcoal"
            }`}
          />
        </button>
      </div>

      <div>
        <h3 className="font-medium text-charcoal mb-1 group-hover:text-brown-warm transition-colors line-clamp-1">
          {product.title}
        </h3>
        {product.subtitle && (
          <p className="text-sm text-charcoal/60 mb-2 line-clamp-1">{product.subtitle}</p>
        )}
        <div className="flex items-center gap-2">
          <span className="font-semibold">{formatPrice(product.price)}</span>
          {product.compareAt && product.compareAt > product.price && (
            <span className="text-sm text-charcoal/50 line-through">
              {formatPrice(product.compareAt)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

