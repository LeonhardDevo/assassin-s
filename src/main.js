import './style.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initThreeBackground } from './three-bg.js'
import { initUIAnimations } from './ui-animations.js'
import { initUIControls } from './ui-modals.js'
import {
  gamesData, eras, getEraForYear,
  timelineData, storeGames, storeMerch, storeCollectibles
} from './games.js'

gsap.registerPlugin(ScrollTrigger)
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const IS_MOBILE = window.matchMedia('(max-width: 768px)').matches

// ====== Horizontal scroll carousel (featured) — native scroll + snap ======
function renderGames(games) {
    const gamesScroll = document.getElementById('games-scroll');
    if (!gamesScroll) return;

    gamesScroll.innerHTML = '';
    games.forEach((game, index) => {
        const delay = index * 80;
        const card = document.createElement('div');
        card.className = `w-[85vw] sm:w-[420px] flex-shrink-0 group relative overflow-hidden rounded-lg snap-center bg-surface cursor-pointer ac-blade-reveal`;
        card.style.transitionDelay = `${delay}ms`;
        card.setAttribute('data-cursor', '');
        card.innerHTML = `
            <div class="aspect-[4/5] relative overflow-hidden">
                <img alt="${game.fullName || game.title}" loading="lazy" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" src="${game.image}"/>
                <div class="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent"></div>
                <div class="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style="background:linear-gradient(115deg,transparent 42%,rgba(233,195,73,0.18) 48%,transparent 54%);"></div>
                <span class="absolute top-4 left-4 font-label-sm text-[10px] tracking-[0.3em] text-secondary/80 uppercase">Seq. ${String(index+1).padStart(2,'0')}</span>
            </div>
            <div class="absolute bottom-0 left-0 w-full p-6 transform transition-transform duration-500 group-hover:-translate-y-2">
                <p class="font-label-sm text-secondary mb-1">${game.year}${game.location ? ' • ' + game.location : ''}</p>
                <h3 class="font-headline-md text-headline-md text-primary mb-2">${game.title}</h3>
                <p class="text-sm text-on-surface-variant line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">${game.about || game.desc}</p>
            </div>
        `;
        card.addEventListener('click', () => window.openModal?.(game));
        gamesScroll.appendChild(card);
    });

    ScrollTrigger.refresh();
    if (typeof window.reveal === 'function') window.reveal();
}

// ====== Saga grid with era filters ======
function renderEraFilters() {
    const container = document.getElementById('era-filters');
    if (!container) return;
    container.innerHTML = '';
    let activeEra = 'all';

    eras.forEach((era, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `era-tab px-5 py-2 rounded-full font-label-sm text-label-sm uppercase tracking-widest border transition-all cursor-pointer ${i === 0 ? 'border-secondary bg-secondary/10 text-secondary' : 'border-outline-variant/30 text-on-surface-variant hover:border-secondary/50 hover:text-primary'}`;
        btn.textContent = era.label;
        btn.dataset.era = era.id;
        btn.addEventListener('click', () => {
            activeEra = era.id;
            container.querySelectorAll('.era-tab').forEach(t => {
                t.classList.remove('border-secondary', 'bg-secondary/10', 'text-secondary');
                t.classList.add('border-outline-variant/30', 'text-on-surface-variant');
            });
            btn.classList.add('border-secondary', 'bg-secondary/10', 'text-secondary');
            btn.classList.remove('border-outline-variant/30', 'text-on-surface-variant');
            renderSagaGrid(activeEra);
        });
        container.appendChild(btn);
    });
    renderSagaGrid('all');
}

function renderSagaGrid(era) {
    const grid = document.getElementById('saga-grid');
    if (!grid) return;
    const filtered = era === 'all' ? gamesData : gamesData.filter(g => getEraForYear(g.year) === era);

    grid.innerHTML = '';
    filtered.forEach((game, i) => {
        const card = document.createElement('div');
        card.className = 'group relative overflow-hidden rounded-lg bg-surface-container-low border border-outline-variant/15 cursor-pointer reveal';
        card.style.transitionDelay = `${i * 60}ms`;
        card.setAttribute('data-cursor', '');
        card.innerHTML = `
            <div class="aspect-[3/4] relative overflow-hidden">
                <img alt="${game.fullName || game.title}" loading="lazy" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" src="${game.image}"/>
                <div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
            </div>
            <div class="absolute bottom-0 left-0 w-full p-4 md:p-5">
                <p class="font-label-sm text-secondary text-[10px] mb-1 uppercase tracking-widest">${game.year}</p>
                <h3 class="font-headline-md text-primary text-base md:text-lg leading-tight">${game.title}</h3>
                <p class="text-on-surface-variant text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">${game.location || ''}</p>
            </div>
        `;
        card.addEventListener('click', () => window.openModal?.(game));
        grid.appendChild(card);
    });
    if (typeof window.reveal === 'function') window.reveal();
}

