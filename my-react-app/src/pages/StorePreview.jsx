import { useEffect, useState } from "react";
import styles from "../shared/styles.module.css";
import preview from "./StorePreview.module.css";
import * as sellerApi from "../api/seller.js";
import { resolveMediaUrl } from "../config/runtime.js";

const money = (v) => `${Number(v ?? 0).toLocaleString("ru-RU")} ₽`;
const asList = (d) => (Array.isArray(d) ? d : d?.results ?? []);

// Шаблоны витрины — по одному на каждую нишу/категорию.
// Каждый шаблон задаёт оформление: цвета, заголовок-приветствие, стиль карточек.
const TEMPLATES = {
  clothing: {
    label: "Одежда и обувь",
    accent: "#1a1a2e",
    accent2: "#e94560",
    bg: "#faf8f6",
    heroTitle: "Новая коллекция",
    heroSubtitle: "Стиль, который говорит за вас",
    cardStyle: "tall",
    font: "elegant",
  },
  electronics: {
    label: "Электроника",
    accent: "#0f3460",
    accent2: "#00b4d8",
    bg: "#f4f7fb",
    heroTitle: "Технологии будущего",
    heroSubtitle: "Гаджеты и техника по лучшим ценам",
    cardStyle: "grid",
    font: "tech",
  },
  home: {
    label: "Товары для дома",
    accent: "#5a4e3c",
    accent2: "#c89f65",
    bg: "#f9f6f0",
    heroTitle: "Уют в каждой детали",
    heroSubtitle: "Всё для вашего дома",
    cardStyle: "soft",
    font: "warm",
  },
  beauty: {
    label: "Красота и здоровье",
    accent: "#7a3b69",
    accent2: "#e6a3c4",
    bg: "#fdf6fa",
    heroTitle: "Ваша красота",
    heroSubtitle: "Косметика и уход за собой",
    cardStyle: "soft",
    font: "elegant",
  },
  food: {
    label: "Продукты питания",
    accent: "#2d5016",
    accent2: "#8cb369",
    bg: "#f6faf2",
    heroTitle: "Свежесть каждый день",
    heroSubtitle: "Качественные продукты с доставкой",
    cardStyle: "grid",
    font: "warm",
  },
  kids: {
    label: "Детские товары",
    accent: "#1d6a96",
    accent2: "#ffb703",
    bg: "#f4fafd",
    heroTitle: "Всё для детей",
    heroSubtitle: "Игрушки, одежда и забота",
    cardStyle: "soft",
    font: "playful",
  },
  other: {
    label: "Универсальный",
    accent: "#1a1a2e",
    accent2: "#4a90d9",
    bg: "#f7f8fa",
    heroTitle: "Добро пожаловать",
    heroSubtitle: "Лучшие товары в одном месте",
    cardStyle: "grid",
    font: "default",
  },
};

export function getTemplate(niche) {
  return TEMPLATES[niche] || TEMPLATES.other;
}

export const TEMPLATE_LIST = Object.entries(TEMPLATES).map(([key, t]) => ({ key, ...t }));

// Превью витрины магазина — отражает реальные данные (название + видимые товары).
export default function StorePreview() {
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const st = await sellerApi.store.get();
        setStore(st);
        const sp = await sellerApi.storeProducts.list();
        // показываем только видимые товары — как увидит покупатель
        setProducts(asList(sp).filter((p) => p.is_visible));
      } catch { /* no store */ }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className={styles.empty}>Загрузка превью…</div>;
  if (!store) return <div className={styles.empty}>Магазин не создан.</div>;

  const tpl = getTemplate(store.niche);

  return (
    <div>
      <div className={preview.notice}>
        <span>👁️ Так выглядит ваш интернет-магазин для покупателей</span>
        <span className={preview.noticeTpl}>Шаблон: {tpl.label}</span>
      </div>

      {/* Рамка-«браузер» вокруг превью */}
      <div className={preview.browser}>
        <div className={preview.browserBar}>
          <span className={preview.dot} style={{ background: "#ff5f57" }} />
          <span className={preview.dot} style={{ background: "#febc2e" }} />
          <span className={preview.dot} style={{ background: "#28c840" }} />
          <div className={preview.urlBar}>mysellix.ru/shop/{store.slug}</div>
        </div>

        {/* Сама витрина по шаблону */}
        <div className={preview.shop} style={{ background: tpl.bg, "--accent": tpl.accent, "--accent2": tpl.accent2 }}>
          {/* Шапка магазина */}
          <header className={preview.shopHeader} style={{ background: tpl.accent }}>
            <div className={preview.shopName}>{store.name}</div>
            <nav className={preview.shopNav}>
              <span>Каталог</span>
              <span>О магазине</span>
              <span>Контакты</span>
              <span className={preview.shopCart}>🛒</span>
            </nav>
          </header>

          {/* Hero-баннер шаблона */}
          <div className={preview.hero} style={{ background: `linear-gradient(135deg, ${tpl.accent} 0%, ${tpl.accent2} 100%)` }}>
            <div className={preview.heroText}>
              <h2>{tpl.heroTitle}</h2>
              <p>{tpl.heroSubtitle}</p>
              <button style={{ color: tpl.accent }}>В каталог</button>
            </div>
          </div>

          {/* Сетка товаров */}
          <div className={preview.shopBody}>
            <h3 className={preview.sectionTitle} style={{ color: tpl.accent }}>Товары</h3>
            {products.length === 0 ? (
              <div className={preview.emptyShop}>
                В магазине пока нет видимых товаров.<br />
                Добавьте товары на вкладке «Товары» и включите их видимость.
              </div>
            ) : (
              <div className={`${preview.products} ${preview[tpl.cardStyle]}`}>
                {products.map((sp) => {
                  const img = sp.product?.images?.[0]?.image;
                  return (
                    <div key={sp.id} className={preview.product}>
                      <div className={preview.productImg}>
                        {img ? <img src={resolveMediaUrl(img)} alt="" /> : <div className={preview.noImg}>нет фото</div>}
                      </div>
                      <div className={preview.productInfo}>
                        <div className={preview.productName}>{sp.product?.name}</div>
                        <div className={preview.productCat}>{sp.product?.category_name}</div>
                        <div className={preview.productPrice} style={{ color: tpl.accent2 }}>{money(sp.retail_price)}</div>
                        <button className={preview.buyBtn} style={{ background: tpl.accent }}>В корзину</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Подвал магазина */}
          <footer className={preview.shopFooter} style={{ background: tpl.accent }}>
            <span>{store.name}</span>
            <span>© 2025 · Работает на Sellix</span>
          </footer>
        </div>
      </div>

      <p className={preview.hint}>
        Превью обновляется автоматически: измените название магазина в «Настройках»
        или добавьте товары во вкладке «Товары» — изменения сразу отразятся здесь.
      </p>
    </div>
  );
}
