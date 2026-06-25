import React from "react";
import { Link } from "react-router-dom";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product }) {
  const stock = product.stock ?? 0;

  const stockText =
    stock === 0
      ? "Нет в наличии"
      : stock <= 3
      ? `Осталось мало: ${stock} шт.`
      : `В наличии: ${stock} шт.`;

  const stockClass =
    stock === 0
      ? styles.outOfStock
      : stock <= 3
      ? styles.lowStock
      : styles.inStock;

  return (
    <Link to={`/product/${product.id}`} className={styles.cardLink}>
      <article className={styles.card}>
        <div className={styles.imageWrap}>
          {product.badge && <span className={styles.badge}>{product.badge}</span>}
          <img className={styles.image} src={product.image} alt={product.title} />
        </div>

        <div className={styles.info}>
          <div className={styles.textBox}>
            <h3 className={styles.title}>{product.title}</h3>
            <p className={styles.subtitle}>{product.subtitle}</p>
            <p className={`${styles.stock} ${stockClass}`}>{stockText}</p>
          </div>

          <p className={styles.price}>{product.price.toLocaleString("ru-RU")} ₽</p>
        </div>
      </article>
    </Link>
  );
}