import Image from "next/image";

export default function LookbookPage() {
  const images = [
    {
      url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800",
      title: "Summer Collection",
    },
    {
      url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
      title: "Artisan Details",
    },
    {
      url: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800",
      title: "Modern Craftsmanship",
    },
    {
      url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800",
      title: "Cozy Textures",
    },
    {
      url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800",
      title: "Vintage Inspired",
    },
    {
      url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800",
      title: "Hand-Made Beauty",
    },
  ];

  return (
    <div className="container-custom py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-serif font-bold text-brown mb-4">
          Lookbook
        </h1>
        <p className="text-xl text-charcoal/80 max-w-2xl mx-auto">
          A visual journey through our hand-crafted collections. Each piece tells a story of
          dedication, artistry, and timeless style.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <div
            key={index}
            className="group relative aspect-square rounded-2xl overflow-hidden"
          >
            <Image
              src={image.url}
              alt={image.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brown/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-white font-serif text-2xl font-bold">
                  {image.title}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

