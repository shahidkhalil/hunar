-- Replace placeholder catalog with products sourced from @hunarofficial1 Instagram
delete from public.product_categories;
delete from public.variants;
delete from public.products;


insert into public.products (
  title, slug, subtitle, description, price, images, materials, care, tags,
  is_featured, is_new, is_bestseller, stock, status
) values (
  'Handmade crochet polo shirt',
  'handmade-crochet-polo-shirt-dqcmpxmdhkf',
  'Handmade by Hunar',
  'Handmade crochet polo shirt. Colour of your choice. Available in small, medium, and large. Delivery in 7-10 days. Advance booking with half payment upfront and half cash on delivery.',
  6900,
  '[{"publicId":"DQCmPxMDHKF","url":"/products/instagram/DQCmPxMDHKF.jpg"}]'::jsonb,
  'Premium yarn, hand-crafted',
  'Hand wash cold, lay flat to dry',
  '{men,handmade,instagram,winter}',
  true,
  true,
  true,
  12,
  'PUBLISHED'
);

insert into public.product_categories (product_id, category_id)
select p.id, c.id
from public.products p
join public.categories c on c.slug = 'men'
where p.slug = 'handmade-crochet-polo-shirt-dqcmpxmdhkf';

insert into public.variants (product_id, color, size, sku, stock)
select id, 'Custom Color', 'One Size', 'handmade-crochet-polo-shirt-dqcmpxmdhkf-default', 12
from public.products
where slug = 'handmade-crochet-polo-shirt-dqcmpxmdhkf';


insert into public.products (
  title, slug, subtitle, description, price, images, materials, care, tags,
  is_featured, is_new, is_bestseller, stock, status
) values (
  'Handmade crochet cardigan',
  'handmade-crochet-cardigan-dc68m62ths1',
  'Handmade by Hunar',
  'Handmade crochet cardigan. Colour of your choice. Available in small, medium, and large. Delivery in 7-10 days. Advance booking with half payment upfront and half cash on delivery.',
  8400,
  '[{"publicId":"DC68m62tHS1","url":"/products/instagram/DC68m62tHS1.jpg"}]'::jsonb,
  'Premium yarn, hand-crafted',
  'Hand wash cold, lay flat to dry',
  '{women,handmade,instagram,winter}',
  true,
  true,
  false,
  12,
  'PUBLISHED'
);

insert into public.product_categories (product_id, category_id)
select p.id, c.id
from public.products p
join public.categories c on c.slug = 'women'
where p.slug = 'handmade-crochet-cardigan-dc68m62ths1';

insert into public.variants (product_id, color, size, sku, stock)
select id, 'Custom Color', 'One Size', 'handmade-crochet-cardigan-dc68m62ths1-default', 12
from public.products
where slug = 'handmade-crochet-cardigan-dc68m62ths1';


insert into public.products (
  title, slug, subtitle, description, price, images, materials, care, tags,
  is_featured, is_new, is_bestseller, stock, status
) values (
  'Handmade crochet winter collection',
  'handmade-crochet-winter-collection-dsnpjv5dw8b',
  'Handmade by Hunar',
  'Handmade crochet winter collection. Colour of your choice. Available in small, medium, and large. Delivery in 7-10 days. Advance booking with half payment upfront and half cash on delivery.',
  9900,
  '[{"publicId":"DSNPjv5DW8B","url":"/products/instagram/DSNPjv5DW8B.jpg"}]'::jsonb,
  'Premium yarn, hand-crafted',
  'Hand wash cold, lay flat to dry',
  '{women,handmade,instagram,winter}',
  true,
  true,
  false,
  12,
  'PUBLISHED'
);

insert into public.product_categories (product_id, category_id)
select p.id, c.id
from public.products p
join public.categories c on c.slug = 'women'
where p.slug = 'handmade-crochet-winter-collection-dsnpjv5dw8b';

insert into public.variants (product_id, color, size, sku, stock)
select id, 'Custom Color', 'One Size', 'handmade-crochet-winter-collection-dsnpjv5dw8b-default', 12
from public.products
where slug = 'handmade-crochet-winter-collection-dsnpjv5dw8b';


