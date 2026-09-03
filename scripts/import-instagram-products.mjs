import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execFileSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "apps/web/public/products/instagram");
const SQL_OUT = path.join(ROOT, "supabase/migrations/20260902130000_instagram_products.sql");
const POSTS_FILE = path.join(__dirname, "instagram-posts.json");

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function guessCategory(description) {
  const text = description.toLowerCase();
  if (/baby|newborn|kid/.test(text)) return "accessories";
  if (/men|polo|shirt|sweater|beanie|male/.test(text)) return "men";
  if (/home|blanket|decor|wall/.test(text)) return "home";
  return "women";
}

function sqlEscape(value) {
  return value.replace(/'/g, "''");
}

function downloadImage(url, filename) {
  execFileSync("curl", ["-sSL", "-A", "Mozilla/5.0", url, "-o", filename], {
    stdio: "inherit",
  });
  const stat = fs.statSync(filename);
  if (stat.size < 1000) {
    throw new Error(`Download too small: ${filename}`);
  }
}

function main() {
  const posts = JSON.parse(fs.readFileSync(POSTS_FILE, "utf8"));
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const sqlParts = [
    "-- Replace placeholder catalog with products sourced from @hunarofficial1 Instagram",
    "delete from public.product_categories;",
    "delete from public.variants;",
    "delete from public.products;",
    "",
  ];

  posts.forEach((post, index) => {
    const imageFile = `${post.shortcode}.jpg`;
    const imagePath = path.join(OUT_DIR, imageFile);
    downloadImage(post.image, imagePath);

    const baseTitle = post.description.trim();
    const title = baseTitle.charAt(0).toUpperCase() + baseTitle.slice(1);
    const slug = `${slugify(title)}-${post.shortcode.toLowerCase()}`;
    const categorySlug = guessCategory(post.description);
    const price = 6900 + (index % 6) * 1500;
    const publicUrl = `/products/instagram/${imageFile}`;
    const imagesJson = JSON.stringify([{ publicId: post.shortcode, url: publicUrl }]);
    const description = `${title}. Colour of your choice. Available in small, medium, and large. Delivery in 7-10 days. Advance booking with half payment upfront and half cash on delivery.`;
    const tags =
      categorySlug === "men"
        ? "{men,handmade,instagram,winter}"
        : "{women,handmade,instagram,winter}";

    sqlParts.push(`
insert into public.products (
  title, slug, subtitle, description, price, images, materials, care, tags,
  is_featured, is_new, is_bestseller, stock, status
) values (
  '${sqlEscape(title)}',
  '${sqlEscape(slug)}',
  'Handmade by Hunar',
  '${sqlEscape(description)}',
  ${price},
  '${sqlEscape(imagesJson)}'::jsonb,
  'Premium yarn, hand-crafted',
  'Hand wash cold, lay flat to dry',
  '${tags}',
  ${index < 6},
  ${index < 5},
  ${index % 4 === 0},
  12,
  'PUBLISHED'
);

insert into public.product_categories (product_id, category_id)
select p.id, c.id
from public.products p
join public.categories c on c.slug = '${categorySlug}'
where p.slug = '${sqlEscape(slug)}';

insert into public.variants (product_id, color, size, sku, stock)
select id, 'Custom Color', 'One Size', '${sqlEscape(slug)}-default', 12
from public.products
where slug = '${sqlEscape(slug)}';
`);
  });

  fs.writeFileSync(SQL_OUT, sqlParts.join("\n"));
  console.log(`Imported ${posts.length} Instagram products`);
  console.log(`Images: ${OUT_DIR}`);
  console.log(`Migration: ${SQL_OUT}`);
}

main();
