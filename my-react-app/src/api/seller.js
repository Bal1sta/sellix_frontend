// Кабинет продавца (apps.tenants, apps.catalog, apps.finance).
import { api } from "./client.js";

// --- Магазин ---
export const store = {
  get: () => api.get("/seller/store/"),
  create: (payload) => api.post("/seller/store/", payload),
  update: (patch) => api.patch("/seller/store/", patch),
  publish: () => api.post("/seller/store/publish/", {}),
  checkSlug: (name) => api.post("/seller/store/slug-check/", { name }),
};

// --- Общий пул товаров производителей (для добавления в магазин) ---
// params: { category, producer, price_min, price_max, search, page }
export function browsePool(params = {}) {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== "")
  ).toString();
  return api.get(`/pool/${qs ? `?${qs}` : ""}`);
}

// --- Товары магазина (StoreProduct): наценка и видимость ---
export const storeProducts = {
  list: () => api.get("/seller/products/"),
  // Добавить товар из пула в один клик (появляется скрытым).
  add: (productId) => api.post("/seller/products/add/", { product_id: productId }),
  // Задать наценку и видимость.
  update: (id, patch) => api.patch(`/seller/products/${id}/`, patch),
  remove: (id) => api.delete(`/seller/products/${id}/`),
};

// --- Интеграции оплаты/доставки ---
export const integrations = {
  list: () => api.get("/integrations/"),
  create: (payload) => api.post("/integrations/", payload),
  verify: (id) => api.post(`/integrations/${id}/verify/`, {}),
  remove: (id) => api.delete(`/integrations/${id}/`),
};

// --- Заказы магазина (только просмотр) ---
export function listSellerOrders(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return api.get(`/seller/orders/${qs ? `?${qs}` : ""}`);
}

// --- Выплаты продавцу ---
export function listSellerPayouts(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return api.get(`/seller/payouts/${qs ? `?${qs}` : ""}`);
}
