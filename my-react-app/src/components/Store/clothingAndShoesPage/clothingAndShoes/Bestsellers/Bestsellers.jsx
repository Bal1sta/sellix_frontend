import React, { useRef } from "react";
import styles from "./Bestsellers.module.css";
import bestsellersData from "./BestsellersData.js";

export default function Bestsellers() {
  const { title, subtitle, products } = bestsellersData;
  const productsRef = useRef(null);

  const scrollLeft = () => {
    if (productsRef.current) {
      productsRef.current.scrollBy({
        left: -440,
        behavior: "smooth"
      });
    }
  };

  const scrollRight = () => {
    if (productsRef.current) {
      productsRef.current.scrollBy({
        left: 440,
        behavior: "smooth"
      });
    }
  };

  const productsClass =
    products.length > 3
      ? `${styles.products} ${styles.productsSlider}`
      : `${styles.products} ${styles.productsCenter}`;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <p className={styles.subtitle}>{subtitle}</p>
          <h2 className={styles.title}>{title}</h2>
        </div>

        {products.length > 3 && (
          <div className={styles.arrows}>
            <button
              className={styles.arrow}
              type="button"
              onClick={scrollLeft}
              aria-label="Прокрутить влево"
            >
              ←
            </button>

            <button
              className={styles.arrow}
              type="button"
              onClick={scrollRight}
              aria-label="Прокрутить вправо"
            >
              →
            </button>
          </div>
        )}
      </div>

      <div ref={productsRef} className={productsClass}>
        {products.map((product) => (
          <div key={product.id} className={styles.card}>
            <img
              src={product.image}
              alt={product.name}
              className={styles.image}
            />

            <div className={styles.info}>
              <div className={styles.row}>
                <span className={styles.name}>{product.name}</span>
                <span className={styles.price}>{product.price}</span>
              </div>

              <span className={styles.collection}>{product.collection}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}