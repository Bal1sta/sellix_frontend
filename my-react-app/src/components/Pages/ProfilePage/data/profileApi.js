// Интеграция профиля покупателя с Django REST API (apps.accounts, apps.orders).
//
// Функции сохраняют прежние сигнатуры (как при моковых данных), поэтому
// остальной код страницы профиля менять не нужно. Внутри — реальные запросы
// к бэку с приведением полей под формат, который ожидает интерфейс:
//   бэк: full_name, phone           ←→   UI: firstName, lastName, phone, address
//   бэк: number, grand_total, status, created_at  ←→  UI: number, totalPrice, ...

import { getMe, updateMe } from "../../../../api/auth.js";
import { listBuyerOrders } from "../../../../api/orders.js";

// Разбиваем full_name на имя/фамилию для формы профиля.
function splitName(fullName = "") {
  const parts = String(fullName).trim().split(/\s+/);
  if (parts.length <= 1) return { firstName: parts[0] || "", lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

// Преобразуем пользователя бэка в профиль для UI.
function mapUserToProfile(user) {
  const { firstName, lastName } = splitName(user.full_name);
  return {
    id: user.id,
    userId: user.id,
    firstName,
    lastName,
    email: user.email || "",
    phone: user.phone || "",
    address: "", // адреса хранятся отдельно (BuyerAddress); поле оставлено для формы
    avatar: "",
    membership: user.role === "buyer" ? "Покупатель" : "Клиент Sellix",
  };
}

// Локальный формат даты под русский интерфейс.
function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

// Заказ бэка → карточка заказа в UI профиля.
function mapOrder(order) {
  const firstItem = order.items?.[0];
  const extra =
    order.items && order.items.length > 1
      ? ` и ещё ${order.items.length - 1}`
      : "";
  return {
    id: order.id,
    userId: order.buyer ?? null,
    number: order.number || "",
    title: firstItem ? `${firstItem.product_name}${extra}` : "Заказ",
    status: order.status || "",
    totalPrice: Number(order.grand_total ?? 0),
    createdAt: formatDate(order.created_at),
    image: "",
  };
}

// --- Публичные функции (сигнатуры сохранены) ---

// Раньше возвращала захардкоженный id. Теперь не нужна для запросов
// (бэк сам определяет пользователя по JWT), но оставлена для совместимости.
export async function getCurrentUserId() {
  const me = await getMe();
  return me.id;
}

// userId игнорируется: бэк отдаёт профиль по токену.
export async function getCurrentUserProfile() {
  const me = await getMe();
  return mapUserToProfile(me);
}

// Сохранение профиля: собираем full_name обратно и шлём PATCH /me/.
export async function updateCurrentUserProfile(_userId, profileData) {
  const fullName = `${profileData.firstName || ""} ${profileData.lastName || ""}`.trim();
  const updated = await updateMe({
    full_name: fullName,
    phone: profileData.phone || "",
  });
  return mapUserToProfile(updated);
}

// История заказов покупателя (across всех магазинов).
export async function getCurrentUserOrders() {
  const data = await listBuyerOrders();
  // DRF-пагинация отдаёт { results: [...] }; без пагинации — массив.
  const list = Array.isArray(data) ? data : data?.results ?? [];
  return list.map(mapOrder);
}
