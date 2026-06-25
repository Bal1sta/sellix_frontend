import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import navBarStyle from "./navBarStyle.module.css";

import navBarData from "./navBarData.js";
import { useAuth } from "../../../auth/AuthContext.jsx";

import search from "../../../assets/Images/NavBarImages/search.svg"
import user from "../../../assets/Images/NavBarImages/user.svg";
import cart from "../../../assets/Images/NavBarImages/cart.svg";

// Куда ведёт иконка пользователя в зависимости от роли.
function profileTarget(role) {
  if (role === "seller") return "/seller";
  if (role === "producer") return "/producer";
  if (role === "admin") return "/admin";
  return "/profile"; // покупатель или роль не выбрана
}

export default function NavBar() {
  const { shop, menu, icons } = navBarData;
  const { isLoggedIn, role, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/", { replace: true });
  }

  return (
    <header className={navBarStyle.header}>
      <nav className={navBarStyle.navbar}>
        <div className={navBarStyle.leftSection}>
          {menu.map((item) => (
            <NavLink
              key={item.id}
              to={item.link}
              end={item.link === "/clothingShop-page"}
              className={({ isActive }) =>
                isActive
                  ? `${navBarStyle.navItem} ${navBarStyle.active}`
                  : navBarStyle.navItem
              }
            >
              {item.title}
            </NavLink>
          ))}
        </div>

        <div className={navBarStyle.centerSection}>
          <Link to="/clothingShop-page" className={navBarStyle.logo}>
            {shop.logo && (
              <img
                className={navBarStyle.logoImg}
                src={shop.logo}
                alt={shop.name}
              />
            )}

            <span className={navBarStyle.logoText}>{shop.name}</span>
          </Link>
        </div>

        <div className={navBarStyle.rightSection}>
          {icons.search && (
            <button
              className={navBarStyle.iconButton}
              type="button"
              aria-label="Поиск"
            >
              <img className={navBarStyle.iconImg} src={search} alt="Поиск" />
            </button>
          )}

          {icons.profile && (
            <Link
              to={isLoggedIn ? profileTarget(role) : "/login"}
              className={navBarStyle.iconButton}
              aria-label={isLoggedIn ? "Личный кабинет" : "Войти"}
            >
              <img className={navBarStyle.iconImg} src={user} alt="Профиль" />
            </Link>
          )}

          {icons.cart && (
            <Link
              to="/cart"
              className={navBarStyle.iconButton}
              aria-label="Корзина"
            >
              <img className={navBarStyle.iconImg} src={cart} alt="Корзина" />
            </Link>
          )}

          {isLoggedIn && (
            <button
              type="button"
              className={navBarStyle.iconButton}
              onClick={handleLogout}
              aria-label="Выйти"
              title="Выйти"
              style={{ fontSize: "0.7rem", color: "var(--color-black)" }}
            >
              Выйти
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}