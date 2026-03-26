import React from 'react'
import FourSectionStyles from './FourSectionStyles.module.css'

export default function FourSection() {
  return (
    <div className={FourSectionStyles.ContainerFourSection}>
      <div className={FourSectionStyles.ContentWrapper}>
        <div className={FourSectionStyles.HeadingGroup}>
          <h3 className={FourSectionStyles.MainHeading}>Не упустите свой шанс</h3>
          <div className={FourSectionStyles.SubHeading}>🚀 Запустите магазин уже сегодня</div>
        </div>
        
        <button className={FourSectionStyles.ctaButton}>
          <span>Начните бесплатно</span>
          <div className={FourSectionStyles.IconArrow}>→</div>
        </button>

        <div className={FourSectionStyles.StatsGrid}>
          <div className={FourSectionStyles.StatItem}>
            <div className={FourSectionStyles.StatNumber}>500+</div>
            <div className={FourSectionStyles.StatLabel}>магазинов</div>
          </div>
          <div className={FourSectionStyles.StatItem}>
            <div className={FourSectionStyles.StatNumber}>24/7</div>
            <div className={FourSectionStyles.StatLabel}>поддержка</div>
          </div>
          <div className={FourSectionStyles.StatItem}>
            <div className={FourSectionStyles.StatNumber}>0₽</div>
            <div className={FourSectionStyles.StatLabel}>первые 30 дней</div>
          </div>
        </div>

        <div className={FourSectionStyles.FloatingElements}>
          <div className={FourSectionStyles.FloatingOrb1}></div>
          <div className={FourSectionStyles.FloatingOrb2}></div>
          <div className={FourSectionStyles.FloatingOrb3}></div>
        </div>
      </div>
    </div>
  )
}
