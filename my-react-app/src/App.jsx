// App.jsx — единый маршрутизатор с чистой навигацией.
//
// Потоки:
//   Гость  →  /login  →  OAuth  →  /select-role (если роль не назначена)
//   Продавец  →  /seller  (создание магазина встроено в кабинет)
//   Производитель  →  /producer  (создание профиля встроено в кабинет)
//   Покупатель  →  роль назначается автоматически при первом заказе  →  /profile
//   Админ  →  /admin/login  →  /admin

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext.jsx";

// Pages
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import OAuthCallback from "./pages/OAuthCallback.jsx";
import SelectRole from "./pages/SelectRole.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import CreateStore from "./pages/CreateStore.jsx";
import CreateProducerProfile from "./pages/CreateProducerProfile.jsx";
import SellerCabinet from "./pages/SellerCabinet.jsx";
import ProducerCabinet from "./pages/ProducerCabinet.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import BuyerProfile from "./pages/BuyerProfile.jsx";
import Cart from "./pages/Cart.jsx";
import Catalog from "./pages/Catalog.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import LegalPage from "./pages/LegalPage.jsx";

// Route guards
function RequireAuth({ children }) {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-black)" }}>Загрузка…</div>;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}

function RequireRole({ roles, children }) {
  const { isLoggedIn, role, loading } = useAuth();
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (loading) return <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-black)" }}>Загрузка…</div>;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!role) return <Navigate to="/select-role" replace />;
  if (!allowed.includes(role)) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* ─── Публичные ─── */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<OAuthCallback />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/cart" element={<Cart />} />

      {/* ─── Правовые документы ─── */}
      <Route path="/legal/terms" element={<LegalPage docKey="terms" />} />
      <Route path="/legal/privacy" element={<LegalPage docKey="privacy" />} />
      <Route path="/legal/offer" element={<LegalPage docKey="offer" />} />
      <Route path="/legal/sellers" element={<LegalPage docKey="sellers" />} />

      {/* ─── Витрина магазина (публичная) ─── */}
      <Route path="/shop/:slug" element={<Catalog />} />
      <Route path="/shop/:slug/catalog" element={<Catalog />} />
      <Route path="/shop/:slug/product/:productId" element={<ProductDetail />} />

      {/* ─── Требуют входа ─── */}
      <Route path="/select-role" element={<RequireAuth><SelectRole /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><BuyerProfile /></RequireAuth>} />

      {/* ─── Кабинеты по ролям ─── */}
      <Route path="/seller/create" element={<RequireRole roles="seller"><CreateStore /></RequireRole>} />
      <Route path="/seller" element={<RequireRole roles="seller"><SellerCabinet /></RequireRole>} />
      <Route path="/producer/create" element={<RequireRole roles="producer"><CreateProducerProfile /></RequireRole>} />
      <Route path="/producer" element={<RequireRole roles="producer"><ProducerCabinet /></RequireRole>} />
      <Route path="/admin" element={<RequireRole roles="admin"><AdminPanel /></RequireRole>} />

      {/* ─── Fallback ─── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
