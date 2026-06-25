import { useEffect, useState, useCallback } from "react";
import CabinetLayout from "./CabinetLayout.jsx";
import styles from "./Cabinet.module.css";
import * as producerApi from "../../../api/producer.js";
import * as sellerApi from "../../../api/seller.js";
import { listCategories } from "../../../api/storefront.js";
import { getMe, updateMe } from "../../../api/auth.js";
import { resolveMediaUrl } from "../../../config/runtime.js";

const TABS = [
  { key: "profile", label: "Профиль" },
  { key: "dashboard", label: "Дашборд" },
  { key: "products", label: "Товары" },
  { key: "pool", label: "Пул производителей" },
  { key: "shipments", label: "Отгрузки" },
  { key: "settings", label: "Настройки" },
];

const money = (v) => `${Number(v ?? 0).toLocaleString("ru-RU")} ₽`;
const asList = (d) => (Array.isArray(d) ? d : d?.results ?? []);

const PAYMENT_PROVIDERS = [
  { code: "yookassa", label: "ЮKassa" },
  { code: "tkassa", label: "Т-Касса" },
  { code: "cloudpayments", label: "CloudPayments" },
];
const DELIVERY_PROVIDERS = [
  { code: "cdek", label: "СДЭК" },
  { code: "pochta", label: "Почта России" },
  { code: "yandex_delivery", label: "Яндекс Доставка" },
  { code: "boxberry", label: "Boxberry" },
];

export default function ProducerCabinet() {
  const [tab, setTab] = useState("dashboard");
  return (
    <CabinetLayout title="Кабинет производителя" tabs={TABS} activeTab={tab} onTab={setTab}>
      {tab === "profile" && <ProfileTab />}
      {tab === "dashboard" && <DashboardTab />}
      {tab === "products" && <ProductsTab />}
      {tab === "pool" && <PoolTab />}
      {tab === "shipments" && <ShipmentsTab />}
      {tab === "settings" && <SettingsTab />}
    </CabinetLayout>
  );
}

// --- Профиль ---
function ProfileTab() {
  const [producer, setProducer] = useState(null);
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ company_name: "", inn: "", ogrn: "", contact_email: "", contact_phone: "" });
  const [selectedCats, setSelectedCats] = useState([]);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    Promise.all([
      producerApi.profile.get().catch(() => null),
      getMe().catch(() => null),
      listCategories().catch(() => []),
    ]).then(([p, u, cats]) => {
      setProducer(p);
      setUser(u);
      setCategories(asList(cats));
      if (p?.categories) setSelectedCats(p.categories.map(c => c.id));
      setLoading(false);
    });
  }, []);

  function toggleCat(id) {
    setSelectedCats(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length >= 3 ? prev : [...prev, id]);
  }

  async function create() {
    setError("");
    try {
      const p = await producerApi.profile.create({ ...form, category_ids: selectedCats });
      setProducer(p);
      setMsg("Профиль создан");
    } catch (e) { setError(e.message); }
  }

  async function update() {
    setError("");
    try {
      const p = await producerApi.profile.update({ category_ids: selectedCats });
      setProducer(p);
      setMsg("Обновлено");
    } catch (e) { setError(e.message); }
  }

  if (loading) return <div className={styles.empty}>Загрузка…</div>;

  if (!producer) {
    return (
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Создайте профиль компании</h2>
        <div className={styles.field}><label>Название компании</label><input value={form.company_name} onChange={e => setForm({...form, company_name: e.target.value})} /></div>
        <div className={styles.row}>
          <div className={styles.field}><label>ИНН</label><input value={form.inn} onChange={e => setForm({...form, inn: e.target.value})} /></div>
          <div className={styles.field}><label>ОГРН/ОГРНИП</label><input value={form.ogrn} onChange={e => setForm({...form, ogrn: e.target.value})} /></div>
        </div>
        <div className={styles.field}>
          <label>Категории продукции (до 3)</label>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:6}}>
            {categories.map(c => (
              <label key={c.id} style={{display:"flex",gap:6,fontSize:"0.82rem",color:"var(--color-black)",cursor:"pointer"}}>
                <input type="checkbox" checked={selectedCats.includes(c.id)} onChange={() => toggleCat(c.id)} />
                {c.name}
              </label>
            ))}
          </div>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <button className={styles.btn} onClick={create}>Создать профиль</button>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>{producer.company_name}</h2>
      <p className={styles.muted}>Статус: <StatusBadge status={producer.status} /> · ИНН: {producer.inn || "—"}</p>
      <p className={styles.muted}>Категории: {(producer.categories || []).map(c => c.name).join(", ") || "—"}</p>
      {user && <p className={styles.muted}>Email: {user.email}</p>}
      <div className={styles.field} style={{marginTop:14}}>
        <label>Изменить категории (до 3)</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:6}}>
          {categories.map(c => (
            <label key={c.id} style={{display:"flex",gap:6,fontSize:"0.82rem",color:"var(--color-black)",cursor:"pointer"}}>
              <input type="checkbox" checked={selectedCats.includes(c.id)} onChange={() => toggleCat(c.id)} />
              {c.name}
            </label>
          ))}
        </div>
      </div>
      {error && <div className={styles.error}>{error}</div>}
      {msg && <div className={styles.success}>{msg}</div>}
      <button className={styles.btnGhost} onClick={update} style={{marginTop:10}}>Сохранить категории</button>
    </div>
  );
}

