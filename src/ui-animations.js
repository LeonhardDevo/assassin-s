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
    window.dispatchEvent(new Event('resize'));
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
   Eagle Vision — toggle desaturated highlight overlay (desktop)
------------------------------------------------------------------ */
function initEagleVision() {
  const btn = document.getElementById('btn-eagle');
  const overlay = document.getElementById('ac-eagle');
  if (!btn || !overlay) return;

  const toggle = (force) => {
    const on = typeof force === 'boolean' ? force : !overlay.classList.contains('ac-eagle--on');
    overlay.classList.toggle('ac-eagle--on', on);
    btn.classList.toggle('text-secondary', on);
    btn.setAttribute('aria-pressed', String(on));
  };
  btn.addEventListener('click', () => toggle());
  // 'V' key = Eagle Vision in AC controls
  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'v' && !/input|textarea/i.test(e.target.tagName)) toggle();
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

  window.addEventListener('mousemove', (e) => { dx = e.clientX; dy = e.clientY; }, { passive: true });

  function loop() {
    requestAnimationFrame(loop);
    // dot follows tightly
    cx += (dx - cx) * 0.6;
    cy += (dy - cy) * 0.6;
    // ring trails slightly
    rx += (dx - rx) * 0.18;
    ry += (dy - ry) * 0.18;
    dot.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
    cursor.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
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
