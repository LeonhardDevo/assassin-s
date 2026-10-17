import './style.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initThreeBackground } from './three-bg.js'
import { initUIAnimations } from './ui-animations.js'
import { initUIControls } from './ui-modals.js'
import { initHeroShowcase } from './hero-showcase.js'
import { initScrollParallax } from './scroll-parallax.js'
import {
  gamesData, eras, getEraForYear,
  timelineData, storeGames, storeMerch, storeCollectibles
} from './games.js'

gsap.registerPlugin(ScrollTrigger)

// ====== Horizontal scroll carousel (Main Entries) ======
function renderGames(games) {
    const gamesScroll = document.getElementById('games-scroll');
    if (!gamesScroll) return;

    gamesScroll.innerHTML = '';
    games.forEach((game, index) => {
        const delay = index * 60;
        const card = document.createElement('div');
        card.className = `w-[82vw] xs:w-[320px] sm:w-[350px] md:w-[370px] flex-shrink-0 group relative overflow-hidden rounded-xl snap-center bg-surface-container-low border border-white/10 hover:border-secondary/60 cursor-pointer ac-card-glow transition-all duration-500`;
        card.style.transitionDelay = `${delay}ms`;
        card.setAttribute('data-cursor', '');
        card.innerHTML = `
            <div class="aspect-[3/4] relative overflow-hidden bg-black">
                <img alt="${game.fullName || game.title}" loading="lazy" class="w-full h-full object-cover object-top sm:object-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100" src="${game.image}"/>
                <div class="absolute inset-0 ac-card-overlay pointer-events-none"></div>
                <div class="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style="background:linear-gradient(115deg,transparent 40%,rgba(233,195,73,0.14) 48%,transparent 56%);"></div>
                
                <!-- Top badging -->
                <div class="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-10">
                    <span class="px-2.5 py-1 rounded bg-black/75 backdrop-blur-md border border-secondary/40 font-label-sm text-[10px] tracking-[0.25em] text-secondary uppercase font-semibold">Seq. ${String(index+1).padStart(2,'0')}</span>
                    <span class="px-2.5 py-1 rounded bg-black/75 backdrop-blur-md border border-white/15 font-label-sm text-[10px] tracking-wider text-on-surface-variant uppercase flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>${game.year}</span>
                </div>

                <!-- Bottom content -->
                <div class="absolute bottom-0 left-0 w-full p-5 md:p-6 z-10 transform transition-transform duration-500 group-hover:-translate-y-1">
                    <p class="font-label-sm text-secondary text-[11px] uppercase tracking-widest font-semibold mb-1 flex items-center gap-1"><span class="material-symbols-outlined text-[13px]">location_on</span>${game.location}</p>
                    <h3 class="font-headline-lg text-2xl md:text-[26px] text-primary font-bold tracking-wide mb-1 leading-tight group-hover:text-white transition-colors">${game.title}</h3>
                    <p class="text-xs text-secondary/90 font-medium mb-2 flex items-center gap-1"><span class="material-symbols-outlined text-[13px] text-secondary">person</span>${game.protagonist || ''}</p>
                    <p class="text-xs text-on-surface-variant line-clamp-2 mb-3.5 opacity-80 group-hover:opacity-100 transition-opacity duration-300 leading-relaxed">${game.about}</p>
                    
                    <div class="flex items-center justify-between pt-2.5 border-t border-white/10">
                        <span class="text-[11px] font-label-sm uppercase tracking-widest text-secondary group-hover:text-primary transition-colors flex items-center gap-1 font-semibold">Relive Memory <span class="material-symbols-outlined text-[15px] transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span></span>
                        ${game.trailerId ? '<span class="text-[11px] font-label-sm uppercase tracking-wider text-on-surface-variant/70 flex items-center gap-1"><span class="material-symbols-outlined text-[13px] text-secondary">play_circle</span> Trailer</span>' : ''}
                    </div>
                </div>
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
        btn.className = `era-tab px-5 py-2.5 rounded-full font-label-sm text-xs uppercase tracking-widest border transition-all cursor-pointer flex items-center gap-2 ${i === 0 ? 'border-secondary bg-secondary/15 text-secondary font-bold shadow-[0_0_15px_rgba(233,195,73,0.15)]' : 'border-outline-variant/30 text-on-surface-variant hover:border-secondary/50 hover:text-primary'}`;
        btn.innerHTML = `<span class="material-symbols-outlined text-[16px]">${era.icon || 'history'}</span>${era.label}`;
        btn.dataset.era = era.id;
        btn.addEventListener('click', () => {
            activeEra = era.id;
            container.querySelectorAll('.era-tab').forEach(t => {
                t.classList.remove('border-secondary', 'bg-secondary/15', 'text-secondary', 'font-bold', 'shadow-[0_0_15px_rgba(233,195,73,0.15)]');
                t.classList.add('border-outline-variant/30', 'text-on-surface-variant');
            });
            btn.classList.add('border-secondary', 'bg-secondary/15', 'text-secondary', 'font-bold', 'shadow-[0_0_15px_rgba(233,195,73,0.15)]');
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
        card.className = 'group relative overflow-hidden rounded-xl bg-surface-container-low border border-white/10 hover:border-secondary/60 cursor-pointer ac-card-glow transition-all duration-500 reveal';
        card.style.transitionDelay = `${i * 40}ms`;
        card.setAttribute('data-cursor', '');
        card.innerHTML = `
            <div class="aspect-[3/4] relative overflow-hidden bg-black">
                <img alt="${game.fullName || game.title}" loading="lazy" class="w-full h-full object-cover object-top sm:object-center transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" src="${game.image}"/>
                <div class="absolute inset-0 ac-card-overlay pointer-events-none"></div>
                <div class="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style="background:linear-gradient(115deg,transparent 40%,rgba(233,195,73,0.12) 48%,transparent 56%);"></div>
                
                <div class="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                    <span class="px-2 py-0.5 rounded bg-black/75 backdrop-blur-md border border-secondary/30 font-label-sm text-[9px] tracking-widest text-secondary uppercase font-semibold">${game.year}</span>
                </div>

                <div class="absolute bottom-0 left-0 w-full p-4 md:p-5 z-10">
                    <p class="font-label-sm text-secondary text-[10px] mb-0.5 uppercase tracking-widest flex items-center gap-1 font-semibold"><span class="material-symbols-outlined text-[12px]">location_on</span>${game.location}</p>
                    <h3 class="font-headline-md text-primary text-base md:text-lg font-bold leading-tight group-hover:text-white transition-colors">${game.title}</h3>
                    <p class="text-[11px] text-secondary/80 font-medium mt-1 truncate flex items-center gap-1"><span class="material-symbols-outlined text-[12px] text-secondary">person</span>${game.protagonist || ''}</p>
                </div>
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
        const game = gamesData.find(g => g.id === item.gameId) || null;
        const el = document.createElement('div');
        el.className = `relative pl-12 md:pl-0 ${left ? 'md:w-1/2 md:pr-12 md:ml-0 md:text-right' : 'md:w-1/2 md:pl-12 md:ml-auto'} mb-14 text-left group reveal cursor-pointer`;
        el.innerHTML = `
            <div class="absolute left-4 ${left ? 'md:left-full' : 'md:left-0'} top-3 w-3 h-3 rounded-full bg-secondary shadow-[0_0_14px_rgba(233,195,73,0.7)] transform -translate-x-1.5 md:-translate-x-1.5 z-10 transition-transform group-hover:scale-150"></div>
            <div class="bg-surface-container-low/80 backdrop-blur-md border border-white/10 rounded-xl p-5 md:p-6 group-hover:border-secondary/40 ac-card-glow transition-all">
                <div class="flex items-center gap-2 mb-1 ${left ? 'md:justify-end' : ''}">
                    <span class="text-xl md:text-2xl font-headline-md text-secondary font-bold">${item.year}</span>
                    <span class="text-xs px-2 py-0.5 rounded bg-secondary/10 border border-secondary/30 text-secondary uppercase font-label-sm">${item.location}</span>
                </div>
                <h4 class="text-base md:text-lg text-primary font-bold mb-2 group-hover:text-secondary transition-colors">${item.title}</h4>
                <p class="text-on-surface-variant text-xs md:text-sm leading-relaxed">${item.desc}</p>
                ${game ? `<p class="text-secondary/70 text-[11px] mt-3 uppercase tracking-widest flex items-center gap-1 ${left ? 'md:justify-end' : ''}"><span class="material-symbols-outlined text-[13px]">sports_esports</span>Featured: ${game.fullName}</p>` : ''}
            </div>
        `;
        if (game) {
            el.addEventListener('click', () => window.openModal?.(game));
        }
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
            card.className = 'group relative overflow-hidden rounded-xl bg-surface-container-low border border-white/10 hover:border-secondary/60 cursor-pointer ac-card-glow transition-all duration-500 reveal';
            card.style.transitionDelay = `${i * 80}ms`;
            card.setAttribute('data-cursor', '');
            card.innerHTML = `
                <div class="aspect-[16/10] relative overflow-hidden bg-black">
                    <img alt="${g.title}" loading="lazy" class="w-full h-full object-cover object-[center_15%] transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" src="${g.image}"/>
                    <div class="absolute inset-0 bg-gradient-to-t from-[#050608] via-[#050608]/30 to-transparent pointer-events-none"></div>
                    <span class="absolute top-3.5 left-3.5 px-3 py-1 bg-black/80 backdrop-blur-md border border-secondary/50 text-secondary font-label-sm text-[10px] uppercase tracking-widest rounded-md font-bold shadow-lg flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>${g.tag}</span>
                </div>
                <div class="p-5 md:p-6 bg-surface-container-low">
                    <h3 class="font-headline-md text-primary text-lg md:text-xl font-bold mb-1 leading-tight group-hover:text-secondary transition-colors">${g.title}</h3>
                    <p class="text-secondary/80 text-xs mb-1 font-medium">${g.edition || ''}</p>
                    <p class="text-on-surface-variant text-xs mb-5 flex items-center gap-1.5"><span class="material-symbols-outlined text-[14px]">devices</span>${g.platform}</p>
                    <div class="flex items-center justify-between pt-3 border-t border-white/10">
                        <span class="text-secondary font-headline-md text-2xl font-bold">${g.price}</span>
                        <button class="px-5 py-2.5 bg-secondary/10 border border-secondary/50 text-secondary font-label-sm text-xs uppercase tracking-widest rounded-md hover:bg-secondary hover:text-on-secondary transition-all cursor-pointer font-bold">Acquire</button>
                    </div>
                </div>
            `;
            const matchingGame = gamesData.find(game => game.id === g.id);
            if (matchingGame) {
                card.querySelector('button')?.addEventListener('click', (e) => {
                    e.stopPropagation();
                    window.openModal?.(matchingGame);
                });
                card.addEventListener('click', () => window.openModal?.(matchingGame));
            }
            gamesEl.appendChild(card);
        });
    }

    const iconCard = (item, i) => {
        const card = document.createElement('div');
        card.className = 'group bg-surface-container-low border border-white/10 rounded-xl p-5 text-center cursor-pointer reveal hover:border-secondary/40 ac-card-glow transition-all duration-300';
        card.style.transitionDelay = `${i * 60}ms`;
        card.setAttribute('data-cursor', '');
        card.innerHTML = `
            <div class="w-14 h-14 mx-auto mb-3 rounded-full bg-secondary/10 border border-secondary/30 flex items-center justify-center group-hover:scale-110 group-hover:border-secondary/70 transition-all duration-300">
                <span class="material-symbols-outlined text-secondary text-[28px]">${item.icon}</span>
            </div>
            <h3 class="font-headline-md text-primary text-sm font-semibold mb-1 leading-tight">${item.name}</h3>
            <p class="text-on-surface-variant/70 text-[11px] mb-2 leading-tight">${item.desc || ''}</p>
            <p class="text-secondary font-label-sm text-sm font-bold">${item.price}</p>
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
  initHeroShowcase();
  initUIControls(gamesData, renderGames);

  renderGames(gamesData);
  renderEraFilters();
  renderTimeline();
  renderStore();

  initScrollParallax();

  const gamesScroll = document.getElementById('games-scroll');
  if (gamesScroll) {
    const prevBtn = document.querySelector('.games-prev');
    const nextBtn = document.querySelector('.games-next');
    let scrolling = false;

    const updateBtns = () => {
      if (prevBtn) prevBtn.disabled = gamesScroll.scrollLeft <= 4;
      if (nextBtn) nextBtn.disabled = gamesScroll.scrollLeft + gamesScroll.clientWidth >= gamesScroll.scrollWidth - 4;
    };
    const cardW = () => gamesScroll.firstElementChild?.getBoundingClientRect().width || 370;

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
