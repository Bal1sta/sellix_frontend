import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CabinetShell from "./_CabinetShell.jsx";
import styles from "../shared/styles.module.css";
import * as sellerApi from "../api/seller.js";
import { getProducerProfile, getProducerProducts } from "../api/producer.js";
import { resolveMediaUrl } from "../config/runtime.js";
import StorePreview from "./StorePreview.jsx";

const TABS = [
  { key: "dashboard", label: "Дашборд" },
  { key: "catalog", label: "Товары" },
  { key: "pool", label: "Пул производителей" },
  { key: "orders", label: "Заказы" },
  { key: "promotions", label: "Акции" },
  { key: "integrations", label: "Настройки" },
  { key: "store", label: "Магазин" },
];

const money = (v) => `${Number(v ?? 0).toLocaleString("ru-RU")} ₽`;
const asList = (d) => (Array.isArray(d) ? d : d?.results ?? []);

export default function SellerCabinet() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("dashboard");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    sellerApi.store.get()
      .then(() => setReady(true))
      .catch(() => navigate("/seller/create", { replace: true }));
  }, [navigate]);

  if (!ready) return <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-black)" }}>Загрузка…</div>;

  return (
    <CabinetShell title="Кабинет продавца" tabs={TABS} activeTab={tab} onTab={setTab}>
      {tab === "dashboard" && <DashboardTab />}
      {tab === "catalog" && <StoreProductsTab />}
      {tab === "pool" && <PoolTab />}
      {tab === "orders" && <OrdersTab />}
      {tab === "promotions" && <PromotionsStub />}
      {tab === "integrations" && <SettingsTab />}
      {tab === "store" && <StorePreview />}
    </CabinetShell>
  );
}

// --- Дашборд ---
function DashboardTab() {
  const [store, setStore] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      sellerApi.store.get().catch(() => null),
      sellerApi.listSellerOrders().catch(() => []),
    ]).then(([s, o]) => {
      setStore(s);
      setOrders(asList(o));
      setLoading(false);
    });
  }, []);

  if (loading) return <div className={styles.empty}>Загрузка…</div>;

  const total = orders.reduce((s, o) => s + Number(o.grand_total || 0), 0);
  const active = orders.filter((o) => !["completed", "cancelled"].includes(o.status)).length;

  return (
    <>
      {!store ? (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Магазин не создан</h2>
          <p className={styles.muted}>Перейдите во вкладку «Редактирование сайта», чтобы создать магазин.</p>
        </div>
      ) : (
        <>
          <div className={styles.statGrid}>
            <div className={styles.stat}><div className={styles.statLabel}>Выручка</div><div className={styles.statValue}>{money(total)}</div></div>
            <div className={styles.stat}><div className={styles.statLabel}>Всего заказов</div><div className={styles.statValue}>{orders.length}</div></div>
            <div className={styles.stat}><div className={styles.statLabel}>Активные</div><div className={styles.statValue}>{active}</div></div>
            <div className={styles.stat}><div className={styles.statLabel}>Статус магазина</div><div className={styles.statValue}><StatusBadge status={store.status} /></div></div>
          </div>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>{store.name}</h2>
            <p className={styles.muted}>Витрина: /shop/{store.slug}</p>
          </div>
        </>
      )}
    </>
  );
}

// --- Товары магазина ---
function StoreProductsTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(asList(await sellerApi.storeProducts.list())); } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function save(item, patch) {
    setError("");
    try { await sellerApi.storeProducts.update(item.id, patch); await load(); } catch (e) { setError(e.message); }
  }

  if (loading) return <div className={styles.empty}>Загрузка…</div>;
  if (items.length === 0) return <div className={styles.empty}>Пока нет товаров. Добавьте из «Пул производителей».</div>;

  return (
    <>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.grid}>
        {items.map((sp) => <StoreProductCard key={sp.id} sp={sp} onSave={save} />)}
      </div>
    </>
  );
}

