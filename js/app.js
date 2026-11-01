/* Parand Pastry: the app. Hash routes, five tabs, sheets for detail. */
import { CATS, PRODUCTS, CAFE, ALL, byId, CUSTOM, SHOP } from './data.js';
import { ico, mark } from './icons.js';
import * as S from './store.js';
import { $, $$, on, money, price, esc, fmt, latinDigits, toast, openSheet, closeSheet, toggleTheme, setTheme, themePref, reduced, haptic } from './ui.js';
import { buildNav, paintNav, setCount, expandNav } from './nav.js';

const view = $('#view');
const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
let installEvt = null;
addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); installEvt = e; $$('[data-install-btn]').forEach((b) => b.hidden = false); });
addEventListener('appinstalled', () => { installEvt = null; toast('اپ قنادی پرند نصب شد'); });

/* ═══ shared pieces ═══════════════════════════════════════════════════ */

const img = (p, size = 'sm', cls = '') => `<img class="${cls}" src="${p.img[size]}" ${size === 'sm' && p.img.lg !== p.img.sm ? `srcset="${p.img.sm} 480w, ${p.img.lg} 900w" sizes="(min-width: 900px) 25vw, 50vw"` : ''} alt="${esc(p.name)}" loading="lazy" decoding="async">`;

function addCtl(id, big = false) {
  const n = S.qty(id);
  if (!n) return `<span class="addctl${big ? ' big' : ''}" data-ctl="${id}"><button class="addbtn" data-act="inc" data-id="${id}" aria-label="افزودن به سبد">${ico('plus', big ? 20 : 18)}${big ? '<span>افزودن به سبد</span>' : ''}</button></span>`;
  return `<span class="addctl on${big ? ' big' : ''}" data-ctl="${id}"><span class="stepper">
    <button data-act="inc" data-id="${id}" aria-label="یکی بیشتر">${ico('plus', 17)}</button>
    <b class="q">${n}</b>
    <button data-act="dec" data-id="${id}" aria-label="یکی کمتر">${ico(n === 1 ? 'trash' : 'minus', 17)}</button>
  </span></span>`;
}

const favBtn = (id) => `<button class="fav glass${S.isFav(id) ? ' on' : ''}" data-act="fav" data-id="${id}" aria-label="علاقه‌مندی" aria-pressed="${S.isFav(id)}">${ico('heart', 18)}</button>`;

function pcard(p) {
  return `<article class="pcard" data-open="${p.id}">
    <div class="pc-img">${img(p)}${p.tag ? `<span class="pc-tag">${p.tag}</span>` : ''}${favBtn(p.id)}</div>
    <div class="pc-body">
      <h3 class="pc-name">${p.name}</h3>
      <p class="pc-short">${p.short}</p>
      <div class="pc-foot"><span class="price">${price(p.price)}</span>${addCtl(p.id)}</div>
    </div>
  </article>`;
}

function cafeRow(c) {
  return `<div class="crow">
    <span class="crow-ico">${ico('coffee', 20)}</span>
    <div class="crow-t"><b>${c.name}</b><small>${c.note}</small></div>
    <span class="price">${price(c.price)}</span>${addCtl(c.id)}
  </div>`;
}

const head = (title, sub, extra = '') => `<header class="phead wrap"><div><h1 class="h1">${title}</h1>${sub ? `<p class="lead">${sub}</p>` : ''}</div>${extra}</header>`;

function footer() {
  return `<footer class="foot wrap">
    <div class="foot-brand">${mark('foot-mark')}<div><b>${SHOP.name}</b><span class="latin">${SHOP.latin} . ${SHOP.motto}</span></div></div>
    <div class="foot-links">
      <a class="chip glass" href="${SHOP.instagram}" target="_blank" rel="noopener">${ico('instagram', 17)}<span class="latin">${SHOP.handle}</span></a>
    </div>
    <p class="foot-note">نسخه‌ی نمایشی است؛ قیمت‌ها نمونه‌اند و پرداخت شبیه‌سازی می‌شود.</p>
    <a class="alpha" href="https://alphaa.agency" target="_blank" rel="noopener" dir="ltr">
      <span>Powered by Alpha Agency</span>
      <img class="alpha-b" src="assets/brand/alpha-black.png" alt="Alpha Agency" width="44" height="33">
      <img class="alpha-w" src="assets/brand/alpha-white.png" alt="" width="44" height="33">
    </a>
  </footer>`;
}

/* ═══ HOME ═══════════════════════════════════════════════════════════ */

