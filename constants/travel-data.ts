import type { ImageSourcePropType } from 'react-native';

export type FacilityKind = 'coffee' | 'view' | 'food' | 'stay' | 'museum' | 'car';

export type Facility = {
  id: string;
  label: string;
  kind: FacilityKind;
};

export type City = {
  slug: string;
  name: string;
  region: string;
  tagline: string;
  image: string | ImageSourcePropType;
  stay: string;
  vibe: string;
};

export type Place = {
  slug: string;
  title: string;
  city: string;
  region: string;
  category: string;
  image: string | ImageSourcePropType;
  gallery?: Array<string | ImageSourcePropType>;
  rating: string;
  price: string;
  duration: string;
  excerpt: string;
  description: string;
  tags: string[];
  facilities: Facility[];
};

export type Collection = {
  slug: string;
  title: string;
  description: string;
  image: string | ImageSourcePropType;
  duration: string;
  mood: string;
  stops: string[];
};

export const HERO_IMAGE: string | ImageSourcePropType = require('../assets/images/cities/kyiv.jpg');

export const UKRAINE_CITIES: City[] = [
  {
    slug: 'kyiv',
    name: 'Київ',
    region: 'Центр України',
    tagline: 'Куполи, дворики Подолу та довгі прогулянки над Дніпром.',
    image: require('../assets/images/cities/kyiv.jpg'),
    stay: '2-3 дні',
    vibe: 'місто / архітектура',
  },
  {
    slug: 'lviv',
    name: 'Львів',
    region: 'Галичина',
    tagline: 'Кава, камʼяні фасади та маршрути для неспішних вихідних.',
    image: require('../assets/images/cities/lviv.jpg'),
    stay: '2 дні',
    vibe: 'кава / історія',
  },
  {
    slug: 'odesa',
    name: 'Одеса',
    region: 'Південь',
    tagline: 'Море, ранкове світло на бульварі й легкий ритм літа.',
    image: require('../assets/images/cities/odesa.jpg'),
    stay: '2-4 дні',
    vibe: 'море / гастро',
  },
  {
    slug: 'chernivtsi',
    name: 'Чернівці',
    region: 'Буковина',
    tagline: 'Європейський настрій, університет і камерні вулиці.',
    image: require('../assets/images/cities/chernivtsi.jpg'),
    stay: '1-2 дні',
    vibe: 'архітектура / тиша',
  },
  {
    slug: 'drohobych',
    name: 'Дрогобич',
    region: 'Львівська область',
    tagline: 'Ратуша, історичний центр і найдавніша солеварня України.',
    image: require('../assets/images/drohobych-ratusha-square.png'),
    stay: '1-2 дні',
    vibe: 'історія / солеварня',
  },
  {
    slug: 'truskavets',
    name: 'Трускавець',
    region: 'Львівська область',
    tagline: 'Курортне місто з бюветами, парком і неспішним ритмом відпочинку.',
    image: require('../assets/images/cities/truskavets.jpg'),
    stay: '2-3 дні',
    vibe: 'курорт / бювет',
  },
  {
    slug: 'kamianets',
    name: 'Камʼянець',
    region: 'Поділля',
    tagline: 'Фортеця, каньйон і той самий вау-ефект із першого кадру.',
    image: require('../assets/images/cities/kamianets.jpg'),
    stay: '1-2 дні',
    vibe: 'фортеця / каньйон',
  },
];

