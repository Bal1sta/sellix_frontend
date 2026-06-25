// Функция получает уникальные значения по ключу (например: brand, category)
export function getUniqueValues(products, key) {

  // products.map(...) — берём у каждого товара значение по ключу (item[key])
  // filter(Boolean) — убираем пустые значения (null, undefined, "")
  // new Set(...) — оставляет только уникальные значения
  // [...] — превращаем Set обратно в массив
  return [...new Set(products.map((item) => item[key]).filter(Boolean))];
}



// Функция собирает ВСЕ размеры из всех товаров
export function getAllSizes(products) {

  // flatMap — объединяет массивы sizes из каждого товара в один общий массив
  // если sizes нет → используем пустой массив []
  const sizes = products.flatMap((product) => product.sizes || []);

  // Убираем дубликаты через Set
  return [...new Set(sizes)];
}



// Функция определяет минимальную и максимальную цену
export function getPriceBounds(products) {

  // Если товаров нет — возвращаем значения по умолчанию
  if (!products.length) {
    return {
      minPrice: 0,
      maxPrice: 100000,
    };
  }

  // Собираем все цены товаров
  const prices = products.map((item) => item.price);

  // Math.min / Math.max — находим диапазон цен
  return {
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
  };
}



// Главная функция — фильтрация каталога
export function applyCatalogFilters(products, filters) {

  // filter — проходим по каждому товару
  return products.filter((product) => {

    // Проверка категории:
    // если фильтр пустой → пропускаем всё
    // иначе проверяем, входит ли категория товара в выбранные
    const categoryMatch =
      filters.categories.length === 0 ||
      filters.categories.includes(product.category);

    // Проверка бренда
    const brandMatch =
      filters.brands.length === 0 ||
      filters.brands.includes(product.brand);

    // Проверка размеров:
    // some — проверяет, есть ли хотя бы один совпадающий размер
    const sizeMatch =
      filters.sizes.length === 0 ||
      filters.sizes.some((size) => product.sizes?.includes(size));

    // Проверка цены (в диапазоне)
    const priceMatch =
      product.price >= filters.priceMin && product.price <= filters.priceMax;

    // Товар попадёт в результат, только если ВСЕ условия true
    return categoryMatch && brandMatch && sizeMatch && priceMatch;
  });
}



// Функция сортировки товаров
export function sortProducts(products, sortBy) {

  // Копируем массив, чтобы не менять оригинальный
  const sorted = [...products];

  // Выбираем тип сортировки
  switch (sortBy) {

    // По цене (дешёвые → дорогие)
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);

    // По цене (дорогие → дешёвые)
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);

    // По популярности (больше → выше)
    case "popular":
      return sorted.sort((a, b) => b.popularity - a.popularity);

    // По новизне (новые сверху)
    case "newest":
    default:
      return sorted.sort((a, b) => Number(b.isNew) - Number(a.isNew));
  }
}



// Функция пагинации (разбивка на страницы)
export function paginateProducts(products, currentPage, perPage) {

  // Индекс начала (например: страница 2 → пропускаем первые товары)
  const startIndex = (currentPage - 1) * perPage;

  // Индекс конца
  const endIndex = startIndex + perPage;

  // slice — возвращает кусок массива (страницу)
  return products.slice(startIndex, endIndex);
}