insert into public.products (
  title, slug, subtitle, description, price, images, materials, care, tags,
  is_featured, is_new, is_bestseller, stock, status
) values (
  'Handmade crochet cardigan',
  'handmade-crochet-cardigan-drxoozsjyp4',
  'Handmade by Hunar',
  'Handmade crochet cardigan. Colour of your choice. Available in small, medium, and large. Delivery in 7-10 days. Advance booking with half payment upfront and half cash on delivery.',
  11400,
  '[{"publicId":"DRxoOZSjYP4","url":"/products/instagram/DRxoOZSjYP4.jpg"}]'::jsonb,
  'Premium yarn, hand-crafted',
  'Hand wash cold, lay flat to dry',
  '{women,handmade,instagram,winter}',
  true,
  true,
  false,
  12,
  'PUBLISHED'
);

insert into public.product_categories (product_id, category_id)
select p.id, c.id
from public.products p
join public.categories c on c.slug = 'women'
where p.slug = 'handmade-crochet-cardigan-drxoozsjyp4';

insert into public.variants (product_id, color, size, sku, stock)
select id, 'Custom Color', 'One Size', 'handmade-crochet-cardigan-drxoozsjyp4-default', 12
from public.products
where slug = 'handmade-crochet-cardigan-drxoozsjyp4';


insert into public.products (
  title, slug, subtitle, description, price, images, materials, care, tags,
  is_featured, is_new, is_bestseller, stock, status
) values (
  'Handmade crochet cat winter cloth cardigan',
  'handmade-crochet-cat-winter-cloth-cardigan-drrq4o5jtgy',
  'Handmade by Hunar',
  'Handmade crochet cat winter cloth cardigan. Colour of your choice. Available in small, medium, and large. Delivery in 7-10 days. Advance booking with half payment upfront and half cash on delivery.',
  12900,
  '[{"publicId":"DRrQ4o5jTGY","url":"/products/instagram/DRrQ4o5jTGY.jpg"}]'::jsonb,
  'Premium yarn, hand-crafted',
  'Hand wash cold, lay flat to dry',
  '{women,handmade,instagram,winter}',
  true,
  true,
  true,
  12,
  'PUBLISHED'
);

insert into public.product_categories (product_id, category_id)
select p.id, c.id
from public.products p
join public.categories c on c.slug = 'women'
where p.slug = 'handmade-crochet-cat-winter-cloth-cardigan-drrq4o5jtgy';

insert into public.variants (product_id, color, size, sku, stock)
select id, 'Custom Color', 'One Size', 'handmade-crochet-cat-winter-cloth-cardigan-drrq4o5jtgy-default', 12
from public.products
where slug = 'handmade-crochet-cat-winter-cloth-cardigan-drrq4o5jtgy';


insert into public.products (
  title, slug, subtitle, description, price, images, materials, care, tags,
  is_featured, is_new, is_bestseller, stock, status
) values (
  'Handmade crochet cat winter cloth',
  'handmade-crochet-cat-winter-cloth-drrotzqdxjp',
  'Handmade by Hunar',
  'Handmade crochet cat winter cloth. Colour of your choice. Available in small, medium, and large. Delivery in 7-10 days. Advance booking with half payment upfront and half cash on delivery.',
  14400,
  '[{"publicId":"DRrOtzqDXJp","url":"/products/instagram/DRrOtzqDXJp.jpg"}]'::jsonb,
  'Premium yarn, hand-crafted',
  'Hand wash cold, lay flat to dry',
  '{women,handmade,instagram,winter}',
  true,
  false,
  false,
  12,
  'PUBLISHED'
);

insert into public.product_categories (product_id, category_id)
select p.id, c.id
from public.products p
join public.categories c on c.slug = 'women'
where p.slug = 'handmade-crochet-cat-winter-cloth-drrotzqdxjp';

