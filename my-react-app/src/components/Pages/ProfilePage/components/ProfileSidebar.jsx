import React from "react";
import styles from "./ProfileSidebar.module.css";

export default function ProfileSidebar({ user, activeTab, setActiveTab }) {
  const menuItems = [
    { key: "profile", label: "Профиль" },
    { key: "orders", label: "История заказов" },
    { key: "payments", label: "Способы оплаты" },
    { key: "shipping", label: "Параметры доставки" },
    { key: "newsletter", label: "Настройки рассылки" },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.userCard}>
        <img className={styles.avatar} src={user.avatar} alt={user.name} />

        <div>
          <h3 className={styles.name}>{user.name}</h3>
          <p className={styles.status}>{user.membership}</p>
        </div>
      </div>

      <nav className={styles.menu}>
        {menuItems.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`${styles.menuItem} ${
              activeTab === item.key ? styles.active : ""
            }`}
            onClick={() => setActiveTab(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}