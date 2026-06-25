// Shared cabinet wrapper — replaces old CabinetLayout
import Navbar from "../shared/Navbar.jsx";
import s from "../shared/styles.module.css";

export default function CabinetShell({ title, tabs, activeTab, onTab, children }) {
  return (
    <div className={s.shell}>
      <Navbar />
      <div className={s.cabinetBody}>
        <h1 className={s.cabinetTitle}>{title}</h1>
        {tabs && tabs.length > 0 && (
          <nav className={s.tabs}>
            {tabs.map(t => (
              <button key={t.key} type="button"
                className={t.key === activeTab ? `${s.tab} ${s.tabActive}` : s.tab}
                onClick={() => onTab(t.key)}>{t.label}</button>
            ))}
          </nav>
        )}
        {children}
      </div>
    </div>
  );
}