insert into public.variants (product_id, color, size, sku, stock)
select id, 'Custom Color', 'One Size', 'handmade-crochet-cat-winter-cloth-drrotzqdxjp-default', 12
from public.products
where slug = 'handmade-crochet-cat-winter-cloth-drrotzqdxjp';


insert into public.products (
  title, slug, subtitle, description, price, images, materials, care, tags,
  is_featured, is_new, is_bestseller, stock, status
) values (
  'Handmade crochet cardigan',
  'handmade-crochet-cardigan-drnsjtrjzdr',
  'Handmade by Hunar',
  'Handmade crochet cardigan. Colour of your choice. Available in small, medium, and large. Delivery in 7-10 days. Advance booking with half payment upfront and half cash on delivery.',
  6900,
  '[{"publicId":"DRnSJTrjZdr","url":"/products/instagram/DRnSJTrjZdr.jpg"}]'::jsonb,
  'Premium yarn, hand-crafted',
  'Hand wash cold, lay flat to dry',
  '{women,handmade,instagram,winter}',
  false,
  false,
  false,
  12,
  'PUBLISHED'
);

insert into public.product_categories (product_id, category_id)
select p.id, c.id
from public.products p
join public.categories c on c.slug = 'women'
where p.slug = 'handmade-crochet-cardigan-drnsjtrjzdr';

insert into public.variants (product_id, color, size, sku, stock)
select id, 'Custom Color', 'One Size', 'handmade-crochet-cardigan-drnsjtrjzdr-default', 12
from public.products
where slug = 'handmade-crochet-cardigan-drnsjtrjzdr';


insert into public.products (
  title, slug, subtitle, description, price, images, materials, care, tags,
  is_featured, is_new, is_bestseller, stock, status
) values (
  'Handmade crochet cardigan',
  'handmade-crochet-cardigan-drxwckdjfxv',
  'Handmade by Hunar',
  'Handmade crochet cardigan. Colour of your choice. Available in small, medium, and large. Delivery in 7-10 days. Advance booking with half payment upfront and half cash on delivery.',
  8400,
  '[{"publicId":"DRXwCkdjfxV","url":"/products/instagram/DRXwCkdjfxV.jpg"}]'::jsonb,
  'Premium yarn, hand-crafted',
  'Hand wash cold, lay flat to dry',
  '{women,handmade,instagram,winter}',
  false,
  false,
  false,
  12,
  'PUBLISHED'
);

insert into public.product_categories (product_id, category_id)
select p.id, c.id
from public.products p
join public.categories c on c.slug = 'women'
where p.slug = 'handmade-crochet-cardigan-drxwckdjfxv';

insert into public.variants (product_id, color, size, sku, stock)
select id, 'Custom Color', 'One Size', 'handmade-crochet-cardigan-drxwckdjfxv-default', 12
from public.products
where slug = 'handmade-crochet-cardigan-drxwckdjfxv';


insert into public.products (
  title, slug, subtitle, description, price, images, materials, care, tags,
  is_featured, is_new, is_bestseller, stock, status
) values (
  'Handmade crochet winter sweaters',
  'handmade-crochet-winter-sweaters-drxjzbkjefx',
  'Handmade by Hunar',
  'Handmade crochet winter sweaters. Colour of your choice. Available in small, medium, and large. Delivery in 7-10 days. Advance booking with half payment upfront and half cash on delivery.',
  9900,
  '[{"publicId":"DRXJzBKjefx","url":"/products/instagram/DRXJzBKjefx.jpg"}]'::jsonb,
  'Premium yarn, hand-crafted',
  'Hand wash cold, lay flat to dry',
  '{men,handmade,instagram,winter}',
  false,
  false,
  true,
  12,
  'PUBLISHED'
);

insert into public.product_categories (product_id, category_id)
select p.id, c.id
from public.products p
join public.categories c on c.slug = 'men'
where p.slug = 'handmade-crochet-winter-sweaters-drxjzbkjefx';

insert into public.variants (product_id, color, size, sku, stock)
select id, 'Custom Color', 'One Size', 'handmade-crochet-winter-sweaters-drxjzbkjefx-default', 12
from public.products
where slug = 'handmade-crochet-winter-sweaters-drxjzbkjefx';


