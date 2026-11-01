/* Local state for the demo: basket, favourites, orders, custom-cake requests, profile. */
const KEY = 'pp.v1';
const blank = () => ({ basket: {}, favs: [], orders: [], requests: [], user: { name: '', phone: '' }, hint: false });

let S = blank();
try { S = { ...blank(), ...(JSON.parse(localStorage.getItem(KEY)) || {}) }; } catch (_) { /* private mode */ }

const subs = new Set();
export const state = () => S;
export const onChange = (fn) => { subs.add(fn); return () => subs.delete(fn); };
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (_) { /* quota or private mode: keep in memory */ }
  subs.forEach((f) => f(S));
}

/* basket */
export const qty = (id) => S.basket[id] || 0;
export const count = () => Object.values(S.basket).reduce((a, b) => a + b, 0);
export function setQty(id, n) {
  n = Math.max(0, Math.min(20, n | 0));
  if (n) S.basket[id] = n; else delete S.basket[id];
  save();
}
export const add = (id, n = 1) => setQty(id, qty(id) + n);
export const clearBasket = () => { S.basket = {}; save(); };

/* favourites */
export const isFav = (id) => S.favs.includes(id);
export function toggleFav(id) {
  S.favs = isFav(id) ? S.favs.filter((x) => x !== id) : [id, ...S.favs];
  save();
  return isFav(id);
}

/* orders + requests */
export function addOrder(o) { S.orders = [o, ...S.orders]; save(); }
export function addRequest(r) { S.requests = [r, ...S.requests]; save(); }

/* profile */
export function setUser(u) { S.user = { ...S.user, ...u }; save(); }
export function dismissHint() { S.hint = true; save(); }

export function resetAll() { S = blank(); save(); }
