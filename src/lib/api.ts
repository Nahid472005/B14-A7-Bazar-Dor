import { Product, Category } from "@/types";

const BASE_URLS = [
  "https://openapi.programming-hero.com/api/bazardor",
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

async function fetchWithFallback<T>(endpoint: string): Promise<T> {
  let lastError: any = null;

  for (const baseUrl of BASE_URLS) {
    try {
      const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
      const res = await fetch(url, {
        next: { revalidate: 60 },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch from ${url} (status: ${res.status})`);
      }

      const data = await res.json();
      return data as T;
    } catch (err) {
      lastError = err;
      // Continue to next fallback url
    }
  }

  throw lastError || new Error(`All API endpoints failed for ${endpoint}`);
}

/**
 * Fetches all products
 */
export async function getProducts(): Promise<Product[]> {
  try {
    return await fetchWithFallback<Product[]>("/products");
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

/**
 * Fetches products filtered by category slug
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    return await fetchWithFallback<Product[]>(`/products?category=${encodeURIComponent(category)}`);
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    // Fallback: fetch all and filter in memory
    const all = await getProducts();
    return all.filter((p) => p.category === category);
  }
}

/**
 * Fetches a single product by id or slug
 */
export async function getProductByIdOrSlug(idOrSlug: string): Promise<Product | null> {
  // If numeric, try direct endpoint /products/:id
  const isNumeric = /^\d+$/.test(idOrSlug);
  if (isNumeric) {
    try {
      const product = await fetchWithFallback<Product>(`/products/${idOrSlug}`);
      if (product && product.id) return product;
    } catch {
      // Continue to fallback search
    }
  }

  // Fallback: search in all products by id or slug
  try {
    const all = await getProducts();
    const found = all.find(
      (p) => p.id.toString() === idOrSlug || p.slug === idOrSlug
    );
    return found || null;
  } catch (err) {
    console.error(`Error fetching product ${idOrSlug}:`, err);
    return null;
  }
}

/**
 * Fetches all categories
 */
export async function getCategories(): Promise<Category[]> {
  try {
    return await fetchWithFallback<Category[]>("/categories");
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Hardcoded fallback according to assignment
    return [
      { id: "chal", slug: "chal", nameBn: "চাল", icon: "🍚" },
      { id: "dal", slug: "dal", nameBn: "ডাল", icon: "🫘" },
      { id: "tel", slug: "tel", nameBn: "তেল", icon: "🥫" },
      { id: "sobji", slug: "sobji", nameBn: "সবজি", icon: "🥬" },
      { id: "mach", slug: "mach", nameBn: "মাছ", icon: "🐟" },
      { id: "mangsho", slug: "mangsho", nameBn: "মাংস", icon: "🍗" },
      { id: "dim-dui", slug: "dim-dui", nameBn: "ডিম-দুধ", icon: "🥛" },
      { id: "mosla", slug: "mosla", nameBn: "মসলা", icon: "🌶️" },
    ];
  }
}

/**
 * Fetches single category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const cat = await fetchWithFallback<Category>(`/categories/${encodeURIComponent(slug)}`);
    if (cat && cat.slug) return cat;
  } catch {
    // continue to fallback
  }

  const all = await getCategories();
  return all.find((c) => c.slug === slug || c.id === slug) || null;
}
