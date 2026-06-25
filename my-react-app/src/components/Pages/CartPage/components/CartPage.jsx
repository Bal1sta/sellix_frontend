import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CartPage.module.css";
import {
  getCartItems,
  removeFromCart,
  updateCartItemQuantity,
} from "../utils/cartStorage";
import { canCheckout, submitCheckout } from "../utils/checkout";
import { isAuthenticated } from "../../../../api/tokenStore.js";

function getItemWord(count) {
  if (count % 10 === 1 && count % 100 !== 11) return "товар";
  if (
    [2, 3, 4].includes(count % 10) &&
    ![12, 13, 14].includes(count % 100)
  ) {
    return "товара";
  }
  return "товаров";
}

export default function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState("");

  // Состояние оформления заказа.
  const [showCheckout, setShowCheckout] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [address, setAddress] = useState({
    full_name: "",
    phone: "",
    city: "",
    address_line: "",
    postal_code: "",
  });

  useEffect(() => {
    setCartItems(getCartItems());
  }, []);

  const updateAddressField = (field, value) =>
    setAddress((prev) => ({ ...prev, [field]: value }));

  const startCheckout = () => {
    setCheckoutError("");
    if (cartItems.length === 0) return;

    // Заказ оформляет только авторизованный покупатель (PRD 6.4).
    if (!isAuthenticated()) {
      navigate("/login", { state: { from: { pathname: "/cart" } } });
      return;
    }
    // Корзина должна быть привязана к товарам магазина из API.
    if (!canCheckout()) {
      setCheckoutError(
        "Эти товары добавлены в демо-режиме и не связаны с магазином. " +
          "Добавьте товары с витрины магазина, чтобы оформить заказ."
      );
      return;
    }
    setShowCheckout(true);
  };

  const confirmCheckout = async () => {
    const required = ["full_name", "phone", "city", "address_line"];
    const missing = required.filter((f) => !address[f].trim());
    if (missing.length > 0) {
      setCheckoutError("Заполните имя, телефон, город и адрес доставки.");
      return;
    }

    setPlacing(true);
    setCheckoutError("");
    try {
      await submitCheckout(address);
      setCartItems([]);
      setShowCheckout(false);
      navigate("/profile", { state: { tab: "orders", justOrdered: true } });
    } catch (err) {
      setCheckoutError(err.message || "Не удалось оформить заказ");
    } finally {
      setPlacing(false);
    }
  };

  const increaseQuantity = (id, selectedSize) => {
    const currentItem = cartItems.find(
      (item) =>
        item.id === id &&
        (item.selectedSize || "") === (selectedSize || "")
    );

    if (!currentItem) return;

    const updated = updateCartItemQuantity(
      id,
      selectedSize,
      currentItem.quantity + 1
    );

    setCartItems(updated);
  };

  const decreaseQuantity = (id, selectedSize) => {
    const currentItem = cartItems.find(
      (item) =>
        item.id === id &&
        (item.selectedSize || "") === (selectedSize || "")
    );

    if (!currentItem) return;

    const updated = updateCartItemQuantity(
      id,
      selectedSize,
      currentItem.quantity - 1
    );

    setCartItems(updated);
  };

  const handleRemoveItem = (id, selectedSize) => {
    const updated = removeFromCart(id, selectedSize);
    setCartItems(updated);
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
  }, [cartItems]);

  const shipping = subtotal > 0 ? 0 : 0;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;

  const formatPrice = (value) => `${value.toLocaleString("ru-RU")} ₽`;

  return (
    <section className={styles.page}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>Корзина</h1>
          <p className={styles.count}>
            {cartItems.length} {getItemWord(cartItems.length)} в вашем заказе
          </p>
        </div>

        <div className={styles.layout}>
          <div className={styles.itemsColumn}>
            {cartItems.length === 0 ? (
              <div className={styles.emptyState}>
                <h2>Корзина пуста</h2>
                <p>Добавьте товары в корзину, чтобы оформить заказ.</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <article
                  key={`${item.id}-${item.selectedSize || "no-size"}`}
                  className={styles.cartItem}
                >
                  <div className={styles.imageWrap}>
                    <img
                      className={styles.image}
                      src={item.image}
                      alt={item.title}
                    />
                  </div>

                  <div className={styles.itemInfo}>
                    <div className={styles.itemTop}>
                      <div>
                        <h2 className={styles.itemTitle}>{item.title}</h2>
                        <p className={styles.itemSubtitle}>{item.subtitle}</p>
                      </div>

                      <p className={styles.itemPrice}>
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <div className={styles.metaRow}>
                      <div className={styles.metaBlock}>
                        <span className={styles.metaLabel}>Размер</span>
                        <span className={styles.sizeValue}>
                          {item.selectedSize || "Без размера"}
                        </span>
                      </div>

                      <div className={styles.metaBlock}>
                        <span className={styles.metaLabel}>Количество</span>
                        <div className={styles.quantityBox}>
                          <button
                            type="button"
                            className={styles.quantityButton}
                            onClick={() =>
                              decreaseQuantity(item.id, item.selectedSize || "")
                            }
                          >
                            −
                          </button>

                          <span className={styles.quantityValue}>
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            className={styles.quantityButton}
                            onClick={() =>
                              increaseQuantity(item.id, item.selectedSize || "")
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.actionButton}
                        onClick={() =>
                          handleRemoveItem(item.id, item.selectedSize || "")
                        }
                      >
                        Удалить
                      </button>

                      <button type="button" className={styles.actionButton}>
                        В избранное
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          <aside className={styles.summary}>
            <h2 className={styles.summaryTitle}>Итог заказа</h2>

            <div className={styles.summaryRow}>
              <span>Сумма товаров</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Доставка</span>
              <span>{shipping === 0 ? "Бесплатно" : formatPrice(shipping)}</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Налог</span>
              <span>{formatPrice(tax)}</span>
            </div>

            <div className={styles.divider} />

            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Итого</span>
              <span>{formatPrice(total)}</span>
            </div>

            <div className={styles.promoBlock}>
              <label htmlFor="promo" className={styles.promoLabel}>
                Промокод
              </label>

              <div className={styles.promoRow}>
                <input
                  id="promo"
                  type="text"
                  className={styles.promoInput}
                  placeholder="Введите код"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />

                <button type="button" className={styles.applyButton}>
                  Применить
                </button>
              </div>
            </div>

            {checkoutError && (
              <div
                style={{
                  marginTop: 12,
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: "rgba(220,53,69,0.1)",
                  color: "rgb(176,0,32)",
                  fontSize: "0.75rem",
                }}
              >
                {checkoutError}
              </div>
            )}

            <button
              type="button"
              className={styles.checkoutButton}
              onClick={startCheckout}
              disabled={cartItems.length === 0 || placing}
            >
              Оформить заказ
            </button>
          </aside>
        </div>
      </div>

      {showCheckout && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            zIndex: 1000,
          }}
          onClick={() => !placing && setShowCheckout(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 460,
              background: "var(--color-white)",
              borderRadius: 16,
              padding: 28,
            }}
          >
            <h2 style={{ color: "var(--color-black)", fontSize: "1.3rem", marginBottom: 6 }}>
              Адрес доставки
            </h2>
            <p style={{ color: "rgb(110,110,120)", fontSize: "0.78rem", marginBottom: 18 }}>
              Укажите, куда доставить заказ. Стоимость доставки рассчитает
              служба доставки производителя.
            </p>

            {[
              { key: "full_name", label: "Имя и фамилия", type: "text" },
              { key: "phone", label: "Телефон", type: "tel" },
              { key: "city", label: "Город", type: "text" },
              { key: "address_line", label: "Адрес (улица, дом, кв.)", type: "text" },
              { key: "postal_code", label: "Индекс (необязательно)", type: "text" },
            ].map((f) => (
              <div key={f.key} style={{ marginBottom: 12 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.72rem",
                    color: "var(--color-black)",
                    marginBottom: 4,
                  }}
                >
                  {f.label}
                </label>
                <input
                  type={f.type}
                  value={address[f.key]}
                  onChange={(e) => updateAddressField(f.key, e.target.value)}
                  style={{
                    width: "100%",
                    padding: "11px 13px",
                    border: "1px solid var(--color-gray)",
                    borderRadius: 10,
                    fontSize: "0.85rem",
                    color: "var(--color-black)",
                    background: "var(--color-white)",
                  }}
                />
              </div>
            ))}

            {checkoutError && (
              <div
                style={{
                  marginTop: 8,
                  padding: "9px 13px",
                  borderRadius: 9,
                  background: "rgba(220,53,69,0.1)",
                  color: "rgb(176,0,32)",
                  fontSize: "0.74rem",
                }}
              >
                {checkoutError}
              </div>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <button
                type="button"
                onClick={() => setShowCheckout(false)}
                disabled={placing}
                style={{
                  flex: 1,
                  padding: 13,
                  borderRadius: 11,
                  border: "1px solid var(--color-gray)",
                  background: "var(--color-white)",
                  color: "var(--color-black)",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={confirmCheckout}
                disabled={placing}
                style={{
                  flex: 2,
                  padding: 13,
                  borderRadius: 11,
                  border: "none",
                  background: "var(--color-black)",
                  color: "var(--color-white)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: placing ? "not-allowed" : "pointer",
                  opacity: placing ? 0.6 : 1,
                }}
              >
                {placing ? "Оформляем…" : "Подтвердить заказ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}