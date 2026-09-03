import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@hunar/ui";

interface ProductSectionProps {
  title: string;
  subtitle: string;
  products: any[];
  viewAllHref: string;
  viewAllLabel?: string;
  variant?: "default" | "muted";
  columns?: 3 | 4;
}

export function ProductSection({
  title,
  subtitle,
  products,
  viewAllHref,
  viewAllLabel = "View all",
  variant = "default",
  columns = 4,
}: ProductSectionProps) {
  if (products.length === 0) return null;

  const gridClass =
    columns === 3
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <section
      className={`section-padding ${variant === "muted" ? "bg-cream/60" : ""}`}
    >
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="heading-2 mb-2">{title}</h2>
            <p className="text-charcoal/70">{subtitle}</p>
          </div>
          <Link
            href={viewAllHref}
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-brown-warm hover:underline underline-offset-4"
          >
            {viewAllLabel}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className={`grid ${gridClass} gap-6 md:gap-8`}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-10 sm:hidden">
          <Link href={viewAllHref}>
            <Button variant="outline">{viewAllLabel}</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
