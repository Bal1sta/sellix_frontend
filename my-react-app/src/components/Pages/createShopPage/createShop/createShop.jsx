import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './createShopStyle.module.css';
import Logo from '../../../Images/SelixLOGO.svg';

const CreateShopStandalone = () => {
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

  const handleCreateShop = () => {
    if (shopName.length < 3) {
      alert('❌ Название слишком короткое!');
      return;
    }
    // alert(`✅ Магазин "${shopName}"\n📁 Категория: "${categories[selectedCategory]}"\n🎉 Успешно создан!`);
  };

  return (
    <div className={styles.app}>
      <header className={styles.hdr}>
        <div className={styles.hdrL}>
          <img 
            src={Logo} 
            alt="Sellix" 
            className={styles.logoIcon}
            width="40"  // добавьте явные атрибуты
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
            <h1 className={styles.h1}>Придумайте свой </h1>
            <h2><span className={styles.accent}>магазин</span></h2>
            <p className={styles.heroT}>Выберите категорию и создайте уникальное имя для старта вашего бизнеса.</p>
          </div>

          {/* ШАГ 1 */}
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

          {/* ШАГ 2 */}
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

              <Link to="/editing-page">
                <button 
                  className={styles.btnCreate}
                  onClick={handleCreateShop}
                  disabled={shopName.length < 3}
                >
                  <span>Создать магазин</span>
                </button>
              </Link>

          </div>
        </div>
      </main>

      <footer className={styles.ftr}>
        © 202? Sellix. Все права защищены.
      </footer>
    </div>
  );
};

export default CreateShopStandalone ;
