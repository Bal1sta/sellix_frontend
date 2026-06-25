import React from "react";
import styles from "./saleBanner.module.css";
import saleBannerData from "./saleBannerData.js";

export default function SaleBanner({ data }) {

  const sectionData = data || saleBannerData;

  const {
    label,
    title,
    description,
    discount,
    buttonText,
    buttonLink
  } = sectionData;

  return (
    <section className={styles.section}>

      <div className={styles.container}>

        <div className={styles.left}>

          <p className={styles.label}>
            {label}
          </p>

          <h2 className={styles.title}>
            {title}
          </h2>

          <p className={styles.description}>
            {description}
          </p>

        </div>

        <div className={styles.right}>

          <span className={styles.discount}>
            {discount}
          </span>

          <a
            href={buttonLink}
            className={styles.button}
          >
            {buttonText}
          </a>

        </div>

      </div>

    </section>
  );
}