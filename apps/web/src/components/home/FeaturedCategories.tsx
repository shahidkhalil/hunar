import Link from "next/link";
import Image from "next/image";

export function FeaturedCategories() {
  const categories = [
    {
      name: "Women",
      href: "/shop?gender=WOMEN",
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600",
    },
    {
      name: "Men",
      href: "/shop?gender=MEN",
      image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600",
    },
    {
      name: "Home",
      href: "/shop?category=home",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600",
    },
  ];

  return (
    <section className="py-16 md:py-24 container-custom">
      <div className="text-center mb-12">
        <h2 className="heading-2 mb-4">Shop by Category</h2>
        <p className="text-lg text-charcoal/70">
          Explore our curated collections
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            className="group relative overflow-hidden rounded-2xl aspect-[4/5] block"
          >
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-2xl font-serif font-bold mb-2">{category.name}</h3>
              <span className="text-sm underline">Shop Now</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

