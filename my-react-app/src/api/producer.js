// Кабинет производителя (apps.tenants, apps.catalog, apps.orders, apps.finance).
import { api } from "./client.js";

// --- Профиль производителя ---
export const profile = {
  get: () => api.get("/producer/profile/"),
  create: (payload) => api.post("/producer/profile/", payload),
  update: (patch) => api.patch("/producer/profile/", patch),
};

// --- Товары производителя (общий пул) ---
export const products = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/producer/products/${qs ? `?${qs}` : ""}`);
  },
  get: (id) => api.get(`/producer/products/${id}/`),
  create: (payload) => api.post("/producer/products/", payload),
  update: (id, patch) => api.patch(`/producer/products/${id}/`, patch),
  remove: (id) => api.delete(`/producer/products/${id}/`),
  publish: (id) => api.post(`/producer/products/${id}/publish/`, {}),
  archive: (id) => api.post(`/producer/products/${id}/archive/`, {}),
  addImage: (id, file, { isPrimary } = {}) => {
    const form = new FormData();
    form.append("image", file);
    if (isPrimary !== undefined) form.append("is_primary", isPrimary);
    return api.postForm(`/producer/products/${id}/images/`, form);
  },
};

// --- Отгрузки производителя ---
export const shipments = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/producer/shipments/${qs ? `?${qs}` : ""}`);
  },
  get: (id) => api.get(`/producer/shipments/${id}/`),
  assemble: (id) => api.post(`/producer/shipments/${id}/assemble/`, {}),
  ship: (id) => api.post(`/producer/shipments/${id}/ship/`, {}),
};

// --- Публичный профиль производителя (для продавцов в пуле) ---
export function getProducerProfile(producerId) {
  return api.get(`/producers/${producerId}/`);
}

export function getProducerProducts(producerId) {
  return api.get(`/producers/${producerId}/products/`);
}

// --- Выплаты производителю ---
export function listProducerPayouts(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return api.get(`/producer/payouts/${qs ? `?${qs}` : ""}`);
}
