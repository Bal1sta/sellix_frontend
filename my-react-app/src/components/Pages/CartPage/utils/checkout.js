// Оформление заказа: связывает локальную корзину с бэком (apps.orders).
//
// Поток (PRD 6.4):
//   1. Собираем позиции { store_product_id, quantity } из корзины.
//   2. POST /checkout/ → создаётся заказ + платёж, возвращается confirmation_url.
//   3. В sandbox-режиме провайдера эмулируем оплату, чтобы заказ ушёл в работу.
//   4. Чистим корзину и ведём пользователя в профиль/трекинг.

import { checkout, sandboxConfirmPayment } from "../../../../api/orders.js";
import { getCartItems, getCartStoreSlug, clearCart } from "./cartStorage.js";

// Можно ли оформить корзину через бэк (есть ли у позиций storeProductId и slug).
export function canCheckout() {
  const slug = getCartStoreSlug();
  const items = getCartItems();
  return Boolean(slug) && items.length > 0 && items.every((i) => i.storeProductId);
}

// address: { full_name, phone, city, address_line, postal_code? }
// options: { autoConfirmSandbox = true }
export async function submitCheckout(address, { autoConfirmSandbox = true } = {}) {
  const slug = getCartStoreSlug();
  const items = getCartItems();

  if (!slug) {
    throw new Error("Не определён магазин корзины");
  }
  const mapped = items
    .filter((i) => i.storeProductId)
    .map((i) => ({ store_product_id: i.storeProductId, quantity: i.quantity }));

  if (mapped.length === 0) {
    throw new Error("В корзине нет товаров, доступных к заказу");
  }

  const result = await checkout({
    store_slug: slug,
    address,
    items: mapped,
  });

  // Sandbox: подтверждаем платёж, чтобы заказ перешёл в оплачен → в обработку.
  const payment = result?.payment;
  if (autoConfirmSandbox && payment?.id && payment.status === "pending") {
    const looksSandbox =
      !payment.confirmation_url ||
      payment.confirmation_url.includes("sandbox");
    if (looksSandbox) {
      try {
        await sandboxConfirmPayment(payment.id);
      } catch (err) {
        console.warn("Не удалось эмулировать оплату (sandbox):", err);
      }
    }
  }

  clearCart();
  return result;
}
