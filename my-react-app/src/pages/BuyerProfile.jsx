import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../shared/Navbar.jsx";
import StatusBadge from "../shared/StatusBadge.jsx";
import s from "../shared/styles.module.css";
import { getMe, updateMe } from "../api/auth.js";
import { useAuth } from "../auth/AuthContext.jsx";
import { listBuyerOrders } from "../api/orders.js";

const money = v => `${Number(v ?? 0).toLocaleString("ru-RU")} ₽`;
const asList = d => Array.isArray(d) ? d : d?.results ?? [];

const ROLE_LABELS = {
  buyer: "Покупатель",
  seller: "Продавец",
  producer: "Производитель",
  admin: "Администратор",
};

export default function UserProfile() {
  const { role } = useAuth();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ full_name: "", phone: "" });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getMe().then(u => {
      setUser(u);
      setForm({ full_name: u.full_name || "", phone: u.phone || "" });
    });
    // Покупатели и продавцы могут видеть заказы
    if (role === "buyer" || role === "seller" || !role) {
      listBuyerOrders().then(d => setOrders(asList(d))).catch(() => {});
    }
  }, [role]);

  async function save() {
    setError(""); setMsg("");
    try {
      const u = await updateMe(form);
      setUser(u); setMsg("Сохранено");
      setTimeout(() => setMsg(""), 2500);
    } catch (e) { setError(e.message); }
  }

  if (!user) return <div className={s.shell}><Navbar /><div className={s.empty}>Загрузка…</div></div>;

  const cabinetLink = role === "seller" ? "/seller" : role === "producer" ? "/producer" : role === "admin" ? "/admin" : null;
  const cabinetLabel = role === "seller" ? "Управление магазином" : role === "producer" ? "Управление товарами" : role === "admin" ? "Панель администратора" : null;

  return (
    <div className={s.shell}>
      <Navbar />
      <div className={s.cabinetBody}>
        <h1 className={s.cabinetTitle}>Мой профиль</h1>

        <div className={s.card}>
          <h2 className={s.cardTitle}>Личные данные</h2>
          <p className={s.muted}>
            Email: {user.email || "—"} · Роль: {ROLE_LABELS[user.role] || user.role || "не выбрана"}
          </p>

          <div className={s.field} style={{ marginTop: 16 }}>
            <label>Имя и фамилия</label>
            <input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
          </div>
          <div className={s.field}>
            <label>Телефон</label>
            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>

          {error && <div className={s.error}>{error}</div>}
          {msg && <div className={s.success}>{msg}</div>}
          <button className={s.btn} onClick={save}>Сохранить</button>
        </div>

        {/* Ссылка на кабинет (магазин / товары / админ) */}
        {cabinetLink && (
          <div className={s.card}>
            <Link to={cabinetLink} style={{ color: "var(--color-black)", fontSize: ".95rem", fontWeight: 600 }}>
              → {cabinetLabel}
            </Link>
          </div>
        )}

        {/* История заказов — для покупателей */}
        {orders.length > 0 && (
          <>
            <h2 className={s.cardTitle} style={{ marginTop: 24 }}>История заказов</h2>
            <table className={s.table}>
              <thead><tr><th>Номер</th><th>Статус</th><th>Сумма</th><th>Дата</th></tr></thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td>{o.number}</td>
                    <td><StatusBadge status={o.status} label={o.status_display} /></td>
                    <td>{money(o.grand_total)}</td>
                    <td className={s.muted}>{new Date(o.created_at).toLocaleDateString("ru-RU")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
