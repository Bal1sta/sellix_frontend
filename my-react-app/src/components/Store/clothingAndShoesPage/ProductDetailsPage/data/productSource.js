// Источник данных карточки товара.
//
// Если магазин сконфигурирован (VITE_DEFAULT_STORE_SLUG) и id похож на UUID —
// грузим товар витрины с бэка (apps.storefront). Иначе — берём локальный
// мок-товар по числовому id (режим разработки фронта).

import { getStoreProduct } from "../../../../../api/storefront.js";
import { resolveMediaUrl } from "../../../../../config/runtime.js";
import mockProducts from "./products.js";

const STORE_SLUG = import.meta.env.VITE_DEFAULT_STORE_SLUG ?? "";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function mapApiProduct(sp) {
  const images = (sp.images || []).map((img) => resolveMediaUrl(img.image));
  return {
    id: sp.id,
    storeProductId: sp.id, // нужно для оформления заказа
    storeSlug: STORE_SLUG,
    title: sp.name || "",
    subtitle: sp.category_name || "",
    description: sp.description || "",
    price: Number(sp.price ?? 0),
    sizes: [], // на витрине размеры не приходят из MVP-бэка
    stock: sp.in_stock ? 99 : 0,
    image: images[0] || "",
    images,
  };
}

// Возвращает объект товара или null.
export async function loadProduct(id) {
  if (STORE_SLUG && UUID_RE.test(String(id))) {
    try {
      const sp = await getStoreProduct(STORE_SLUG, id);
      return mapApiProduct(sp);
    } catch (error) {
      console.error("Не удалось загрузить товар с бэкенда:", error);
      return null;
    }
  }

  // Локальный режим: числовой id из мок-данных.
  const local = mockProducts.find((item) => item.id === Number(id));
  return local ? { ...local, storeProductId: null, storeSlug: "" } : null;
}
