// Корзина хранится в localStorage (анонимная корзина браузера).
//
// Для оформления заказа на бэке каждый элемент должен по возможности нести:
//   storeProductId — UUID позиции магазина (StoreProduct) из API витрины;
//   storeSlug      — slug магазина, к которому относится товар.
// Старые элементы без этих полей остаются совместимыми (используются для
// отображения), но checkout по ним невозможен — см. utils/checkout.js.
const CART_KEY = "shop_cart_items";
const CART_SLUG_KEY = "shop_cart_slug";

// Запоминаем магазин текущей корзины (на MVP — одна корзина = один магазин).
export function getCartStoreSlug() {
  try {
    return localStorage.getItem(CART_SLUG_KEY) || "";
  } catch {
    return "";
  }
}

export function setCartStoreSlug(slug) {
  try {
    if (slug) localStorage.setItem(CART_SLUG_KEY, slug);
  } catch {
    /* noop */
  }
}

export function getCartItems() {
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Ошибка чтения корзины:", error);
    return [];
  }
}

export function saveCartItems(items) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Ошибка сохранения корзины:", error);
  }
}

export function addToCart(newItem) {
  const currentItems = getCartItems();

  const existingIndex = currentItems.findIndex(
    (item) =>
      item.id === newItem.id &&
      (item.selectedSize || "") === (newItem.selectedSize || "")
  );

  if (existingIndex !== -1) {
    const updatedItems = currentItems.map((item, index) => {
      if (index !== existingIndex) return item;

      const maxStock = item.stock ?? 9999;
      const nextQuantity = Math.min(item.quantity + newItem.quantity, maxStock);

      return {
        ...item,
        quantity: nextQuantity,
      };
    });

    saveCartItems(updatedItems);
    return updatedItems;
  }

  const updatedItems = [...currentItems, newItem];
  saveCartItems(updatedItems);
  return updatedItems;
}

export function updateCartItemQuantity(id, selectedSize, nextQuantity) {
  const currentItems = getCartItems();

  const updatedItems = currentItems
    .map((item) => {
      if (
        item.id === id &&
        (item.selectedSize || "") === (selectedSize || "")
      ) {
        const maxStock = item.stock ?? 9999;
        const safeQuantity = Math.max(0, Math.min(nextQuantity, maxStock));

        return {
          ...item,
          quantity: safeQuantity,
        };
      }

      return item;
    })
    .filter((item) => item.quantity > 0);

  saveCartItems(updatedItems);
  return updatedItems;
}

export function removeFromCart(id, selectedSize) {
  const currentItems = getCartItems();

  const updatedItems = currentItems.filter(
    (item) =>
      !(
        item.id === id &&
        (item.selectedSize || "") === (selectedSize || "")
      )
  );

  saveCartItems(updatedItems);
  return updatedItems;
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
  localStorage.removeItem(CART_SLUG_KEY);
}