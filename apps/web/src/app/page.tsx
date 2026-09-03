import { api } from "@/lib/api";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { CategoryTiles } from "@/components/home/CategoryTiles";
import { ProductSection } from "@/components/home/ProductSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { HunarPromise } from "@/components/home/HunarPromise";
import { InstagramGrid } from "@/components/home/InstagramGrid";
import { ShopCTA } from "@/components/home/ShopCTA";

export const revalidate = 3600;

async function getProducts(filters: Record<string, string>) {
  try {
    const data = await api.products.list(filters);
    return data.products || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function HomePage() {
  const [bestsellers, newArrivals, featured] = await Promise.all([
    getProducts({ isBestseller: "true", limit: "4" }),
    getProducts({ isNew: "true", limit: "4" }),
    getProducts({ featured: "true", limit: "3" }),
  ]);

  const featuredProducts =
    featured.length > 0 ? featured : bestsellers.slice(0, 3);

  return (
    <>
      <Hero />
      <TrustBar />
      <CategoryTiles />

      <ProductSection
        title="Customer favourites"
        subtitle="Most-loved pieces from our Instagram community"
        products={bestsellers}
        viewAllHref="/shop?isBestseller=true"
        viewAllLabel="Shop best sellers"
        variant="muted"
      />

      <HowItWorks />

      <ProductSection
        title="New arrivals"
        subtitle="Fresh designs just added to the studio"
        products={newArrivals}
        viewAllHref="/shop?isNew=true"
        viewAllLabel="See what's new"
      />

      {featuredProducts.length > 0 && (
        <ProductSection
          title="Editor&apos;s picks"
          subtitle="Curated styles our team recommends starting with"
          products={featuredProducts}
          viewAllHref="/shop"
          viewAllLabel="Browse collection"
          variant="muted"
          columns={3}
        />
      )}

      <HunarPromise />
      <InstagramGrid />
      <ShopCTA />
    </>
  );
}
