-- Seed catalog data for Hunar. Safe to run once on a fresh project.

insert into public.categories (name, slug, gender)
values
  ('Women', 'women', 'WOMEN'),
  ('Men', 'men', 'MEN'),
  ('Accessories', 'accessories', 'UNISEX'),
  ('Home', 'home', null);

insert into public.products (
  title, slug, subtitle, description, price, compare_at, images, materials, care, tags,
  is_featured, is_new, is_bestseller, stock, status
)
values
  (
    'Hunar Soft Weave Cardigan',
    'soft-weave-cardigan-women',
    'Hand-crafted with premium cotton yarn',
    'A timeless cardigan featuring intricate crochet patterns. Perfect for layering in any season. Made with love and attention to detail, this piece showcases traditional craftsmanship with a modern touch.',
    12900, 15900,
    '[{"publicId":"sample1","url":"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800"},{"publicId":"sample2","url":"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800"}]'::jsonb,
    '100% Cotton yarn, sustainably sourced',
    'Hand wash cold, lay flat to dry. Do not bleach or iron.',
    array['cardigan','women','bestseller'],
    true, false, true, 15, 'PUBLISHED'
  ),
  (
    'Heritage Lace Shawl',
    'heritage-lace-shawl',
    'Delicate and timeless',
    'An elegant lace shawl that adds sophistication to any outfit. Features traditional crochet lace patterns passed down through generations.',
    8900, null,
    '[{"publicId":"sample1","url":"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800"},{"publicId":"sample2","url":"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800"}]'::jsonb,
    'Merino wool blend',
    'Hand wash cold, reshape and dry flat',
    array['shawl','women','lace'],
    true, true, false, 20, 'PUBLISHED'
  ),
  (
    'Classic Granny-Square Tote',
    'granny-square-tote',
    'Vintage charm meets modern utility',
    'A spacious tote bag featuring the iconic granny square pattern. Perfect for daily use, shopping, or the beach.',
    5900, null,
    '[{"publicId":"sample1","url":"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800"},{"publicId":"sample2","url":"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800"}]'::jsonb,
    'Cotton yarn',
    'Machine wash cold, air dry',
    array['tote','women','accessories'],
    false, false, true, 30, 'PUBLISHED'
  ),
  (
    'Bohemian Crop Top',
    'bohemian-crop-top',
    'Festival-ready crochet',
    'A breezy crop top with bohemian flair. Features an open-weave pattern perfect for summer festivals and beach days.',
    6900, null,
    '[{"publicId":"sample1","url":"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800"},{"publicId":"sample2","url":"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800"}]'::jsonb,
    '100% Cotton',
    'Hand wash cold',
    array['top','women','summer'],
    false, true, false, 25, 'PUBLISHED'
  ),
  (
    'Vintage Rose Blanket Scarf',
    'vintage-rose-blanket-scarf',
    'Oversized warmth',
    'An oversized blanket scarf featuring rose motifs. Can be worn as a scarf, shawl, or light blanket.',
    9900, null,
    '[{"publicId":"sample1","url":"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800"},{"publicId":"sample2","url":"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800"}]'::jsonb,
    'Acrylic and wool blend',
    'Machine wash cold, tumble dry low',
    array['scarf','women','winter'],
    false, false, false, 18, 'PUBLISHED'
  ),
  (
    'Heritage Crochet Beanie',
    'heritage-beanie-men',
    'Classic warmth with artisan touch',
    'A cozy beanie featuring traditional crochet stitches. Perfect for cold weather, combining comfort with timeless style.',
    3900, null,
    '[{"publicId":"sample1","url":"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800"},{"publicId":"sample2","url":"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800"}]'::jsonb,
    'Wool blend',
    'Hand wash cold, reshape and dry flat',
    array['beanie','men','winter'],
    false, false, true, 40, 'PUBLISHED'
  ),
  (
    'Coastal Breeze Linen Shirt',
    'coastal-breeze-linen-shirt-men',
    'Lightweight summer essential',
    'A breathable crochet linen shirt perfect for warm weather. Features an open-weave pattern and relaxed fit.',
    11900, null,
    '[{"publicId":"sample1","url":"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800"},{"publicId":"sample2","url":"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800"}]'::jsonb,
    'Linen and cotton blend',
    'Machine wash cold, hang to dry',
    array['shirt','men','summer'],
    true, true, false, 15, 'PUBLISHED'
  ),
  (
    'Rustic Chunky Scarf',
    'rustic-chunky-scarf-men',
    'Bold texture for cold days',
    'A thick, chunky scarf with a rustic aesthetic. Provides exceptional warmth while making a statement.',
    6900, null,
    '[{"publicId":"sample1","url":"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800"},{"publicId":"sample2","url":"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800"}]'::jsonb,
    'Chunky wool yarn',
    'Hand wash cold, lay flat to dry',
    array['scarf','men','winter'],
    false, false, false, 22, 'PUBLISHED'
  ),
  (
    'Artisan Fingerless Gloves',
    'artisan-fingerless-gloves-men',
    'Function meets craftsmanship',
    'Fingerless gloves perfect for staying warm while maintaining dexterity. Features subtle geometric patterns.',
    4900, null,
    '[{"publicId":"sample1","url":"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800"},{"publicId":"sample2","url":"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800"}]'::jsonb,
    'Merino wool',
    'Hand wash cold',
    array['gloves','men','winter','accessories'],
    false, true, false, 30, 'PUBLISHED'
  ),
  (
    'Rainbow Dreams Baby Blanket',
    'rainbow-dreams-baby-blanket',
    'Soft and colorful for little ones',
    'A gentle, colorful baby blanket made with hypoallergenic yarn. Perfect as a gift for new parents.',
    7900, null,
    '[{"publicId":"sample1","url":"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800"},{"publicId":"sample2","url":"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800"}]'::jsonb,
    '100% Cotton, hypoallergenic',
    'Machine wash warm, tumble dry low',
    array['blanket','baby','gift'],
    true, false, false, 25, 'PUBLISHED'
  ),
  (
    'Market Mesh Bag Set',
    'market-mesh-bag-set',
    'Eco-friendly shopping companion',
    'A set of three reusable mesh bags in different sizes. Perfect for sustainable shopping and reducing plastic use.',
    3900, null,
    '[{"publicId":"sample1","url":"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800"},{"publicId":"sample2","url":"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800"}]'::jsonb,
    'Cotton string',
    'Machine wash cold',
    array['bag','accessories','eco-friendly'],
    false, false, true, 50, 'PUBLISHED'
  ),
  (
    'Cozy Cup Sleeve Set',
    'cozy-cup-sleeve-set',
    'Protect your hands, save the planet',
    'Set of 4 reusable cup sleeves in assorted colors. Fits most coffee cups and adds a handmade touch to your morning routine.',
    2900, null,
    '[{"publicId":"sample1","url":"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800"},{"publicId":"sample2","url":"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800"}]'::jsonb,
    'Cotton yarn',
    'Machine wash cold',
    array['accessories','eco-friendly','gift'],
    false, false, false, 60, 'PUBLISHED'
  ),
  (
    'Mandala Wall Hanging',
    'mandala-wall-hanging',
    'Bohemian decor statement piece',
    'A stunning mandala wall hanging featuring intricate lacework. Adds texture and visual interest to any room.',
    8900, null,
    '[{"publicId":"sample1","url":"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800"},{"publicId":"sample2","url":"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800"}]'::jsonb,
    'Cotton rope',
    'Spot clean only',
    array['home','decor','wall-art'],
    true, true, false, 12, 'PUBLISHED'
  ),
  (
    'Textured Throw Pillow Cover Set',
    'textured-throw-pillow-set',
    'Comfort meets style',
    'Set of 2 pillow covers with raised crochet patterns. Adds warmth and texture to sofas and beds.',
    6900, null,
    '[{"publicId":"sample1","url":"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800"},{"publicId":"sample2","url":"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800"}]'::jsonb,
    'Cotton and acrylic blend',
    'Remove insert, machine wash cover cold',
    array['home','pillow','decor'],
    false, false, false, 20, 'PUBLISHED'
  ),
  (
    'Farmhouse Table Runner',
    'farmhouse-table-runner',
    'Rustic elegance for your table',
    'A beautiful table runner featuring vintage-inspired patterns. Perfect for dining tables or console styling.',
    5900, null,
    '[{"publicId":"sample1","url":"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800"},{"publicId":"sample2","url":"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800"}]'::jsonb,
    'Cotton yarn',
    'Hand wash cold, lay flat to dry',
    array['home','table','decor'],
    false, false, true, 15, 'PUBLISHED'
  ),
  (
    'Heirloom Afghan Blanket',
    'heirloom-afghan-blanket',
    'A treasure to pass down',
    'A large, luxurious afghan featuring traditional granny square patterns. Made to be cherished for generations.',
    19900, 24900,
    '[{"publicId":"sample1","url":"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800"},{"publicId":"sample2","url":"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800"}]'::jsonb,
    'Premium wool blend',
    'Dry clean recommended or hand wash cold',
    array['home','blanket','heirloom'],
    true, false, false, 8, 'PUBLISHED'
  ),
  (
    'Modern Geometric Coasters',
    'modern-geometric-coasters',
    'Protect surfaces in style',
    'Set of 6 coasters featuring modern geometric patterns. Functional art for your coffee table.',
    2900, null,
    '[{"publicId":"sample1","url":"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800"},{"publicId":"sample2","url":"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800"}]'::jsonb,
    'Cotton yarn',
    'Machine wash cold',
    array['home','coasters','accessories'],
    false, false, false, 40, 'PUBLISHED'
  );

