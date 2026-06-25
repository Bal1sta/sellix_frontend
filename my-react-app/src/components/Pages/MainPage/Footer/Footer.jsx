import React from 'react'
import FooterStyles from './FooterStyles.module.css'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <div className={FooterStyles.ContainerFooter}>
      <div className={FooterStyles.TopFooter}>
        <div className={FooterStyles.FooterInfo}>
          <div className={FooterStyles.Commercia}>
            <h3 className={FooterStyles.LogoText}>Sellix</h3>
            <p className={FooterStyles.StatusTag}>🚀 В стадии разработки</p>
            <div className={FooterStyles.SocialLinks}>
              <a href="#" className={FooterStyles.SocialLink}>Telegram</a>
              <a href="#" className={FooterStyles.SocialLink}>VK</a>
              <a href="#" className={FooterStyles.SocialLink}>GitHub</a>
            </div>
          </div>

          <div className={FooterStyles.Navigation}>
            <h4>Навигация</h4>
            <Link to="/about" className={FooterStyles.FooterLink}>О платформе</Link>
            <Link to="/features" className={FooterStyles.FooterLink}>Возможности</Link>
            <Link to="/feedback" className={FooterStyles.FooterLink}>Обратная связь</Link>
            <Link to="/contacts" className={FooterStyles.FooterLink}>Контакты</Link>
          </div>

          <div className={FooterStyles.Contacts}>
            <h4>Контакты</h4>
            <div className={FooterStyles.ContactItem}>
              <span className={FooterStyles.ContactIcon}>✉️</span>
              <a href="mailto:support@sellix.com">support@sellix.com</a>
            </div>
            <div className={FooterStyles.ContactItem}>
              <span className={FooterStyles.ContactIcon}>📞</span>
              <a href="tel:+79921859939">+7 (992) 185-9939</a>
            </div>
            <div className={FooterStyles.ContactItem}>
              <span className={FooterStyles.ContactIcon}>📍</span>
              Вершинина 39а, Томск, Россия
            </div>
          </div>
        </div>
      </div>

      <div className={FooterStyles.GradientLine}></div>

      <div className={FooterStyles.BottomFooter}>
        <p className={FooterStyles.Copyright}>© 2026 Sellix. Все права защищены.</p>
        <div className={FooterStyles.PrivacyLinks}>
          <Link to="/privacy" className={FooterStyles.PrivacyLink}>Политика конфиденциальности</Link>
          <Link to="/terms" className={FooterStyles.PrivacyLink}>Условия использования</Link>
        </div>
      </div>

      <div className={FooterStyles.FloatingDecorations}>
        <div className={FooterStyles.GlowDot1}></div>
        <div className={FooterStyles.GlowDot2}></div>
        <div className={FooterStyles.GlowDot3}></div>
      </div>
    </div>
  )
}
