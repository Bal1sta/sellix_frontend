// Импорт хуков React для работы с состоянием и жизненным циклом компонента
import { useEffect, useState } from "react";

// Импорт функции для получения ID текущего пользователя (например, с бэка или из токена)
import { getCurrentUserId } from "./profileApi.js";

// Импорт всех функций для управления состоянием профиля (логика вынесена отдельно)
import {
  createInitialProfileState, // создает начальное состояние страницы профиля
  loadProfilePageData,       // загружает данные профиля пользователя
  setActiveProfileTab,       // переключает вкладки профиля
  startProfileEditing,       // включает режим редактирования
  cancelProfileEditing,      // отменяет редактирование
  updateProfileFormField,    // обновляет поле формы
  saveProfileChanges,        // сохраняет изменения профиля
} from "./profileStore.js";

// Кастомный хук для страницы профиля
export function useProfilePage() {
  
  // Создаем состояние компонента (state) и функцию для его обновления (setState)
  // Внутрь передаем начальное состояние профиля
  const [state, setState] = useState(createInitialProfileState());

  // useEffect выполняется один раз при монтировании компонента (из-за пустого массива [])
  useEffect(() => {
    
    // Асинхронная функция для инициализации страницы профиля
    async function initProfilePage() {
      try {
        // Получаем ID текущего пользователя (например, из API или localStorage)
        const currentUserId = await getCurrentUserId();

        // Загружаем данные профиля и записываем их в state
        // setState передается внутрь, чтобы функция могла обновить состояние
        await loadProfilePageData(currentUserId, setState);

      } catch (error) {
        // Если произошла ошибка — обновляем состояние с ошибкой
        setState((prev) => ({
          ...prev, // сохраняем старое состояние
          loading: false, // выключаем загрузку
          error: error.message || "Не удалось загрузить пользователя", // записываем текст ошибки
        }));
      }
    }

    // Вызываем функцию загрузки данных
    initProfilePage();

  }, []); // пустой массив = эффект выполнится только 1 раз

  // Обработчик смены вкладки профиля (например: "Профиль", "Заказы", "Настройки")
  function handleTabChange(tabKey) {
    // вызываем функцию, которая меняет активную вкладку
    setActiveProfileTab(tabKey, setState);
  }

  // Обработчик начала редактирования профиля
  function handleEditStart() {
    // включаем режим редактирования
    startProfileEditing(setState);
  }

  // Обработчик отмены редактирования
  function handleEditCancel() {
    // возвращаем данные к исходному состоянию
    cancelProfileEditing(setState);
  }

  // Обработчик изменения любого поля формы (например имя, email и т.д.)
  function handleFieldChange(fieldName, fieldValue) {
    // обновляем конкретное поле в форме
    updateProfileFormField(fieldName, fieldValue, setState);
  }

  // Обработчик сохранения профиля
  async function handleSave() {
    // сохраняем изменения (обычно отправка на сервер)
    await saveProfileChanges(state, setState);
  }

  // Возвращаем state и все обработчики, чтобы использовать их в компоненте
  return {
    state,               // текущее состояние профиля
    handleTabChange,     // переключение вкладок
    handleEditStart,     // начать редактирование
    handleEditCancel,    // отменить редактирование
    handleFieldChange,   // изменение полей формы
    handleSave,          // сохранение
  };
}