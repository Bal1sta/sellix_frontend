// Заказы покупателя и оформление (apps.orders).
import { api } from "./client.js";

// Предварительный расчёт доставки до оплаты.
// payload: { store_slug, address: { city, ... }, items: [{ store_product_id, quantity }] }
export function quoteCheckout(payload) {
  return api.post("/checkout/quote/", payload);
}

// Оформление заказа. Если items не передать — бэк возьмёт серверную корзину.
// Возвращает { order, payment: { id, confirmation_url, status } }.
export function checkout(payload) {
  return api.post("/checkout/", payload);
}

// История заказов покупателя.
export function listBuyerOrders() {
  return api.get("/buyer/orders/");
}

export function getBuyerOrder(id) {
  return api.get(`/buyer/orders/${id}/`);
}

// Интерактивный трекинг (таймлайн статусов).
export function getOrderTracking(id) {
  return api.get(`/buyer/orders/${id}/tracking/`);
}

// Подтверждение получения покупателем.
export function confirmDelivery(id) {
  return api.post(`/buyer/orders/${id}/confirm_delivery/`, {});
}

// Отмена заказа до сборки.
export function cancelOrder(id) {
  return api.post(`/buyer/orders/${id}/cancel/`, {});
}

// Sandbox: эмуляция успешной оплаты (для сквозного теста без реального провайдера).
export function sandboxConfirmPayment(paymentId) {
  return api.post(`/payments/${paymentId}/sandbox-confirm/`, {}, { auth: false });
}