// ====== Timeline ======
function renderTimeline() {
    const track = document.getElementById('timeline-track');
    if (!track) return;
    timelineData.forEach((item, i) => {
        const left = i % 2 === 0;
        const el = document.createElement('div');
        el.className = `relative pl-12 md:pl-0 ${left ? 'md:w-1/2 md:pr-12 md:ml-0 md:text-right' : 'md:w-1/2 md:pl-12 md:ml-auto'} mb-14 text-left group reveal`;
        el.innerHTML = `
            <div class="absolute left-4 ${left ? 'md:left-full' : 'md:left-0'} top-2 w-3 h-3 rounded-full bg-secondary shadow-[0_0_12px_rgba(233,195,73,0.6)] transform -translate-x-1.5 md:-translate-x-1.5 z-10 transition-transform group-hover:scale-150"></div>
            <div class="bg-surface-container-low/60 border border-outline-variant/15 rounded-lg p-5 md:p-6 group-hover:border-secondary/30 transition-colors">
                <h3 class="text-xl md:text-2xl font-headline-md text-primary mb-1">${item.year}</h3>
                <h4 class="text-base md:text-lg text-secondary mb-2">${item.title}</h4>
                <p class="text-on-surface-variant text-xs md:text-sm leading-relaxed">${item.desc}</p>
                <p class="text-on-surface-variant/50 text-[10px] mt-3 uppercase tracking-widest flex items-center gap-1 ${left ? 'md:justify-end' : ''}"><span class="material-symbols-outlined text-[12px]">location_on</span>${item.location}</p>
            </div>
        `;
        track.appendChild(el);
    });
    if (typeof window.reveal === 'function') window.reveal();
}

// ====== Store ======
function renderStore() {
    const gamesEl = document.getElementById('store-games');
    const merchEl = document.getElementById('store-merch');
    const collEl = document.getElementById('store-collectibles');

    if (gamesEl) {
        storeGames.forEach((g, i) => {
            const card = document.createElement('div');
            card.className = 'group relative overflow-hidden rounded-lg bg-surface-container-low border border-outline-variant/15 cursor-pointer reveal';
            card.style.transitionDelay = `${i * 80}ms`;
            card.setAttribute('data-cursor', '');
            card.innerHTML = `
                <div class="aspect-video relative overflow-hidden">
                    <img alt="${g.title}" loading="lazy" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="${g.image}"/>
                    <span class="absolute top-3 left-3 px-3 py-1 bg-secondary text-on-secondary font-label-sm text-label-sm uppercase tracking-widest rounded">${g.tag}</span>
                </div>
                <div class="p-5">
                    <h3 class="font-headline-md text-primary text-lg mb-1 leading-tight">${g.title}</h3>
                    <p class="text-on-surface-variant text-xs mb-4">${g.platform}</p>
                    <div class="flex items-center justify-between">
                        <span class="text-secondary font-headline-md text-xl">${g.price}</span>
                        <button class="px-4 py-2 bg-primary/10 border border-primary/30 text-primary font-label-sm text-label-sm uppercase tracking-widest rounded hover:bg-secondary hover:text-on-secondary hover:border-secondary transition-all cursor-pointer">Buy Now</button>
                    </div>
                </div>
            `;
            gamesEl.appendChild(card);
        });
    }

    const iconCard = (item, i) => {
        const card = document.createElement('div');
        card.className = 'group bg-surface-container-low border border-outline-variant/15 rounded-lg p-5 text-center cursor-pointer reveal hover:border-secondary/40 transition-colors';
        card.style.transitionDelay = `${i * 60}ms`;
        card.setAttribute('data-cursor', '');
        card.innerHTML = `
            <span class="material-symbols-outlined text-secondary text-[40px] mb-3 block group-hover:scale-110 transition-transform">${item.icon}</span>
            <h3 class="font-headline-md text-primary text-sm mb-2 leading-tight">${item.name}</h3>
            <p class="text-secondary font-label-sm text-label-sm">${item.price}</p>
        `;
        return card;
    };

    if (merchEl) storeMerch.forEach((m, i) => merchEl.appendChild(iconCard(m, i)));
    if (collEl) storeCollectibles.forEach((c, i) => collEl.appendChild(iconCard(c, i)));
    if (typeof window.reveal === 'function') window.reveal();
}

// ====== Init ======
window.addEventListener('DOMContentLoaded', () => {
  initThreeBackground();
  initUIAnimations();
  initUIControls(gamesData, renderGames);

  renderGames(gamesData);
  renderEraFilters();
  renderTimeline();
  renderStore();

  const gamesScroll = document.getElementById('games-scroll');
  if (gamesScroll) {
    const prevBtn = document.querySelector('.games-prev');
    const nextBtn = document.querySelector('.games-next');
    let scrolling = false;

    const updateBtns = () => {
      if (prevBtn) prevBtn.disabled = gamesScroll.scrollLeft <= 4;
      if (nextBtn) nextBtn.disabled = gamesScroll.scrollLeft + gamesScroll.clientWidth >= gamesScroll.scrollWidth - 4;
    };
    const cardW = () => gamesScroll.firstElementChild?.getBoundingClientRect().width || 420;

    const goToCard = (dir) => {
      if (scrolling) return;
      const w = cardW() + 24;
      const target = Math.round(gamesScroll.scrollLeft / w) * w + dir * w;
      scrolling = true;
      gamesScroll.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
    };
    prevBtn?.addEventListener('click', () => goToCard(-1));
    nextBtn?.addEventListener('click', () => goToCard(1));
    gamesScroll.addEventListener('scroll', () => { updateBtns(); }, { passive: true });
    gamesScroll.addEventListener('scrollend', () => { scrolling = false; }, { passive: true });
    let scrollTimer = null;
    gamesScroll.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => { scrolling = false; }, 150);
    }, { passive: true });
    setTimeout(updateBtns, 200);
    window.addEventListener('resize', updateBtns, { passive: true });
  }
});
