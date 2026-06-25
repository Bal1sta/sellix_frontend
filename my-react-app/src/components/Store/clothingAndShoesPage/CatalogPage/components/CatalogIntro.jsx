import React from "react";
import styles from "./CatalogIntro.module.css";

export default function CatalogIntro() {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Подборка коллекции</h1>
      <p className={styles.text}>
        Откройте для себя сочетание современного силуэта и timeless-эстетики.
        Вещи, созданные для стильного современного гардероба.
      </p>
    </div>
  );
}