/* Catalogue. Prices are demo placeholders (Toman) until Parand sends its real menu. */

export const CATS = [
  { id: 'all',       label: 'همه',     icon: 'sparkles' },
  { id: 'croissant', label: 'کروسان',  icon: 'croissant' },
  { id: 'cake',      label: 'کیک',     icon: 'cake' },
  { id: 'dessert',   label: 'دسر',     icon: 'slice' },
  { id: 'cookie',    label: 'کوکی',    icon: 'cookie' },
  { id: 'cafe',      label: 'کافه',    icon: 'coffee' },
];

const img = (k, big = true) => ({ sm: `assets/img/${k}-480.webp`, lg: big ? `assets/img/${k}-900.webp` : `assets/img/${k}-480.webp` });

export const PRODUCTS = [
  {
    id: 'croissant-oreo', cat: 'croissant', name: 'کروسان شکلاتی', price: 385000, tag: 'پرفروش',
    img: img('croissant-oreo'),
    short: 'خامه‌ی تازه، اورئو و سس شکلات',
    desc: 'کروسان کره‌ای که از وسط باز می‌شود و با خامه‌ی تازه، بیسکویت اورئو و سس شکلات داغ پر می‌شود. روی آن هم یک اورئوی کامل می‌نشیند.',
    notes: ['خامه‌ی تازه', 'اورئو', 'سس شکلات'],
  },
  {
    id: 'croissant-strawberry', cat: 'croissant', name: 'کروسان توت‌فرنگی', price: 395000, tag: 'فصل',
    img: img('croissant-strawberry'),
    short: 'خامه، توت‌فرنگی تازه و گلیز',
    desc: 'دو لایه کروسان طلایی با خامه‌ی سبک و برش‌های توت‌فرنگی تازه، که با گلیز براق توت‌فرنگی پوشانده شده است.',
    notes: ['توت‌فرنگی تازه', 'گلیز توت‌فرنگی', 'خامه'],
  },
  {
    id: 'croissant-lotus', cat: 'croissant', name: 'کروسان لوتوس', price: 410000,
    img: img('croissant-lotus'),
    short: 'کرم و بیسکویت لوتوس، خامه',
    desc: 'کروسان پرملات با کرم کاراملی لوتوس، تکه‌های بیسکویت لوتوس و خامه‌ی تازه. برای کسانی که طعم کارامل و دارچین را دوست دارند.',
    notes: ['کرم لوتوس', 'بیسکویت لوتوس', 'خامه'],
  },
  {
    id: 'croissant-redvelvet', cat: 'croissant', name: 'کروسان ردولوت', price: 420000, tag: 'جدید',
    img: img('croissant-redvelvet'),
    short: 'خمیر دورنگ ردولوت، خامه و توت‌فرنگی',
    desc: 'کروسان راه‌راه با لایه‌های ردولوت، پر شده با خامه و توت‌فرنگی تازه. هم خوش‌طعم است، هم برای عکس گرفتن.',
    notes: ['ردولوت', 'توت‌فرنگی', 'خامه'],
  },
  {
    id: 'croissant-black', cat: 'croissant', name: 'کروسان بلک', price: 430000, tag: 'خاص',
    img: img('croissant-black'),
    short: 'خمیر مشکی، گاناش شکلات',
    desc: 'کروسان مشکی با گاناش شکلات، دیسک‌های شکلات شیری و یک توت‌فرنگی روی آن. انتخاب شکلات‌دوست‌ها.',
    notes: ['گاناش شکلات', 'شکلات شیری', 'توت‌فرنگی'],
  },
  {
    id: 'cake-vintage', cat: 'cake', name: 'کیک وینتیج صورتی', price: 1450000, tag: 'محبوب',
    img: img('cake-vintage'),
    short: 'مینی کیک وینتیج با پاپیون ساتن',
    desc: 'کیک وینتیج با خامه‌کشی صورتی، روبان ساتن و نوشته‌ی دلخواه. مناسب ۴ تا ۶ نفر. متن روی کیک را هنگام سفارش بنویس.',
    notes: ['۴ تا ۶ نفر', 'نوشته‌ی دلخواه', 'روبان ساتن'],
  },
  {
    id: 'bento-bear', cat: 'cake', name: 'بنتو کیک تولد', price: 890000,
    img: img('bento-bear', false),
    short: 'بنتو کیک با طرح فانتزی',
    desc: 'بنتو کیک کوچک برای ۲ تا ۳ نفر، با طرح فانتزی و نوشته‌ی تولد. در جعبه‌ی مخصوص بنتو تحویل می‌شود.',
    notes: ['۲ تا ۳ نفر', 'طرح فانتزی', 'جعبه‌ی بنتو'],
  },
  {
    id: 'mini-flower', cat: 'dessert', name: 'باکس مینی کیک گل', price: 1950000,
    img: img('mini-flower', false),
    short: '۱۲ مینی کیک با گل خامه‌ای',
    desc: 'باکس دوازده‌تایی مینی کیک با گل‌های خامه‌ای و تور. برای خواستگاری، نامزدی و مهمانی‌هایی که باید خاص باشند.',
    notes: ['۱۲ عدد', 'گل خامه‌ای', 'باکس هدیه'],
  },
  {
    id: 'cookie-brownie', cat: 'cookie', name: 'ست کوکی و براونی', price: 360000,
    img: img('cookie-brownie'),
    short: 'کوکی شکلات تلخ، براونی و تمشک',
    desc: 'چهار کوکی شکلات تلخ با دکمه‌ی شکلات شیری، تکه‌های براونی و تمشک. برای کنار قهوه یا هدیه‌ی کوچک.',
    notes: ['۴ کوکی', 'براونی', 'تمشک'],
  },
];

