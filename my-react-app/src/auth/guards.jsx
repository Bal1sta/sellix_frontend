// Защита маршрутов по авторизации и роли.
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

// Требует, чтобы пользователь был залогинен. Иначе — на /login.
export function RequireAuth({ children }) {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullScreenLoader />;
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

// Требует конкретную роль (или одну из списка). Иначе — на главную.
export function RequireRole({ roles, children }) {
  const { isLoggedIn, role, loading } = useAuth();
  const location = useLocation();
  const allowed = Array.isArray(roles) ? roles : [roles];

  if (loading) return <FullScreenLoader />;
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  // Роль ещё не выбрана — отправляем на выбор роли.
  if (!role) {
    return <Navigate to="/select-role" replace />;
  }
  if (!allowed.includes(role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function FullScreenLoader() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-base, sans-serif)",
        color: "var(--color-black)",
      }}
    >
      Загрузка…
    </div>
  );
}
