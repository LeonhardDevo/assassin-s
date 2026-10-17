export function initUIControls(gamesData, renderGamesCallback) {
    const modal = document.getElementById('game-modal');
    const modalClose = document.getElementById('modal-close');

    // ===== Modal =====
    window.openModal = function(game) {
        if (!modal) return;
        const titleEl = document.getElementById('modal-title');
        const aboutEl = document.getElementById('modal-about');
        const yearEl = document.getElementById('modal-year');
        const posterEl = document.getElementById('modal-poster');
        const backdropEl = document.getElementById('modal-backdrop');
        const protagEl = document.getElementById('modal-protagonist');
        const periodEl = document.getElementById('modal-period');

        if (titleEl) titleEl.textContent = game.fullName || game.title;
        if (aboutEl) aboutEl.textContent = game.about || game.desc || '';
        if (yearEl) yearEl.textContent = `${game.year}${game.location ? ' • ' + game.location : ''}`;
        if (posterEl) posterEl.src = game.image;
        if (backdropEl) backdropEl.src = game.wallpaper || game.image;
        if (protagEl) protagEl.textContent = game.protagonist || 'Assassin Order';
        if (periodEl) periodEl.textContent = game.historicalPeriod || '';

        if (game.minSpecs) {
            document.getElementById('min-cpu').textContent = game.minSpecs.cpu;
            document.getElementById('min-ram').textContent = game.minSpecs.ram;
            document.getElementById('min-gpu').textContent = game.minSpecs.gpu;
        }
        if (game.recSpecs) {
            document.getElementById('rec-cpu').textContent = game.recSpecs.cpu;
            document.getElementById('rec-ram').textContent = game.recSpecs.ram;
            document.getElementById('rec-gpu').textContent = game.recSpecs.gpu;
        }

        const trailerBtn = document.getElementById('trailer-btn');
        if (game.trailerId) {
            trailerBtn.href = `https://www.youtube.com/watch?v=${game.trailerId}`;
            trailerBtn.style.display = 'inline-flex';
        } else {
            trailerBtn.style.display = 'none';
        }

        modal.classList.remove('hidden');
        void modal.offsetWidth;
        modal.classList.remove('opacity-0', 'scale-95');
        modal.classList.add('opacity-100', 'scale-100');
        document.body.style.overflow = 'hidden';
    };

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('opacity-100', 'scale-100');
        modal.classList.add('opacity-0', 'scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) closeModal();
    });

    const searchBtn = document.getElementById('btn-search');
    const searchOverlay = document.getElementById('search-overlay');
    const searchClose = document.getElementById('search-close');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const searchEmpty = document.getElementById('search-empty');

    let searchState = { items: [], selected: -1 };

    function openSearch() {
        if (!searchOverlay) return;
        searchOverlay.classList.remove('hidden');
        void searchOverlay.offsetWidth;
        searchOverlay.classList.remove('opacity-0');
        setTimeout(() => searchInput?.focus(), 50);
        renderSearchResults(gamesData, '');
    }

    function closeSearch() {
        if (!searchOverlay) return;
        searchOverlay.classList.add('opacity-0');
        setTimeout(() => {
            searchOverlay.classList.add('hidden');
            if (searchInput) searchInput.value = '';
            if (searchResults) searchResults.innerHTML = '';
            if (searchEmpty) searchEmpty.classList.add('hidden');
            searchState = { items: [], selected: -1 };
        }, 300);
    }

    function renderSearchResults(games, term) {
        if (!searchResults) return;
        const lower = term.toLowerCase().trim();
        const filtered = lower
            ? games.filter(g => {
                const t = (g.title || '').toLowerCase();
                const f = (g.fullName || '').toLowerCase();
                const l = (g.location || '').toLowerCase();
                const y = (g.year || '').toLowerCase();
                const a = (g.about || g.desc || '').toLowerCase();
                const p = (g.protagonist || '').toLowerCase();
                return t.includes(lower) || f.includes(lower) || l.includes(lower) || y.includes(lower) || a.includes(lower) || p.includes(lower);
            })
            : games;

        searchState.items = filtered;
        searchState.selected = -1;
        searchResults.innerHTML = '';

        if (filtered.length === 0) {
            searchResults.classList.add('hidden');
            searchEmpty?.classList.remove('hidden');
            return;
        }
        searchResults.classList.remove('hidden');
        searchEmpty?.classList.add('hidden');

        filtered.forEach((g, i) => {
            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'search-result-card flex items-center gap-4 p-3.5 rounded-xl bg-surface-container-low/70 border border-white/10 hover:border-secondary/60 hover:bg-surface-container transition-all text-left cursor-pointer ac-card-glow';
            card.dataset.index = i;
            card.innerHTML = `
                <img src="${g.image}" alt="" class="w-14 h-18 aspect-[3/4] object-cover object-top rounded-lg shadow-md border border-white/10 flex-shrink-0" loading="lazy"/>
                <div class="flex-1 min-w-0">
                    <p class="font-headline-md text-primary text-base font-bold truncate">${g.title}</p>
                    <p class="text-secondary text-xs truncate font-medium">${g.year}${g.location ? ' • ' + g.location : ''}</p>
                    <p class="text-on-surface-variant/70 text-[11px] truncate mt-1 flex items-center gap-1"><span class="material-symbols-outlined text-[13px] text-secondary">person</span>${g.protagonist || ''}</p>
                </div>
                <span class="material-symbols-outlined text-secondary/50 text-[20px] flex-shrink-0">arrow_forward</span>
            `;
            card.addEventListener('click', () => {
                closeSearch();
                setTimeout(() => window.openModal?.(g), 200);
            });
            card.addEventListener('mouseenter', () => {
                searchState.selected = i;
                updateSelection();
            });
            searchResults.appendChild(card);
        });
    }

    function updateSelection() {
        const cards = searchResults?.querySelectorAll('.search-result-card');
        if (!cards) return;
        cards.forEach((c, i) => {
            c.classList.toggle('border-secondary', i === searchState.selected);
            c.classList.toggle('bg-surface-container', i === searchState.selected);
        });
        if (searchState.selected >= 0 && cards[searchState.selected]) {
            cards[searchState.selected].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }

    if (searchBtn) searchBtn.addEventListener('click', openSearch);
    if (searchClose) searchClose.addEventListener('click', closeSearch);

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderSearchResults(gamesData, e.target.value);
        });
        // Keyboard navigation
        searchInput.addEventListener('keydown', (e) => {
            const cards = searchResults?.querySelectorAll('.search-result-card');
            if (!cards || cards.length === 0) return;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                searchState.selected = Math.min(searchState.selected + 1, cards.length - 1);
                updateSelection();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                searchState.selected = Math.max(searchState.selected - 1, 0);
                updateSelection();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (searchState.selected >= 0 && searchState.items[searchState.selected]) {
                    const g = searchState.items[searchState.selected];
                    closeSearch();
                    setTimeout(() => window.openModal?.(g), 200);
                }
            }
        });
    }

    // Close search on overlay background click
    if (searchOverlay) {
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) closeSearch();
        });
    }

    const menuBtn = document.getElementById('btn-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    const menuClose = document.getElementById('menu-close');

    if (menuBtn && menuOverlay && menuClose) {
        const openMenu = () => {
            menuOverlay.classList.remove('-translate-x-full');
            menuBtn.setAttribute('aria-expanded', 'true');
        };
        const closeMenu = () => {
            menuOverlay.classList.add('-translate-x-full');
            menuBtn.setAttribute('aria-expanded', 'false');
        };
        menuBtn.addEventListener('click', openMenu);
        menuClose.addEventListener('click', closeMenu);
        document.addEventListener('click', (e) => {
            if (menuOverlay.classList.contains('-translate-x-full')) return;
            if (!menuOverlay.contains(e.target) && e.target !== menuBtn && !menuBtn.contains(e.target)) {
                closeMenu();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !menuOverlay.classList.contains('-translate-x-full')) closeMenu();
        });
    }
}
