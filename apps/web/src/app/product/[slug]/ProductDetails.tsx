"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@hunar/ui";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { Check } from "lucide-react";

export function ProductDetails({ slug }: { slug: string }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await api.products.get(slug);
        setProduct(data);
        if (data?.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;

    const image = product.images?.[0] || { url: "" };

    addItem({
      productId: product.id,
      variantId: selectedVariant?.id,
      title: product.title,
      slug: product.slug,
      color: selectedVariant?.color,
      size: selectedVariant?.size,
      price: selectedVariant?.price || product.price,
      quantity,
      image: image.url,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="container-custom py-20">
        <p className="text-center text-charcoal/60">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-20">
        <p className="text-center text-charcoal/60">Product not found.</p>
      </div>
    );
  }

  const currentPrice = selectedVariant?.price || product.price;

  return (
    <div className="container-custom py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-brown/5 mb-4">
            {product.images && product.images[selectedImage] && (
              <Image
                src={product.images[selectedImage].url}
                alt={product.title}
                fill
                className="object-cover"
              />
            )}
          </div>

          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-xl overflow-hidden ${
                    selectedImage === index ? "ring-2 ring-brown" : ""
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={`${product.title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-4xl font-serif font-bold text-brown mb-2">
            {product.title}
          </h1>
          {product.subtitle && (
            <p className="text-lg text-charcoal/70 mb-4">{product.subtitle}</p>
          )}

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-charcoal">
              {formatPrice(currentPrice)}
            </span>
            {product.compareAt && (
              <span className="text-xl text-charcoal/50 line-through">
                {formatPrice(product.compareAt)}
              </span>
            )}
          </div>

          <div className="prose prose-sm mb-8">
            <p className="text-charcoal/80">{product.description}</p>
          </div>

          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-charcoal mb-3">
                Color & Size
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {product.variants.map((variant: any) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`p-4 rounded-xl border-2 transition-colors ${
                      selectedVariant?.id === variant.id
                        ? "border-brown bg-brown/5"
                        : "border-brown/20 hover:border-brown/40"
                    }`}
                  >
                    <div className="text-sm font-medium text-charcoal">
                      {variant.color}
                    </div>
                    <div className="text-xs text-charcoal/60">
                      {variant.size}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-semibold text-charcoal mb-3">Quantity</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-xl border border-brown/20 hover:border-brown flex items-center justify-center"
              >
                -
              </button>
              <span className="text-lg font-medium w-8 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-xl border border-brown/20 hover:border-brown flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full mb-6"
            onClick={handleAddToCart}
            disabled={added}
          >
            {added ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Added to Cart
              </>
            ) : (
              "Add to Cart"
            )}
          </Button>

          {(product.materials || product.care) && (
            <div className="border-t border-brown/10 pt-6 space-y-4">
              {product.materials && (
                <div>
                  <h3 className="font-semibold text-charcoal mb-2">
                    Materials
                  </h3>
                  <p className="text-sm text-charcoal/70">{product.materials}</p>
                </div>
              )}
              {product.care && (
                <div>
                  <h3 className="font-semibold text-charcoal mb-2">
                    Care Instructions
                  </h3>
                  <p className="text-sm text-charcoal/70">{product.care}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
