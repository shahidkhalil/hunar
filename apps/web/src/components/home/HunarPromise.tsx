import { Heart, Sparkles, ShieldCheck } from "lucide-react";

const promises = [
  {
    icon: Heart,
    title: "Hand-crafted with care",
    description:
      "Every stitch is done by hand. No mass production — just skilled artisans making pieces you'll keep for years.",
  },
  {
    icon: Sparkles,
    title: "Truly yours",
    description:
      "Choose your colour and size. Your piece isn't pulled from a shelf — it's crocheted specifically for your order.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted checkout",
    description:
      "Half payment upfront to begin, half on delivery. Transparent pricing in PKR with free shipping over Rs. 5,000.",
  },
];

export function HunarPromise() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sm font-medium uppercase tracking-widest text-brown-warm/80 mb-2">
            Why Hunar
          </p>
          <h2 className="heading-2 mb-4">Slow fashion you can feel good about</h2>
          <p className="text-charcoal/70 text-lg">
            We believe in quality over quantity — pieces that are personal, beautiful, and built to last.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {promises.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-brown-warm/10 bg-white p-8 text-center md:text-left"
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-cream mb-5">
                  <Icon className="h-7 w-7 text-brown-warm" aria-hidden />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-charcoal/70 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
