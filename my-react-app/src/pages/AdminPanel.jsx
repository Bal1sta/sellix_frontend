import { useEffect, useState, useCallback } from "react";
import CabinetShell from "./_CabinetShell.jsx";
import styles from "../shared/styles.module.css";
import { admin } from "../api/admin.js";

const TABS = [
  { key: "dashboard", label: "Дашборд" },
  { key: "payouts", label: "Выплаты" },
  { key: "orders", label: "Заказы" },
  { key: "users", label: "Пользователи" },
  { key: "producers", label: "Производители" },
];

const money = (v) => `${Number(v ?? 0).toLocaleString("ru-RU")} ₽`;
const asList = (d) => (Array.isArray(d) ? d : d?.results ?? []);

export default function AdminCabinet() {
  const [tab, setTab] = useState("dashboard");
  return (
    <CabinetShell title="Панель администратора" tabs={TABS} activeTab={tab} onTab={setTab}>
      {tab === "dashboard" && <Dashboard />}
      {tab === "payouts" && <Payouts />}
      {tab === "orders" && <Orders />}
      {tab === "users" && <Users />}
      {tab === "producers" && <Producers />}
    </CabinetShell>
  );
}

function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    admin
      .dashboard()
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <div className={styles.error}>{error}</div>;
  if (!data) return <div className={styles.empty}>Загрузка…</div>;

  const stats = [
    ["GMV (завершённые)", money(data.gmv_completed)],
    ["Всего заказов", data.orders_total],
    ["Пользователей", data.users_total],
    ["Магазинов", `${data.stores_published}/${data.stores_total}`],
    ["Производителей", data.producers_total],
    ["Товаров", data.products_total],
    ["К выплате", money(data.pending_payouts_sum)],
    ["Ошибки интеграций", data.integration_errors],
  ];

  return (
    <>
      <div className={styles.statGrid}>
        {stats.map(([label, value]) => (
          <div key={label} className={styles.stat}>
            <div className={styles.statLabel}>{label}</div>
            <div className={styles.statValue}>{value}</div>
          </div>
        ))}
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Заказы по статусам</h2>
        {Object.entries(data.orders_by_status || {}).length === 0 ? (
          <p className={styles.muted}>Нет данных</p>
        ) : (
          <table className={styles.table}>
            <tbody>
              {Object.entries(data.orders_by_status).map(([status, count]) => (
                <tr key={status}>
                  <td>{status}</td>
                  <td>{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

function Payouts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(asList(await admin.payouts.list()));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function confirm(id) {
    setError("");
    try {
      await admin.payouts.confirm(id, "Подтверждено из панели");
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  if (loading) return <div className={styles.empty}>Загрузка…</div>;

  return (
    <>
      {error && <div className={styles.error}>{error}</div>}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Заказ</th>
            <th>Получатель</th>
            <th>Сумма</th>
            <th>Статус</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={5} className={styles.muted}>
                Выплат нет
              </td>
            </tr>
          ) : (
            items.map((p) => (
              <tr key={p.id}>
                <td>{p.order_number}</td>
                <td>{p.payee_type === "seller" ? "Продавец" : "Производитель"}</td>
                <td>{money(p.amount)}</td>
                <td>
                  <StatusBadge status={p.status} />
                </td>
                <td>
                  {p.status === "pending" && (
                    <button className={styles.btnGhost} onClick={() => confirm(p.id)}>
                      Подтвердить
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}

function Orders() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    admin.orders
      .list()
      .then((d) => setItems(asList(d)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.empty}>Загрузка…</div>;
  if (items.length === 0) return <div className={styles.empty}>Заказов нет.</div>;

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Номер</th>
          <th>Покупатель</th>
          <th>Магазин</th>
          <th>Статус</th>
          <th>Сумма</th>
        </tr>
      </thead>
      <tbody>
        {items.map((o) => (
          <tr key={o.id}>
            <td>{o.number}</td>
            <td className={styles.muted}>{o.buyer_email}</td>
            <td>{o.store_name}</td>
            <td>
              <StatusBadge status={o.status} label={o.status_display} />
            </td>
            <td>{money(o.grand_total)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Users() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(asList(await admin.users.list()));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleBlock(u) {
    setError("");
    try {
      if (u.is_blocked) await admin.users.unblock(u.id);
      else await admin.users.block(u.id, "Заблокирован администратором");
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  if (loading) return <div className={styles.empty}>Загрузка…</div>;

  return (
    <>
      {error && <div className={styles.error}>{error}</div>}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Роль</th>
            <th>Статус</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((u) => (
            <tr key={u.id}>
              <td>{u.email || "—"}</td>
              <td className={styles.muted}>{u.role || "—"}</td>
              <td>
                {u.is_blocked ? (
                  <span className={`${styles.badge} ${styles.badgeRed}`}>Заблокирован</span>
                ) : (
                  <span className={`${styles.badge} ${styles.badgeGreen}`}>Активен</span>
                )}
              </td>
              <td>
                <button className={styles.btnGhost} onClick={() => toggleBlock(u)}>
                  {u.is_blocked ? "Разблокировать" : "Заблокировать"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function Producers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(asList(await admin.producers.list()));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function approve(id) {
    await admin.producers.approve(id);
    load();
  }

  if (loading) return <div className={styles.empty}>Загрузка…</div>;

  return (
    <>
      {error && <div className={styles.error}>{error}</div>}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Компания</th>
            <th>ИНН</th>
            <th>Статус</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id}>
              <td>{p.company_name}</td>
              <td className={styles.muted}>{p.inn || "—"}</td>
              <td>
                <StatusBadge status={p.status} />
              </td>
              <td>
                {p.status !== "approved" && (
                  <button className={styles.btnGhost} onClick={() => approve(p.id)}>
                    Одобрить
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function StatusBadge({ status, label }) {
  const map = {
    approved: styles.badgeGreen,
    paid: styles.badgeGreen,
    completed: styles.badgeGreen,
    delivered: styles.badgeGreen,
    pending: styles.badgeYellow,
    processing: styles.badgeYellow,
    blocked: styles.badgeRed,
    failed: styles.badgeRed,
    cancelled: styles.badgeRed,
  };
  return (
    <span className={`${styles.badge} ${map[status] || styles.badgeGray}`}>
      {label || status}
    </span>
  );
}