export const UKRAINE_PLACES: Place[] = [
  {
    slug: 'sofiia-kyivska',
    title: 'Софія Київська',
    city: 'Київ',
    region: 'Центр України',
    category: 'Архітектура',
    image:
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    rating: '4.9',
    price: 'від 650 грн',
    duration: '3-4 год',
    excerpt: 'Старий Київ, золото куполів і класичний маршрут через Софійську площу.',
    description:
      'Маршрут для тих, хто хоче відчути Київ через історію, панорами та міські деталі. Починай із Софійської площі, далі йди до Золотих воріт і закінчуй день на терасах Подолу або біля фунікулера.',
    tags: ['Київ', 'Історія', 'Пішки'],
    facilities: [
      { id: 'coffee', label: 'Кава поруч', kind: 'coffee' },
      { id: 'view', label: 'Панорама', kind: 'view' },
      { id: 'museum', label: 'Музейний формат', kind: 'museum' },
      { id: 'car', label: 'Трансфер 15 хв', kind: 'car' },
    ],
  },
  {
    slug: 'ratusha-lviv',
    title: 'Площа Ринок',
    city: 'Львів',
    region: 'Галичина',
    category: 'Місто',
    image:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    rating: '4.8',
    price: 'від 720 грн',
    duration: '1 день',
    excerpt: 'Класичний львівський день: Ринок, кавʼярні та старі подвірʼя.',
    description:
      'Це ідеальний міський маршрут для короткої подорожі до Львова. Площа Ринок, вежа ратуші, дворики, кавові точки і вечірній променад до Оперного дають саме той ритм, за який місто люблять повертатися.',
    tags: ['Львів', 'Кава', 'Вихідні'],
    facilities: [
      { id: 'coffee', label: 'Авторська кава', kind: 'coffee' },
      { id: 'food', label: 'Локальна кухня', kind: 'food' },
      { id: 'view', label: 'Оглядовий дах', kind: 'view' },
      { id: 'stay', label: 'Бутік-готелі', kind: 'stay' },
    ],
  },
  {
    slug: 'drogobych-saltworks',
    title: 'Дрогобицька солеварня',
    city: 'Дрогобич',
    region: 'Львівська область',
    category: 'Історія',
    image: require('../assets/images/drohobych-saltworks-exterior.png'),
    rating: '4.9',
    price: 'від 590 грн',
    duration: '3-5 год',
    excerpt: 'Жива промислова спадщина: соляні цехи, старі печі та автентичний дух Галичини.',
    description:
      'Один із найатмосферніших маршрутів Львівщини: історичний центр Дрогобича, Ратуша та знайомство з легендарною солеварнею, яка працює ще з княжих часів. Це локація, де добре відчувається місцева історія, ремесло й характер міста.',
    tags: ['Дрогобич', 'Солеварня', 'Львівщина'],
    facilities: [
      { id: 'museum', label: 'Екскурсія цехами', kind: 'museum' },
      { id: 'view', label: 'Історичний центр', kind: 'view' },
      { id: 'coffee', label: 'Кавові точки', kind: 'coffee' },
      { id: 'car', label: 'Трансфер 10 хв', kind: 'car' },
    ],
    gallery: [
      require('../assets/images/drohobych-ratusha-square.png'),
      require('../assets/images/drohobych-saltworks-inside.png'),
    ],
  },
  {
    slug: 'truskavets-buvet',
    title: 'Бювет мінеральних вод',
    city: 'Трускавець',
    region: 'Львівська область',
    category: 'Курорт',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Truskavets_Buvet.jpg/1280px-Truskavets_Buvet.jpg',
    rating: '4.8',
    price: 'від 520 грн',
    duration: '1 день',
    excerpt: 'Символ Трускавця: бювет, прогулянки курортним парком і мінеральна вода «Нафтуся».',
    description:
      'Трускавець - класичний курорт Львівщини, де головний ритм задають бювети мінеральних вод, тиша парку та неквапливі прогулянки. Маршрут добре підходить для відновлення, короткого вікенду й знайомства з оздоровчою традицією міста.',
    tags: ['Трускавець', 'Бювет', 'Львівщина'],
    facilities: [
      { id: 'view', label: 'Курортний парк', kind: 'view' },
      { id: 'food', label: 'Кафе поруч', kind: 'food' },
      { id: 'stay', label: 'Санаторії', kind: 'stay' },
      { id: 'car', label: 'Трансфер 10 хв', kind: 'car' },
    ],
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Truskavets_city_center.jpg/1280px-Truskavets_city_center.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Truskavets_resort_park.jpg/1280px-Truskavets_resort_park.jpg',
    ],
  },
  {
    slug: 'potemkin-odesa',
    title: 'Приморський маршрут',
    city: 'Одеса',
    region: 'Південь',
    category: 'Море',
    image:
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
    rating: '4.7',
    price: 'від 980 грн',
    duration: '1 день',
    excerpt: 'Морський вітер, театр, сходи й повільний південний день.',
    description:
      'Почни ранок із Приморського бульвару, спустись до води, а потім залиш собі час на обід із видом на порт. Це маршрут про настрій Одеси: світло, море, архітектура й довгі паузи між точками.',
    tags: ['Одеса', 'Море', 'Літо'],
    facilities: [
      { id: 'view', label: 'Вид на море', kind: 'view' },
      { id: 'food', label: 'Рибні місця', kind: 'food' },
      { id: 'coffee', label: 'Ранкова кава', kind: 'coffee' },
      { id: 'stay', label: 'Ніч біля центру', kind: 'stay' },
    ],
  },
  {
    slug: 'university-chernivtsi',
    title: 'Університет Чернівців',
    city: 'Чернівці',
    region: 'Буковина',
    category: 'Архітектура',
    image:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    rating: '4.9',
    price: 'від 560 грн',
    duration: '4-5 год',
    excerpt: 'Один із найкрасивіших університетських комплексів Європи й дуже камерне місто навколо.',
    description:
      'Чернівці добре працюють як одноденна втеча або неспішний старт буковинського маршруту. Університет, вулиця Кобилянської та маленькі кавові точки збираються в дуже мʼякий і стильний міський досвід.',
    tags: ['Чернівці', 'Естетика', 'Спокій'],
    facilities: [
      { id: 'museum', label: 'Екскурсія', kind: 'museum' },
      { id: 'coffee', label: 'Кавʼярні', kind: 'coffee' },
      { id: 'view', label: 'Красиві кадри', kind: 'view' },
      { id: 'stay', label: 'Центр пішки', kind: 'stay' },
    ],
  },
  {
    slug: 'fortress-kamianets',
    title: 'Фортеця Камʼянця',
    city: 'Камʼянець-Подільський',
    region: 'Поділля',
    category: 'Фортеця',
    image:
      'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80',
    rating: '4.8',
    price: 'від 840 грн',
    duration: '1 день',
    excerpt: 'Фортеця над каньйоном і один із найефектніших історичних кадрів країни.',
    description:
      'Камʼянець-Подільський добре відчувається як маршрут на один щільний день або як частина більшого подільського вікенду. Головний акцент тут не лише сама фортеця, а й рельєф міста, мости та краєвиди на каньйон.',
    tags: ['Камʼянець', 'Історія', 'Фото'],
    facilities: [
      { id: 'view', label: 'Каньйон', kind: 'view' },
      { id: 'museum', label: 'Фортеця-музей', kind: 'museum' },
      { id: 'food', label: 'Локальні страви', kind: 'food' },
      { id: 'car', label: 'Маршрут авто', kind: 'car' },
    ],
  },
];

