import React from 'react'
import ThreeSectionStyle from './ThreeSectionStyle.module.css'
import RussianMap from '../../../../assets/Images/RussianMap1233.png'

export default function ThreeSection() {
  return (
    <div className={ThreeSectionStyle.ContainerThreeSection}>
      <div className={ThreeSectionStyle.ContentWrapper}>
        <div className={ThreeSectionStyle.MapContainer}>
          <img src={RussianMap} alt="Карта России" className={ThreeSectionStyle.ImgRussianMap} />
          <div className={ThreeSectionStyle.GlowOverlay}></div>
          <div className={ThreeSectionStyle.Particles}>
            <span className={ThreeSectionStyle.Particle}></span>
            <span className={ThreeSectionStyle.Particle} style={{animationDelay: '0.3s'}}></span>
            <span className={ThreeSectionStyle.Particle} style={{animationDelay: '0.6s'}}></span>
            <span className={ThreeSectionStyle.Particle} style={{animationDelay: '1s'}}></span>
          </div>
        </div>
        
        <div className={ThreeSectionStyle.LeftTextRussianMap}>
          <h2 className={ThreeSectionStyle.SectionTitle}>Электронная коммерция в России</h2>
          <p>Создайте свой магазин для электронной коммерции, работающей по всей Российской Федерации</p>
          <div className={ThreeSectionStyle.CtaButton}>Начать продажи</div>
        </div>
      </div>
    </div>
  )
}
