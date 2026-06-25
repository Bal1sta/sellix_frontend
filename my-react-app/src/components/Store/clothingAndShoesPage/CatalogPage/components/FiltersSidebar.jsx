import React, { useMemo } from "react";
import styles from "./FiltersSidebar.module.css";
import {
  getUniqueValues,
  getAllSizes,
  getPriceBounds,
} from "../utils/catalogUtils";

export default function FiltersSidebar({
  products,
  availableFilters,
  filters,
  onCheckboxChange,
  onSizeClick,
  onPriceChange,
  onResetFilters,
}) {
  const autoCategories = useMemo(
    () => getUniqueValues(products, "category"),
    [products]
  );

  const autoBrands = useMemo(
    () => getUniqueValues(products, "brand"),
    [products]
  );

  const autoSizes = useMemo(
    () => getAllSizes(products),
    [products]
  );

  const categories =
    availableFilters?.categories?.length > 0
      ? availableFilters.categories
      : autoCategories;

  const brands =
    availableFilters?.brands?.length > 0
      ? availableFilters.brands
      : autoBrands;

  const sizes =
    availableFilters?.sizes?.length > 0
      ? availableFilters.sizes
      : autoSizes;

  const { minPrice, maxPrice } = useMemo(() => getPriceBounds(products), [products]);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.group}>
        <p className={styles.groupTitle}>КАТЕГОРИЯ</p>

        {categories.map((category) => (
          <label className={styles.checkboxLabel} key={category}>
            <input
              type="checkbox"
              checked={filters.categories.includes(category)}
              onChange={() => onCheckboxChange("categories", category)}
            />
            <span>{category}</span>
          </label>
        ))}
      </div>

      <div className={styles.group}>
        <p className={styles.groupTitle}>БРЕНД</p>

        {brands.map((brand) => (
          <label className={styles.checkboxLabel} key={brand}>
            <input
              type="checkbox"
              checked={filters.brands.includes(brand)}
              onChange={() => onCheckboxChange("brands", brand)}
            />
            <span>{brand}</span>
          </label>
        ))}
      </div>

      <div className={styles.group}>
        <p className={styles.groupTitle}>РАЗМЕР</p>

        <div className={styles.sizeGrid}>
          {sizes.map((size) => (
            <button
              key={size}
              className={`${styles.sizeButton} ${
                filters.sizes.includes(size) ? styles.sizeButtonActive : ""
              }`}
              type="button"
              onClick={() => onSizeClick(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <p className={styles.groupTitle}>ЦЕНОВОЙ ДИАПАЗОН</p>

        <div className={styles.priceRow}>
          <span>{filters.priceMin.toLocaleString("ru-RU")} ₽</span>
          <span>{filters.priceMax.toLocaleString("ru-RU")} ₽</span>
        </div>

        <div className={styles.rangeLine}></div>

        <div className={styles.priceInputs}>
          <input
            type="number"
            value={filters.priceMin}
            min={minPrice}
            max={filters.priceMax}
            onChange={(e) => onPriceChange("priceMin", e.target.value)}
            placeholder="От"
            className={styles.priceInput}
          />

          <input
            type="number"
            value={filters.priceMax}
            min={filters.priceMin}
            max={maxPrice}
            onChange={(e) => onPriceChange("priceMax", e.target.value)}
            placeholder="До"
            className={styles.priceInput}
          />
        </div>

        <button
          type="button"
          onClick={onResetFilters}
          className={styles.resetButton}
        >
          Сбросить фильтры
        </button>
      </div>
    </aside>
  );
}