insert into public.variants (product_id, color, size, sku, stock)
select id, 'Cream', 'One Size', slug || '-cream-os', greatest(floor(stock / 3.0)::int, 1)
from public.products;

insert into public.variants (product_id, color, size, sku, stock)
select id, 'Olive', 'One Size', slug || '-olive-os', greatest(floor(stock / 3.0)::int, 1)
from public.products;

insert into public.variants (product_id, color, size, sku, stock)
select id, 'Rust', 'One Size', slug || '-rust-os', greatest(floor(stock / 3.0)::int, 1)
from public.products;

insert into public.product_categories (product_id, category_id)
select p.id, c.id
from public.products p
join public.categories c on c.slug = 'women'
where p.slug in (
  'soft-weave-cardigan-women',
  'heritage-lace-shawl',
  'granny-square-tote',
  'bohemian-crop-top',
  'vintage-rose-blanket-scarf'
);

insert into public.product_categories (product_id, category_id)
select p.id, c.id
from public.products p
join public.categories c on c.slug = 'men'
where p.slug in (
  'heritage-beanie-men',
  'coastal-breeze-linen-shirt-men',
  'rustic-chunky-scarf-men',
  'artisan-fingerless-gloves-men'
);

insert into public.product_categories (product_id, category_id)
select p.id, c.id
from public.products p
join public.categories c on c.slug = 'accessories'
where p.slug in (
  'granny-square-tote',
  'artisan-fingerless-gloves-men',
  'market-mesh-bag-set',
  'cozy-cup-sleeve-set',
  'modern-geometric-coasters'
);

insert into public.product_categories (product_id, category_id)
select p.id, c.id
from public.products p
join public.categories c on c.slug = 'home'
where p.slug in (
  'rainbow-dreams-baby-blanket',
  'mandala-wall-hanging',
  'textured-throw-pillow-set',
  'farmhouse-table-runner',
  'heirloom-afghan-blanket',
  'modern-geometric-coasters'
);

insert into public.coupons (code, type, value, active, usage_cap)
values
  ('WELCOME10', 'PERCENT', 10, true, 100),
  ('SAVE20', 'PERCENT', 20, true, null),
  ('FREESHIP', 'FIXED', 500, true, null);

insert into public.homepage_slots (key, config)
values (
  'hero',
  '{
    "title": "Hand-Crafted with Love",
    "subtitle": "Discover artisan crochet pieces for your wardrobe and home",
    "imageUrl": "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1200",
    "ctaText": "Shop Now",
    "ctaLink": "/shop"
  }'::jsonb
);
