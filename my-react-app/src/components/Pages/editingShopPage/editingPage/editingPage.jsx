import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import editingPageStyle from './editingPageStyle.module.css'

export default function EditingPageComponent() {
  const location = useLocation();
  
  return (
    <div className={editingPageStyle.app}>
      <div className={editingPageStyle.sidebar}>
        <div className={editingPageStyle.logo}>Sellix</div>
        
        <div className={editingPageStyle.navSectionNoBorder}>
          <div className={editingPageStyle.sectionTitle}>основное меню</div>
          
          {/* Ссылка 1: Панель управления - Без изменений */}
          <Link to="/editing-page" className={`${editingPageStyle.navItem} ${location.pathname === '/editing-page' ? editingPageStyle.active : ''}`}>
            Панель управления
          </Link>
          
          {/* ИЗМЕНЕНИЕ: Исправлен путь с '/electronics-page' на '/electronicsShop-page' */}
          <Link to="/electronicsShop-page" className={`${editingPageStyle.navItem} ${location.pathname === '/electronicsShop-page' ? editingPageStyle.active : ''}`}>
            Товары
          </Link>
          
          {/* Остальные ссылки - Без изменений */}
          <Link to="/editing-page" className={editingPageStyle.navItem}>
            Заказы
          </Link>
          <Link to="/editing-page" className={editingPageStyle.navItem}>
            Клиенты
          </Link>
        </div>

        <div className={editingPageStyle.navSection}>
          <div className={editingPageStyle.sectionTitle}>настройки</div>
          <Link to="/editing-page" className={editingPageStyle.navItem}>
            Оформление
          </Link>
          <Link to="/editing-page" className={editingPageStyle.navItem}>
            Настройки магазина
          </Link>
          <Link to="/editing-page" className={editingPageStyle.navItem}>
            Платежи
          </Link>
          <Link to="/editing-page" className={editingPageStyle.navItem}>
            Общие настройки
          </Link>
        </div>
      </div>
      
      <div className={editingPageStyle.main}>
        <div className={editingPageStyle.header}>
          <div className={editingPageStyle.pageTitle}>Панель управления</div>
          <div className={editingPageStyle.searchBar}>
            <input 
              type="text" 
              placeholder="Поиск товаров, заказов, клиентов..." 
              className={editingPageStyle.searchInput}
            />
          </div>
          <div className={editingPageStyle.userProfile}>
            <div className={editingPageStyle.userAvatar}>АМ</div>
          </div>
        </div>
        
        <div className={editingPageStyle.contentArea}>
          Главная панель управления Sellix (содержимое будет добавлено здесь)

          {/* Временная кнопка - Без изменений (уже использует правильный путь) */}
          <Link to="/electronicsShop-page">
            <button>Временная кнопка</button>
          </Link>


          {/* <a href="my-react-app\src\components\Pages\editingShopPage\code.html">Временная кнопка</a> */}
        </div>
      </div>
    </div>
  )
}