import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import s from "./styles.module.css";
import Logo from "../assets/Images/SelixLOGO.svg";
import cartIcon from "../assets/Images/NavBarImages/cart.svg";
import userIcon from "../assets/Images/NavBarImages/user.svg";

export default function Navbar() {
  const { isLoggedIn, role, user, logout } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();

  const isBusiness = role === "seller" || role === "producer" || role === "admin";
  const cabinetPath = role === "seller" ? "/seller" : role === "producer" ? "/producer" : role === "admin" ? "/admin" : null;
  const cabinetLabel = role === "seller" ? "Мой магазин" : role === "producer" ? "Мои товары" : role === "admin" ? "Панель" : "";

  // Логотип ведёт: бизнес-пользователя — в кабинет, остальных — на главную.
  const brandTo = isBusiness && cabinetPath ? cabinetPath : "/";

  async function handleLogout() {
    await logout();
    navigate("/", { replace: true });
  }

  return (
    <header className={s.navbar}>
      <Link to={brandTo} className={s.navBrand}>
        <img src={Logo} alt="Sellix" />
        <span>Sellix</span>
      </Link>

      <nav className={s.navLinks}>
        {!isBusiness && (
          <Link to="/" className={loc.pathname === "/" ? `${s.navLink} ${s.navLinkActive}` : s.navLink}>Главная</Link>
        )}
        {isLoggedIn && cabinetPath && (
          <Link to={cabinetPath} className={loc.pathname.startsWith(cabinetPath) ? `${s.navLink} ${s.navLinkActive}` : s.navLink}>
            {cabinetLabel}
          </Link>
        )}
      </nav>

      <div className={s.navRight}>
        {isLoggedIn && <span className={s.navUser}>{user?.full_name || user?.email || ""}</span>}

        {/* Иконка пользователя → личный профиль */}
        <Link to={isLoggedIn ? "/profile" : "/login"} title={isLoggedIn ? "Мой профиль" : "Войти"}>
          <img src={userIcon} alt="Профиль" className={s.navIcon} />
        </Link>

        {/* Корзина — только для покупателей/гостей (не для бизнес-аккаунтов) */}
        {!isBusiness && (
          <Link to="/cart" title="Корзина">
            <img src={cartIcon} alt="Корзина" className={s.navIcon} />
          </Link>
        )}

        {isLoggedIn && (
          <button type="button" className={s.navLogout} onClick={handleLogout}>Выйти</button>
        )}
      </div>
    </header>
  );
}
