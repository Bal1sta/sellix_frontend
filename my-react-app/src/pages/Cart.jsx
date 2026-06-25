import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../shared/Navbar.jsx";
import s from "../shared/styles.module.css";
import { getCartItems, removeFromCart, updateCartItemQuantity, clearCart, getCartStoreSlug } from "../components/Pages/CartPage/utils/cartStorage.js";
import { isAuthenticated } from "../api/tokenStore.js";
import { checkout, sandboxConfirmPayment } from "../api/orders.js";

const money = v => `${Number(v??0).toLocaleString("ru-RU")} ₽`;

export default function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [address, setAddress] = useState({ full_name:"", phone:"", city:"", address_line:"", postal_code:"" });

  useEffect(() => { setItems(getCartItems()); }, []);

  const total = items.reduce((s,i) => s + i.price * i.quantity, 0);

  function remove(id) { removeFromCart(id); setItems(getCartItems()); }
  function changeQty(id, delta) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const newQty = Math.max(1, Math.min(item.stock || 99, item.quantity + delta));
    updateCartItemQuantity(id, newQty);
    setItems(getCartItems());
  }

  function startCheckout() {
    setError("");
    if (items.length === 0) return;
    if (!isAuthenticated()) { navigate("/login", { state: { from: { pathname: "/cart" } } }); return; }
    const slug = getCartStoreSlug();
    const hasApi = slug && items.every(i => i.storeProductId);
    if (!hasApi) { setError("Товары добавлены в демо-режиме. Добавьте товары с витрины магазина."); return; }
    setShowCheckout(true);
  }

  async function confirmCheckout() {
    const missing = ["full_name","phone","city","address_line"].filter(f => !address[f].trim());
    if (missing.length) { setError("Заполните имя, телефон, город и адрес."); return; }
    setPlacing(true); setError("");
    try {
      const slug = getCartStoreSlug();
      const mapped = items.filter(i=>i.storeProductId).map(i=>({ store_product_id: i.storeProductId, quantity: i.quantity }));
      const result = await checkout({ store_slug: slug, address, items: mapped });
      // sandbox auto-confirm
      const payment = result?.payment;
      if (payment?.id && payment.status === "pending") {
        const isSandbox = !payment.confirmation_url || payment.confirmation_url.includes("sandbox");
        if (isSandbox) try { await sandboxConfirmPayment(payment.id); } catch {}
      }
      clearCart(); setItems([]); setShowCheckout(false);
      navigate("/profile", { replace: true });
    } catch (err) { setError(err.message || "Ошибка оформления"); }
    finally { setPlacing(false); }
  }

  return (
    <div className={s.shell}>
      <Navbar />
      <div className={s.cartWrap}>
        <h1 className={s.cabinetTitle}>Корзина</h1>
        {items.length === 0 ? (
          <div className={s.empty}>Корзина пуста. <Link to="/" style={{color:"var(--color-black)"}}>На главную</Link></div>
        ) : (
          <>
            {items.map(item => (
              <div key={item.id} className={s.cartItem}>
                <img src={item.image || ""} alt="" className={s.cartImg} />
                <div className={s.cartInfo}>
                  <h3>{item.title}</h3>
                  <p>{money(item.price)}</p>
                </div>
                <div className={s.cartQty}>
                  <button className={s.cartQtyBtn} onClick={() => changeQty(item.id, -1)}>−</button>
                  <span style={{color:"var(--color-black)",fontSize:".9rem"}}>{item.quantity}</span>
                  <button className={s.cartQtyBtn} onClick={() => changeQty(item.id, 1)}>+</button>
                </div>
                <button className={s.cartRemove} onClick={() => remove(item.id)}>Удалить</button>
              </div>
            ))}
            <div className={s.cartSummary}>
              <span className={s.cartTotal}>Итого: {money(total)}</span>
              <button className={s.btn} onClick={startCheckout} disabled={placing}>Оформить заказ</button>
            </div>
            {error && <div className={s.error}>{error}</div>}
          </>
        )}
      </div>

      {showCheckout && (
        <div className={s.modalOverlay} onClick={() => !placing && setShowCheckout(false)}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <h2 className={s.cardTitle}>Адрес доставки</h2>
            <p className={s.muted} style={{marginBottom:16}}>Укажите, куда доставить заказ.</p>
            {[
              {key:"full_name",label:"Имя и фамилия",type:"text"},
              {key:"phone",label:"Телефон",type:"tel"},
              {key:"city",label:"Город",type:"text"},
              {key:"address_line",label:"Адрес",type:"text"},
              {key:"postal_code",label:"Индекс (необязательно)",type:"text"},
            ].map(f => (
              <div key={f.key} className={s.field}><label>{f.label}</label><input type={f.type} value={address[f.key]} onChange={e=>setAddress(prev=>({...prev,[f.key]:e.target.value}))} /></div>
            ))}
            {error && <div className={s.error}>{error}</div>}
            <div className={s.modalActions}>
              <button className={s.modalCancel} onClick={() => setShowCheckout(false)} disabled={placing}>Отмена</button>
              <button className={s.modalConfirm} onClick={confirmCheckout} disabled={placing}>{placing ? "Оформляем…" : "Подтвердить"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
