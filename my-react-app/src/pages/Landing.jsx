import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import land from "./Landing.module.css";
import Logo from "../assets/Images/SelixLOGO.svg";
import { store as storeApi } from "../api/seller.js";
import { profile as producerProfileApi } from "../api/producer.js";

export default function Landing() {
  const navigate = useNavigate();
  const { isLoggedIn, role, loading } = useAuth();
  const [checking, setChecking] = useState(true);

  // Если авторизован и уже создал магазин/компанию — сразу в кабинет управления.
  useEffect(() => {
    if (loading) return;
    if (!isLoggedIn) { setChecking(false); return; }

    let cancelled = false;
    (async () => {
      try {
        if (role === "seller") {
          await storeApi.get();
          if (!cancelled) navigate("/seller", { replace: true });
        } else if (role === "producer") {
          await producerProfileApi.get();
          if (!cancelled) navigate("/producer", { replace: true });
        } else if (role === "admin") {
          if (!cancelled) navigate("/admin", { replace: true });
        } else {
          if (!cancelled) setChecking(false);
        }
      } catch {
        if (cancelled) return;
        if (role === "seller") navigate("/seller/create", { replace: true });
        else if (role === "producer") navigate("/producer/create", { replace: true });
        else if (!role) navigate("/select-role", { replace: true });
        else setChecking(false);
      }
    })();
    return () => { cancelled = true; };
  }, [isLoggedIn, role, loading, navigate]);

  // Кнопка «Войти/Начать» — в кабинет (если бизнес) или на регистрацию.
  function handleEnter() {
    if (!isLoggedIn) { navigate("/login"); return; }
    if (role === "seller") navigate("/seller");
    else if (role === "producer") navigate("/producer");
    else if (role === "admin") navigate("/admin");
    else navigate("/select-role");
  }

  // Плавный скролл к секции по якорю.
  function scrollTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (loading || checking) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "rgb(26,26,46)", color: "#fff" }}>Загрузка…</div>;
  }

  return (
    <div>
      {/* ─── ВЕРХНЯЯ НАВИГАЦИЯ ЛЕНДИНГА ─── */}
      <header className={land.nav}>
        <button className={land.navBrand} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <img src={Logo} alt="Sellix" />
          <span>Sellix</span>
        </button>

        <nav className={land.navLinks}>
          <button onClick={() => scrollTo("how")}>Как устроена платформа</button>
          <button onClick={() => scrollTo("sellers")}>Для продавцов</button>
          <button onClick={() => scrollTo("producers")}>Для производителей</button>
          <button onClick={() => scrollTo("features")}>Всё для онлайн-торговли</button>
        </nav>

        <button className={land.navCta} onClick={handleEnter}>
          {isLoggedIn ? "В кабинет" : "Войти / Регистрация"}
        </button>
      </header>

      {/* ─── HERO ─── */}
      <section className={land.hero}>
        <div className={land.heroInner}>
          <div className={land.heroBadge}>B2B2C · Маркетплейс-платформа</div>
          <h1 className={land.heroTitle}>
            Запустите интернет-магазин<br />за несколько минут
          </h1>
          <p className={land.heroLead}>
            Sellix — это платформа, объединяющая производителей, продавцов и покупателей.
            Создайте магазин, наполните его товарами от проверенных поставщиков
            и начните продавать по всей России — без склада, кода и вложений.
          </p>
          <div className={land.heroBtns}>
            <button className={`${land.btn} ${land.btnPrimary}`} onClick={handleEnter}>
              Создать магазин бесплатно
            </button>
            <button className={`${land.btn} ${land.btnSecondary}`} onClick={handleEnter}>
              Стать поставщиком
            </button>
          </div>
          <p className={land.heroNote}>Вход через Яндекс ID или VK ID · Без банковской карты</p>
        </div>
      </section>

      {/* ─── ЦИФРЫ ─── */}
      <section className={land.stats}>
        <div className={land.stat}><div className={land.statNum}>3 в 1</div><div className={land.statLabel}>Производитель · Продавец · Покупатель</div></div>
        <div className={land.stat}><div className={land.statNum}>0 ₽</div><div className={land.statLabel}>Старт без вложений</div></div>
        <div className={land.stat}><div className={land.statNum}>4</div><div className={land.statLabel}>Службы доставки по РФ</div></div>
        <div className={land.stat}><div className={land.statNum}>2 мин</div><div className={land.statLabel}>На запуск магазина</div></div>
      </section>

      {/* ─── КАК УСТРОЕНА ПЛАТФОРМА ─── */}
      <section id="how" className={land.section}>
        <div className={land.sectionHead}>
          <h2>Как устроена платформа</h2>
          <p>Sellix соединяет три стороны рынка в единую экосистему. Каждый получает своё.</p>
        </div>
        <div className={land.flow}>
          <div className={land.flowCard}>
            <div className={land.flowIcon}>🏭</div>
            <h3>Производитель</h3>
            <p>Размещает товары в общем каталоге по отпускной цене. Не занимается витриной и маркетингом — только производит и отгружает.</p>
          </div>
          <div className={land.flowArrow}>→</div>
          <div className={land.flowCard}>
            <div className={land.flowIcon}>🛍️</div>
            <h3>Продавец</h3>
            <p>Открывает магазин, добавляет товары из каталога в один клик, ставит свою наценку и продаёт под своим брендом.</p>
          </div>
          <div className={land.flowArrow}>→</div>
          <div className={land.flowCard}>
            <div className={land.flowIcon}>🛒</div>
            <h3>Покупатель</h3>
            <p>Заказывает в удобном магазине с доставкой СДЭК, Почтой России, Яндекс Доставкой или Boxberry.</p>
          </div>
        </div>
      </section>

      {/* ─── ДЛЯ ПРОДАВЦОВ ─── */}
      <section id="sellers" className={`${land.section} ${land.sectionAlt}`}>
        <div className={land.split}>
          <div className={land.splitText}>
            <div className={land.tag}>Для продавцов</div>
            <h2>Магазин без склада и закупок</h2>
            <p>Вам не нужно покупать товар заранее или арендовать склад. Выбирайте позиции из общего пула производителей, добавляйте в свой магазин и продавайте. Оплата делится автоматически.</p>
            <ul className={land.checklist}>
              <li>Один товар — много магазинов: добавляйте в один клик</li>
              <li>Гибкая наценка: процент, фиксированная сумма или своя цена</li>
              <li>Подключение оплаты: ЮKassa, Т-Касса, CloudPayments</li>
              <li>Собственная витрина с уникальным адресом</li>
            </ul>
            <button className={`${land.btn} ${land.btnPrimary}`} onClick={handleEnter}>Открыть магазин</button>
          </div>
          <div className={land.splitVisual}>
            <div className={land.mockCard}>
              <div className={land.mockRow}><span>Кроссовки Nova</span><strong>4 990 ₽</strong></div>
              <div className={land.mockRow}><span>Закупка</span><span className={land.mockMuted}>3 200 ₽</span></div>
              <div className={land.mockRow}><span>Ваша наценка</span><strong className={land.mockGreen}>+1 790 ₽</strong></div>
              <div className={land.mockBtn}>Добавить в магазин</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ДЛЯ ПРОИЗВОДИТЕЛЕЙ ─── */}
      <section id="producers" className={land.section}>
        <div className={`${land.split} ${land.splitReverse}`}>
          <div className={land.splitText}>
            <div className={land.tag}>Для производителей</div>
            <h2>Ваш товар — в сотнях магазинов</h2>
            <p>Разместите продукцию один раз — её начнут продавать десятки магазинов платформы. Вы получаете отпускную цену с каждой продажи и занимаетесь только производством и отгрузкой.</p>
            <ul className={land.checklist}>
              <li>Единый каталог: ваши товары видят все продавцы</li>
              <li>До 3 категорий продукции на компанию</li>
              <li>Индивидуальные способы оплаты и доставки для каждого товара</li>
              <li>Прозрачные выплаты после доставки заказа</li>
            </ul>
            <button className={`${land.btn} ${land.btnPrimary}`} onClick={handleEnter}>Стать поставщиком</button>
          </div>
          <div className={land.splitVisual}>
            <div className={land.mockCard}>
              <div className={land.mockTitle}>Ваш товар продают</div>
              <div className={land.mockShops}>
                <span className={land.mockShop}>Магазин «Стиль»</span>
                <span className={land.mockShop}>ShoeBox</span>
                <span className={land.mockShop}>Топ-Обувь</span>
                <span className={land.mockShop}>+ ещё 12</span>
              </div>
              <div className={land.mockRow}><span>Продаж за месяц</span><strong>284</strong></div>
              <div className={land.mockRow}><span>К выплате</span><strong className={land.mockGreen}>908 800 ₽</strong></div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ВСЁ ДЛЯ ОНЛАЙН-ТОРГОВЛИ ─── */}
      <section id="features" className={`${land.section} ${land.sectionAlt}`}>
        <div className={land.sectionHead}>
          <h2>Всё для онлайн-торговли</h2>
          <p>Локализованная для России платформа с интеграциями, которыми пользуются миллионы.</p>
        </div>
        <div className={land.features}>
          <div className={land.feature}><div className={land.featureIcon}>💳</div><h3>Приём платежей</h3><p>ЮKassa, Т-Касса, CloudPayments. Деньги делятся между продавцом и производителем автоматически.</p></div>
          <div className={land.feature}><div className={land.featureIcon}>📦</div><h3>Доставка по РФ</h3><p>СДЭК, Почта России, Яндекс Доставка, Boxberry. Трек-номер и статусы прямо в заказе.</p></div>
          <div className={land.feature}><div className={land.featureIcon}>🔐</div><h3>Вход через Яндекс / VK</h3><p>Авторизация через Яндекс ID и VK ID. Никаких паролей и долгой регистрации.</p></div>
          <div className={land.feature}><div className={land.featureIcon}>📊</div><h3>Аналитика</h3><p>Выручка, заказы, статусы выплат — всё в одной панели управления.</p></div>
          <div className={land.feature}><div className={land.featureIcon}>🏷️</div><h3>Гибкое ценообразование</h3><p>Наценка процентом, суммой или своей ценой. Управляйте маржой по каждому товару.</p></div>
          <div className={land.feature}><div className={land.featureIcon}>🚚</div><h3>Умная логистика</h3><p>Заказ с товарами разных производителей автоматически разбивается на отгрузки.</p></div>
        </div>
      </section>

      {/* ─── КАК НАЧАТЬ ─── */}
      <section className={land.section}>
        <div className={land.sectionHead}>
          <h2>Запуск за 4 шага</h2>
        </div>
        <div className={land.steps}>
          <div className={land.step}><div className={land.stepNum}>1</div><h3>Войдите</h3><p>Через Яндекс ID или VK ID за пару секунд.</p></div>
          <div className={land.step}><div className={land.stepNum}>2</div><h3>Выберите роль</h3><p>Продавец или производитель — решать вам.</p></div>
          <div className={land.step}><div className={land.stepNum}>3</div><h3>Создайте магазин</h3><p>Название, ниша — и витрина готова.</p></div>
          <div className={land.step}><div className={land.stepNum}>4</div><h3>Начните продавать</h3><p>Добавьте товары и подключите оплату.</p></div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className={land.cta}>
        <h2>Готовы начать продавать?</h2>
        <p>Присоединяйтесь к платформе, где торговать может каждый.</p>
        <button className={`${land.btn} ${land.btnPrimary} ${land.btnLarge}`} onClick={handleEnter}>
          Начать бесплатно
        </button>
      </section>

      {/* ─── РАСШИРЕННЫЙ ПОДВАЛ ─── */}
      <footer className={land.footer}>
        <div className={land.footerTop}>
          <div className={land.footerCol}>
            <div className={land.footerBrand}>
              <img src={Logo} alt="Sellix" />
              <span>Sellix</span>
            </div>
            <p className={land.footerAbout}>
              Мультиарендная B2B2C-платформа электронной коммерции. Объединяем
              производителей, продавцов и покупателей по всей России.
            </p>
          </div>

          <div className={land.footerCol}>
            <h4>Платформа</h4>
            <button onClick={() => scrollTo("how")}>Как это работает</button>
            <button onClick={() => scrollTo("sellers")}>Для продавцов</button>
            <button onClick={() => scrollTo("producers")}>Для производителей</button>
            <button onClick={() => scrollTo("features")}>Возможности</button>
          </div>

          <div className={land.footerCol}>
            <h4>Поддержка</h4>
            <a href="mailto:support@mysellix.ru">support@mysellix.ru</a>
            <a href="tel:+78001234567">8 (800) 123-45-67</a>
            <span>Пн–Пт, 9:00–18:00 МСК</span>
            <button onClick={handleEnter}>Центр помощи</button>
          </div>

          <div className={land.footerCol}>
            <h4>Документы</h4>
            <button onClick={() => navigate("/legal/terms")}>Пользовательское соглашение</button>
            <button onClick={() => navigate("/legal/privacy")}>Политика конфиденциальности</button>
            <button onClick={() => navigate("/legal/offer")}>Договор оферты</button>
            <button onClick={() => navigate("/legal/sellers")}>Условия для продавцов</button>
          </div>

          <div className={land.footerCol}>
            <h4>Компания</h4>
            <span>ООО «Селликс»</span>
            <span>ИНН 7700000000</span>
            <span>г. Москва</span>
            <a href="#">Реквизиты</a>
          </div>
        </div>

        <div className={land.footerBottom}>
          <span>© 2025 Sellix. Все права защищены.</span>
          <div className={land.footerSocial}>
            <a href="#" aria-label="Telegram">Telegram</a>
            <a href="#" aria-label="VK">VKontakte</a>
            <a href="#" aria-label="YouTube">YouTube</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
