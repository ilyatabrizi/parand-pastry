/* The glass tab bar. It minimises while you read down a page, the way iOS 26 does (the Kairo pattern).
 *
 * Expanded: all five tabs and a lens under the current one; the lens can be dragged along the bar.
 * Minimised: the capsule narrows to the current tab at the leading edge (right, in Persian) and an accessory
 * button appears at the trailing edge: the basket, or back-to-top when you are already in the basket.
 * Scrolling up, tapping the capsule, or changing page opens it again.
 *
 * Rules this is built to (from the vault's glass tab bar notes):
 * - Tabs never resize. The capsule clips a fixed-width row and the row slides; nothing reflows mid-animation.
 * - Geometry is CSS from the viewport; JS only sets --li / --shift and the .min class.
 * - The lens lives inside the row it points at.
 * - Nothing above the glass carries a transform, filter or opacity < 1, so the blur keeps working. */
import { ico } from './icons.js';
import { on, reduced, haptic } from './ui.js';

export const TABS = [
  { id: 'home',     href: '#/',         icon: 'home',  label: 'خانه' },
  { id: 'products', href: '#/products', icon: 'grid',  label: 'محصولات' },
  { id: 'custom',   href: '#/custom',   icon: 'cake',  label: 'کیک سفارشی' },
  { id: 'basket',   href: '#/basket',   icon: 'bag',   label: 'سبد خرید' },
  { id: 'profile',  href: '#/profile',  icon: 'user',  label: 'پروفایل' },
];

const $ = (s) => document.querySelector(s);
const rtl = () => document.documentElement.dir === 'rtl';
let bar, caps, row, tabs = [], acc;
let active = -1, minimized = false, count = 0;

export function buildNav() {
  bar = $('#tabbar');
  bar.className = 'tabbar';
  bar.style.setProperty('--n', String(TABS.length));
  bar.innerHTML = `
    <div class="tabbar-in">
      <nav class="tb glass" id="tabs" aria-label="منوی اصلی">
        <div class="tb-row" id="tabs-row">
          <span class="tb-lens" aria-hidden="true"></span>
          ${TABS.map((t, i) => `
            <a class="tab" href="${t.href}" data-tab="${t.id}" data-i="${i}" draggable="false">
              <span class="tab-ico">${ico(t.icon, 23)}</span><span class="tab-label">${t.label}</span>
            </a>`).join('')}
        </div>
      </nav>
      <button class="tb-acc glass" data-act="navAcc" aria-label="سبد خرید" tabindex="-1">
        <span class="acc-bag">${ico('bag', 21)}<b class="acc-n"></b></span><span class="acc-top">${ico('toTop', 21)}</span>
      </button>
    </div>`;
  caps = $('#tabs'); row = $('#tabs-row'); acc = bar.querySelector('.tb-acc');
  tabs = [...row.querySelectorAll('.tab')];
  bindPointer();
}

function place() {
  const n = tabs.length, i = Math.max(0, active);
  bar.classList.toggle('no-lens', active < 0);
  bar.style.setProperty('--li', String(rtl() ? n - 1 - i : i));
  bar.style.setProperty('--shift', String(rtl() ? i : -i));
  const toTop = TABS[active]?.id === 'basket';
  acc.classList.toggle('is-top', toTop);
  acc.setAttribute('aria-label', toTop ? 'بازگشت به بالا' : 'سبد خرید');
}

export function paintNav(tab, basketCount) {
  active = TABS.findIndex((t) => t.id === tab);
  tabs.forEach((t, i) => {
    if (i === active) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
  });
  setCount(basketCount);
  place();
  setMin(false);
}

export function setCount(n) {
  if (!bar) return;
  const grew = n > count;
  count = n;
  const t = tabs.find((x) => x.dataset.tab === 'basket');
  let b = t.querySelector('.badge');
  if (n && !b) { t.querySelector('.tab-ico').insertAdjacentHTML('beforeend', '<span class="badge"></span>'); b = t.querySelector('.badge'); }
  if (b) { if (n) b.textContent = n; else b.remove(); }
  acc.querySelector('.acc-n').textContent = n || '';
  acc.classList.toggle('has-n', !!n);
  if (grew && b) { b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); }
}

/* ── minimise on scroll ── */
function canMin() {
  return active >= 0 && !document.documentElement.classList.contains('locked')
    && document.documentElement.scrollHeight - innerHeight > 600;   // never on a page you can see the end of
}
function setMin(v) {
  if (v && !canMin()) return;
  if (v === minimized || !bar) return;
  minimized = v;
  bar.classList.toggle('min', v);
  acc.tabIndex = v ? 0 : -1;
  caps.setAttribute('aria-label', v ? 'نمایش همه‌ی بخش‌ها' : 'منوی اصلی');
}
export const expandNav = () => setMin(false);

let lastY = scrollY, run = 0;
addEventListener('scroll', () => {
  const y = scrollY, dy = y - lastY;
  lastY = y;
  if (y < 80) { run = 0; setMin(false); return; }
  /* travel has to add up in one direction, so a wobbly thumb never flips the bar back and forth */
  run = (dy > 0) === (run > 0) ? run + dy : dy;
  if (run > 60) setMin(true);
  else if (run < -40) setMin(false);
}, { passive: true });

on({
  navAcc(el) {
    haptic();
    if (el.classList.contains('is-top')) scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' });
    else location.hash = '#/basket';
  },
});

/* ── tap, re-tap, and drag the lens ── */
let drag = null, swallow = false;
function bindPointer() {
  caps.addEventListener('dragstart', (e) => e.preventDefault());
  caps.addEventListener('pointerdown', (e) => {
    if (minimized || e.button > 0) return;
    drag = { x0: e.clientX, id: e.pointerId, moved: false, idx: active };
  });
  caps.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    if (!drag.moved) {
      if (Math.abs(e.clientX - drag.x0) < 10) return;
      drag.moved = true;
      try { caps.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
      bar.classList.add('dragging');
    }
    const r = row.getBoundingClientRect(), w = r.width / tabs.length;
    const x = Math.min(r.width - w, Math.max(0, e.clientX - r.left - w / 2));
    bar.style.setProperty('--drag-x', `${x}px`);
    const slot = Math.round(x / w);
    const idx = rtl() ? tabs.length - 1 - slot : slot;
    if (idx !== drag.idx) { drag.idx = idx; haptic(4); tabs.forEach((t, i) => t.classList.toggle('under', i === idx)); }
  });
  const end = (go) => {
    if (!drag) return;
    const d = drag; drag = null;
    bar.classList.remove('dragging');
    tabs.forEach((t) => t.classList.remove('under'));
    if (!d.moved) return;
    swallow = true; setTimeout(() => { swallow = false; }, 0);
    const t = tabs[d.idx];
    if (go && t && d.idx !== active) location.hash = t.getAttribute('href');
  };
  caps.addEventListener('pointerup', () => end(true));
  caps.addEventListener('pointercancel', () => end(false));
  caps.addEventListener('click', (e) => {
    if (swallow) { e.preventDefault(); e.stopPropagation(); return; }
    if (minimized) { e.preventDefault(); e.stopPropagation(); setMin(false); return; }
    const t = e.target.closest('.tab');
    if (!t) return;
    haptic();
    const here = '#' + (location.hash.replace(/^#/, '').split('?')[0] || '/');
    if (t.getAttribute('href') === here) {
      e.preventDefault();
      scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' });
    }
  }, true);
}
