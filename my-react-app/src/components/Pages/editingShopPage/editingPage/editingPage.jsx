import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import editingPageStyle from './editingPageStyle.module.css';

export default function EditingPageComponent() {
  const location = useLocation();

  const shopDataString = localStorage.getItem('shop');
  const shop = shopDataString ? JSON.parse(shopDataString) : null;

  return (
    <div className={editingPageStyle.app}>
      <div className={editingPageStyle.sidebar}>
        <div className={editingPageStyle.logo}>Sellix</div>

        <div className={editingPageStyle.navSectionNoBorder}>
          <div className={editingPageStyle.sectionTitle}>основное меню</div>

          <Link
            to="/editing-page"
            className={`${editingPageStyle.navItem} ${
              location.pathname === '/editing-page' ? editingPageStyle.active : ''
            }`}
          >
            Панель управления
          </Link>

          <Link
            to="/electronicsShop-page"
            className={`${editingPageStyle.navItem} ${
              location.pathname === '/electronicsShop-page' ? editingPageStyle.active : ''
            }`}
          >
            Товары
          </Link>

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
          {shop ? (
            <>
              <h1>Добро пожаловать в {shop.name}</h1>
              <p><strong>Категория:</strong> {shop.category}</p>
              <p><strong>Дата создания:</strong> {new Date(shop.createdAt).toLocaleString()}</p>

              <div style={{ marginTop: '24px' }}>
                <Link to="/electronicsShop-page">
                  <button>Перейти в магазин электроники</button>
                </Link>

                <Link to="/clothingShop-Page">
                  <button>Перейти в магазин одежды и обуви</button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1>Магазин пока не создан</h1>
              <p>Сначала создайте магазин, чтобы увидеть панель управления.</p>

              <div style={{ marginTop: '24px' }}>
                <Link to="/create-shop">
                  <button>Создать магазин</button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}