/* café menu: a compact list, no photos */
export const CAFE = [
  { id: 'cafe-espresso',  name: 'اسپرسو',      price: 110000, note: 'دبل شات' },
  { id: 'cafe-americano', name: 'آمریکانو',    price: 120000, note: 'گرم یا سرد' },
  { id: 'cafe-latte',     name: 'لاته',        price: 165000, note: 'با شیر یا شیر جو' },
  { id: 'cafe-mocha',     name: 'موکا',        price: 180000, note: 'شکلات تلخ' },
  { id: 'cafe-hotchoc',   name: 'هات چاکلت',   price: 175000, note: 'با مارشمالو' },
  { id: 'cafe-masala',    name: 'چای ماسالا',  price: 140000, note: 'دم‌کرده با ادویه' },
];

export const ALL = [...PRODUCTS, ...CAFE.map((c) => ({ ...c, cat: 'cafe', short: c.note }))];
export const byId = (id) => ALL.find((p) => p.id === id);

/* custom cake builder */
export const CUSTOM = {
  occasions: ['تولد', 'سالگرد', 'خواستگاری و نامزدی', 'تعیین جنسیت', 'فارغ‌التحصیلی', 'مناسبت دیگر'],
  sizes: [
    { id: 'bento',  label: 'بنتو',   serves: '۲ تا ۳ نفر',   base: 890000,  r: 0.62 },
    { id: 'small',  label: 'کوچک',   serves: '۶ تا ۸ نفر',   base: 1650000, r: 0.78 },
    { id: 'medium', label: 'متوسط',  serves: '۱۲ تا ۱۵ نفر', base: 2650000, r: 0.9 },
    { id: 'large',  label: 'بزرگ',   serves: '۲۰ تا ۲۵ نفر', base: 3900000, r: 1 },
  ],
  flavors: ['وانیل', 'شکلات', 'ردولوت', 'هویج و گردو'],
  fillings: [
    { id: 'strawberry', label: 'خامه و توت‌فرنگی', add: 0 },
    { id: 'ganache',    label: 'گاناش شکلات',      add: 120000 },
    { id: 'lotus',      label: 'لوتوس',            add: 160000 },
    { id: 'nutella',    label: 'نوتلا',            add: 160000 },
    { id: 'caramel',    label: 'موز و کارامل',     add: 90000 },
  ],
  decos: [
    { id: 'vintage', label: 'وینتیج',       add: 220000 },
    { id: 'minimal', label: 'مینیمال',      add: 0 },
    { id: 'flower',  label: 'گل خامه‌ای',   add: 280000 },
    { id: 'fantasy', label: 'فانتزی',       add: 350000 },
  ],
  colors: [
    { id: 'pink',  label: 'صورتی', hex: '#F4A3BF', dark: '#E07399' },
    { id: 'white', label: 'سفید',  hex: '#FBF7F5', dark: '#E6DCD8' },
    { id: 'black', label: 'مشکی',  hex: '#2A2628', dark: '#141213' },
    { id: 'lilac', label: 'یاسی',  hex: '#C9B6E4', dark: '#A68DCB' },
    { id: 'cream', label: 'کرم',   hex: '#F3E3C8', dark: '#DCC39C' },
  ],
  slots: ['۱۰ تا ۱۲', '۱۲ تا ۱۵', '۱۵ تا ۱۸', '۱۸ تا ۲۱'],
};

export const SHOP = {
  name: 'قنادی پرند',
  latin: 'PARAND PASTRY',
  motto: 'SWEET LIKE YOU',
  instagram: 'https://instagram.com/parandpastry',
  handle: '@parandpastry',
  posts: 130,
  followers: '۲۲٫۴ هزار',
  delivery: 90000,
};
