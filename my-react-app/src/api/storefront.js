// Публичная витрина и каталог (apps.storefront, apps.catalog).
import { api } from "./client.js";

// --- Категории (публичные, без пагинации на бэке) ---
export function listCategories() {
  return api.get("/categories/", { auth: false });
}

// --- Витрина магазина по slug ---
export function getStore(slug) {
  return api.get(`/shop/${slug}/`, { auth: false });
}

// Товары витрины. params: { category, search, page }
export function getStoreProducts(slug, params = {}) {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== "")
  ).toString();
  const suffix = qs ? `?${qs}` : "";
  return api.get(`/shop/${slug}/products/${suffix}`, { auth: false });
}

export function getStoreProduct(slug, productId) {
  return api.get(`/shop/${slug}/products/${productId}/`, { auth: false });
}

// --- Серверная корзина покупателя (требует авторизации) ---
export const cart = {
  get: (slug) => api.get(`/shop/${slug}/cart/`),
  add: (slug, storeProductId, quantity = 1) =>
    api.post(`/shop/${slug}/cart/`, {
      store_product_id: storeProductId,
      quantity,
    }),
  removeItem: (slug, itemId) =>
    api.delete(`/shop/${slug}/cart/?item_id=${itemId}`),
};
