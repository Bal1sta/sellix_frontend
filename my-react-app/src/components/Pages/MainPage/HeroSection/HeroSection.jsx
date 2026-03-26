import React from 'react'
import HeroSectionStyles from './HeroSectionStyles.module.css'

export default function HeroSection() {
  return (
    <div className={HeroSectionStyles.containerHeroSection}>
      <section className={HeroSectionStyles.hero}>
        <h1 className={HeroSectionStyles.title}>
          Создайте и развивайте онлайн-магазин
        </h1>

        <p className={HeroSectionStyles.subtitle}>
          Запустите свой интернет-магазин с нашей интуитивно понятной платформой. Выбирайте из множества шаблонов и настраивайте свой сайт.
        </p>

        <div className={HeroSectionStyles.actions}>
          <button className={HeroSectionStyles.ctaButton}>Начните бесплатно</button>
          {/* <Link to="/create-shop">
              <button className={HeroSectionStyles.ctaButton}>
                Начните бесплатно
              </button>
            </Link> */}
        </div>
      </section>

      {/* <div className={HeroSectionStyles.figure}></div> */}
    </div>
  )
}