function home() {
  const best = ['croissant-oreo', 'croissant-redvelvet', 'cake-vintage', 'croissant-lotus', 'croissant-black', 'mini-flower'].map(byId);
  const hint = !isStandalone() && !S.state().hint;
  return `
  <section class="hero" id="hero">
    <div class="hero-media">
      <video class="hero-video" src="assets/media/hero.mp4" poster="assets/media/hero-poster.webp" autoplay muted loop playsinline preload="auto" disablepictureinpicture disableremoteplayback aria-hidden="true" tabindex="-1"></video>
      <div class="hero-shade"></div>
    </div>
    <div class="hero-in">
      <span class="kicker glass on-media latin">${SHOP.latin}</span>
      <h1 class="hero-title">شیرین،<br>مثل خودت</h1>
      <p class="hero-sub">کروسان‌های پرملات، کیک‌هایی که برای تو طراحی می‌شوند و دسرهای روز؛ هر روز تازه از آشپزخانه‌ی پرند.</p>
      <div class="hero-cta">
        <a href="#/products" class="btn btn-light">منوی امروز ${ico('chevL', 18, 'dir')}</a>
        <a href="#/custom" class="btn glass on-media">${ico('cake', 19)} کیک شخصی</a>
      </div>
    </div>
    <div class="hero-frame" aria-hidden="true"></div>
    <a class="hero-ig glass on-media" href="${SHOP.instagram}" target="_blank" rel="noopener">${ico('instagram', 16)}<span>${SHOP.followers} دنبال‌کننده</span></a>
  </section>

  ${hint ? `<div class="wrap"><div class="install-card glass" id="installCard">
    <span class="ic-mark">${mark()}</span>
    <div class="ic-t"><b>پرند را روی صفحه‌ی اصلی بگذار</b><small>مثل یک اپ واقعی، با یک لمس باز می‌شود.</small></div>
    <button class="btn btn-sm btn-dark" data-act="install">نصب</button>
    <button class="icon-btn sm" data-act="hideHint" aria-label="بستن">${ico('x', 18)}</button>
  </div></div>` : ''}

  <section class="wrap sec">
    <div class="cats">
      ${CATS.filter((c) => c.id !== 'all').map((c) => `<a class="cat glass" href="#/products?c=${c.id}"><span class="cat-ico">${ico(c.icon, 24)}</span><span>${c.label}</span></a>`).join('')}
    </div>
  </section>

  <section class="sec">
    <div class="sec-head wrap"><h2 class="h2">پرطرفدارهای این هفته</h2><a class="more" href="#/products">همه ${ico('chevL', 16, 'dir')}</a></div>
    <div class="rail">${best.map(pcard).join('')}</div>
  </section>

  <section class="wrap sec">
    <a class="promo" href="#/custom">
      <div class="promo-img"><img src="assets/img/cake-vintage-900.webp" alt="کیک وینتیج صورتی قنادی پرند" loading="lazy"></div>
      <div class="promo-t">
        <span class="eyebrow">${ico('sparkles', 15)} کیک شخصی</span>
        <h2 class="h2">کیکی که فقط مال توست</h2>
        <p>اندازه، طعم، رنگ و نوشته را خودت انتخاب کن؛ پیش‌نمایشش را همان لحظه ببین و درخواست را بفرست.</p>
        <span class="btn btn-pink">طراحی کیک ${ico('chevL', 18, 'dir')}</span>
      </div>
    </a>
  </section>

  <section class="wrap sec">
    <div class="feats">
      <div class="feat card"><span class="feat-ico">${ico('wheat', 22)}</span><b>پخت هر روز</b><small>هر صبح از نو؛ چیزی از دیروز پشت ویترین نمی‌ماند.</small></div>
      <div class="feat card"><span class="feat-ico">${ico('cake', 22)}</span><b>با طرح تو</b><small>از بنتو کیک تا کیک دو طبقه، با نوشته و رنگ دلخواه.</small></div>
      <div class="feat card"><span class="feat-ico">${ico('gift', 22)}</span><b>آماده‌ی هدیه</b><small>باکس و روبان پرند، برای وقتی که می‌خواهی کسی را غافلگیر کنی.</small></div>
    </div>
  </section>

  <section class="wrap sec">
    <div class="sec-head"><h2 class="h2">کنار شیرینی، یک قهوه</h2><a class="more" href="#/products?c=cafe">منوی کافه ${ico('chevL', 16, 'dir')}</a></div>
    <div class="clist card">${CAFE.slice(0, 3).map(cafeRow).join('')}</div>
  </section>

  <section class="wrap sec">
    <a class="ig card" href="${SHOP.instagram}" target="_blank" rel="noopener">
      <span class="ig-av">${mark()}</span>
      <div class="ig-t"><b class="latin">parandpastry</b><small>${SHOP.name} در اینستاگرام</small></div>
      <div class="ig-n"><b>${money(SHOP.posts)}</b><small>پست</small></div>
      <div class="ig-n"><b>${SHOP.followers}</b><small>دنبال‌کننده</small></div>
      <span class="btn btn-sm btn-dark">${ico('instagram', 16)} دنبال کن</span>
    </a>
  </section>
  ${footer()}`;
}

function afterHome() {
  const v = $('.hero-video');
  if (!v) return;
  v.muted = true; v.defaultMuted = true; v.setAttribute('muted', '');
  const play = () => v.play().catch(() => {});
  if (reduced()) v.pause(); else play();
  /* the desktop hero shows the film again, sharp, in a portrait frame */
  if (matchMedia('(min-width: 900px)').matches) {
    $('.hero-frame').innerHTML = `<video src="assets/media/hero.mp4" autoplay muted loop playsinline preload="auto" disablepictureinpicture></video>`;
    const v2 = $('.hero-frame video'); v2.muted = true; v2.play().catch(() => {});
  }
  const io = new IntersectionObserver(([e]) => {
    $$('#hero video').forEach((x) => { if (e.isIntersecting && !reduced()) x.play().catch(() => {}); else x.pause(); });
  });
  io.observe($('#hero'));
  cleanup = () => io.disconnect();
}

/* ═══ PRODUCTS ═══════════════════════════════════════════════════════ */

let pState = { c: 'all', q: '' };
function products(params) {
  pState.c = CATS.some((c) => c.id === params.get('c')) ? params.get('c') : 'all';
  return `
  ${head('محصولات', 'تازه از آشپزخانه‌ی پرند، برای امروز و برای سفارش.')}
  <div class="filters">
    <div class="wrap">
      <label class="search glass">${ico('search', 19)}<input id="q" type="search" placeholder="جست‌وجو در منو…" value="${esc(pState.q)}" autocomplete="off" enterkeyhint="search"></label>
      <div class="chips-wrap glass"><div class="seg chips" id="catSeg" role="tablist">
        <span class="seg-pill" aria-hidden="true"></span>
        ${CATS.map((c) => `<button role="tab" data-act="cat" data-c="${c.id}" class="${c.id === pState.c ? 'on' : ''}" aria-selected="${c.id === pState.c}">${ico(c.icon, 17)}<span>${c.label}</span></button>`).join('')}
      </div></div>
    </div>
  </div>
  <div class="wrap" id="results">${results()}</div>
  ${footer()}`;
}

function results() {
  const q = pState.q.trim();
  const m = (p) => !q || (p.name + p.short).includes(q);
  const items = PRODUCTS.filter((p) => (pState.c === 'all' || p.cat === pState.c) && m(p));
  const cafe = (pState.c === 'all' || pState.c === 'cafe') ? CAFE.filter((c) => !q || (c.name + c.note).includes(q)) : [];
  if (!items.length && !cafe.length) {
    return `<div class="empty">${mark('empty-mark')}<b>چیزی پیدا نشد</b><small>عبارت دیگری را امتحان کن یا سراغ کیک سفارشی برو.</small><a href="#/custom" class="btn btn-dark btn-sm">کیک سفارشی</a></div>`;
  }
  return `${items.length ? `<div class="grid">${items.map(pcard).join('')}</div>` : ''}
    ${cafe.length ? `<div class="sec"><div class="sec-head"><h2 class="h2">منوی کافه</h2></div><div class="clist card">${cafe.map(cafeRow).join('')}</div></div>` : ''}`;
}

function placeSeg(seg, animate = true) {
  if (!seg) return;
  const on = seg.querySelector('button.on'), pill = seg.querySelector('.seg-pill');
  if (!on || !pill) return;
  if (!animate) pill.style.transition = 'none';
  pill.style.width = `${on.offsetWidth}px`;
  pill.style.transform = `translateX(${on.offsetLeft}px)`;
  if (!animate) { void pill.offsetWidth; pill.style.transition = ''; }
}

