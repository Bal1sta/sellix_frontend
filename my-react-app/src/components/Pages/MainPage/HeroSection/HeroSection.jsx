import React from 'react'
import HeroSectionStyles from './HeroSectionStyles.module.css'

export default function HeroSection() {
  return (
    <div className={HeroSectionStyles.containerHeroSection}>
      <section className={HeroSectionStyles.hero}>
        <h1 className={HeroSectionStyles.title}>
          Создайте и развивайте онлайн-магазин за минуты
        </h1>

        <p className={HeroSectionStyles.subtitle}>
          Запустите свой интернет-магазин с нашей интуитивно понятной платформой.Выбирайте из множества шаблонов и настраивайте свой сайт с помощью простого и удобного drag-and-drop редактора.
        </p>

        <div className={HeroSectionStyles.actions}>
          <button className={HeroSectionStyles.cta}>Начать бесплатно</button>
        </div>
      </section>
    </div>
  )
}