// --- Дашборд ---
function DashboardTab() {
  const [shipments, setShipments] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      producerApi.shipments.list().catch(() => []),
      producerApi.listProducerPayouts().catch(() => []),
    ]).then(([s, p]) => { setShipments(asList(s)); setPayouts(asList(p)); setLoading(false); });
  }, []);

  if (loading) return <div className={styles.empty}>Загрузка…</div>;

  const pending = shipments.filter(s => s.status === "pending").length;
  const assembling = shipments.filter(s => s.status === "assembling").length;
  const totalPayout = payouts.reduce((s, p) => s + Number(p.amount || 0), 0);

  return (
    <div className={styles.statGrid}>
      <div className={styles.stat}><div className={styles.statLabel}>Ожидают сборки</div><div className={styles.statValue}>{pending}</div></div>
      <div className={styles.stat}><div className={styles.statLabel}>На сборке</div><div className={styles.statValue}>{assembling}</div></div>
      <div className={styles.stat}><div className={styles.statLabel}>Всего отгрузок</div><div className={styles.statValue}>{shipments.length}</div></div>
      <div className={styles.stat}><div className={styles.statLabel}>Выплаты (итого)</div><div className={styles.statValue}>{money(totalPayout)}</div></div>
    </div>
  );
}

// --- Товары с per-product оплатой/доставкой ---
function ProductsTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(asList(await producerApi.products.list())); } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className={styles.empty}>Загрузка…</div>;

  return (
    <>
      {error && <div className={styles.error}>{error}</div>}
      <button className={styles.btn} style={{marginBottom:16}} onClick={() => setShowForm(v => !v)}>{showForm ? "Закрыть форму" : "Добавить товар"}</button>
      {showForm && <NewProductForm onCreated={load} />}
      {items.length === 0 ? <div className={styles.empty}>Товаров пока нет.</div> : (
        <div className={styles.grid}>
          {items.map(p => <ProductCard key={p.id} product={p} onChange={load} />)}
        </div>
      )}
    </>
  );
}

function NewProductForm({ onCreated }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    category: "", name: "", description: "", base_price: "", stock: "", weight_grams: "",
    allowed_payment_providers: [], allowed_delivery_providers: [],
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    listCategories().then(d => { const l = asList(d); setCategories(l); if (l[0]) setForm(f => ({...f, category: l[0].id})); }).catch(() => {});
  }, []);

  function toggleProv(field, code) {
    setForm(f => {
      const cur = f[field] || [];
      return {...f, [field]: cur.includes(code) ? cur.filter(c => c !== code) : [...cur, code]};
    });
  }

  async function submit() {
    setBusy(true); setError("");
    try {
      await producerApi.products.create({
        category: form.category, name: form.name, description: form.description,
        base_price: Number(form.base_price), stock: Number(form.stock),
        weight_grams: Number(form.weight_grams),
        allowed_payment_providers: form.allowed_payment_providers,
        allowed_delivery_providers: form.allowed_delivery_providers,
      });
      setForm(f => ({...f, name: "", description: "", base_price: "", stock: "", weight_grams: "", allowed_payment_providers: [], allowed_delivery_providers: []}));
      onCreated();
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>Новый товар</h2>
      <div className={styles.field}><label>Категория</label><select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
      <div className={styles.field}><label>Название</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
      <div className={styles.field}><label>Описание</label><textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
      <div className={styles.row}>
        <div className={styles.field}><label>Цена (отпускная), ₽</label><input type="number" value={form.base_price} onChange={e => setForm({...form, base_price: e.target.value})} /></div>
        <div className={styles.field}><label>Остаток, шт.</label><input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} /></div>
        <div className={styles.field}><label>Вес, г</label><input type="number" value={form.weight_grams} onChange={e => setForm({...form, weight_grams: e.target.value})} /></div>
      </div>

      <div className={styles.field}>
        <label>Способы оплаты для этого товара</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:10,marginTop:6}}>
          {PAYMENT_PROVIDERS.map(p => (
            <label key={p.code} style={{display:"flex",gap:6,fontSize:"0.82rem",color:"var(--color-black)",cursor:"pointer"}}>
              <input type="checkbox" checked={(form.allowed_payment_providers||[]).includes(p.code)} onChange={() => toggleProv("allowed_payment_providers", p.code)} />
              {p.label}
            </label>
          ))}
        </div>
        <p className={styles.muted} style={{marginTop:4}}>Не выбрано ни одного = все доступны</p>
      </div>

      <div className={styles.field}>
        <label>Службы доставки для этого товара</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:10,marginTop:6}}>
          {DELIVERY_PROVIDERS.map(p => (
            <label key={p.code} style={{display:"flex",gap:6,fontSize:"0.82rem",color:"var(--color-black)",cursor:"pointer"}}>
              <input type="checkbox" checked={(form.allowed_delivery_providers||[]).includes(p.code)} onChange={() => toggleProv("allowed_delivery_providers", p.code)} />
              {p.label}
            </label>
          ))}
        </div>
        <p className={styles.muted} style={{marginTop:4}}>Не выбрано ни одного = все доступны</p>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      <button className={styles.btn} onClick={submit} disabled={busy}>{busy ? "Сохраняем…" : "Создать товар"}</button>
    </div>
  );
}

