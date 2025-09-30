import React from 'react'
import HeaderStyles from './HeaderStyles.module.css'
import Logo from '../../../Images/logo123.svg'

export default function Header() {
  return (
    <div className={HeaderStyles.containerHeader}>
      <nav className={HeaderStyles.nav}>
        <div className={HeaderStyles.logo}>
          <img src={Logo} alt="Логотип" />
          <h2>Sellix</h2>
          <ul className={HeaderStyles.navbar}>
            <li><a href="#">O Commercia</a></li>
            <li><a href="#">Возможности</a></li>
            <li><a href="#">Обратная связь</a></li>
          </ul>
        </div>
        <div>
          <ul className={HeaderStyles.navbar}>
            <li><a href="#">Войти</a></li>
            <li>
              <button className={HeaderStyles.ctaButton}>
                Начать бесплатно
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  )
}
