// Импорт функций API для работы с профилем и заказами пользователя
import {
  getCurrentUserProfile,   // получает профиль пользователя
  updateCurrentUserProfile, // обновляет профиль пользователя
  getCurrentUserOrders,    // получает заказы пользователя
} from "./profileApi.js";

// Импорт функций нормализации данных
import { normalizeOrders, normalizeProfileData } from "./profileHelpers.js";

// Функция создания начального состояния страницы профиля
export function createInitialProfileState() {
  return {
    // ID текущего пользователя
    currentUserId: null,

    // Объект профиля пользователя
    profile: null,

    // Массив заказов пользователя
    orders: [],

    // Флаг загрузки данных
    loading: false,

    // Флаг сохранения изменений
    saving: false,

    // Текст ошибки
    error: "",

    // Активная вкладка на странице профиля
    activeTab: "profile",

    // Флаг режима редактирования
    isEditing: false,

    // Данные формы редактирования профиля
    formData: {
      // Имя
      firstName: "",

      // Фамилия
      lastName: "",

      // Email
      email: "",

      // Телефон
      phone: "",

      // Адрес
      address: "",

      // Ссылка на аватар
      avatar: "",
    },
  };
}

// Функция загрузки данных страницы профиля
export async function loadProfilePageData(userId, setState) {
  // Сразу включаем состояние загрузки
  setState((prev) => ({
    ...prev, // сохраняем прошлое состояние
    currentUserId: userId, // записываем ID текущего пользователя
    loading: true, // включаем загрузку
    error: "", // очищаем старую ошибку
  }));

  try {
    // Одновременно загружаем профиль и заказы
    const [profileResponse, ordersResponse] = await Promise.all([
      getCurrentUserProfile(userId),
      getCurrentUserOrders(userId),
    ]);

    // Нормализуем профиль, чтобы привести поля к нужному формату
    const normalizedProfile = normalizeProfileData(profileResponse);

    // Нормализуем список заказов
    const normalizedOrders = normalizeOrders(ordersResponse);

    // Записываем все данные в state
    setState((prev) => ({
      ...prev, // сохраняем остальное состояние
      loading: false, // выключаем загрузку
      profile: normalizedProfile, // сохраняем профиль
      orders: normalizedOrders, // сохраняем заказы
      formData: {
        // Заполняем форму текущими данными профиля
        firstName: normalizedProfile.firstName,
        lastName: normalizedProfile.lastName,
        email: normalizedProfile.email,
        phone: normalizedProfile.phone,
        address: normalizedProfile.address,
        avatar: normalizedProfile.avatar,
      },
    }));
  } catch (error) {
    // Если произошла ошибка, сохраняем ее в state
    setState((prev) => ({
      ...prev, // сохраняем предыдущее состояние
      loading: false, // выключаем загрузку
      error: error.message || "Ошибка загрузки профиля", // записываем текст ошибки
    }));
  }
}

// Функция смены активной вкладки профиля
export function setActiveProfileTab(tabKey, setState) {
  setState((prev) => ({
    ...prev, // сохраняем старое состояние
    activeTab: tabKey, // меняем активную вкладку
  }));
}

// Функция включения режима редактирования
export function startProfileEditing(setState) {
  setState((prev) => ({
    ...prev, // сохраняем остальное состояние
    isEditing: true, // включаем режим редактирования
    error: "", // очищаем ошибки
  }));
}

// Функция отмены редактирования
export function cancelProfileEditing(setState) {
  setState((prev) => {
    // Если профиль еще не загружен
    if (!prev.profile) {
      return {
        ...prev, // сохраняем прошлое состояние
        isEditing: false, // просто выключаем режим редактирования
      };
    }

    // Если профиль есть — выключаем редактирование и откатываем форму
    return {
      ...prev, // сохраняем старое состояние
      isEditing: false, // выключаем редактирование
      formData: {
        // Возвращаем значения формы к данным профиля
        firstName: prev.profile.firstName,
        lastName: prev.profile.lastName,
        email: prev.profile.email,
        phone: prev.profile.phone,
        address: prev.profile.address,
        avatar: prev.profile.avatar,
      },
    };
  });
}

// Функция обновления одного поля формы
export function updateProfileFormField(fieldName, fieldValue, setState) {
  setState((prev) => ({
    ...prev, // сохраняем старое состояние
    formData: {
      ...prev.formData, // сохраняем остальные поля формы
      [fieldName]: fieldValue, // обновляем нужное поле по имени
    },
  }));
}

// Функция сохранения изменений профиля
export async function saveProfileChanges(state, setState) {
  // Если нет currentUserId — сохранять нечего
  if (!state.currentUserId) {
    setState((prev) => ({
      ...prev, // сохраняем старое состояние
      error: "Не найден пользователь для сохранения профиля", // пишем ошибку
    }));
    return; // выходим из функции
  }

  // Включаем состояние сохранения
  setState((prev) => ({
    ...prev, // сохраняем предыдущее состояние
    saving: true, // включаем флаг сохранения
    error: "", // очищаем ошибку
  }));

  try {
    // Отправляем обновленные данные профиля
    const updatedProfileResponse = await updateCurrentUserProfile(
      state.currentUserId, // ID пользователя
      state.formData // новые данные из формы
    );

    // Нормализуем ответ от API
    const normalizedProfile = normalizeProfileData(updatedProfileResponse);

    // Обновляем state после успешного сохранения
    setState((prev) => ({
      ...prev, // сохраняем остальное состояние
      saving: false, // выключаем сохранение
      isEditing: false, // выключаем режим редактирования
      profile: normalizedProfile, // сохраняем новый профиль
      formData: {
        // Обновляем форму уже сохраненными данными
        firstName: normalizedProfile.firstName,
        lastName: normalizedProfile.lastName,
        email: normalizedProfile.email,
        phone: normalizedProfile.phone,
        address: normalizedProfile.address,
        avatar: normalizedProfile.avatar,
      },
    }));
  } catch (error) {
    // Если произошла ошибка — выключаем saving и показываем ошибку
    setState((prev) => ({
      ...prev, // сохраняем предыдущее состояние
      saving: false, // выключаем сохранение
      error: error.message || "Не удалось сохранить изменения", // записываем ошибку
    }));
  }
}