import Image from "next/image";
import { Instagram } from "lucide-react";

export function InstagramGrid() {
  const images = [
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400",
    "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400",
    "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400",
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400",
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400",
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400",
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container-custom">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Instagram className="h-6 w-6" />
            <h2 className="heading-3">@hunarcraft</h2>
          </div>
          <p className="text-lg text-charcoal/70">
            Follow us for daily inspiration and behind-the-scenes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {images.map((image, index) => (
          <a
            key={index}
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="relative aspect-square overflow-hidden group"
          >
            <Image
              src={image}
              alt={`Instagram post ${index + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-brown-warm/0 group-hover:bg-brown-warm/20 transition-colors" />
          </a>
        ))}
      </div>
    </section>
  );
}

