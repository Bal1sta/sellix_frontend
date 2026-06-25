const products = [
  {
    id: 1,
    sku: "SA-COAT-001",
    title: "Структурированное шерстяное пальто",
    subtitle: "Тёмный графит",
    price: 42500,
    oldPrice: null,
    badge: "",
    category: "Одежда",
    brand: "Studio Atelier",
    sizes: ["S", "M", "L"],
    isNew: true,
    popularity: 78,
    stock: 4,
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Элегантное шерстяное пальто прямого кроя для холодного сезона. Хорошо сочетается как с классическими, так и с повседневными образами.",
    features: {
      material: "90% шерсть, 10% кашемир",
      country: "Италия",
      season: "Осень / Зима",
    },
  },

  {
    id: 2,
    sku: "NM-BOOTS-002",
    title: "Кожаные ботинки Kinsale",
    subtitle: "Чёрный",
    price: 31000,
    oldPrice: null,
    badge: "ЭКОЛОГИЧНО",
    category: "Обувь",
    brand: "Nordic Minimal",
    sizes: ["40", "41", "42", "43"],
    isNew: false,
    popularity: 95,
    stock: 2,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Ботинки из натуральной кожи с плотной посадкой и современной минималистичной формой.",
    features: {
      material: "Натуральная кожа",
      country: "Португалия",
      season: "Осень / Весна",
    },
  },

  {
    id: 3,
    sku: "ML-DRESS-003",
    title: "Шёлковое платье косого кроя",
    subtitle: "Шампань",
    price: 28500,
    oldPrice: null,
    badge: "",
    category: "Одежда",
    brand: "Maison Luxe",
    sizes: ["XS", "S", "M"],
    isNew: true,
    popularity: 82,
    stock: 7,
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Лёгкое шёлковое платье с мягким блеском и плавным силуэтом. Подходит для вечерних и дневных образов.",
    features: {
      material: "100% шёлк",
      country: "Франция",
      season: "Весна / Лето",
    },
  },

  {
    id: 4,
    sku: "TF-SWEATER-004",
    title: 'Вязаный свитер "Aran Hybrid"',
    subtitle: "Молочно-белый",
    price: 19500,
    oldPrice: null,
    badge: "",
    category: "Одежда",
    brand: "Terraform",
    sizes: ["S", "M", "L", "XL"],
    isNew: false,
    popularity: 70,
    stock: 5,
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Мягкий вязаный свитер для повседневных образов в прохладную погоду.",
    features: {
      material: "Шерсть / акрил",
      country: "Турция",
      season: "Осень / Зима",
    },
  },

  {
    id: 5,
    sku: "SA-PANTS-005",
    title: "Льняные брюки классического кроя",
    subtitle: "Оливковый",
    price: 18000,
    oldPrice: null,
    badge: "",
    category: "Одежда",
    brand: "Studio Atelier",
    sizes: ["S", "M", "L"],
    isNew: false,
    popularity: 76,
    stock: 9,
    image:
      "https://images.unsplash.com/photo-1506629905607-e1cc1c0a4c8f?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1506629905607-e1cc1c0a4c8f?auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Лёгкие льняные брюки с классическим силуэтом для тёплого сезона.",
    features: {
      material: "100% лён",
      country: "Италия",
      season: "Весна / Лето",
    },
  },

  {
    id: 6,
    sku: "ML-WATCH-006",
    title: "Часы Series 01",
    subtitle: "Серебристый / Чёрный",
    price: 35000,
    oldPrice: null,
    badge: "ЛИМИТИРОВАННАЯ СЕРИЯ",
    category: "Аксессуары",
    brand: "Maison Luxe",
    sizes: [],
    isNew: true,
    popularity: 98,
    stock: 1,
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Минималистичные часы в металлическом корпусе с акцентом на чистые линии.",
    features: {
      material: "Сталь / минеральное стекло",
      country: "Швейцария",
      season: "Всесезонный",
    },
  },

  {
    id: 7,
    sku: "NM-BLAZER-007",
    title: "Минималистичный шерстяной пиджак",
    subtitle: "Пепельно-серый",
    price: 39000,
    oldPrice: null,
    badge: "",
    category: "Одежда",
    brand: "Nordic Minimal",
    sizes: ["M", "L", "XL"],
    isNew: false,
    popularity: 81,
    stock: 3,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Структурированный пиджак в лаконичном стиле для деловых и повседневных комплектов.",
    features: {
      material: "Шерсть / вискоза",
      country: "Польша",
      season: "Осень / Весна",
    },
  },

  {
    id: 8,
    sku: "TF-CHELSEA-008",
    title: "Современные ботинки челси",
    subtitle: "Глубокий чёрный",
    price: 29500,
    oldPrice: null,
    badge: "",
    category: "Обувь",
    brand: "Terraform",
    sizes: ["40", "41", "42", "43", "44"],
    isNew: false,
    popularity: 88,
    stock: 0,
    image:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Ботинки челси с эластичными вставками и современным силуэтом.",
    features: {
      material: "Натуральная кожа",
      country: "Португалия",
      season: "Осень / Зима",
    },
  },

  {
    id: 9,
    sku: "SA-SHIRT-009",
    title: "Повседневная хлопковая рубашка",
    subtitle: "Мягкий айвори",
    price: 12000,
    oldPrice: null,
    badge: "",
    category: "Одежда",
    brand: "Studio Atelier",
    sizes: ["S", "M", "L"],
    isNew: false,
    popularity: 67,
    stock: 12,
    image:
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Базовая хлопковая рубашка для повседневного гардероба.",
    features: {
      material: "100% хлопок",
      country: "Турция",
      season: "Всесезонный",
    },
  },

  {
    id: 10,
    sku: "ML-BAG-010",
    title: "Классическая кожаная сумка",
    subtitle: "Какао",
    price: 46000,
    oldPrice: null,
    badge: "",
    category: "Аксессуары",
    brand: "Maison Luxe",
    sizes: [],
    isNew: false,
    popularity: 90,
    stock: 6,
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Классическая сумка из кожи с вместительным основным отделением.",
    features: {
      material: "Натуральная кожа",
      country: "Италия",
      season: "Всесезонный",
    },
  },

  {
    id: 11,
    sku: "NM-DRESS-011",
    title: "Лёгкое летнее платье",
    subtitle: "Песочный",
    price: 21000,
    oldPrice: null,
    badge: "НОВИНКА",
    category: "Одежда",
    brand: "Nordic Minimal",
    sizes: ["XS", "S", "M"],
    isNew: true,
    popularity: 86,
    stock: 2,
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Лёгкое платье из струящейся ткани для летнего гардероба.",
    features: {
      material: "Вискоза",
      country: "Франция",
      season: "Лето",
    },
  },

  {
    id: 12,
    sku: "TF-SWEATER-012",
    title: "Городской вязаный свитер",
    subtitle: "Каменный",
    price: 17500,
    oldPrice: null,
    badge: "",
    category: "Одежда",
    brand: "Terraform",
    sizes: ["M", "L", "XL"],
    isNew: false,
    popularity: 74,
    stock: 8,
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Практичный свитер для городского повседневного гардероба.",
    features: {
      material: "Шерсть / хлопок",
      country: "Польша",
      season: "Осень / Зима",
    },
  },
];

export default products;