import { Heart, Package, RotateCcw } from "lucide-react";

export function HandMadePromise() {
  const features = [
    {
      icon: Heart,
      title: "Hand-Crafted",
      description: "Each piece is lovingly made by skilled artisans",
    },
    {
      icon: Package,
      title: "Free Shipping",
      description: "On orders over $75 within the US",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "Free 7-day returns, no questions asked",
    },
  ];

  return (
    <section className="py-16 md:py-24 container-custom">
      <div className="text-center mb-12">
        <h2 className="heading-2 mb-4">The Hunar Promise</h2>
        <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
          We're committed to quality, sustainability, and fair practices in everything we create.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cream mb-4">
                <Icon className="h-8 w-8 text-brown-warm" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-charcoal/70">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