function afterProducts() {
  const seg = $('#catSeg');
  placeSeg(seg, false);
  seg.querySelector('button.on')?.scrollIntoView({ block: 'nearest', inline: 'center' });
  $('#q').addEventListener('input', (e) => { pState.q = e.target.value; $('#results').innerHTML = results(); });
  const ro = new ResizeObserver(() => placeSeg(seg, false));
  ro.observe(seg);
  cleanup = () => ro.disconnect();
}

on({
  cat(el) {
    pState.c = el.dataset.c;
    const seg = $('#catSeg');
    $$('button', seg).forEach((b) => { b.classList.toggle('on', b === el); b.setAttribute('aria-selected', b === el); });
    placeSeg(seg);
    el.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduced() ? 'auto' : 'smooth' });
    history.replaceState(null, '', pState.c === 'all' ? '#/products' : `#/products?c=${pState.c}`);
    $('#results').innerHTML = results();
    haptic(4);
  },
});

/* product detail sheet */
function openProduct(id) {
  const p = byId(id);
  if (!p || !p.img) return;
  openSheet(`
    <div class="sh-media"><img src="${p.img.lg}" alt="${esc(p.name)}">${favBtn(p.id)}
      <button class="sh-close" data-act="closeSheet" aria-label="بستن">${ico('x', 20)}</button></div>
    <div class="sheet-body">
      ${p.tag ? `<span class="pill-tag">${p.tag}</span>` : ''}
      <h2 class="h2 sh-title">${p.name}</h2>
      <p class="sh-desc">${p.desc}</p>
      <div class="notes">${p.notes.map((n) => `<span>${n}</span>`).join('')}</div>
    </div>
    <div class="sheet-foot"><span class="price big">${price(p.price)}</span>${addCtl(p.id, true)}</div>`, { cls: 'product' });
}
view.addEventListener('click', (e) => {
  const card = e.target.closest('[data-open]');
  if (!card || e.target.closest('button, a')) return;
  openProduct(card.dataset.open);
});

/* ═══ CUSTOM CAKE ════════════════════════════════════════════════════ */

const draft = { occasion: '', size: 'small', tiers: 1, flavor: '', filling: '', deco: 'vintage', color: 'pink', text: '', date: '', slot: '', delivery: 'pickup', name: '', phone: '', note: '', photo: '' };

function days() {
  const out = [], d0 = new Date();
  for (let i = 2; i < 16; i++) { const d = new Date(d0); d.setDate(d0.getDate() + i); d.setHours(12, 0, 0, 0); out.push(d); }
  return out;
}
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

function estimate() {
  const s = CUSTOM.sizes.find((x) => x.id === draft.size);
  const f = CUSTOM.fillings.find((x) => x.id === draft.filling);
  const d = CUSTOM.decos.find((x) => x.id === draft.deco);
  const e = s.base * (draft.tiers === 2 ? 1.45 : 1) + (f?.add || 0) + (d?.add || 0);
  const r10 = (n) => Math.round(n / 10000) * 10000;
  return { lo: r10(e * 0.92), hi: r10(e * 1.12) };
}

