const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  products: {
    list: (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params)}` : "";
      return fetchAPI(`/products${query}`);
    },
    get: (slug: string) => fetchAPI(`/products/${slug}`),
  },
  
  admin: {
    stats: (token: string) =>
      fetchAPI("/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    orders: (token: string, status?: string) => {
      const query = status && status !== "all" ? `?status=${status}` : "";
      return fetchAPI(`/admin/orders${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    updateOrderStatus: (token: string, orderId: string, status: string) =>
      fetchAPI(`/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }),
  },
};

