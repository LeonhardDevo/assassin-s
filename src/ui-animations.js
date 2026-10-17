import anime from 'animejs';

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const IS_MOBILE = window.matchMedia('(max-width: 768px)').matches;

export function initUIAnimations() {
  initAnimusIntro();
  initEagleVision();
  initCursor();
  initDecodeOnReveal();
  initDesyncOnScroll();
  initHeroEntrance();
}

/* ------------------------------------------------------------------
   Animus Intro — cinematic loading sync (once per session)
------------------------------------------------------------------ */
function initAnimusIntro() {
  const intro = document.getElementById('ac-intro');
  if (!intro) return;

  // Skip if already seen this session
  if (sessionStorage.getItem('ac-intro-seen') === '1') {
    intro.classList.add('ac-intro--hidden');
    intro.style.display = 'none';
    document.body.style.overflow = '';
    return;
  }

  const status = document.getElementById('ac-intro-status');
  const steps = [
    'Initializing genetic memory stream',
    'Synchronizing ancestral data',
    'Memory sync complete'
  ];
  let i = 0;
  const interval = setInterval(() => {
    if (status) status.textContent = steps[i++];
    if (i >= steps.length) clearInterval(interval);
  }, 650);

  const hide = () => {
    if (intro.dataset.hidden) return;
    intro.dataset.hidden = '1';
    intro.classList.add('ac-intro--hidden');
    sessionStorage.setItem('ac-intro-seen', '1');
    setTimeout(() => { if (intro) intro.style.display = 'none'; }, 900);
    window.dispatchEvent(new CustomEvent('ac-intro-done'));
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  };

  const skip = () => hide();
  intro.addEventListener('click', skip);
  window.addEventListener('keydown', skip, { once: true });
  window.addEventListener('wheel', skip, { once: true, passive: true });
  window.addEventListener('touchmove', skip, { once: true, passive: true });

  const minTime = IS_MOBILE ? 1800 : 2200;
  const start = performance.now();
  const finish = () => {
    const elapsed = performance.now() - start;
    setTimeout(hide, Math.max(0, minTime - elapsed));
  };
  if (document.readyState === 'complete') finish();
  else window.addEventListener('load', finish, { once: true });

  setTimeout(hide, 3500);
}

/* ------------------------------------------------------------------
   Eagle Vision — toggle desaturated highlight overlay & sound
------------------------------------------------------------------ */
export function toggleEagleVision(force) {
  const overlay = document.getElementById('ac-eagle');
  const btn = document.getElementById('btn-eagle');
  const heroBtn = document.getElementById('hero-eagle-btn');
  const heroBtnText = document.getElementById('hero-eagle-btn-text');
  if (!overlay) return;

  const on = typeof force === 'boolean' ? force : !overlay.classList.contains('ac-eagle--on');
  overlay.classList.toggle('ac-eagle--on', on);
  document.documentElement.classList.toggle('ac-eagle-active', on);

  if (btn) {
    btn.classList.toggle('text-secondary', on);
    btn.setAttribute('aria-pressed', String(on));
  }

  if (heroBtn) {
    if (on) {
      heroBtn.className = 'w-full py-2.5 px-4 rounded-xl bg-secondary text-black border border-secondary shadow-[0_0_25px_rgba(233,195,73,0.7)] transition-all flex items-center justify-center gap-2 font-label-sm text-xs uppercase tracking-widest font-bold cursor-pointer';
      if (heroBtnText) heroBtnText.textContent = 'Eagle Vision Active';
    } else {
      heroBtn.className = 'w-full py-2.5 px-4 rounded-xl bg-black/85 hover:bg-secondary hover:text-black border border-secondary/60 text-secondary transition-all flex items-center justify-center gap-2 font-label-sm text-xs uppercase tracking-widest font-bold shadow-2xl cursor-pointer group/btn active:scale-95';
      if (heroBtnText) heroBtnText.textContent = 'Activate Eagle Vision';
    }
  }

  if (window.animusAudio) {
    window.animusAudio.playEaglePulse();
  }
}
window.toggleEagleVision = toggleEagleVision;

function initEagleVision() {
  const btn = document.getElementById('btn-eagle');
  if (btn) {
    btn.addEventListener('click', () => toggleEagleVision());
  }

  // 'V' key = Eagle Vision in AC controls
  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'v' && !/input|textarea/i.test(e.target.tagName)) {
      toggleEagleVision();
    }
  });
}

