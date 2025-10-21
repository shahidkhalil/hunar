import Link from "next/link";
import Image from "next/image";
import { Button } from "@hunar/ui";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export const revalidate = 3600; // Revalidate every hour

async function getFeaturedProducts() {
  try {
    const data = await api.products.list({ featured: "true", limit: "6" });
    return data.products || [];
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

async function getNewProducts() {
  try {
    const data = await api.products.list({ isNew: "true", limit: "4" });
    return data.products || [];
  } catch (error) {
    console.error("Error fetching new products:", error);
    return [];
  }
}

export default async function HomePage() {
  const [featured, newProducts] = await Promise.all([
    getFeaturedProducts(),
    getNewProducts(),
  ]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] bg-cream overflow-visible">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <Image
            src="/banner.png"
            alt="Hand-crafted crochet banner"
            fill
            className="object-cover object-center"
            priority
            quality={100}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/50 via-charcoal/30 to-transparent" />
        </div>
        
        {/* Text Overlay */}
        <div className="relative h-full flex items-center justify-start z-10 py-8 md:py-12">
          <div className="container mx-auto px-6 md:px-12 lg:px-16">
            <div className="max-w-3xl text-white pt-4 md:pt-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 md:mb-6 leading-tight drop-shadow-2xl">
                Hand-Crafted with Love
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 md:mb-8 leading-relaxed opacity-95 drop-shadow-lg max-w-2xl">
                Discover artisan crochet pieces for your wardrobe and home. Each item tells a unique story.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/shop?gender=WOMEN">
                  <Button size="lg" className="bg-white text-charcoal hover:bg-white/90 shadow-xl">
                    Shop Women
                  </Button>
                </Link>
                <Link href="/shop?gender=MEN">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-charcoal shadow-xl backdrop-blur-sm">
                    Shop Men
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link
              href="/shop?gender=WOMEN"
              className="group relative h-[400px] rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-brown/80 to-transparent z-10" />
              <Image
                src="/women.png"
                alt="Women's Crochet Collection - Hand-crafted pieces"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                quality={100}
              />
              <div className="absolute bottom-8 left-8 z-20">
                <h2 className="text-4xl font-serif font-bold text-white mb-2">
                  Women
                </h2>
                <p className="text-white/90">Explore the collection →</p>
              </div>
            </Link>

            <Link
              href="/shop?gender=MEN"
              className="group relative h-[400px] rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-brown/80 to-transparent z-10" />
              <Image
                src="/men.png"
                alt="Men's Crochet Collection - Handmade accessories"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                quality={100}
              />
              <div className="absolute bottom-8 left-8 z-20">
                <h2 className="text-4xl font-serif font-bold text-white mb-2">
                  Men
                </h2>
                <p className="text-white/90">Explore the collection →</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newProducts.length > 0 && (
        <section className="py-20 bg-cream/50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold text-brown mb-4">
                New Arrivals
              </h2>
              <p className="text-charcoal/80">
                Fresh pieces added to our collection
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/shop?isNew=true">
                <Button variant="outline">View All New</Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Hand-Made Promise */}
      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-serif font-bold text-brown mb-6">
              The Hand-Made Promise
            </h2>
            <p className="text-lg text-charcoal/80 mb-8">
              Every piece at Hunar is lovingly crafted by skilled artisans. We believe in
              slow fashion, quality materials, and timeless designs that you'll treasure for years.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div>
                <h3 className="font-serif text-xl font-bold text-brown mb-2">
                  Hand-Crafted
                </h3>
                <p className="text-charcoal/70 text-sm">
                  Made with care by skilled artisans
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-brown mb-2">
                  Ethically Made
                </h3>
                <p className="text-charcoal/70 text-sm">
                  Fair wages and sustainable practices
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-brown mb-2">
                  Quality Materials
                </h3>
                <p className="text-charcoal/70 text-sm">
                  Premium yarns and natural fibers
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-20 bg-cream/50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold text-brown mb-4">
                Featured Products
              </h2>
              <p className="text-charcoal/80">
                Curated pieces we love
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  const image = product.images?.[0] || { url: "" };

  return (
    <Link href={`/product/${product.slug}`} className="group">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-brown/5 mb-4">
        {image.url && (
          <Image
            src={image.url}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        {product.isNew && (
          <span className="absolute top-4 right-4 bg-gold text-charcoal text-xs px-3 py-1 rounded-full font-medium">
            New
          </span>
        )}
        {product.isBestseller && (
          <span className="absolute top-4 left-4 bg-brown text-white text-xs px-3 py-1 rounded-full font-medium">
            Bestseller
          </span>
        )}
      </div>
      <h3 className="font-serif text-lg font-semibold text-brown mb-1 group-hover:underline">
        {product.title}
      </h3>
      {product.subtitle && (
        <p className="text-charcoal/60 text-sm mb-2">{product.subtitle}</p>
      )}
      <div className="flex items-center gap-2">
        <span className="font-medium text-charcoal">
          {formatPrice(product.price)}
        </span>
        {product.compareAt && (
          <span className="text-charcoal/50 line-through text-sm">
            {formatPrice(product.compareAt)}
          </span>
        )}
      </div>
    </Link>
  );
}
