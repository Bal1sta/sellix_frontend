// Функция собирает полное имя пользователя из имени и фамилии
export function getFullName(user) {
  // Возвращаем строку:
  // если firstName есть — берем его, иначе пустую строку
  // если lastName есть — берем его, иначе пустую строку
  // между ними ставим пробел
  // .trim() убирает лишние пробелы по краям
  return `${user.firstName || ""} ${user.lastName || ""}`.trim();
}

// Функция нормализует данные профиля.
// То есть берет "сырой" объект rawProfile и возвращает аккуратный объект
// с гарантированно заполненными полями по умолчанию.
export function normalizeProfileData(rawProfile) {
  return {
    // id профиля, если его нет — null
    id: rawProfile.id || null,

    // userId пользователя, если нет — null
    userId: rawProfile.userId || null,

    // Имя пользователя, если нет — пустая строка
    firstName: rawProfile.firstName || "",

    // Фамилия пользователя, если нет — пустая строка
    lastName: rawProfile.lastName || "",

    // Email пользователя, если нет — пустая строка
    email: rawProfile.email || "",

    // Телефон пользователя, если нет — пустая строка
    phone: rawProfile.phone || "",

    // Адрес пользователя, если нет — пустая строка
    address: rawProfile.address || "",

    // Ссылка на аватар, если нет — пустая строка
    avatar: rawProfile.avatar || "",

    // Статус клиента:
    // если membership есть — берем его,
    // иначе ставим значение по умолчанию
    membership: rawProfile.membership || "Стандартный клиент",

    // Полное имя пользователя.
    // Вызываем функцию getFullName и передаем rawProfile
    name: getFullName(rawProfile),
  };
}

// Функция нормализует массив заказов.
// Она проверяет, что пришел именно массив,
// и преобразует каждый заказ в предсказуемый формат.
export function normalizeOrders(rawOrders) {
  // Если rawOrders не является массивом,
  // возвращаем пустой массив, чтобы не было ошибки .map()
  if (!Array.isArray(rawOrders)) {
    return [];
  }

  // Проходимся по каждому заказу и создаем новый объект
  return rawOrders.map((order) => ({
    // id заказа
    id: order.id,

    // id пользователя, которому принадлежит заказ
    userId: order.userId,

    // Номер заказа, если нет — пустая строка
    number: order.number || "",

    // Название товара/заказа, если нет — пустая строка
    title: order.title || "",

    // Статус заказа, если нет — пустая строка
    status: order.status || "",

    // Сумма заказа, если нет — 0
    totalPrice: order.totalPrice || 0,

    // Дата создания заказа, если нет — пустая строка
    createdAt: order.createdAt || "",

    // Картинка заказа, если нет — пустая строка
    image: order.image || "",
  }));
}

// Функция переводит технический статус заказа в русский текст для интерфейса
export function getStatusLabel(status) {
  // Проверяем значение status
  switch (status) {
    // Если статус delivered
    case "delivered":
      // Возвращаем русский текст
      return "Доставлен";

    // Если статус in_transit
    case "in_transit":
      // Возвращаем русский текст
      return "В пути";

    // Если статус processing
    case "processing":
      // Возвращаем русский текст
      return "В обработке";

    // Если статус cancelled
    case "cancelled":
      // Возвращаем русский текст
      return "Отменён";

    // Если статус неизвестен
    default:
      // Возвращаем запасной вариант
      return "Неизвестно";
  }
}

// Функция форматирует цену в красивый вид для русского интерфейса
export function formatPrice(price) {
  // Number(price) приводит значение к числу
  // toLocaleString("ru-RU") добавляет пробелы/разделители по русскому формату
  // в конце добавляется знак рубля
  return `${Number(price).toLocaleString("ru-RU")} ₽`;
}