// Script to update all products currency from USD to PKR

const ADMIN_EMAIL = 'admin@hunar.com';
const ADMIN_PASSWORD = 'admin123';
const API_URL = 'http://localhost:4000';

async function updateCurrency() {
  try {
    console.log('🔐 Logging in as admin...');
    
    // Login
    const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
      })
    });

    const loginData = await loginResponse.json();
    
    if (!loginData.token) {
      console.error('❌ Login failed:', loginData);
      return;
    }

    const token = loginData.token;
    console.log('✅ Logged in successfully!\n');

    // Get all products
    console.log('📦 Fetching all products...');
    const productsResponse = await fetch(`${API_URL}/api/products?limit=50`);
    const productsData = await productsResponse.json();
    const products = productsData.products || productsData;
    
    console.log(`Found ${products.length} total products\n`);

    // Update each product to PKR
    console.log('💱 Updating currency to PKR...\n');
    let successCount = 0;
    
    for (const product of products) {
      console.log(`   Updating: ${product.title}...`);
      
      const updateData = {
        title: product.title,
        slug: product.slug,
        subtitle: product.subtitle,
        description: product.description,
        price: product.price,
        compareAt: product.compareAt || undefined,
        currency: 'PKR', // Change to PKR
        materials: product.materials,
        care: product.care,
        tags: product.tags,
        isFeatured: product.isFeatured,
        isNew: product.isNew,
        isBestseller: product.isBestseller,
        stock: product.stock,
        status: product.status,
        categoryIds: product.categories ? product.categories.map(c => c.id) : [],
        images: product.images.map(img => ({
          url: img.url,
          publicId: img.publicId,
          altText: img.altText || ''
        })),
        variants: []
      };
      
      const response = await fetch(`${API_URL}/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        console.log(`   ✅ Updated to PKR`);
        successCount++;
      } else {
        const error = await response.json();
        console.log(`   ❌ Failed:`, error);
      }
    }

    console.log(`\n✅ Currency update complete!`);
    console.log(`   ${successCount}/${products.length} products updated to PKR`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

updateCurrency();

