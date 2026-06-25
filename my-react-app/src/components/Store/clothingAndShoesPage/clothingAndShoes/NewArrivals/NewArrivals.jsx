import React from "react";
import styles from "./newArrivals.module.css";
import newArrivalsData from "./newArrivalsData.js";

export default function NewArrivals({ data }) {
  const sectionData = data || newArrivalsData;
  const { subtitle, title, products } = sectionData;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <p className={styles.subtitle}>{subtitle}</p>
        <h2 className={styles.title}>{title}</h2>
      </div>

      <div className={styles.products}>
        {products.map((product) => (
          <a key={product.id} href={product.link} className={styles.card}>
            <img
              src={product.image}
              alt={product.name}
              className={styles.image}
            />

            <div className={styles.info}>
              <h3 className={styles.name}>{product.name}</h3>
              <p className={styles.price}>{product.price}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}