function cakeSVG() {
  const col = CUSTOM.colors.find((c) => c.id === draft.color);
  const sz = CUSTOM.sizes.find((s) => s.id === draft.size);
  const two = draft.tiers === 2;
  const bw = 112 + 74 * sz.r, bh = 56 + 12 * sz.r, bx = (260 - bw) / 2, by = 186 - bh;
  const tw = bw * 0.64, th = bh * 0.86, tx = (260 - tw) / 2, ty = by - th;
  const ink = draft.color === 'black' ? '#F7F1F3' : col.dark;
  const tier = (x, y, w, h) => {
    let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${col.hex}"/>
      <rect x="${x}" y="${y}" width="${w}" height="${h * 0.22}" rx="10" fill="#fff" opacity=".22"/>
      <rect x="${x + 6}" y="${y + 6}" width="${w * 0.18}" height="${h - 14}" rx="6" fill="#fff" opacity=".12"/>`;
    if (draft.deco === 'vintage') {
      for (let cx = x + 8; cx <= x + w - 6; cx += 11) s += `<circle cx="${cx}" cy="${y + 2}" r="6.2" fill="${col.hex}" stroke="${col.dark}" stroke-width="1.4"/>`;
      for (let cx = x + 7; cx <= x + w - 5; cx += 10) s += `<path d="M${cx - 5} ${y + h} q5 7 10 0" fill="${col.hex}" stroke="${col.dark}" stroke-width="1.3"/>`;
      s += `<path d="M${x + 4} ${y + h * 0.48} q${w / 8} 12 ${w / 4} 0 t${w / 4} 0 t${w / 4} 0 t${w / 4 - 8} 0" fill="none" stroke="${col.dark}" stroke-width="2" stroke-linecap="round"/>`;
    } else if (draft.deco === 'minimal') {
      s += `<path d="M${x + 10} ${y + h * 0.62} H${x + w - 10}" stroke="${col.dark}" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>`;
    } else if (draft.deco === 'flower') {
      for (let cx = x + 10; cx <= x + w - 8; cx += 13) s += `<circle cx="${cx}" cy="${y + h}" r="4.2" fill="#fff" opacity=".85"/>`;
    } else if (draft.deco === 'fantasy') {
      const dots = ['#F49AB8', '#9FD3F2', '#FFD36E', '#B8E3B0', '#C9B6E4'];
      for (let i = 0; i < 16; i++) s += `<rect x="${x + 8 + ((i * 37) % (w - 18))}" y="${y + 12 + ((i * 23) % (h - 22))}" width="7" height="2.6" rx="1.3" fill="${dots[i % 5]}" transform="rotate(${(i * 47) % 180} ${x + 11 + ((i * 37) % (w - 18))} ${y + 13 + ((i * 23) % (h - 22))})"/>`;
    }
    return s;
  };
  const topY = two ? ty : by, topX = two ? tx : bx, topW = two ? tw : bw, topH = two ? th : bh;
  let topper = '';
  if (draft.deco === 'flower') {
    const fl = (cx, cy, c) => `<g>${[0, 72, 144, 216, 288].map((a) => `<circle cx="${cx + 6 * Math.cos(a * Math.PI / 180)}" cy="${cy + 6 * Math.sin(a * Math.PI / 180)}" r="5" fill="${c}"/>`).join('')}<circle cx="${cx}" cy="${cy}" r="3.4" fill="#FFE3A3"/></g>`;
    topper = `<path d="M${topX + topW * 0.28} ${topY - 2} q10 -14 22 -4" stroke="#7FA77A" stroke-width="3" fill="none" stroke-linecap="round"/>` + fl(topX + topW * 0.35, topY - 8, '#fff') + fl(topX + topW * 0.55, topY - 12, draft.color === 'pink' ? '#E07399' : '#F4A3BF') + fl(topX + topW * 0.72, topY - 6, '#fff');
  }
  if (draft.occasion === 'تولد') {
    topper += `<rect x="${topX + topW / 2 - 3}" y="${topY - 30}" width="6" height="26" rx="2" fill="#fff" stroke="${col.dark}" stroke-width="1"/><path d="M${topX + topW / 2} ${topY - 44} q7 8 0 13 q-7 -5 0 -13z" fill="#FFB547"/>`;
  }
  if (draft.deco === 'vintage') {
    topper += `<g transform="translate(${topX + topW - 28} ${topY + 12})"><path d="M0 0 q-14 -12 -14 2 q0 12 14 -2z M0 0 q14 -12 14 2 q0 12 -14 -2z" fill="#fff" stroke="${col.dark}" stroke-width="1"/><path d="M-2 2 l-5 18 M2 2 l5 18" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></g>`;
  }
  const label = esc(draft.text.trim().slice(0, 24));
  const vy = Math.max(0, Math.floor(topY - (draft.occasion === 'تولد' ? 50 : draft.deco === 'flower' ? 26 : 14)));
  return `<svg viewBox="0 ${vy} 260 ${206 - vy}" class="cake-svg" role="img" aria-label="پیش‌نمایش کیک">
    <ellipse cx="130" cy="192" rx="${bw / 2 + 26}" ry="10" class="plate"/>
    <ellipse cx="130" cy="188" rx="${bw / 2 + 18}" ry="6" class="plate-top"/>
    ${tier(bx, by, bw, bh)}${two ? tier(tx, ty, tw, th) : ''}${topper}
    ${label ? `<text x="130" y="${topY + topH * 0.62}" text-anchor="middle" font-size="${Math.min(15, 210 / Math.max(6, label.length))}" font-weight="800" fill="${ink}" style="font-family:'IRANYekanX'">${label}</text>` : ''}
  </svg>`;
}

const opt = (k, v, label, sub = '') => `<button type="button" class="opt${draft[k] === v ? ' on' : ''}" data-act="pick" data-k="${k}" data-v="${v}">${label}${sub ? `<small>${sub}</small>` : ''}</button>`;

function custom() {
  const sizeTwo = draft.size === 'medium' || draft.size === 'large';
  const e = estimate();
  return `
  ${head('کیک سفارشی', 'کیک رویایی‌ات را بساز؛ ما طراحی را بررسی می‌کنیم و قیمت نهایی را خبر می‌دهیم.')}
  <div class="wrap builder">
    <aside class="preview card" id="preview">
      <div class="pv-stage">${cakeSVG()}</div>
      <div class="pv-meta">
        <span class="muted">برآورد قیمت</span>
        <b class="pv-price" id="pvPrice">${money(e.lo)} تا ${money(e.hi)} <small>تومان</small></b>
        <small class="muted">قیمت نهایی پس از بررسی طرح اعلام می‌شود.</small>
      </div>
    </aside>

    <form class="steps" id="cakeForm" novalidate>
      <section class="step card" data-req="occasion"><h3 class="lg"><i>۱</i> مناسبت</h3>
        <div class="opts wrapo">${CUSTOM.occasions.map((o) => opt('occasion', o, o)).join('')}</div><p class="err">مناسبت را انتخاب کن.</p></section>

      <section class="step card"><h3 class="lg"><i>۲</i> اندازه</h3>
        <div class="opts g4">${CUSTOM.sizes.map((s) => opt('size', s.id, s.label, s.serves)).join('')}</div>
        <div class="tiers${sizeTwo ? '' : ' off'}" id="tiers">
          <span class="muted">طبقه‌ها</span>
          <div class="seg mini">${[1, 2].map((t) => `<button type="button" class="${draft.tiers === t ? 'on' : ''}" data-act="tier" data-v="${t}" ${!sizeTwo && t === 2 ? 'disabled' : ''}>${t === 1 ? 'یک طبقه' : 'دو طبقه'}</button>`).join('')}</div>
          ${sizeTwo ? '' : '<small class="muted">دو طبقه برای اندازه‌ی متوسط و بزرگ.</small>'}
        </div></section>

      <section class="step card" data-req="flavor"><h3 class="lg"><i>۳</i> طعم کیک</h3>
        <div class="opts wrapo">${CUSTOM.flavors.map((f) => opt('flavor', f, f)).join('')}</div><p class="err">طعم کیک را انتخاب کن.</p></section>

      <section class="step card" data-req="filling"><h3 class="lg"><i>۴</i> فیلینگ</h3>
        <div class="opts wrapo">${CUSTOM.fillings.map((f) => opt('filling', f.id, f.label, f.add ? `+${money(f.add / 1000)} هزار` : '')).join('')}</div><p class="err">فیلینگ را انتخاب کن.</p></section>

      <section class="step card"><h3 class="lg"><i>۵</i> طرح و رنگ</h3>
        <div class="opts g4">${CUSTOM.decos.map((d) => opt('deco', d.id, d.label)).join('')}</div>
        <div class="swatches">${CUSTOM.colors.map((c) => `<button type="button" class="sw${draft.color === c.id ? ' on' : ''}" data-act="pick" data-k="color" data-v="${c.id}" style="--c:${c.hex}" aria-label="${c.label}"><i></i><span>${c.label}</span></button>`).join('')}</div>
        <label class="field"><span>نوشته‌ی روی کیک <small class="muted">(اختیاری، تا ۲۴ حرف)</small></span>
          <input id="cakeText" maxlength="24" placeholder="مثلاً: تولدت مبارک سارا" value="${esc(draft.text)}"></label>
        <label class="drop" id="drop">
          <input type="file" accept="image/*" id="photo" hidden>
          ${draft.photo ? `<img src="${draft.photo}" alt="عکس نمونه">` : `<span class="drop-ico">${ico('image', 24)}</span>`}
          <span><b>${draft.photo ? 'عکس نمونه اضافه شد' : 'عکس نمونه'}</b><small>${draft.photo ? 'برای تغییر دوباره بزن' : 'اگر طرحی در ذهن داری، عکسش را بفرست'}</small></span>
        </label></section>

      <section class="step card" data-req="date"><h3 class="lg"><i>۶</i> زمان تحویل</h3>
        <div class="days" id="days">${days().map((d) => `<button type="button" class="day${draft.date === iso(d) ? ' on' : ''}" data-act="pick" data-k="date" data-v="${iso(d)}"><small>${fmt.week(d)}</small><b>${fmt.date(d)}</b></button>`).join('')}</div>
        <div class="opts g4 slots">${CUSTOM.slots.map((s) => opt('slot', s, s)).join('')}</div>
        <div class="seg mini wide">${[['pickup', 'تحویل حضوری', 'store'], ['courier', 'ارسال با پیک', 'truck']].map(([v, l, i]) => `<button type="button" class="${draft.delivery === v ? 'on' : ''}" data-act="pick" data-k="delivery" data-v="${v}">${ico(i, 17)} ${l}</button>`).join('')}</div>
        <p class="err">روز و ساعت تحویل را انتخاب کن.</p>
        <small class="muted">کیک سفارشی حداقل ۴۸ ساعت زمان می‌برد.</small></section>

      <section class="step card" data-req="contact"><h3 class="lg"><i>۷</i> اطلاعات تماس</h3>
        <div class="two">
          <label class="field"><span>نام</span><input id="cName" autocomplete="name" value="${esc(draft.name || S.state().user.name)}" placeholder="نام و نام خانوادگی"></label>
          <label class="field"><span>شماره موبایل</span><input id="cPhone" inputmode="tel" autocomplete="tel" dir="ltr" value="${esc(draft.phone || S.state().user.phone)}" placeholder="09xxxxxxxxx"></label>
        </div>
        <label class="field"><span>توضیحات <small class="muted">(اختیاری)</small></span><textarea id="cNote" rows="3" placeholder="حساسیت غذایی، تم مهمانی، هر چیزی که باید بدانیم…">${esc(draft.note)}</textarea></label>
        <p class="err">نام و شماره‌ی موبایل درست را وارد کن.</p></section>

      <button class="btn btn-dark btn-block" type="submit">${ico('sparkles', 19)} ارسال درخواست کیک</button>
    </form>
  </div>
  ${footer()}`;
}

function updateCustom() {
  const sizeTwo = draft.size === 'medium' || draft.size === 'large';
  if (!sizeTwo) draft.tiers = 1;
  $$('#cakeForm [data-act="pick"]').forEach((b) => b.classList.toggle('on', draft[b.dataset.k] === b.dataset.v));
  $$('#tiers button').forEach((b) => { b.classList.toggle('on', +b.dataset.v === draft.tiers); b.disabled = !sizeTwo && b.dataset.v === '2'; });
  $('#tiers').classList.toggle('off', !sizeTwo);
  $('.pv-stage').innerHTML = cakeSVG();
  const e = estimate();
  $('#pvPrice').innerHTML = `${money(e.lo)} تا ${money(e.hi)} <small>تومان</small>`;
  $$('.step.bad').forEach(validStep);
}

function validStep(fs) {
  const k = fs.dataset.req;
  let ok = true;
  if (k === 'date') ok = !!(draft.date && draft.slot);
  else if (k === 'contact') ok = draft.name.trim().length > 1 && /^09\d{9}$/.test(latinDigits(draft.phone).replace(/\s/g, ''));
  else ok = !!draft[k];
  fs.classList.toggle('bad', !ok);
  return ok;
}

function afterCustom() {
  const f = $('#cakeForm');
  $('#cakeText').addEventListener('input', (e) => { draft.text = e.target.value; $('.pv-stage').innerHTML = cakeSVG(); });
  const sync = () => { draft.name = $('#cName').value; draft.phone = $('#cPhone').value; draft.note = $('#cNote').value; };
  ['#cName', '#cPhone', '#cNote'].forEach((s) => $(s).addEventListener('input', () => { sync(); const fs = $(s).closest('.step'); if (fs.classList.contains('bad')) validStep(fs); }));
  $('#photo').addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      draft.photo = await shrink(file, 520);
      const d = $('#drop');
      d.querySelector('img, .drop-ico').outerHTML = `<img src="${draft.photo}" alt="عکس نمونه">`;
      d.querySelector('b').textContent = 'عکس نمونه اضافه شد';
      d.querySelector('small').textContent = 'برای تغییر دوباره بزن';
    } catch (_) { toast('این عکس خوانده نشد', 'info'); }
  });
  f.addEventListener('submit', (e) => {
    e.preventDefault();
    sync();
    const bad = $$('.step[data-req]', f).filter((fs) => !validStep(fs));
    if (bad.length) {
      bad[0].scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'center' });
      haptic(20);
      return;
    }
    const est = estimate();
    const r = {
      id: `PC-${Math.floor(1000 + Math.random() * 9000)}`, at: Date.now(),
      occasion: draft.occasion, size: draft.size, tiers: draft.tiers, flavor: draft.flavor, filling: draft.filling,
      deco: draft.deco, color: draft.color, text: draft.text.trim(), date: draft.date, slot: draft.slot, delivery: draft.delivery,
      note: draft.note.trim(), photo: draft.photo, est,
    };
    S.setUser({ name: draft.name.trim(), phone: latinDigits(draft.phone).replace(/\s/g, '') });
    S.addRequest(r);
    Object.assign(draft, { occasion: '', flavor: '', filling: '', text: '', date: '', slot: '', note: '', photo: '' });
    const d = new Date(r.date + 'T12:00:00');
    openSheet(`<div class="sheet-body done">
      <div class="done-ico">${ico('check', 34)}</div>
      <h2 class="h2">درخواستت رسید</h2>
      <p>کد پیگیری <b class="latin">${r.id}</b>. قنادی پرند طرح را بررسی می‌کند و قیمت نهایی و پیش‌پرداخت را با شماره‌ی تو هماهنگ می‌کند.</p>
      <div class="kv"><span>تحویل</span><b>${fmt.week(d)} ${fmt.date(d)}، ساعت ${r.slot}</b></div>
      <div class="kv"><span>برآورد</span><b>${money(est.lo)} تا ${money(est.hi)} تومان</b></div>
      <div class="row-btns"><a class="btn btn-dark" href="#/profile" data-act="go" data-to="#/profile">پیگیری در پروفایل</a><button class="btn btn-ghost" data-act="closeSheet">باشه</button></div>
    </div>`, { cls: 'compact' });
    render(false);
  });
}

function shrink(file, max) {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file), im = new Image();
    im.onload = () => {
      const k = Math.min(1, max / Math.max(im.width, im.height));
      const c = document.createElement('canvas');
      c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      res(c.toDataURL('image/jpeg', 0.72));
    };
    im.onerror = rej;
    im.src = url;
  });
}

on({
  pick(el) {
    draft[el.dataset.k] = el.dataset.v;
    haptic(4);
    updateCustom();
  },
  tier(el) { draft.tiers = +el.dataset.v; haptic(4); updateCustom(); },
});

/* ═══ BASKET ═════════════════════════════════════════════════════════ */

let delivery = 'courier';
function basketLines() { return Object.entries(S.state().basket).map(([id, n]) => ({ p: byId(id), n })).filter((l) => l.p); }

function basket() {
  const lines = basketLines();
  if (!lines.length) {
    return `${head('سبد خرید')}
    <div class="wrap"><div class="empty big card">
      <span class="empty-bag">${ico('bag', 34)}</span>
      <b>سبدت خالی است</b><small>یک کروسان پرملات یا یک کیک وینتیج، شروع خوبی است.</small>
      <div class="row-btns"><a href="#/products" class="btn btn-dark">دیدن محصولات</a><a href="#/custom" class="btn btn-ghost">کیک سفارشی</a></div>
    </div></div>${footer()}`;
  }
  const sub = lines.reduce((a, l) => a + l.p.price * l.n, 0);
  const ship = delivery === 'courier' ? SHOP.delivery : 0;
  const u = S.state().user;
  return `
  ${head('سبد خرید', `${money(S.count())} قلم در سبد`, `<button class="btn btn-ghost btn-sm" data-act="clear">${ico('trash', 16)} خالی کردن</button>`)}
  <div class="wrap checkout">
    <div class="lines card">
      ${lines.map(({ p, n }) => `<div class="line">
        ${p.img ? `<span class="line-img" data-open="${p.id}">${img(p)}</span>` : `<span class="line-img cafe">${ico('coffee', 24)}</span>`}
        <div class="line-t"><b>${p.name}</b><small>${p.short}</small><span class="price">${price(p.price * n)}</span></div>
        ${addCtl(p.id)}
      </div>`).join('')}
    </div>

    <div class="co-side">
      <div class="card co-box">
        <h2 class="h3">نحوه‌ی تحویل</h2>
        <div class="seg mini wide" id="delSeg">${[['courier', 'ارسال با پیک', 'truck'], ['pickup', 'تحویل حضوری', 'store']].map(([v, l, i]) => `<button type="button" class="${delivery === v ? 'on' : ''}" data-act="del" data-v="${v}">${ico(i, 17)} ${l}</button>`).join('')}</div>
        <div class="two">
          <label class="field"><span>نام</span><input id="oName" autocomplete="name" value="${esc(u.name)}" placeholder="نام و نام خانوادگی"></label>
          <label class="field"><span>شماره موبایل</span><input id="oPhone" inputmode="tel" autocomplete="tel" dir="ltr" value="${esc(u.phone)}" placeholder="09xxxxxxxxx"></label>
        </div>
        ${delivery === 'courier' ? `<label class="field"><span>نشانی</span><textarea id="oAddr" rows="2" autocomplete="street-address" placeholder="محله، خیابان، پلاک، واحد">${esc(u.addr || '')}</textarea></label>` : '<p class="muted small">سفارش آماده که شد، با همین شماره خبرت می‌کنیم.</p>'}
        <label class="field"><span>یادداشت برای قنادی <small class="muted">(اختیاری)</small></span><input id="oNote" placeholder="مثلاً: بسته‌بندی کادویی"></label>
      </div>
      <div class="card co-box sum">
        <div class="kv"><span>جمع سفارش</span><b>${price(sub)}</b></div>
        <div class="kv"><span>هزینه‌ی ارسال</span><b>${ship ? price(ship) : 'رایگان'}</b></div>
        <div class="kv total"><span>مبلغ قابل پرداخت</span><b>${price(sub + ship)}</b></div>
        <button class="btn btn-dark btn-block" data-act="checkout">${ico('check', 19)} ثبت و پرداخت</button>
        <small class="muted center">پرداخت در این نسخه‌ی نمایشی شبیه‌سازی می‌شود.</small>
      </div>
    </div>
  </div>
  ${footer()}`;
}

on({
  del(el) {
    delivery = el.dataset.v;
    /* keep what was typed: it goes to the profile, and the store change repaints the page */
    const v = (s) => $(s)?.value.trim();
    S.setUser({ name: v('#oName') ?? '', phone: latinDigits(v('#oPhone') ?? ''), ...($('#oAddr') ? { addr: v('#oAddr') } : {}) });
  },
  clear() { S.clearBasket(); toast('سبد خالی شد', 'trash'); },
  checkout() {
    const name = $('#oName').value.trim(), phone = latinDigits($('#oPhone').value).replace(/\s/g, ''), addr = $('#oAddr')?.value.trim() || '';
    const bad = name.length < 2 ? '#oName' : !/^09\d{9}$/.test(phone) ? '#oPhone' : (delivery === 'courier' && addr.length < 6) ? '#oAddr' : null;
    if (bad) { $(bad).closest('.field').classList.add('bad'); $(bad).focus(); toast(bad === '#oPhone' ? 'شماره موبایل را درست وارد کن' : bad === '#oName' ? 'نام را وارد کن' : 'نشانی را کامل بنویس', 'info'); haptic(20); return; }
    const lines = basketLines();
    const sub = lines.reduce((a, l) => a + l.p.price * l.n, 0), ship = delivery === 'courier' ? SHOP.delivery : 0;
    const o = { id: `PP-${Math.floor(1000 + Math.random() * 9000)}`, at: Date.now(), items: lines.map((l) => ({ id: l.p.id, name: l.p.name, n: l.n, price: l.p.price })), total: sub + ship, delivery, note: $('#oNote').value.trim() };
    S.setUser({ name, phone, ...(addr ? { addr } : {}) });
    S.addOrder(o);
    S.clearBasket();
    openSheet(`<div class="sheet-body done">
      <div class="done-ico">${ico('check', 34)}</div>
      <h2 class="h2">سفارشت ثبت شد</h2>
      <p>کد سفارش <b class="latin">${o.id}</b>. ${delivery === 'courier' ? 'به محض آماده شدن، پیک راه می‌افتد.' : 'آماده که شد، خبرت می‌کنیم تا بیایی.'}</p>
      <div class="kv"><span>مبلغ</span><b>${price(o.total)}</b></div>
      <div class="row-btns"><a class="btn btn-dark" href="#/profile" data-act="go" data-to="#/profile">پیگیری سفارش</a><button class="btn btn-ghost" data-act="closeSheet">باشه</button></div>
    </div>`, { cls: 'compact' });
  },
});

/* ═══ PROFILE ════════════════════════════════════════════════════════ */

function orderStatus(o) {
  const m = (Date.now() - o.at) / 60000;
  if (m < 2) return ['ثبت شد', 's1'];
  if (m < 20) return ['در حال آماده‌سازی', 's2'];
  if (m < 60) return [o.delivery === 'courier' ? 'در مسیر' : 'آماده‌ی تحویل', 's3'];
  return ['تحویل شد', 's4'];
}
const reqStatus = (r) => ((Date.now() - r.at) / 60000 < 5 ? ['در انتظار بررسی', 's1'] : ['تأیید شد، منتظر پیش‌پرداخت', 's3']);

function profile() {
  const st = S.state(), u = st.user;
  const favs = st.favs.map(byId).filter((p) => p && p.img);
  const pref = themePref();
  const initial = (u.name || 'پ').trim().charAt(0);
  return `
  ${head('پروفایل')}
  <div class="wrap prof">
    <div class="me card">
      <span class="avatar">${esc(initial)}</span>
      <div class="me-t"><b>${esc(u.name) || 'مهمان پرند'}</b><small dir="ltr">${esc(u.phone) || 'شماره‌ای ثبت نشده'}</small></div>
      <button class="icon-btn glass" data-act="editMe" aria-label="ویرایش">${ico('pencil', 18)}</button>
    </div>
    <div class="stats">
      <div class="stat card"><b>${money(st.orders.length)}</b><small>سفارش</small></div>
      <div class="stat card"><b>${money(st.requests.length)}</b><small>کیک سفارشی</small></div>
      <div class="stat card"><b>${money(st.favs.length)}</b><small>علاقه‌مندی</small></div>
    </div>

    <section class="sec">
      <div class="sec-head"><h2 class="h2">سفارش‌های من</h2></div>
      ${st.orders.length ? `<div class="olist">${st.orders.map((o) => { const [t, c] = orderStatus(o); return `<div class="order card">
        <div class="o-top"><b class="latin">${o.id}</b><span class="status ${c}">${t}</span></div>
        <p class="o-items">${o.items.map((i) => `${i.name} × ${money(i.n)}`).join('، ')}</p>
        <div class="o-foot"><small class="muted">${fmt.full(new Date(o.at))}، ${fmt.time(new Date(o.at))}</small><span class="price">${price(o.total)}</span></div>
      </div>`; }).join('')}</div>` : `<div class="empty card slim">${ico('package', 26)}<small>هنوز سفارشی نداری.</small><a class="btn btn-sm btn-dark" href="#/products">سفارش اول</a></div>`}
    </section>

    <section class="sec">
      <div class="sec-head"><h2 class="h2">درخواست‌های کیک</h2></div>
      ${st.requests.length ? `<div class="olist">${st.requests.map((r) => { const [t, c] = reqStatus(r); const s = CUSTOM.sizes.find((x) => x.id === r.size); const d = new Date(r.date + 'T12:00:00'); return `<div class="order card req">
        ${r.photo ? `<img class="req-ph" src="${r.photo}" alt="">` : `<span class="req-ph ico-ph">${ico('cake', 24)}</span>`}
        <div class="req-t">
          <div class="o-top"><b>${r.occasion}، ${s?.label || ''}${r.tiers === 2 ? '، دو طبقه' : ''}</b><span class="status ${c}">${t}</span></div>
          <p class="o-items">${r.flavor}، ${CUSTOM.fillings.find((f) => f.id === r.filling)?.label || ''}${r.text ? `، «${esc(r.text)}»` : ''}</p>
          <div class="o-foot"><small class="muted">${fmt.week(d)} ${fmt.date(d)}، ${r.slot}</small><small class="latin muted">${r.id}</small></div>
        </div>
      </div>`; }).join('')}</div>` : `<div class="empty card slim">${ico('cake', 26)}<small>هنوز کیکی طراحی نکرده‌ای.</small><a class="btn btn-sm btn-dark" href="#/custom">طراحی کیک</a></div>`}
    </section>

    ${favs.length ? `<section class="sec"><div class="sec-head"><h2 class="h2">علاقه‌مندی‌ها</h2></div><div class="grid">${favs.map(pcard).join('')}</div></section>` : ''}

    <section class="sec">
      <div class="sec-head"><h2 class="h2">تنظیمات</h2></div>
      <div class="card settings">
        <div class="set-row"><span class="set-ico">${ico('sun', 19)}</span><span class="set-t">ظاهر</span>
          <div class="seg mini" id="themeSeg">${[['light', 'روشن'], ['dark', 'تیره'], ['system', 'خودکار']].map(([v, l]) => `<button type="button" class="${pref === v ? 'on' : ''}" data-act="themePick" data-v="${v}">${l}</button>`).join('')}</div></div>
        <button class="set-row" data-act="install"><span class="set-ico">${ico('download', 19)}</span><span class="set-t">${isStandalone() ? 'اپ روی صفحه‌ی اصلی نصب است' : 'نصب اپ روی صفحه‌ی اصلی'}</span>${isStandalone() ? `<span class="ok">${ico('check', 18)}</span>` : ico('chevL', 18, 'dir chev')}</button>
        <a class="set-row" href="${SHOP.instagram}" target="_blank" rel="noopener"><span class="set-ico">${ico('instagram', 19)}</span><span class="set-t">قنادی پرند در اینستاگرام</span><span class="latin muted small">${SHOP.handle}</span></a>
        <button class="set-row" data-act="reset"><span class="set-ico">${ico('refresh', 19)}</span><span class="set-t">بازنشانی دمو</span>${ico('chevL', 18, 'dir chev')}</button>
      </div>
    </section>
  </div>
  ${footer()}`;
}

on({
  themePick(el) { setTheme(el.dataset.v, el); $$('#themeSeg button').forEach((b) => b.classList.toggle('on', b === el)); },
  theme(el) { toggleTheme(el); },
  editMe() {
    const u = S.state().user;
    openSheet(`<div class="sheet-head"><h2 class="h2 sh-title">ویرایش پروفایل</h2><button class="icon-btn" data-act="closeSheet" aria-label="بستن">${ico('x', 20)}</button></div>
      <div class="sheet-body">
        <label class="field"><span>نام</span><input id="eName" value="${esc(u.name)}" autocomplete="name" data-autofocus></label>
        <label class="field"><span>شماره موبایل</span><input id="ePhone" value="${esc(u.phone)}" inputmode="tel" dir="ltr" placeholder="09xxxxxxxxx"></label>
        <label class="field"><span>نشانی</span><textarea id="eAddr" rows="2">${esc(u.addr || '')}</textarea></label>
      </div>
      <div class="sheet-foot"><button class="btn btn-dark btn-block" data-act="saveMe">ذخیره</button></div>`, { cls: 'compact' });
  },
  saveMe() {
    S.setUser({ name: $('#eName').value.trim(), phone: latinDigits($('#ePhone').value).replace(/\s/g, ''), addr: $('#eAddr').value.trim() });
    closeSheet(); toast('ذخیره شد');
  },
  reset() {
    S.resetAll();
    try { localStorage.removeItem('pp.theme'); } catch (_) { /* ignore */ }
    setTheme('system');
    toast('دمو از نو شروع شد', 'refresh');
  },
});

/* install: Android/desktop Chrome get the real prompt; iOS gets the three steps */
on({
  async install() {
    if (isStandalone()) { toast('اپ همین حالا نصب است'); return; }
    if (installEvt) { installEvt.prompt(); const r = await installEvt.userChoice.catch(() => null); installEvt = null; if (r?.outcome === 'accepted') S.dismissHint(); return; }
    const ios = isIOS();
    openSheet(`<div class="sheet-head"><h2 class="h2 sh-title">نصب قنادی پرند</h2><button class="icon-btn" data-act="closeSheet" aria-label="بستن">${ico('x', 20)}</button></div>
      <div class="sheet-body">
        <div class="app-badge">${mark()}<div><b>قنادی پرند</b><small>بدون اپ‌استور، مستقیم روی صفحه‌ی اصلی</small></div></div>
        <ol class="howto">
          ${ios ? `<li><span class="hi">${ico('share', 20)}</span><span>در <b>Safari</b> دکمه‌ی اشتراک‌گذاری را بزن.</span></li>
          <li><span class="hi">${ico('addSquare', 20)}</span><span>گزینه‌ی <b dir="ltr">Add to Home Screen</b> یا «افزودن به صفحه‌ی اصلی» را انتخاب کن.</span></li>
          <li><span class="hi">${ico('check', 20)}</span><span>بالای صفحه <b dir="ltr">Add</b> را بزن. آیکون پرند روی صفحه‌ی اصلی می‌نشیند.</span></li>`
          : `<li><span class="hi">${ico('grid', 20)}</span><span>در <b>Chrome</b> منوی سه‌نقطه‌ی بالای صفحه را باز کن.</span></li>
          <li><span class="hi">${ico('download', 20)}</span><span>گزینه‌ی <b dir="ltr">Install app</b> یا «افزودن به صفحه‌ی اصلی» را بزن.</span></li>
          <li><span class="hi">${ico('check', 20)}</span><span>نصب را تأیید کن. پرند مثل یک اپ کامل باز می‌شود.</span></li>`}
        </ol>
      </div>
      <div class="sheet-foot"><button class="btn btn-dark btn-block" data-act="closeSheet">فهمیدم</button></div>`, { cls: 'compact' });
  },
  hideHint() { S.dismissHint(); $('#installCard')?.closest('.wrap')?.remove(); },
  go(el) { closeSheet(true); location.hash = el.dataset.to; },
});

/* ═══ basket + favourites actions (every page) ═══════════════════════ */

on({
  inc(el) { const id = el.dataset.id, first = !S.qty(id); S.add(id, 1); haptic(); if (first) toast(`${byId(id).name} به سبد اضافه شد`, 'bag'); },
  dec(el) { S.add(el.dataset.id, -1); haptic(4); },
  fav(el) {
    const now = S.toggleFav(el.dataset.id);
    haptic();
    $$(`.fav[data-id="${el.dataset.id}"]`).forEach((b) => { b.classList.toggle('on', now); b.setAttribute('aria-pressed', now); b.classList.remove('beat'); void b.offsetWidth; if (now) b.classList.add('beat'); });
  },
});

/* ═══ router ═════════════════════════════════════════════════════════ */

const ROUTES = {
  '/': { tab: 'home', title: 'قنادی پرند', render: home, after: afterHome },
  '/products': { tab: 'products', title: 'محصولات', render: products, after: afterProducts },
  '/custom': { tab: 'custom', title: 'کیک سفارشی', render: custom, after: afterCustom },
  '/basket': { tab: 'basket', title: 'سبد خرید', render: basket },
  '/profile': { tab: 'profile', title: 'پروفایل', render: profile },
};
let cleanup = null, route = null;

function parse() {
  const h = location.hash.replace(/^#/, '') || '/';
  const [path, q] = h.split('?');
  return { path: ROUTES[path] ? path : '/', params: new URLSearchParams(q || '') };
}

function render(animate = true) {
  const { path, params } = parse();
  const r = ROUTES[path];
  cleanup?.(); cleanup = null;
  route = path;
  view.classList.remove('enter');
  view.innerHTML = r.render(params);
  view.dataset.page = r.tab;
  document.body.dataset.page = r.tab;
  if (animate && !reduced()) { void view.offsetWidth; view.classList.add('enter'); }
  r.after?.();
  paintNav(r.tab, S.count());
  document.title = r.tab === 'home' ? 'قنادی پرند | Parand Pastry' : `${r.title} | قنادی پرند`;
}

function keepScroll(fn) { const y = scrollY; fn(); scrollTo(0, y); }

addEventListener('hashchange', () => {
  closeSheet(true);
  render(true);
  scrollTo(0, 0);
});

/* store changes repaint only what shows them */
S.onChange(() => {
  setCount(S.count());
  if (route === '/basket' || route === '/profile') { keepScroll(() => render(false)); }
  $$('[data-ctl]').forEach((c) => { c.outerHTML = addCtl(c.dataset.ctl, c.classList.contains('big')); });
});

document.addEventListener('themechange', () => {
  const s = $('#catSeg'); if (s) placeSeg(s, false);
});

/* ═══ boot ═══════════════════════════════════════════════════════════ */

$('#brand').innerHTML = `${mark()}<span class="brand-t"><b>قنادی پرند</b><small class="latin">PARAND PASTRY</small></span>`;
$('#themeBtn').innerHTML = `${ico('sun', 20, 'sun')}${ico('moon', 20, 'moon')}`;
$('#igBtn').innerHTML = ico('instagram', 20);
buildNav();
render(true);
requestAnimationFrame(() => document.body.classList.add('ready'));
setTimeout(() => $('#boot')?.classList.add('gone'), 650);

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
