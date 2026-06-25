// Контекст авторизации. Хранит текущего пользователя, статус загрузки и
// предоставляет методы входа/выхода. Любой компонент через useAuth() получает
// доступ к user, ролям и действиям.

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

import * as authApi from "../api/auth.js";
import { isAuthenticated, clearTokens } from "../api/tokenStore.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // При старте — если есть токен, подтягиваем профиль.
  const refreshUser = useCallback(async () => {
    if (!isAuthenticated()) {
      setUser(null);
      setLoading(false);
      return null;
    }
    try {
      const me = await authApi.getMe();
      setUser(me);
      return me;
    } catch {
      clearTokens();
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // OAuth-вход: сохраняет токены (внутри authApi) и пользователя.
  const loginWithOAuth = useCallback(async ({ provider, code, redirectUri }) => {
    const data = await authApi.oauthLogin({ provider, code, redirectUri });
    setUser(data.user);
    return data;
  }, []);

  const loginAsAdmin = useCallback(async ({ email, password }) => {
    const data = await authApi.adminLogin({ email, password });
    setUser(data.user);
    return data;
  }, []);

  const chooseRole = useCallback(async (role) => {
    const data = await authApi.selectRole(role);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isLoggedIn: Boolean(user),
      role: user?.role ?? null,
      roleAssigned: Boolean(user?.role),
      refreshUser,
      setUser,
      loginWithOAuth,
      loginAsAdmin,
      chooseRole,
      logout,
    }),
    [user, loading, refreshUser, loginWithOAuth, loginAsAdmin, chooseRole, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth должен использоваться внутри <AuthProvider>");
  }
  return ctx;
}
