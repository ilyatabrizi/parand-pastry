/* Shared UI: helpers, delegated actions, toasts, sheets, theme, glass light. */
import { ico } from './icons.js';

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export const haptic = (ms = 6) => { try { navigator.vibrate?.(ms); } catch (_) { /* not everywhere */ } };

/* numbers: the FaNum font draws Persian digits, so we only swap the separator */
export const money = (n) => Math.round(n).toLocaleString('en-US').replace(/,/g, '٬');
export const price = (n) => `${money(n)}<small> تومان</small>`;
const FA = '۰۱۲۳۴۵۶۷۸۹', AR = '٠١٢٣٤٥٦٧٨٩';
export const latinDigits = (s) => String(s).replace(/[۰-۹]/g, (d) => FA.indexOf(d)).replace(/[٠-٩]/g, (d) => AR.indexOf(d));
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const faDate = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { day: 'numeric', month: 'long' });
const faWeek = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { weekday: 'long' });
const faFull = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { day: 'numeric', month: 'long', year: 'numeric' });
const faTime = new Intl.DateTimeFormat('fa-IR', { hour: '2-digit', minute: '2-digit' });
export const fmt = { date: (d) => faDate.format(d), week: (d) => faWeek.format(d), full: (d) => faFull.format(d), time: (d) => faTime.format(d) };

/* ── delegated actions: <button data-act="name" data-id="…"> ── */
const ACTS = {};
export const on = (map) => Object.assign(ACTS, map);
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el || el.disabled) return;
  const fn = ACTS[el.dataset.act];
  if (!fn) return;
  e.preventDefault();
  fn(el, e);
});

/* ── toasts ── */
export function toast(msg, icon = 'check') {
  const host = $('#toasts');
  const t = document.createElement('div');
  t.className = 'toast glass';
  t.setAttribute('role', 'status');
  t.innerHTML = `<span class="t-ico">${ico(icon, 15)}</span><span>${msg}</span>`;
  host.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 360); }, 2300);
}

/* ── sheets: one at a time, dragged down to close ── */
let current = null;
export function openSheet(html, { cls = '', onOpen } = {}) {
  closeSheet(true);
  const scrim = document.createElement('div');
  scrim.className = 'scrim';
  const sh = document.createElement('section');
  sh.className = `sheet ${cls}`;
  sh.setAttribute('role', 'dialog');
  sh.setAttribute('aria-modal', 'true');
  sh.innerHTML = `<div class="sheet-grab" aria-hidden="true"></div>${html}`;
  document.body.append(scrim, sh);
  document.documentElement.classList.add('locked');
  requestAnimationFrame(() => requestAnimationFrame(() => { scrim.classList.add('in'); sh.classList.add('in'); }));
  scrim.addEventListener('click', () => closeSheet());
  current = { scrim, sh };
  dragToClose(sh);
  onOpen?.(sh);
  setTimeout(() => sh.querySelector('[data-autofocus]')?.focus(), 380);
  return sh;
}
export function closeSheet(now = false) {
  if (!current) return;
  const { scrim, sh } = current;
  current = null;
  document.documentElement.classList.remove('locked');
  if (now) { scrim.remove(); sh.remove(); return; }
  scrim.classList.remove('in'); sh.classList.remove('in');
  sh.style.transform = '';
  setTimeout(() => { scrim.remove(); sh.remove(); }, 480);
}
on({ closeSheet: () => closeSheet() });
addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });

function dragToClose(sh) {
  let y0 = null, dy = 0;
  const grab = sh.querySelector('.sheet-grab');
  const body = () => sh.querySelector('.sheet-body');
  sh.addEventListener('pointerdown', (e) => {
    if (innerWidth >= 760) return;
    const onGrab = e.target.closest('.sheet-grab, .sheet-head, .sh-media');
    const atTop = (body()?.scrollTop || 0) <= 0;
    if (!onGrab && !(atTop && e.target.closest('.sheet-body') && e.pointerType !== 'mouse')) return;
    if (e.target.closest('input, textarea, button, a, select, label')) return;
    y0 = e.clientY; dy = 0;
  });
  sh.addEventListener('pointermove', (e) => {
    if (y0 == null) return;
    dy = Math.max(0, e.clientY - y0);
    if (dy > 4) { sh.classList.add('drag'); sh.style.transform = `translateY(${dy}px)`; }
  });
  const end = () => {
    if (y0 == null) return;
    y0 = null;
    sh.classList.remove('drag');
    if (dy > 110) closeSheet(); else sh.style.transform = '';
  };
  sh.addEventListener('pointerup', end);
  sh.addEventListener('pointercancel', end);
  grab?.addEventListener('click', () => closeSheet());
}

/* ── theme: light / dark / system, remembered; circular reveal from the button ── */
const TKEY = 'pp.theme';
const mq = matchMedia('(prefers-color-scheme: dark)');
export const themePref = () => { try { return localStorage.getItem(TKEY) || 'system'; } catch (_) { return 'system'; } };
const resolved = (p = themePref()) => (p === 'system' ? (mq.matches ? 'dark' : 'light') : p);
function apply() {
  const t = resolved();
  document.documentElement.dataset.theme = t;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t === 'dark' ? '#0B0A0B' : '#FBFAFA');
  document.dispatchEvent(new CustomEvent('themechange', { detail: t }));
}
mq.addEventListener?.('change', () => { if (themePref() === 'system') apply(); });
export function setTheme(pref, from) {
  try { localStorage.setItem(TKEY, pref); } catch (_) { /* ignore */ }
  const before = document.documentElement.dataset.theme;
  if (resolved(pref) === before) { apply(); return; }
  if (!document.startViewTransition || reduced()) { apply(); return; }
  const r = from?.getBoundingClientRect?.();
  const x = r ? r.left + r.width / 2 : innerWidth / 2, y = r ? r.top + r.height / 2 : 0;
  const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  document.documentElement.classList.add('vt');
  const vt = document.startViewTransition(apply);
  vt.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
      { duration: 620, easing: 'cubic-bezier(.22,1,.36,1)', pseudoElement: '::view-transition-new(root)' },
    );
  }).catch(() => {});
  vt.finished.finally(() => document.documentElement.classList.remove('vt'));
}
export const toggleTheme = (btn) => setTheme(resolved() === 'dark' ? 'light' : 'dark', btn);
apply();

/* ── glass: a highlight that follows the finger ── */
document.addEventListener('pointermove', (e) => {
  const g = e.target.closest?.('.glass, .glass-thick, .lift');
  if (!g) return;
  const r = g.getBoundingClientRect();
  g.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
  g.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
}, { passive: true });
document.addEventListener('pointerdown', (e) => {
  const g = e.target.closest?.('.glass, .glass-thick, .lift');
  if (!g) return;
  g.setAttribute('data-lit', '');
  const off = () => { g.removeAttribute('data-lit'); removeEventListener('pointerup', off); removeEventListener('pointercancel', off); };
  addEventListener('pointerup', off); addEventListener('pointercancel', off);
}, { passive: true });
