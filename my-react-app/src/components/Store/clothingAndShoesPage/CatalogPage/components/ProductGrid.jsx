import React from "react";
import styles from "./ProductGrid.module.css";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }) {
  if (!products.length) {
    return (
      <div style={{ padding: "40px 0", color: "#52605a", fontSize: "14px" }}>
        По выбранным фильтрам ничего не найдено.
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}