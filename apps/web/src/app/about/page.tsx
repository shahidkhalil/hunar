import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="container-custom py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-serif font-bold text-brown mb-6 text-center">
          About Hunar
        </h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-charcoal/80 text-center mb-12">
            The art of handcrafting beautiful crochet pieces, one stitch at a time.
          </p>

          <div className="relative h-[400px] rounded-2xl overflow-hidden mb-12">
            <Image
              src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200"
              alt="Craftsmanship"
              fill
              className="object-cover"
            />
          </div>

          <h2 className="text-3xl font-serif font-bold text-brown mb-4">
            Our Story
          </h2>
          <p className="text-charcoal/80 mb-6">
            Hunar, which means "skill" or "craft" in Urdu, was born from a passion for preserving
            traditional crochet techniques while creating contemporary pieces that fit modern
            lifestyles. Founded in 2020, we work with skilled artisans who pour their hearts into
            every stitch.
          </p>

          <p className="text-charcoal/80 mb-6">
            Each piece tells a story—of dedication, craftsmanship, and the timeless beauty of
            handmade goods. We believe in slow fashion, quality over quantity, and creating pieces
            that will be cherished for years to come.
          </p>

          <h2 className="text-3xl font-serif font-bold text-brown mb-4 mt-12">
            Our Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-cream/50 rounded-2xl p-6">
              <h3 className="font-serif text-xl font-bold text-brown mb-3">
                Hand-Crafted Excellence
              </h3>
              <p className="text-charcoal/70">
                Every product is made by hand with meticulous attention to detail. No machines, no
                shortcuts—just pure craftsmanship.
              </p>
            </div>

            <div className="bg-cream/50 rounded-2xl p-6">
              <h3 className="font-serif text-xl font-bold text-brown mb-3">
                Ethical Production
              </h3>
              <p className="text-charcoal/70">
                We ensure fair wages, safe working conditions, and sustainable practices throughout
                our supply chain.
              </p>
            </div>

            <div className="bg-cream/50 rounded-2xl p-6">
              <h3 className="font-serif text-xl font-bold text-brown mb-3">
                Quality Materials
              </h3>
              <p className="text-charcoal/70">
                We use only premium, natural fibers and yarns that are gentle on the skin and
                durable for long-lasting wear.
              </p>
            </div>

            <div className="bg-cream/50 rounded-2xl p-6">
              <h3 className="font-serif text-xl font-bold text-brown mb-3">
                Timeless Design
              </h3>
              <p className="text-charcoal/70">
                Our designs blend traditional techniques with contemporary aesthetics, creating
                pieces that never go out of style.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-serif font-bold text-brown mb-4">
            Meet the Artisans
          </h2>
          <p className="text-charcoal/80 mb-6">
            Behind every Hunar product is a skilled artisan with years of experience. We partner with
            craftspeople from various regions, each bringing their unique techniques and cultural
            heritage to our collections. When you buy from Hunar, you're not just purchasing a
            product—you're supporting livelihoods and keeping traditional crafts alive.
          </p>
        </div>
      </div>
    </div>
  );
}

