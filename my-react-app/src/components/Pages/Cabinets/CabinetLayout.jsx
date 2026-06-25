import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext.jsx";
import styles from "./Cabinet.module.css";
import Logo from "../../../assets/Images/SelixLOGO.svg";

// Общий каркас личного кабинета: шапка с логотипом, навигация по вкладкам,
// кнопка выхода. Используется кабинетами продавца, производителя и админа.
export default function CabinetLayout({ title, tabs = [], activeTab, onTab, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>
          <img src={Logo} alt="Sellix" />
          <span>Sellix</span>
        </Link>
        <div className={styles.headerRight}>
          {user?.email && <span className={styles.userEmail}>{user.email}</span>}
          <button type="button" className={styles.logout} onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </header>

      <div className={styles.body}>
        <h1 className={styles.title}>{title}</h1>

        {tabs.length > 0 && (
          <nav className={styles.tabs}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={
                  tab.key === activeTab
                    ? `${styles.tab} ${styles.tabActive}`
                    : styles.tab
                }
                onClick={() => onTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        )}

        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