export const UKRAINE_COLLECTIONS: Collection[] = [
  {
    slug: 'weekend-west',
    title: 'Львів + Чернівці',
    description: 'Спокійний архітектурний вікенд із кавою, старими фасадами й повільним ритмом двох міст.',
    image:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    duration: '3 дні',
    mood: 'місто / естетика',
    stops: ['Площа Ринок', 'Університет Чернівців'],
  },
  {
    slug: 'capital-days',
    title: 'Київ на 48 годин',
    description: 'Маршрут для першого знайомства: Софія, Поділ, панорами, гастро-паузи й вечірній Дніпро.',
    image:
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    duration: '2 дні',
    mood: 'історія / місто',
    stops: ['Софія Київська', 'Поділ', 'Дніпро'],
  },
  {
    slug: 'south-light',
    title: 'Південне світло Одеси',
    description: 'Літній сценарій про море, тераси, променад і повільні вечори біля води.',
    image:
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
    duration: '2-3 дні',
    mood: 'море / відпочинок',
    stops: ['Приморський бульвар', 'Пляжі', 'Вечірнє море'],
  },
];

export const SAVED_PLACE_SLUGS = ['sofiia-kyivska', 'fortress-kamianets', 'university-chernivtsi'];

export const PROFILE_DATA = {
  name: 'Марія',
  city: 'Київ',
  tagline: 'Збираю красиві українські маршрути на вихідні.',
  visitedCities: 9,
  savedPlaces: SAVED_PLACE_SLUGS.length,
  nextTrip: 'Львів та Чернівці · 12 травня',
  preferences: ['Архітектура', 'Кава', 'Тихі вулиці', 'Вікенди без авто'],
};

export function getPlaceBySlug(slug?: string) {
  return UKRAINE_PLACES.find((place) => place.slug === slug) ?? UKRAINE_PLACES[0];
}

export function getSavedPlaces() {
  return SAVED_PLACE_SLUGS.map((slug) => getPlaceBySlug(slug));
}

export function resolveImageSource(image: string | ImageSourcePropType) {
  return typeof image === 'string' ? { uri: image } : image;
}
