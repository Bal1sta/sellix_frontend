// Каталог витрины: данные из Django REST API (apps.storefront).
//
// Сигнатура getCatalogData() сохранена — компонент CatalogPage не меняется.
// Магазин (slug) определяется переменной окружения VITE_DEFAULT_STORE_SLUG,
// потому что каталог смонтирован на общий маршрут витрины. Если бэк недоступен
// или магазин не задан — откатываемся на локальные мок-данные, чтобы страница
// продолжала работать в режиме разработки фронта.

import { getStoreProducts, listCategories } from "../../../../../api/storefront.js";
import { resolveMediaUrl } from "../../../../../config/runtime.js";
import mockProducts from "../data/products.js";
import mockFilters from "../data/filters.js";

const STORE_SLUG = import.meta.env.VITE_DEFAULT_STORE_SLUG ?? "";

// Товар бэка → формат карточки каталога.
function mapProduct(sp) {
  const primary =
    sp.images?.find((img) => img.is_primary) ?? sp.images?.[0] ?? null;
  return {
    id: sp.id,
    title: sp.name || "",
    subtitle: sp.category_name || "",
    price: Number(sp.price ?? 0),
    badge: sp.in_stock ? "" : "НЕТ В НАЛИЧИИ",
    category: sp.category_name || "",
    brand: "", // бренд/производитель скрыт на витрине (PRD 6.2)
    sizes: [],
    isNew: false,
    popularity: 0,
    stock: sp.in_stock ? 99 : 0,
    image: primary ? resolveMediaUrl(primary.image) : "",
  };
}

export async function getCatalogData() {
  // Магазин не сконфигурирован — отдаём мок-данные (режим разработки фронта).
  if (!STORE_SLUG) {
    return { products: mockProducts, filters: mockFilters };
  }

  try {
    const [productsResp, categoriesResp] = await Promise.all([
      getStoreProducts(STORE_SLUG, { page_size: 100 }),
      listCategories().catch(() => []),
    ]);

    const rawList = Array.isArray(productsResp)
      ? productsResp
      : productsResp?.results ?? [];
    const products = rawList.map(mapProduct);

    const categories = [
      ...new Set(products.map((p) => p.category).filter(Boolean)),
    ];

    return {
      products,
      filters: {
        brands: [],
        categories: categories.length
          ? categories
          : (categoriesResp || []).map((c) => c.name),
        sizes: [],
      },
    };
  } catch (error) {
    console.error("Не удалось загрузить каталог с бэкенда:", error);
    // Бэк недоступен — не роняем витрину, показываем мок-данные.
    return { products: mockProducts, filters: mockFilters };
  }
}
