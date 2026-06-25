import React from "react";
import styles from "./brandInfo.module.css";
import brandInfoData from "./brandInfoData.js";

export default function BrandInfo({ data }) {
  const sectionData = data || brandInfoData;
  const { title, descriptionLines, links } = sectionData;

  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>

        <div className={styles.description}>
          {descriptionLines.map((line, index) => (
            <p key={index} className={styles.descriptionLine}>
              {line}
            </p>
          ))}
        </div>

        <div className={styles.links}>
          {links.map((link) => (
            <a key={link.id} href={link.url} className={styles.link}>
              {link.text}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}