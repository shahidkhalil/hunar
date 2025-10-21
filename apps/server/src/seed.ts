import { PrismaClient } from "@prisma/client";
import { hashPassword } from "./lib/auth";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await hashPassword("admin123");
  const admin = await prisma.user.upsert({
    where: { email: "admin@hunar.com" },
    update: {},
    create: {
      email: "admin@hunar.com",
      name: "Admin User",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user created");

  // Create categories
  const womenCategory = await prisma.category.upsert({
    where: { slug: "women" },
    update: {},
    create: {
      name: "Women",
      slug: "women",
      gender: "WOMEN",
    },
  });

  const menCategory = await prisma.category.upsert({
    where: { slug: "men" },
    update: {},
    create: {
      name: "Men",
      slug: "men",
      gender: "MEN",
    },
  });

  const accessoriesCategory = await prisma.category.upsert({
    where: { slug: "accessories" },
    update: {},
    create: {
      name: "Accessories",
      slug: "accessories",
      gender: "UNISEX",
    },
  });

  const homeCategory = await prisma.category.upsert({
    where: { slug: "home" },
    update: {},
    create: {
      name: "Home",
      slug: "home",
    },
  });

  console.log("✅ Categories created");

  // Sample product images (placeholder URLs)
  const placeholderImages = [
    {
      publicId: "sample1",
      url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800",
    },
    {
      publicId: "sample2",
      url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
    },
  ];

  // Products for Women
  const womenProducts = [
    {
      title: "Hunar Soft Weave Cardigan",
      slug: "soft-weave-cardigan-women",
      subtitle: "Hand-crafted with premium cotton yarn",
      description: "A timeless cardigan featuring intricate crochet patterns. Perfect for layering in any season. Made with love and attention to detail, this piece showcases traditional craftsmanship with a modern touch.",
      price: 12900, // $129.00
      compareAt: 15900,
      images: placeholderImages,
      materials: "100% Cotton yarn, sustainably sourced",
      care: "Hand wash cold, lay flat to dry. Do not bleach or iron.",
      tags: ["cardigan", "women", "bestseller"],
      isFeatured: true,
      isBestseller: true,
      stock: 15,
      status: "PUBLISHED",
    },
    {
      title: "Heritage Lace Shawl",
      slug: "heritage-lace-shawl",
      subtitle: "Delicate and timeless",
      description: "An elegant lace shawl that adds sophistication to any outfit. Features traditional crochet lace patterns passed down through generations.",
      price: 8900,
      images: placeholderImages,
      materials: "Merino wool blend",
      care: "Hand wash cold, reshape and dry flat",
      tags: ["shawl", "women", "lace"],
      isFeatured: true,
      isNew: true,
      stock: 20,
      status: "PUBLISHED",
    },
    {
      title: "Classic Granny-Square Tote",
      slug: "granny-square-tote",
      subtitle: "Vintage charm meets modern utility",
      description: "A spacious tote bag featuring the iconic granny square pattern. Perfect for daily use, shopping, or the beach.",
      price: 5900,
      images: placeholderImages,
      materials: "Cotton yarn",
      care: "Machine wash cold, air dry",
      tags: ["tote", "women", "accessories"],
      isBestseller: true,
      stock: 30,
      status: "PUBLISHED",
    },
    {
      title: "Bohemian Crop Top",
      slug: "bohemian-crop-top",
      subtitle: "Festival-ready crochet",
      description: "A breezy crop top with bohemian flair. Features an open-weave pattern perfect for summer festivals and beach days.",
      price: 6900,
      images: placeholderImages,
      materials: "100% Cotton",
      care: "Hand wash cold",
      tags: ["top", "women", "summer"],
      isNew: true,
      stock: 25,
      status: "PUBLISHED",
    },
    {
      title: "Vintage Rose Blanket Scarf",
      slug: "vintage-rose-blanket-scarf",
      subtitle: "Oversized warmth",
      description: "An oversized blanket scarf featuring rose motifs. Can be worn as a scarf, shawl, or light blanket.",
      price: 9900,
      images: placeholderImages,
      materials: "Acrylic and wool blend",
      care: "Machine wash cold, tumble dry low",
      tags: ["scarf", "women", "winter"],
      stock: 18,
      status: "PUBLISHED",
    },
  ];

  // Products for Men
  const menProducts = [
    {
      title: "Heritage Crochet Beanie",
      slug: "heritage-beanie-men",
      subtitle: "Classic warmth with artisan touch",
      description: "A cozy beanie featuring traditional crochet stitches. Perfect for cold weather, combining comfort with timeless style.",
      price: 3900,
      images: placeholderImages,
      materials: "Wool blend",
      care: "Hand wash cold, reshape and dry flat",
      tags: ["beanie", "men", "winter"],
      isBestseller: true,
      stock: 40,
      status: "PUBLISHED",
    },
    {
      title: "Coastal Breeze Linen Shirt",
      slug: "coastal-breeze-linen-shirt-men",
      subtitle: "Lightweight summer essential",
      description: "A breathable crochet linen shirt perfect for warm weather. Features an open-weave pattern and relaxed fit.",
      price: 11900,
      images: placeholderImages,
      materials: "Linen and cotton blend",
      care: "Machine wash cold, hang to dry",
      tags: ["shirt", "men", "summer"],
      isNew: true,
      isFeatured: true,
      stock: 15,
      status: "PUBLISHED",
    },
    {
      title: "Rustic Chunky Scarf",
      slug: "rustic-chunky-scarf-men",
      subtitle: "Bold texture for cold days",
      description: "A thick, chunky scarf with a rustic aesthetic. Provides exceptional warmth while making a statement.",
      price: 6900,
      images: placeholderImages,
      materials: "Chunky wool yarn",
      care: "Hand wash cold, lay flat to dry",
      tags: ["scarf", "men", "winter"],
      stock: 22,
      status: "PUBLISHED",
    },
    {
      title: "Artisan Fingerless Gloves",
      slug: "artisan-fingerless-gloves-men",
      subtitle: "Function meets craftsmanship",
      description: "Fingerless gloves perfect for staying warm while maintaining dexterity. Features subtle geometric patterns.",
      price: 4900,
      images: placeholderImages,
      materials: "Merino wool",
      care: "Hand wash cold",
      tags: ["gloves", "men", "winter", "accessories"],
      isNew: true,
      stock: 30,
      status: "PUBLISHED",
    },
  ];

  // Unisex Accessories
  const accessoryProducts = [
    {
      title: "Rainbow Dreams Baby Blanket",
      slug: "rainbow-dreams-baby-blanket",
      subtitle: "Soft and colorful for little ones",
      description: "A gentle, colorful baby blanket made with hypoallergenic yarn. Perfect as a gift for new parents.",
      price: 7900,
      images: placeholderImages,
      materials: "100% Cotton, hypoallergenic",
      care: "Machine wash warm, tumble dry low",
      tags: ["blanket", "baby", "gift"],
      isFeatured: true,
      stock: 25,
      status: "PUBLISHED",
    },
    {
      title: "Market Mesh Bag Set",
      slug: "market-mesh-bag-set",
      subtitle: "Eco-friendly shopping companion",
      description: "A set of three reusable mesh bags in different sizes. Perfect for sustainable shopping and reducing plastic use.",
      price: 3900,
      images: placeholderImages,
      materials: "Cotton string",
      care: "Machine wash cold",
      tags: ["bag", "accessories", "eco-friendly"],
      isBestseller: true,
      stock: 50,
      status: "PUBLISHED",
    },
    {
      title: "Cozy Cup Sleeve Set",
      slug: "cozy-cup-sleeve-set",
      subtitle: "Protect your hands, save the planet",
      description: "Set of 4 reusable cup sleeves in assorted colors. Fits most coffee cups and adds a handmade touch to your morning routine.",
      price: 2900,
      images: placeholderImages,
      materials: "Cotton yarn",
      care: "Machine wash cold",
      tags: ["accessories", "eco-friendly", "gift"],
      stock: 60,
      status: "PUBLISHED",
    },
  ];

  // Home Products
  const homeProducts = [
    {
      title: "Mandala Wall Hanging",
      slug: "mandala-wall-hanging",
      subtitle: "Bohemian decor statement piece",
      description: "A stunning mandala wall hanging featuring intricate lacework. Adds texture and visual interest to any room.",
      price: 8900,
      images: placeholderImages,
      materials: "Cotton rope",
      care: "Spot clean only",
      tags: ["home", "decor", "wall-art"],
      isFeatured: true,
      isNew: true,
      stock: 12,
      status: "PUBLISHED",
    },
    {
      title: "Textured Throw Pillow Cover Set",
      slug: "textured-throw-pillow-set",
      subtitle: "Comfort meets style",
      description: "Set of 2 pillow covers with raised crochet patterns. Adds warmth and texture to sofas and beds.",
      price: 6900,
      images: placeholderImages,
      materials: "Cotton and acrylic blend",
      care: "Remove insert, machine wash cover cold",
      tags: ["home", "pillow", "decor"],
      stock: 20,
      status: "PUBLISHED",
    },
    {
      title: "Farmhouse Table Runner",
      slug: "farmhouse-table-runner",
      subtitle: "Rustic elegance for your table",
      description: "A beautiful table runner featuring vintage-inspired patterns. Perfect for dining tables or console styling.",
      price: 5900,
      images: placeholderImages,
      materials: "Cotton yarn",
      care: "Hand wash cold, lay flat to dry",
      tags: ["home", "table", "decor"],
      isBestseller: true,
      stock: 15,
      status: "PUBLISHED",
    },
    {
      title: "Heirloom Afghan Blanket",
      slug: "heirloom-afghan-blanket",
      subtitle: "A treasure to pass down",
      description: "A large, luxurious afghan featuring traditional granny square patterns. Made to be cherished for generations.",
      price: 19900,
      compareAt: 24900,
      images: placeholderImages,
      materials: "Premium wool blend",
      care: "Dry clean recommended or hand wash cold",
      tags: ["home", "blanket", "heirloom"],
      isFeatured: true,
      stock: 8,
      status: "PUBLISHED",
    },
    {
      title: "Modern Geometric Coasters",
      slug: "modern-geometric-coasters",
      subtitle: "Protect surfaces in style",
      description: "Set of 6 coasters featuring modern geometric patterns. Functional art for your coffee table.",
      price: 2900,
      images: placeholderImages,
      materials: "Cotton yarn",
      care: "Machine wash cold",
      tags: ["home", "coasters", "accessories"],
      stock: 40,
      status: "PUBLISHED",
    },
  ];

  // Create all products
  const allProducts = [
    ...womenProducts,
    ...menProducts,
    ...accessoryProducts,
    ...homeProducts,
  ];

  for (const productData of allProducts) {
    const product = await prisma.product.create({
      data: {
        ...productData,
        variants: {
          create: [
            {
              color: "Cream",
              size: "One Size",
              sku: `${productData.slug}-cream-os`,
              stock: Math.floor(productData.stock / 3),
            },
            {
              color: "Olive",
              size: "One Size",
              sku: `${productData.slug}-olive-os`,
              stock: Math.floor(productData.stock / 3),
            },
            {
              color: "Rust",
              size: "One Size",
              sku: `${productData.slug}-rust-os`,
              stock: Math.floor(productData.stock / 3),
            },
          ],
        },
      },
    });

    // Link to appropriate categories
    if (productData.tags.includes("women") || womenProducts.includes(productData as any)) {
      await prisma.productCategory.create({
        data: {
          productId: product.id,
          categoryId: womenCategory.id,
        },
      });
    }

    if (productData.tags.includes("men") || menProducts.includes(productData as any)) {
      await prisma.productCategory.create({
        data: {
          productId: product.id,
          categoryId: menCategory.id,
        },
      });
    }

    if (
      productData.tags.includes("accessories") ||
      accessoryProducts.includes(productData as any)
    ) {
      await prisma.productCategory.create({
        data: {
          productId: product.id,
          categoryId: accessoriesCategory.id,
        },
      });
    }

    if (productData.tags.includes("home") || homeProducts.includes(productData as any)) {
      await prisma.productCategory.create({
        data: {
          productId: product.id,
          categoryId: homeCategory.id,
        },
      });
    }
  }

  console.log(`✅ Created ${allProducts.length} products`);

  // Create coupons
  await prisma.coupon.createMany({
    data: [
      {
      code: "WELCOME10",
      type: "PERCENT",
      value: 10,
      active: true,
        usageCap: 100,
      },
      {
        code: "SAVE20",
        type: "PERCENT",
        value: 20,
        active: true,
      },
      {
      code: "FREESHIP",
      type: "FIXED",
        value: 500,
      active: true,
    },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Coupons created");

  // Create homepage slots
  await prisma.homepageSlot.upsert({
    where: { key: "hero" },
    update: {},
    create: {
      key: "hero",
      config: {
        title: "Hand-Crafted with Love",
        subtitle: "Discover artisan crochet pieces for your wardrobe and home",
        imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1200",
        ctaText: "Shop Now",
        ctaLink: "/shop",
      },
    },
  });

  console.log("✅ Homepage slots created");

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
