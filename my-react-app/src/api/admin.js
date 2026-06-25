// Панель суперадмина (apps.adminpanel).
import { api } from "./client.js";

function qstr(params = {}) {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== "")
  ).toString();
  return qs ? `?${qs}` : "";
}

export const admin = {
  dashboard: () => api.get("/admin-panel/dashboard/"),

  users: {
    list: (params) => api.get(`/admin-panel/users/${qstr(params)}`),
    block: (id, reason) => api.post(`/admin-panel/users/${id}/block/`, { reason }),
    unblock: (id) => api.post(`/admin-panel/users/${id}/unblock/`, {}),
  },

  stores: {
    list: (params) => api.get(`/admin-panel/stores/${qstr(params)}`),
    block: (id, reason) => api.post(`/admin-panel/stores/${id}/block/`, { reason }),
    unblock: (id) => api.post(`/admin-panel/stores/${id}/unblock/`, {}),
  },

  producers: {
    list: (params) => api.get(`/admin-panel/producers/${qstr(params)}`),
    approve: (id) => api.post(`/admin-panel/producers/${id}/approve/`, {}),
    block: (id, reason) => api.post(`/admin-panel/producers/${id}/block/`, { reason }),
  },

  products: {
    list: (params) => api.get(`/admin-panel/products/${qstr(params)}`),
  },

  orders: {
    list: (params) => api.get(`/admin-panel/orders/${qstr(params)}`),
    get: (id) => api.get(`/admin-panel/orders/${id}/`),
    forceStatus: (id, status, comment) =>
      api.post(`/admin-panel/orders/${id}/force_status/`, { status, comment }),
  },

  payouts: {
    list: (params) => api.get(`/admin-panel/payouts/${qstr(params)}`),
    confirm: (id, note) => api.post(`/admin-panel/payouts/${id}/confirm/`, { note }),
    processing: (id) => api.post(`/admin-panel/payouts/${id}/processing/`, {}),
  },

  audit: {
    list: (params) => api.get(`/admin-panel/audit/${qstr(params)}`),
  },
};
