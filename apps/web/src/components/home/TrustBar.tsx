import { Banknote, Palette, Truck, Clock } from "lucide-react";

const trustItems = [
  {
    icon: Banknote,
    label: "Half advance, half COD",
    short: "Easy payment",
  },
  {
    icon: Truck,
    label: "Free shipping over Rs. 5,000",
    short: "Nationwide delivery",
  },
  {
    icon: Palette,
    label: "Your colour, S / M / L",
    short: "Made to order",
  },
  {
    icon: Clock,
    label: "Ready in 7–10 days",
    short: "Hand-crafted",
  },
];

export function TrustBar() {
  return (
    <section className="border-y border-brown-warm/10 bg-white">
      <div className="container-custom py-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 justify-center lg:justify-start"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream">
                  <Icon className="h-5 w-5 text-brown-warm" aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-charcoal leading-snug hidden sm:block">
                    {item.label}
                  </p>
                  <p className="text-sm font-medium text-charcoal leading-snug sm:hidden">
                    {item.short}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
