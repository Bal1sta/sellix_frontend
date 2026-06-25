import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './createShopStyle.module.css';
// import Logo from "../../../../assets/SelixLOGO.svg";
import Logo from "../../../../assets/Images/SelixLOGO.svg"
import { store as storeApi } from "../../../../api/seller.js";
import { isAuthenticated } from "../../../../api/tokenStore.js";

// Соответствие подписей категорий нишам бэка (StoreNiche).
const NICHE_MAP = {
  'Одежда и обувь': 'clothing',
  'Детские товары и игрушки': 'kids',
  'Красота и уход за собой': 'beauty',
  'Техника и электроника': 'electronics',
  'Товары для хобби': 'other',
  'Мебель и товары для дома': 'home',
};

const CreateShopStandalone = () => {
  const navigate = useNavigate();

  const categories = [
    'Одежда и обувь',
    'Детские товары и игрушки',
    'Красота и уход за собой',
    'Техника и электроника',
    'Товары для хобби',
    'Мебель и товары для дома'
  ];

  const [selectedCategory, setSelectedCategory] = useState(0);
  const [shopName, setShopName] = useState('');

  const generateShopName = useCallback(() => {
    const adjectives = ['Уникальный', 'Умный', 'Творческий', 'Эко', 'Счастливый', 'Яркий'];
    const nouns = ['Магазин', 'Лавка', 'Рынок', 'Бутик', 'Уголок', 'Центр'];
    const randomNum = Math.floor(Math.random() * 100);

    return `${adjectives[Math.floor(Math.random() * adjectives.length)]}_${nouns[Math.floor(Math.random() * nouns.length)]}_${randomNum}`;
  }, []);

  const [creating, setCreating] = useState(false);

  const handleCreateShop = async () => {
    const trimmedName = shopName.trim();

    if (trimmedName.length < 3) {
      alert('❌ Название слишком короткое!');
      return;
    }

    const category = categories[selectedCategory];
    const shopData = {
      name: trimmedName,
      category,
      createdAt: new Date().toISOString(),
    };
    // Сохраняем локально для экрана редактирования (черновик оформления).
    localStorage.setItem('shop', JSON.stringify(shopData));

    // Если пользователь авторизован как продавец — создаём магазин на бэке.
    // Иначе ведём на вход; редактор откроется после авторизации.
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: { pathname: '/create-shop' } } });
      return;
    }

    setCreating(true);
    try {
      // Магазин может уже существовать (1 на продавца) — это не ошибка.
      await storeApi.create({
        name: trimmedName,
        niche: NICHE_MAP[category] || 'other',
      });
    } catch (err) {
      // Если магазин уже есть, продолжаем к редактору; иначе показываем ошибку.
      if (!/один магазин|already|существует/i.test(err.message || '')) {
        alert(`Не удалось создать магазин: ${err.message}`);
        setCreating(false);
        return;
      }
    }
    setCreating(false);
    navigate('/editing-page');
  };

  return (
    <div className={styles.app}>
      <header className={styles.hdr}>
        <div className={styles.hdrL}>
          <img
            src={Logo}
            alt="Sellix"
            className={styles.logoIcon}
            width="40"
            height="40"
          />
          <span className={styles.logo}><h2>Sellix</h2></span>
        </div>

        <div className={styles.hdrR}>
          <div className={styles.avatar} role="button" tabIndex={0} aria-label="Профиль">
            <div className={styles.avatarImg}>👤</div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.cnt}>
          <div className={styles.hero}>
            <h1 className={styles.h1}>Придумайте свой</h1>
            <h2><span className={styles.accent}>магазин</span></h2>
            <p className={styles.heroT}>
              Выберите категорию и создайте уникальное имя для старта вашего бизнеса.
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepL}>
              <h2 className={styles.stepN}>Шаг 1</h2>
              <p className={styles.stepT}>ВЫБЕРИТЕ КАТЕГОРИЮ</p>
            </div>

            <div className={styles.stepR}>
              <div className={styles.catGrid}>
                {categories.map((cat, idx) => (
                  <label key={idx} className={styles.catItem}>
                    <input
                      type="radio"
                      name="category"
                      className={styles.radio}
                      checked={selectedCategory === idx}
                      onChange={() => setSelectedCategory(idx)}
                    />
                    <div className={styles.catCard}>{cat}</div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.step}>
            <div className={styles.stepL}>
              <h2 className={styles.stepN}>Шаг 2</h2>
              <p className={styles.stepT}>ПРИДУМАЙТЕ ИЛИ СГЕНЕРИРУЙТЕ НАЗВАНИЕ</p>
            </div>

            <div className={styles.stepR}>
              <div className={styles.nameRow}>
                <button
                  className={styles.btnGen}
                  type="button"
                  onClick={() => setShopName(generateShopName())}
                  title="Сгенерировать название"
                >
                  <span className={styles.spin}>✨</span>
                </button>

                <input
                  className={styles.inpName}
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="Название магазина..."
                  maxLength={30}
                />
              </div>
            </div>
          </div>

          <div className={styles.btnRow}>
            <button
              className={styles.btnCreate}
              onClick={handleCreateShop}
              disabled={shopName.trim().length < 3 || creating}
            >
              <span>{creating ? 'Создаём…' : 'Создать магазин'}</span>
            </button>
          </div>
        </div>
      </main>

      <footer className={styles.ftr}>
        © 2026 Sellix. Все права защищены.
      </footer>
    </div>
  );
};

export default CreateShopStandalone;