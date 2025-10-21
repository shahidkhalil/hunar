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
  
  categories: {
    list: () => fetchAPI("/categories"),
    get: (slug: string) => fetchAPI(`/categories/${slug}`),
  },
  
  cart: {
    validate: (items: any[]) =>
      fetchAPI("/cart/validate", {
        method: "POST",
        body: JSON.stringify({ items }),
      }),
  },
  
  checkout: {
    createSession: (data: any) =>
      fetchAPI("/checkout/create-session", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    verify: (sessionId: string) => fetchAPI(`/checkout/verify/${sessionId}`),
  },
  
  auth: {
    register: (data: any) =>
      fetchAPI("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    login: (data: any) =>
      fetchAPI("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  
  search: (query: string, limit?: number) => {
    const params = new URLSearchParams({ q: query });
    if (limit) params.set("limit", limit.toString());
    return fetchAPI(`/search?${params}`);
  },
};
