import { MessageCircle, Palette, CreditCard, Package } from "lucide-react";

const steps = [
  {
    icon: MessageCircle,
    step: "01",
    title: "Choose your piece",
    description: "Browse cardigans, polos, sweaters and more — every design from our Instagram studio.",
  },
  {
    icon: Palette,
    step: "02",
    title: "Pick colour & size",
    description: "Tell us your preferred colour and size (S, M, or L). Each order is made uniquely for you.",
  },
  {
    icon: CreditCard,
    step: "03",
    title: "Pay half to start",
    description: "Confirm with 50% advance. The remaining 50% is collected cash-on-delivery when your piece arrives.",
  },
  {
    icon: Package,
    step: "04",
    title: "Receive in 7–10 days",
    description: "We hand-crochet your order with care and ship nationwide. Free delivery on orders over Rs. 5,000.",
  },
];

export function HowItWorks() {
  return (
    <section className="section-padding bg-charcoal text-cream">
      <div className="container-custom">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-medium uppercase tracking-widest text-gold-soft mb-3">
            How ordering works
          </p>
          <h2 className="heading-2 text-cream mb-4">
            Custom-made, without the hassle
          </h2>
          <p className="text-cream/75 text-lg">
            Hunar is made-to-order by design. Here&apos;s exactly what happens after you click buy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-semibold tracking-widest text-gold-soft">
                    {item.step}
                  </span>
                  <div className="h-px flex-1 bg-cream/15" />
                </div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cream/10 mb-4">
                  <Icon className="h-6 w-6 text-gold-soft" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-cream/70 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
