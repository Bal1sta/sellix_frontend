// Header.jsx
import React, { useState, useEffect } from 'react';
import HeaderStyles from './HeaderStyles.module.css';
import Logo from '../../../../assets/Images/SelixLOGO.svg';
import { Link } from 'react-router-dom';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); 

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  }

  return (
    <div className={`${HeaderStyles.containerHeader} ${scrolled ? HeaderStyles.scrolled : ''}`}>
      <nav className={HeaderStyles.nav}>
        <div className={HeaderStyles.logo}>
          <img src={Logo} alt="Логотип" />
          <h2>Sellix</h2>
          <ul className={HeaderStyles.navbar}>
            <li><a href="#">О Sellix</a></li>
            <li><a href="#">Возможности</a></li>
            <li><a href="#">Обратная связь</a></li>
          </ul>
        </div>

        <div className={HeaderStyles.rightNavbar}>
          <a href="#" className={HeaderStyles.loginLink}>Войти</a>
          
          <Link to="/create-shop">
            <button className={HeaderStyles.ctaButton}>
              Начните бесплатно
            </button>
          </Link>
          
          <div className={HeaderStyles.burgerContainer} onClick={toggleMenu}>
            <div className={HeaderStyles.burgerLine}></div>
            <div className={HeaderStyles.burgerLine}></div>
            <div className={HeaderStyles.burgerLine}></div>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className={`${HeaderStyles.menuPanel} ${scrolled ? HeaderStyles.scrolledMenu : ''}`}>
          <ul>
            <li><a href="#"><p>О Sellix</p></a></li>
            <li><a href="#"><p>Возможности</p></a></li>
            <li><a href="#"><p>Обратная связь</p></a></li>
            <li><a href="#" className={HeaderStyles.loginLink}><p>Войти</p></a></li>
            <Link to="/create-shop">
              <button className={HeaderStyles.ctaButton}>
                Начните бесплатно
              </button>
            </Link>
          </ul>
        </div>
      )}
    </div>
  );
}