function ProductCard({ product, onChange }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const img = product.images?.[0]?.image;

  async function uploadImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setError("");
    try { await producerApi.products.addImage(product.id, file); onChange(); } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  async function publish() {
    setError("");
    try { await producerApi.products.publish(product.id); onChange(); } catch (e) { setError(e.message); }
  }

  return (
    <div className={styles.productCard}>
      {img ? <img className={styles.productThumb} src={resolveMediaUrl(img)} alt="" /> : <div className={styles.productThumb} />}
      <div className={styles.productBody}>
        <div className={styles.productName}>{product.name}</div>
        <p className={styles.muted}>{money(product.base_price)} · остаток {product.stock} · <StatusBadge status={product.status} /></p>
        {(product.allowed_payment_providers?.length > 0 || product.allowed_delivery_providers?.length > 0) && (
          <p className={styles.muted} style={{marginTop:4}}>
            Оплата: {product.allowed_payment_providers?.join(", ") || "все"} · Доставка: {product.allowed_delivery_providers?.join(", ") || "все"}
          </p>
        )}
        {error && <div className={styles.error}>{error}</div>}
        <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:10}}>
          <label className={styles.btnGhost} style={{textAlign:"center",cursor:"pointer"}}>{busy ? "Загрузка…" : "Добавить фото"}<input type="file" accept="image/*" hidden onChange={uploadImage} /></label>
          {product.status === "draft" && <button className={styles.btnGhost} onClick={publish}>Опубликовать</button>}
        </div>
      </div>
    </div>
  );
}

// --- Пул производителей (доступ производителя к общему каталогу) ---
function PoolTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    sellerApi.browsePool({ page_size: 50 }).then(d => setItems(asList(d))).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.empty}>Загрузка…</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (items.length === 0) return <div className={styles.empty}>В общем пуле нет товаров.</div>;

  return (
    <div className={styles.grid}>
      {items.map(p => (
        <div key={p.id} className={styles.productCard}>
          <img className={styles.productThumb} src={p.images?.[0]?.image ? resolveMediaUrl(p.images[0].image) : ""} alt="" />
          <div className={styles.productBody}>
            <div className={styles.productName}>{p.name}</div>
            <p className={styles.muted}>{p.producer_name}</p>
            <div className={styles.productPrice}>{money(p.base_price)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Отгрузки ---
function ShipmentsTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(asList(await producerApi.shipments.list())); } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function act(id, action) {
    setError("");
    try { await producerApi.shipments[action](id); await load(); } catch (e) { setError(e.message); }
  }

  if (loading) return <div className={styles.empty}>Загрузка…</div>;
  if (items.length === 0) return <div className={styles.empty}>Отгрузок пока нет.</div>;

  return (
    <>
      {error && <div className={styles.error}>{error}</div>}
      <table className={styles.table}>
        <thead><tr><th>Статус</th><th>Служба</th><th>Трек</th><th>Действия</th></tr></thead>
        <tbody>
          {items.map(s => (
            <tr key={s.id}>
              <td><StatusBadge status={s.status} /></td>
              <td>{s.delivery_provider || "—"}</td>
              <td className={styles.muted}>{s.tracking_number || "—"}</td>
              <td style={{display:"flex",gap:8}}>
                {s.status === "pending" && <button className={styles.btnGhost} onClick={() => act(s.id, "assemble")}>В сборку</button>}
                {(s.status === "assembling" || s.status === "pending") && <button className={styles.btnGhost} onClick={() => act(s.id, "ship")}>Отправить</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

// --- Настройки (реквизиты + выплаты) ---
function SettingsTab() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    producerApi.listProducerPayouts().then(d => setPayouts(asList(d))).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.empty}>Загрузка…</div>;

  return (
    <>
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Реквизиты и платёжные настройки</h2>
        <p className={styles.muted}>Реквизиты для получения выплат настраиваются в профиле компании. Платёжные системы подключаются через вкладку «Профиль».</p>
      </div>
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

function StatusBadge({ status, label }) {
  const map = { approved: styles.badgeGreen, published: styles.badgeGreen, paid: styles.badgeGreen, delivered: styles.badgeGreen, shipped: styles.badgeGreen, draft: styles.badgeGray, pending: styles.badgeYellow, assembling: styles.badgeYellow, in_transit: styles.badgeYellow, processing: styles.badgeYellow, out_of_stock: styles.badgeYellow, blocked: styles.badgeRed, failed: styles.badgeRed, cancelled: styles.badgeRed, archived: styles.badgeGray };
  return <span className={`${styles.badge} ${map[status] || styles.badgeGray}`}>{label || status}</span>;
}