insert into public.products (
  title, slug, subtitle, description, price, images, materials, care, tags,
  is_featured, is_new, is_bestseller, stock, status
) values (
  'Handmade crochet winter sweaters',
  'handmade-crochet-winter-sweaters-drsi4jyjxir',
  'Handmade by Hunar',
  'Handmade crochet winter sweaters. Colour of your choice. Available in small, medium, and large. Delivery in 7-10 days. Advance booking with half payment upfront and half cash on delivery.',
  11400,
  '[{"publicId":"DRSi4jYjXIr","url":"/products/instagram/DRSi4jYjXIr.jpg"}]'::jsonb,
  'Premium yarn, hand-crafted',
  'Hand wash cold, lay flat to dry',
  '{men,handmade,instagram,winter}',
  false,
  false,
  false,
  12,
  'PUBLISHED'
);

insert into public.product_categories (product_id, category_id)
select p.id, c.id
from public.products p
join public.categories c on c.slug = 'men'
where p.slug = 'handmade-crochet-winter-sweaters-drsi4jyjxir';

insert into public.variants (product_id, color, size, sku, stock)
select id, 'Custom Color', 'One Size', 'handmade-crochet-winter-sweaters-drsi4jyjxir-default', 12
from public.products
where slug = 'handmade-crochet-winter-sweaters-drsi4jyjxir';


insert into public.products (
  title, slug, subtitle, description, price, images, materials, care, tags,
  is_featured, is_new, is_bestseller, stock, status
) values (
  'Handmade crochet winter shirt',
  'handmade-crochet-winter-shirt-dqz4ykzjyoz',
  'Handmade by Hunar',
  'Handmade crochet winter shirt. Colour of your choice. Available in small, medium, and large. Delivery in 7-10 days. Advance booking with half payment upfront and half cash on delivery.',
  12900,
  '[{"publicId":"DQz4YkzjYoZ","url":"/products/instagram/DQz4YkzjYoZ.jpg"}]'::jsonb,
  'Premium yarn, hand-crafted',
  'Hand wash cold, lay flat to dry',
  '{men,handmade,instagram,winter}',
  false,
  false,
  false,
  12,
  'PUBLISHED'
);

insert into public.product_categories (product_id, category_id)
select p.id, c.id
from public.products p
join public.categories c on c.slug = 'men'
where p.slug = 'handmade-crochet-winter-shirt-dqz4ykzjyoz';

insert into public.variants (product_id, color, size, sku, stock)
select id, 'Custom Color', 'One Size', 'handmade-crochet-winter-shirt-dqz4ykzjyoz-default', 12
from public.products
where slug = 'handmade-crochet-winter-shirt-dqz4ykzjyoz';


insert into public.products (
  title, slug, subtitle, description, price, images, materials, care, tags,
  is_featured, is_new, is_bestseller, stock, status
) values (
  'Handmade crochet winter shirt',
  'handmade-crochet-winter-shirt-dqrh14jiscn',
  'Handmade by Hunar',
  'Handmade crochet winter shirt. Colour of your choice. Available in small, medium, and large. Delivery in 7-10 days. Advance booking with half payment upfront and half cash on delivery.',
  14400,
  '[{"publicId":"DQrh14jiSCn","url":"/products/instagram/DQrh14jiSCn.jpg"}]'::jsonb,
  'Premium yarn, hand-crafted',
  'Hand wash cold, lay flat to dry',
  '{men,handmade,instagram,winter}',
  false,
  false,
  false,
  12,
  'PUBLISHED'
);

insert into public.product_categories (product_id, category_id)
select p.id, c.id
from public.products p
join public.categories c on c.slug = 'men'
where p.slug = 'handmade-crochet-winter-shirt-dqrh14jiscn';

insert into public.variants (product_id, color, size, sku, stock)
select id, 'Custom Color', 'One Size', 'handmade-crochet-winter-shirt-dqrh14jiscn-default', 12
from public.products
where slug = 'handmade-crochet-winter-shirt-dqrh14jiscn';


