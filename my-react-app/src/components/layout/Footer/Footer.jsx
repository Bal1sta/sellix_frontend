import React from "react";
import styles from "./footer.module.css";
import footerData from "./footerData.js";

export default function Footer({ data }) {

  const sectionData = data || footerData;

  const { brand, sections, newsletter } = sectionData;

  return (
    <footer className={styles.footer}>

      <div className={styles.container}>

        {/* бренд */}

        <div className={styles.brand}>
          <h2 className={styles.brandTitle}>{brand.title}</h2>
          <p className={styles.brandSubtitle}>{brand.subtitle}</p>
        </div>


        {/* блоки */}

        <div className={styles.sections}>
          {sections.map((section) => (
            <div key={section.id} className={styles.section}>

              <h3 className={styles.sectionTitle}>
                {section.title}
              </h3>

              <div className={styles.links}>
                {section.links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    className={styles.link}
                  >
                    {link.text}
                  </a>
                ))}
              </div>

            </div>
          ))}
        </div>


        {/* newsletter */}

        <div className={styles.newsletter}>

          <p className={styles.newsletterTitle}>
            {newsletter.title}
          </p>

          <div className={styles.newsletterInputWrapper}>

            <input
              type="email"
              placeholder={newsletter.placeholder}
              className={styles.newsletterInput}
            />

            <button className={styles.newsletterButton}>
              →
            </button>

          </div>

        </div>

      </div>

    </footer>
  );
}