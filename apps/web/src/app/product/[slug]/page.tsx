import productSlugs from "@/data/product-slugs.json";
import { ProductDetails } from "./ProductDetails";

export async function generateStaticParams() {
  return productSlugs.map((slug) => ({ slug }));
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  return <ProductDetails slug={params.slug} />;
}