insert into public.products (
  title, slug, subtitle, description, price, images, materials, care, tags,
  is_featured, is_new, is_bestseller, stock, status
) values (
  'Handmade crochet cardigan',
  'handmade-crochet-cardigan-dqrdljyjya9',
  'Handmade by Hunar',
  'Handmade crochet cardigan. Colour of your choice. Available in small, medium, and large. Delivery in 7-10 days. Advance booking with half payment upfront and half cash on delivery.',
  6900,
  '[{"publicId":"DQrdLJYjYa9","url":"/products/instagram/DQrdLJYjYa9.jpg"}]'::jsonb,
  'Premium yarn, hand-crafted',
  'Hand wash cold, lay flat to dry',
  '{women,handmade,instagram,winter}',
  false,
  false,
  true,
  12,
  'PUBLISHED'
);

insert into public.product_categories (product_id, category_id)
select p.id, c.id
from public.products p
join public.categories c on c.slug = 'women'
where p.slug = 'handmade-crochet-cardigan-dqrdljyjya9';

insert into public.variants (product_id, color, size, sku, stock)
select id, 'Custom Color', 'One Size', 'handmade-crochet-cardigan-dqrdljyjya9-default', 12
from public.products
where slug = 'handmade-crochet-cardigan-dqrdljyjya9';


insert into public.products (
  title, slug, subtitle, description, price, images, materials, care, tags,
  is_featured, is_new, is_bestseller, stock, status
) values (
  'Handmade crochet cardigan',
  'handmade-crochet-cardigan-dqzevqcjxot',
  'Handmade by Hunar',
  'Handmade crochet cardigan. Colour of your choice. Available in small, medium, and large. Delivery in 7-10 days. Advance booking with half payment upfront and half cash on delivery.',
  8400,
  '[{"publicId":"DQZevqCjXOT","url":"/products/instagram/DQZevqCjXOT.jpg"}]'::jsonb,
  'Premium yarn, hand-crafted',
  'Hand wash cold, lay flat to dry',
  '{women,handmade,instagram,winter}',
  false,
  false,
  false,
  12,
  'PUBLISHED'
);

insert into public.product_categories (product_id, category_id)
select p.id, c.id
from public.products p
join public.categories c on c.slug = 'women'
where p.slug = 'handmade-crochet-cardigan-dqzevqcjxot';

insert into public.variants (product_id, color, size, sku, stock)
select id, 'Custom Color', 'One Size', 'handmade-crochet-cardigan-dqzevqcjxot-default', 12
from public.products
where slug = 'handmade-crochet-cardigan-dqzevqcjxot';


insert into public.products (
  title, slug, subtitle, description, price, images, materials, care, tags,
  is_featured, is_new, is_bestseller, stock, status
) values (
  'Handmade crochet polo shirt',
  'handmade-crochet-polo-shirt-dqkiv4njrf3',
  'Handmade by Hunar',
  'Handmade crochet polo shirt. Colour of your choice. Available in small, medium, and large. Delivery in 7-10 days. Advance booking with half payment upfront and half cash on delivery.',
  9900,
  '[{"publicId":"DQKIv4NjRf3","url":"/products/instagram/DQKIv4NjRf3.jpg"}]'::jsonb,
  'Premium yarn, hand-crafted',
  'Hand wash cold, lay flat to dry',
  '{men,handmade,instagram,winter}',
  false,
  false,
  false,
  12,
  'PUBLISHED'
);

insert into public.product_categories (product_id, category_id)
select p.id, c.id
from public.products p
join public.categories c on c.slug = 'men'
where p.slug = 'handmade-crochet-polo-shirt-dqkiv4njrf3';

insert into public.variants (product_id, color, size, sku, stock)
select id, 'Custom Color', 'One Size', 'handmade-crochet-polo-shirt-dqkiv4njrf3-default', 12
from public.products
where slug = 'handmade-crochet-polo-shirt-dqkiv4njrf3';