/* ------------------------------------------------------------------
   AC Cursor — gold ring + dot, expands on interactive hover
------------------------------------------------------------------ */
function initCursor() {
  const cursor = document.getElementById('ac-cursor');
  const dot = document.getElementById('ac-cursor-dot');
  if (!cursor || !dot) return;
  if (!FINE_POINTER || REDUCED) {
    cursor.style.display = 'none';
    dot.style.display = 'none';
    return;
  }

  document.documentElement.classList.add('ac-cursor-on');
  let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
  let dx = cx, dy = cy;
  let rx = cx, ry = cy;
  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    dx = e.clientX;
    dy = e.clientY;
    isMoving = true;
  }, { passive: true });

  function loop() {
    requestAnimationFrame(loop);
    if (!isMoving) return;

    // dot follows tightly
    cx += (dx - cx) * 0.6;
    cy += (dy - cy) * 0.6;
    // ring trails slightly
    rx += (dx - rx) * 0.2;
    ry += (dy - ry) * 0.2;
    dot.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0) translate(-50%,-50%)`;
    cursor.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0) translate(-50%,-50%)`;

    // Settle to avoid constant DOM writes when stationary
    if (Math.abs(dx - cx) < 0.1 && Math.abs(dy - cy) < 0.1 && Math.abs(dx - rx) < 0.1 && Math.abs(dy - ry) < 0.1) {
      isMoving = false;
    }
  }
  loop();

  const interactive = 'a, button, [data-cursor], .group, input, .ac-logo';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactive)) cursor.classList.add('ac-cursor--hover');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactive)) cursor.classList.remove('ac-cursor--hover');
  });
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    dot.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '';
    dot.style.opacity = '';
  });
}

/* ------------------------------------------------------------------
   Decode text — per-char materialize for chapter labels
------------------------------------------------------------------ */
function decodeText(el) {
  if (el.dataset.decoded) return;
  el.dataset.decoded = '1';
  const text = el.textContent;
  el.textContent = '';
  const frag = document.createDocumentFragment();
  // Wrap words to preserve wrapping on mobile
  text.split(/(\s+)/).forEach((token) => {
    if (/^\s+$/.test(token)) {
      frag.appendChild(document.createTextNode(token));
    } else {
      const word = document.createElement('span');
      word.style.whiteSpace = 'nowrap';
      word.style.display = 'inline-block';
      token.split('').forEach((ch) => {
        const s = document.createElement('span');
        s.textContent = ch;
        s.style.opacity = '0';
        s.style.display = 'inline-block';
        s.style.willChange = 'opacity, transform';
        word.appendChild(s);
      });
      frag.appendChild(word);
    }
  });
  el.appendChild(frag);
  anime({
    targets: Array.from(el.querySelectorAll('span > span')),
    opacity: [0, 1],
    translateY: [6, 0],
    duration: 280,
    delay: anime.stagger(20),
    easing: 'easeOutExpo'
  });
}

function initDecodeOnReveal() {
  if (REDUCED) return;
  const targets = document.querySelectorAll('.ac-chapter');
  if (!targets.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        decodeText(en.target);
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.4 });
  targets.forEach((t) => io.observe(t));
}

/* ------------------------------------------------------------------
   Desync flicker — brief "DESYNCHRONIZED" glitch on fast scroll
------------------------------------------------------------------ */
function initDesyncOnScroll() {
  if (REDUCED || IS_MOBILE) return;
  const el = document.getElementById('ac-desync');
  if (!el) return;
  let last = window.scrollY;
  let lastT = performance.now();
  let timer = null;

  window.addEventListener('scroll', () => {
    const now = performance.now();
    const dy = Math.abs(window.scrollY - last);
    const dt = now - lastT;
    last = window.scrollY;
    lastT = now;
    const velocity = dy / Math.max(1, dt);
    if (velocity > 2.2) {
      el.classList.add('ac-desync--on');
      clearTimeout(timer);
      timer = setTimeout(() => el.classList.remove('ac-desync--on'), 500);
    }
  }, { passive: true });
}

/* ------------------------------------------------------------------
   Hero entrance — materialize hero text after intro
------------------------------------------------------------------ */
function initHeroEntrance() {
  if (REDUCED) return;
  const hero = document.querySelector('section.relative .ac-chapter');
  if (!hero) return;
  const items = [
    hero,
    document.querySelector('h1.ac-glitch'),
    document.querySelector('section.relative p.font-headline-md'),
    document.querySelector('section.relative a.glow-gold')
  ].filter(Boolean);

  // start hidden
  items.forEach((el) => { el.style.opacity = '0'; });

  const run = () => {
    anime({
      targets: items,
      opacity: [0, 1],
      translateY: [24, 0],
      duration: 900,
      delay: anime.stagger(140, { start: 100 }),
      easing: 'easeOutExpo'
    });
  };

  if (sessionStorage.getItem('ac-intro-seen') === '1') {
    setTimeout(run, 200);
  } else {
    window.addEventListener('ac-intro-done', run, { once: true });
  }
}