function StoreProductCard({ sp, onSave }) {
  const [markup, setMarkup] = useState(sp.markup_percent ?? "");
  const [visible, setVisible] = useState(sp.is_visible);
  const img = sp.product?.images?.[0]?.image;
  return (
    <div className={styles.productCard}>
      <img className={styles.productThumb} src={img ? resolveMediaUrl(img) : ""} alt="" />
      <div className={styles.productBody}>
        <div className={styles.productName}>{sp.product?.name}</div>
        <p className={styles.muted}>Закупка: {money(sp.product?.base_price)} · Розница: {money(sp.retail_price)}</p>
        <div className={styles.field} style={{marginTop:10}}><label>Наценка, %</label><input type="number" value={markup} onChange={(e) => setMarkup(e.target.value)} /></div>
        <label style={{display:"flex",gap:8,fontSize:"0.78rem",color:"var(--color-black)",marginBottom:10}}>
          <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} /> Показывать на витрине
        </label>
        <button className={styles.btnGhost} onClick={() => onSave(sp, { markup_percent: markup === "" ? null : Number(markup), is_visible: visible })}>Сохранить</button>
      </div>
    </div>
  );
}

// --- Пул производителей (с кликабельными профилями) ---
function PoolTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [selectedProducer, setSelectedProducer] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(asList(await sellerApi.browsePool({ page_size: 50 }))); } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function add(productId) {
    setError(""); setMsg("");
    try { await sellerApi.storeProducts.add(productId); setMsg("Товар добавлен (скрыт, задайте наценку)"); } catch (e) { setError(e.message); }
  }

  async function openProducer(producerId) {
    try {
      const [profile, products] = await Promise.all([
        getProducerProfile(producerId),
        getProducerProducts(producerId),
      ]);
      setSelectedProducer({ profile, products });
    } catch (e) { setError(e.message); }
  }

  // Модальное окно профиля производителя
  if (selectedProducer) {
    const { profile, products } = selectedProducer;
    return (
      <>
        <button className={styles.btnGhost} onClick={() => setSelectedProducer(null)} style={{marginBottom:16}}>← Назад к каталогу</button>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>{profile.company_name}</h2>
          <p className={styles.muted}>
            Категории: {(profile.categories || []).map(c => c.name).join(", ") || "—"} · Товаров: {profile.product_count}
          </p>
          {profile.contact_email && <p className={styles.muted}>Email: {profile.contact_email}</p>}
        </div>
        <h3 className={styles.cardTitle} style={{marginTop:16}}>Товары производителя</h3>
        {error && <div className={styles.error}>{error}</div>}
        {msg && <div className={styles.success}>{msg}</div>}
        <div className={styles.grid}>
          {products.map(p => (
            <div key={p.id} className={styles.productCard}>
              <img className={styles.productThumb} src={p.images?.[0]?.image ? resolveMediaUrl(p.images[0].image) : ""} alt="" />
              <div className={styles.productBody}>
                <div className={styles.productName}>{p.name}</div>
                <div className={styles.productPrice}>{money(p.base_price)}</div>
                <button className={styles.btnGhost} onClick={() => add(p.id)} style={{marginTop:8}}>Добавить в магазин</button>
              </div>
            </div>
          ))}
          {products.length === 0 && <div className={styles.empty}>У производителя нет товаров.</div>}
        </div>
      </>
    );
  }

  if (loading) return <div className={styles.empty}>Загрузка…</div>;

  return (
    <>
      {error && <div className={styles.error}>{error}</div>}
      {msg && <div className={styles.success}>{msg}</div>}
      {items.length === 0 ? (
        <div className={styles.empty}>В общем пуле нет опубликованных товаров.</div>
      ) : (
        <div className={styles.grid}>
          {items.map(p => (
            <div key={p.id} className={styles.productCard}>
              <img className={styles.productThumb} src={p.images?.[0]?.image ? resolveMediaUrl(p.images[0].image) : ""} alt="" />
              <div className={styles.productBody}>
                <div className={styles.productName}>{p.name}</div>
                <button type="button" onClick={() => openProducer(p.producer_id || p.producer)} style={{background:"none",border:"none",padding:0,color:"rgb(60,120,200)",fontSize:"0.78rem",cursor:"pointer",textAlign:"left"}}>{p.producer_name}</button>
                <div className={styles.productPrice} style={{margin:"8px 0"}}>{money(p.base_price)}</div>
                <button className={styles.btnGhost} onClick={() => add(p.id)}>Добавить в магазин</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// --- Заказы ---
function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { sellerApi.listSellerOrders().then(d => setOrders(asList(d))).finally(() => setLoading(false)); }, []);
  if (loading) return <div className={styles.empty}>Загрузка…</div>;
  if (orders.length === 0) return <div className={styles.empty}>Заказов пока нет.</div>;
  return (
    <table className={styles.table}>
      <thead><tr><th>Номер</th><th>Статус</th><th>Сумма</th><th>Дата</th></tr></thead>
      <tbody>
        {orders.map(o => (
          <tr key={o.id}><td>{o.number}</td><td><StatusBadge status={o.status} label={o.status_display} /></td><td>{money(o.grand_total)}</td><td className={styles.muted}>{new Date(o.created_at).toLocaleDateString("ru-RU")}</td></tr>
        ))}
      </tbody>
    </table>
  );
}

// --- Акции (UI-заглушка) ---
function PromotionsStub() {
  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>Акции и скидки</h2>
      <p className={styles.muted}>Раздел находится в разработке. Здесь вы сможете создавать промокоды, задавать процентные и фиксированные скидки на отдельные товары или категории.</p>
      <div className={styles.empty} style={{marginTop: 24}}>🎁 Скоро</div>
    </div>
  );
}

// --- Настройки (интеграции + выплаты) ---
// --- Настройки: магазин (название/публикация) + интеграции + выплаты ---
function SettingsTab() {
  const [store, setStore] = useState(null);
  const [items, setItems] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ kind: "payment", provider: "yookassa" });
  const [storeForm, setStoreForm] = useState({ name: "", description: "", contact_email: "", contact_phone: "" });

  const load = useCallback(async () => {
    try {
      const [st, integ, pay] = await Promise.all([
        sellerApi.store.get(),
        sellerApi.integrations.list(),
        sellerApi.listSellerPayouts(),
      ]);
      setStore(st);
      setStoreForm({
        name: st.name || "",
        description: st.description || "",
        contact_email: st.contact_email || "",
        contact_phone: st.contact_phone || "",
      });
      setItems(asList(integ));
      setPayouts(asList(pay));
    } catch (e) { setError(e.message); }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Сохранение настроек магазина — название сразу отразится в превью «Магазин»
  async function saveStore() {
    setBusy(true); setError(""); setMsg("");
    try {
      const updated = await sellerApi.store.update(storeForm);
      setStore(updated);
      setMsg("Настройки магазина сохранены");
      setTimeout(() => setMsg(""), 2500);
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  async function publish() {
    setBusy(true); setError(""); setMsg("");
    try {
      const updated = await sellerApi.store.publish();
      setStore(updated);
      setMsg("Магазин опубликован");
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  async function connect() {
    setError("");
    try { await sellerApi.integrations.create({ kind: form.kind, provider: form.provider, credentials: {} }); await load(); } catch (e) { setError(e.message); }
  }

  const paymentProviders = [["yookassa","ЮKassa"],["tkassa","Т-Касса"],["cloudpayments","CloudPayments"]];
  const deliveryProviders = [["cdek","СДЭК"],["pochta","Почта России"],["yandex_delivery","Яндекс Доставка"],["boxberry","Boxberry"]];
  const providers = form.kind === "payment" ? paymentProviders : deliveryProviders;

  return (
    <>
      {/* Настройки магазина */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Настройки магазина</h2>
        {store && (
          <p className={styles.muted} style={{ marginBottom: 14 }}>
            Шаблон витрины: {NICHE_LABELS[store.niche] || store.niche} · Адрес: /shop/{store.slug}
          </p>
        )}
        <div className={styles.field}>
          <label>Название магазина</label>
          <input value={storeForm.name} onChange={e => setStoreForm({ ...storeForm, name: e.target.value })} />
        </div>
        <div className={styles.field}>
          <label>Описание</label>
          <textarea rows={2} value={storeForm.description} onChange={e => setStoreForm({ ...storeForm, description: e.target.value })} />
        </div>
        <div className={styles.row}>
          <div className={styles.field}><label>Контактный email</label><input value={storeForm.contact_email} onChange={e => setStoreForm({ ...storeForm, contact_email: e.target.value })} /></div>
          <div className={styles.field}><label>Телефон</label><input value={storeForm.contact_phone} onChange={e => setStoreForm({ ...storeForm, contact_phone: e.target.value })} /></div>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {msg && <div className={styles.success}>{msg}</div>}
        <button className={styles.btn} onClick={saveStore} disabled={busy}>{busy ? "Сохраняем…" : "Сохранить настройки"}</button>
      </div>

      {/* Публикация магазина */}
      {store && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Публикация</h2>
          <p className={styles.muted}>
            Статус: <StatusBadge status={store.status} /> · Активная оплата: {store.has_active_payment ? "да" : "нет"}
          </p>
          {store.status !== "published" ? (
            <>
              <p className={styles.muted} style={{ marginTop: 8 }}>
                Для публикации нужен минимум один видимый товар и подключённая оплата.
              </p>
              <button className={styles.btn} onClick={publish} disabled={busy || !store.can_publish} style={{ marginTop: 12 }}>
                Опубликовать магазин
              </button>
            </>
          ) : (
            <p className={styles.success} style={{ marginTop: 8 }}>Магазин опубликован и доступен покупателям.</p>
          )}
        </div>
      )}

      {/* Интеграции */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Оплата и доставка</h2>
        <div className={styles.row}>
          <div className={styles.field}><label>Тип</label><select value={form.kind} onChange={e => setForm({ kind: e.target.value, provider: e.target.value === "payment" ? "yookassa" : "cdek" })}><option value="payment">Оплата</option><option value="delivery">Доставка</option></select></div>
          <div className={styles.field}><label>Провайдер</label><select value={form.provider} onChange={e => setForm({...form, provider: e.target.value})}>{providers.map(([v,l]) => <option key={v} value={v}>{l}</option>)}</select></div>
        </div>
        <button className={styles.btn} onClick={connect} style={{marginTop:10}}>Подключить</button>
      </div>
      <table className={styles.table}>
        <thead><tr><th>Тип</th><th>Провайдер</th><th>Статус</th><th></th></tr></thead>
        <tbody>
          {items.map(i => (
            <tr key={i.id}><td>{i.kind === "payment" ? "Оплата" : "Доставка"}</td><td>{i.provider}</td><td><StatusBadge status={i.status} /></td><td><button className={styles.btnGhost} onClick={async () => { await sellerApi.integrations.verify(i.id); load(); }}>Проверить</button></td></tr>
          ))}
        </tbody>
      </table>

      {payouts.length > 0 && (
        <>
          <h2 className={styles.cardTitle} style={{marginTop:24}}>Выплаты</h2>
          <table className={styles.table}>
            <thead><tr><th>Заказ</th><th>Сумма</th><th>Статус</th></tr></thead>
            <tbody>{payouts.map(p => <tr key={p.id}><td>{p.order_number}</td><td>{money(p.amount)}</td><td><StatusBadge status={p.status} /></td></tr>)}</tbody>
          </table>
        </>
      )}
    </>
  );
}

const NICHE_LABELS = {
  clothing: "Одежда и обувь", electronics: "Электроника", home: "Товары для дома",
  beauty: "Красота и здоровье", food: "Продукты питания", kids: "Детские товары", other: "Универсальный",
};

function StatusBadge({ status, label }) {
  const map = { published: styles.badgeGreen, active: styles.badgeGreen, approved: styles.badgeGreen, paid: styles.badgeGreen, completed: styles.badgeGreen, delivered: styles.badgeGreen, draft: styles.badgeGray, not_connected: styles.badgeGray, pending: styles.badgeYellow, processing: styles.badgeYellow, error: styles.badgeRed, blocked: styles.badgeRed, failed: styles.badgeRed, cancelled: styles.badgeRed };
  return <span className={`${styles.badge} ${map[status] || styles.badgeGray}`}>{label || status}</span>;
}
