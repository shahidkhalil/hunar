"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Plus, Edit, Trash2, X } from "lucide-react";

type Product = {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  price: number;
  compareAt?: number;
  images: { url: string; publicId: string }[];
  stock: number;
  status: string;
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    price: "",
    compareAt: "",
    imageUrl: "",
    stock: "0",
    status: "PUBLISHED",
    isFeatured: false,
    isNew: false,
    isBestseller: false,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    try {
      // Fetch all products with a high limit to get everything
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?limit=100`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
        console.log(`Loaded ${data.products?.length || 0} products`);
      } else {
        console.error("Failed to fetch products:", res.status);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  }

  function openAddModal() {
    setEditingProduct(null);
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      price: "",
      compareAt: "",
      imageUrl: "",
      stock: "0",
      status: "PUBLISHED",
      isFeatured: false,
      isNew: false,
      isBestseller: false,
    });
    setShowModal(true);
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      subtitle: product.subtitle || "",
      description: product.description,
      price: (product.price / 100).toString(),
      compareAt: product.compareAt ? (product.compareAt / 100).toString() : "",
      imageUrl: product.images?.[0]?.url || "",
      stock: product.stock.toString(),
      status: product.status,
      isFeatured: product.isFeatured,
      isNew: product.isNew,
      isBestseller: product.isBestseller,
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const productData = {
        title: formData.title,
        subtitle: formData.subtitle || undefined,
        description: formData.description,
        price: Math.round(parseFloat(formData.price) * 100),
        compareAt: formData.compareAt ? Math.round(parseFloat(formData.compareAt) * 100) : undefined,
        images: formData.imageUrl ? [{ url: formData.imageUrl, publicId: "custom" }] : [],
        stock: parseInt(formData.stock),
        status: formData.status,
        isFeatured: formData.isFeatured,
        isNew: formData.isNew,
        isBestseller: formData.isBestseller,
        materials: "Hand-crafted materials",
        care: "Hand wash cold",
        tags: [],
      };

      const url = editingProduct
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/products/${editingProduct.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/admin/products`;

      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        setShowModal(false);
        loadProducts();
        alert(editingProduct ? "Product updated successfully!" : "Product added successfully!");
      } else {
        const error = await res.json();
        alert("Failed to save product: " + (error.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product");
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/products/${id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        loadProducts();
        alert("Product deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  }

  if (loading) {
    return (
      <div className="container-custom py-20">
        <p className="text-center text-charcoal/60">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-brown">
            Products Management
          </h1>
          <p className="text-charcoal/60 mt-2">
            {loading ? "Loading..." : `${products.length} products found`}
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-brown text-white px-6 py-3 rounded-xl hover:bg-brown/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-brown/10 text-center">
          <p className="text-charcoal/60 mb-4">No products yet</p>
          <button
            onClick={openAddModal}
            className="text-brown hover:underline"
          >
            Add your first product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-brown/10 overflow-hidden hover:border-brown/30 transition-colors"
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-cream">
                {product.images?.[0]?.url ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-charcoal/30">
                    No Image
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  {product.isFeatured && (
                    <span className="bg-gold text-charcoal text-xs px-2 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                  {product.isNew && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      New
                    </span>
                  )}
                  {product.isBestseller && (
                    <span className="bg-brown text-white text-xs px-2 py-1 rounded-full">
                      Bestseller
                    </span>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-serif text-lg font-bold text-brown mb-1">
                  {product.title}
                </h3>
                {product.subtitle && (
                  <p className="text-sm text-charcoal/60 mb-2">
                    {product.subtitle}
                  </p>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-medium text-brown">
                    {formatPrice(product.price)}
                  </span>
                  {product.compareAt && (
                    <span className="text-sm text-charcoal/50 line-through">
                      {formatPrice(product.compareAt)}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm text-charcoal/60 mb-4">
                  <span>Stock: {product.stock}</span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      product.status === "PUBLISHED"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {product.status}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(product)}
                    className="flex-1 flex items-center justify-center gap-2 bg-brown/10 text-brown px-4 py-2 rounded-lg hover:bg-brown/20 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl font-bold text-brown">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-charcoal/60 hover:text-charcoal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-brown/20 rounded-lg focus:border-brown focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-brown/20 rounded-lg focus:border-brown focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-brown/20 rounded-lg focus:border-brown focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Price (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-brown/20 rounded-lg focus:border-brown focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Compare At Price (PKR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.compareAt}
                    onChange={(e) =>
                      setFormData({ ...formData, compareAt: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-brown/20 rounded-lg focus:border-brown focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-brown/20 rounded-lg focus:border-brown focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Stock *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-brown/20 rounded-lg focus:border-brown focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-brown/20 rounded-lg focus:border-brown focus:outline-none"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData({ ...formData, isFeatured: e.target.checked })
                    }
                    className="w-4 h-4 text-brown"
                  />
                  <span className="text-sm text-charcoal">Featured Product</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) =>
                      setFormData({ ...formData, isNew: e.target.checked })
                    }
                    className="w-4 h-4 text-brown"
                  />
                  <span className="text-sm text-charcoal">New Arrival</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isBestseller}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isBestseller: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-brown"
                  />
                  <span className="text-sm text-charcoal">Bestseller</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-brown text-white px-6 py-3 rounded-xl hover:bg-brown/90 transition-colors"
                >
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-brown/20 rounded-xl hover:border-brown transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
