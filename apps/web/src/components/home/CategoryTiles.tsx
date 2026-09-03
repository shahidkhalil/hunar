import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    name: "Women",
    description: "Cardigans, co-ords & more",
    href: "/shop?gender=WOMEN",
    image: "/brand/category-women.png",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    name: "Men",
    description: "Polos & winter layers",
    href: "/shop?gender=MEN",
    image: "/brand/category-men.png",
    span: "",
  },
  {
    name: "Winter",
    description: "Cozy seasonal picks",
    href: "/shop?isNew=true",
    image: "/brand/category-winter.png",
    span: "",
  },
];

export function CategoryTiles() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-brown-warm/80 mb-2">
              Shop by style
            </p>
            <h2 className="heading-2">Find your next favourite piece</h2>
          </div>
          <Link
            href="/shop"
            className="text-sm font-medium text-brown-warm hover:underline underline-offset-4 inline-flex items-center gap-1"
          >
            View all products
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 md:gap-5 md:min-h-[520px]">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className={`group relative overflow-hidden rounded-2xl min-h-[280px] ${category.span}`}
            >
              <Image
                src={category.image}
                alt={`${category.name} crochet collection`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-1">
                  {category.name}
                </h3>
                <p className="text-white/80 text-sm mb-3">{category.description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-white group-hover:gap-2 transition-all">
                  Shop now
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
