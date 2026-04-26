export type ShopItem = {
  id: string;
  name: string;
  description: string;
  category: 'boosters' | 'themes' | 'bundles';
  priceCoins: number;
};

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'hint-pack-small',
    name: 'Hint Pack S',
    description: '5 підказок для складних моментів.',
    category: 'boosters',
    priceCoins: 250,
  },
  {
    id: 'hint-pack-pro',
    name: 'Hint Pack Pro',
    description: '15 підказок + швидкий reveal 1 фрагмента.',
    category: 'boosters',
    priceCoins: 620,
  },
  {
    id: 'theme-midnight',
    name: 'Тема Midnight',
    description: 'Контрастна темна палітра для вечірніх сесій.',
    category: 'themes',
    priceCoins: 540,
  },
  {
    id: 'theme-paper',
    name: 'Тема Paper',
    description: 'Тепла мінімалістична тема з мʼякими акцентами.',
    category: 'themes',
    priceCoins: 480,
  },
  {
    id: 'starter-bundle',
    name: 'Starter Bundle',
    description: '8 підказок і 1 преміум-тема за вигідною ціною.',
    category: 'bundles',
    priceCoins: 700,
  },
];
