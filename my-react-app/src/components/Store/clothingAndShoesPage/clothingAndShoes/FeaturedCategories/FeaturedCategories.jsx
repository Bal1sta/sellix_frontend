import React from "react";
import styles from "./featuredCategories.module.css";
import featuredCategoriesData from "./featuredCategoriesData.js";

export default function FeaturedCategories({ data }) {
  const sectionData = data || featuredCategoriesData;
  const { cards } = sectionData;

  const largeCard = cards.find((card) => card.type === "large-image");
  const topRightCard = cards.find((card) => card.type === "small-image");
  const bottomRightCard = cards.find((card) => card.type === "text-card");

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {largeCard && (
          <a href={largeCard.link} className={`${styles.card} ${styles.largeCard}`}>
            <img
              src={largeCard.image}
              alt={largeCard.title}
              className={styles.cardImage}
            />
            <div className={styles.overlayDark}></div>

            <div className={styles.cardContentBottom}>
              <h2 className={styles.largeTitle}>{largeCard.title}</h2>
              <p className={styles.largeSubtitle}>{largeCard.subtitle}</p>
            </div>
          </a>
        )}

        <div className={styles.rightColumn}>
          {topRightCard && (
            <a href={topRightCard.link} className={`${styles.card} ${styles.smallImageCard}`}>
              <img
                src={topRightCard.image}
                alt={topRightCard.title}
                className={styles.cardImage}
              />
              <div className={styles.overlayDark}></div>

              <div className={styles.cardContentBottomSmall}>
                <h3 className={styles.smallTitle}>{topRightCard.title}</h3>
                <p className={styles.smallSubtitle}>{topRightCard.subtitle}</p>
              </div>
            </a>
          )}

          {bottomRightCard && (
            <div className={`${styles.card} ${styles.textCard}`}>
              <p className={styles.textCardLabel}>{bottomRightCard.label}</p>
              <h3 className={styles.textCardTitle}>{bottomRightCard.title}</h3>
              <p className={styles.textCardDescription}>
                {bottomRightCard.description}
              </p>

              <a href={bottomRightCard.link} className={styles.textCardButton}>
                {bottomRightCard.buttonText} <span>→</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}