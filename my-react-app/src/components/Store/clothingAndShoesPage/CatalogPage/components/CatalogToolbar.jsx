import React from "react";
import styles from "./CatalogToolbar.module.css";

export default function CatalogToolbar({
  currentPage,
  productsPerPage,
  totalProducts,
  sortBy,
  onSortChange,
}) {
  const start = totalProducts === 0 ? 0 : (currentPage - 1) * productsPerPage + 1;
  const end = Math.min(currentPage * productsPerPage, totalProducts);

  return (
    <div className={styles.toolbar}>
      <p className={styles.resultText}>
        {totalProducts > 0
          ? `Показано ${start}–${end} из ${totalProducts} товаров`
          : "Товары не найдены"}
      </p>

      <div className={styles.sortBox}>
        <span className={styles.sortLabel}>СОРТИРОВАТЬ ПО</span>

        <select
          className={styles.select}
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="newest">Сначала новые</option>
          <option value="price-asc">Цена: по возрастанию</option>
          <option value="price-desc">Цена: по убыванию</option>
          <option value="popular">Популярные</option>
        </select>
      </div>
    </div>
  );
}