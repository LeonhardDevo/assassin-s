// Hero Showcase — Dual Mode: Interactive Animus Corridor Simulation & Cinematic Trailer Video Loop
import { gsap } from 'gsap';
import { AnimusCorridor } from './animus-corridor.js';

export const HERO_CHARACTERS = [
  {
    id: 'altair',
    title: "Assassin's Creed · Altaïr Ibn-La'Ahad",
    name: "Altaïr Ibn-La'Ahad",
    era: "1191 CE",
    archetype: "Legendary Master Assassin",
    subtitle: "The Third Crusade · Holy Land · 1191 CE",
    quote: "“Only a mind free of impediments is capable of grasping the chaotic beauty of the world.”",
    image: "/assets/popout-altair.png",
    wallpaper: "/wallpapers/ac1.png",
    videoSrc: "/videos/hero-ac1.mp4",
    trailerId: "cc-ClutaN_I",
    color: "#dfba52",
    badge: "Part 1: Holy Land (AC1)",
    shortBadge: "Part 1: Holy Land",
    particleType: "dust"
  },
  {
    id: 'ezio',
    title: "Brotherhood · Ezio Auditore",
    name: "Ezio Auditore da Firenze",
    era: "1499 CE",
    archetype: "Mentor of Italian Brotherhood",
    subtitle: "Italian Renaissance · Rome · 1499 CE",
    quote: "“We work in the dark to serve the light. We are Assassins.”",
    image: "/assets/popout-ezio.png",
    wallpaper: "/wallpapers/brotherhood.jpg",
    videoSrc: "/videos/hero-ezio.mp4",
    trailerId: "zzNs4-kRLaE",
    color: "#c1121f",
    badge: "Part 2: Renaissance (Ezio)",
    shortBadge: "Part 2: Renaissance",
    particleType: "sparks"
  },
  {
    id: 'eivor',
    title: "Valhalla · Eivor Varinsdottir",
    name: "Eivor Wolf-Kissed",
    era: "873 CE",
    archetype: "Raven Clan Jarl · Shieldmaiden",
    subtitle: "Viking Expansion · England · 873 CE",
    quote: "“I will carve my own saga into the frozen stone of history.”",
    image: "/assets/popout-eivor.png",
    wallpaper: "/wallpapers/valhalla.jpg",
    videoSrc: "/videos/hero-valhalla.mp4",
    trailerId: "ssrNcwxALS4",
    color: "#2a9d8f",
    badge: "Part 3: Vikings (Valhalla)",
    shortBadge: "Part 3: Vikings",
    particleType: "snow"
  },
  {
    id: 'basim',
    title: "Mirage · Basim Ibn Ishaq",
    name: "Basim Ibn Ishaq",
    era: "861 CE",
    archetype: "Master Assassin · Hidden Blade",
    subtitle: "Golden Age of Baghdad · 861 CE",
    quote: "“When other men blindly follow the truth, remember: nothing is true.”",
    image: "/assets/popout-basim.png",
    wallpaper: "/wallpapers/mirage.jpg",
    videoSrc: "/videos/hero-mirage.mp4",
    trailerId: "x55lAlFtXmw",
    color: "#e9c349",
    badge: "Part 4: Baghdad (Mirage)",
    shortBadge: "Part 4: Baghdad",
    particleType: "sand"
  },
  {
    id: 'shadows',
    title: "Shadows · Naoe & Yasuke",
    name: "Naoe & Yasuke",
    era: "1579 CE",
    archetype: "Shinobi & Samurai",
    subtitle: "Feudal Japan · Azuchi-Momoyama · 1579 CE",
    quote: "“From the shadows of the falling Sengoku era, we strike to shape the new dawn.”",
    image: "/assets/popout-shadows.png",
    wallpaper: "/wallpapers/shadows.jpg",
    videoSrc: "/videos/hero-shadows.mp4",
    trailerId: "vovkzbtYBC8",
    color: "#e63946",
    badge: "Part 5: Feudal Japan (Shadows)",
    shortBadge: "Part 5: Feudal Japan",
    particleType: "sakura"
  }
];

// ============================================================
// Authentic Assassin's Creed Sound Synthesizer Engine
// Acoustically models physical steel, spring releases, and Isu resonance
// ============================================================
class AnimusAudio {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.noiseBuffer = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.createNoiseBuffer();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  createNoiseBuffer() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds of pink/white noise
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    this.noiseBuffer = buffer;
  }

  // Authentic Hidden Blade: Mechanical Trigger + Steel Rail Scrape + Resonant Steel Ring + Lock Clack
  playHiddenBlade() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // 1. Spring Release Latch (sharp mechanical snap)
    if (this.noiseBuffer) {
      const latchSrc = this.ctx.createBufferSource();
      latchSrc.buffer = this.noiseBuffer;
      const latchFilter = this.ctx.createBiquadFilter();
      latchFilter.type = 'highpass';
      latchFilter.frequency.setValueAtTime(2600, t);

      const latchGain = this.ctx.createGain();
      latchGain.gain.setValueAtTime(0.001, t);
      latchGain.gain.linearRampToValueAtTime(0.35, t + 0.003);
      latchGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);

      latchSrc.connect(latchFilter);
      latchFilter.connect(latchGain);
      latchGain.connect(this.ctx.destination);
      latchSrc.start(t);
      latchSrc.stop(t + 0.04);

      // 2. Steel Friction Scrape (blade extending out of the bracer)
      const scrapeSrc = this.ctx.createBufferSource();
      scrapeSrc.buffer = this.noiseBuffer;
      const scrapeFilter = this.ctx.createBiquadFilter();
      scrapeFilter.type = 'bandpass';
      scrapeFilter.Q.value = 4.2;
      scrapeFilter.frequency.setValueAtTime(3400, t + 0.008);
      scrapeFilter.frequency.exponentialRampToValueAtTime(1500, t + 0.09);

      const scrapeGain = this.ctx.createGain();
      scrapeGain.gain.setValueAtTime(0.001, t + 0.008);
      scrapeGain.gain.linearRampToValueAtTime(0.38, t + 0.025);
      scrapeGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

      scrapeSrc.connect(scrapeFilter);
      scrapeFilter.connect(scrapeGain);
      scrapeGain.connect(this.ctx.destination);
      scrapeSrc.start(t + 0.008);
      scrapeSrc.stop(t + 0.13);
    }

    // 3. Damascus Steel Resonant Singing Harmonics (singing blade)
    const harmonics = [1840, 2760, 3680];
    harmonics.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq + (Math.random() * 14 - 7), t + 0.015);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.985, t + 0.35);

      const amp = idx === 0 ? 0.22 : 0.12;
      gain.gain.setValueAtTime(0.001, t + 0.015);
      gain.gain.linearRampToValueAtTime(amp, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + 0.015);
      osc.stop(t + 0.4);
    });

    // 4. Heavy Lock Clack (hard stop pin)
    const clack = this.ctx.createOscillator();
    const clackGain = this.ctx.createGain();
    clack.type = 'triangle';
    clack.frequency.setValueAtTime(200, t + 0.05);
    clack.frequency.exponentialRampToValueAtTime(50, t + 0.12);

    clackGain.gain.setValueAtTime(0.001, t + 0.05);
    clackGain.gain.linearRampToValueAtTime(0.32, t + 0.06);
    clackGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);

    clack.connect(clackGain);
    clackGain.connect(this.ctx.destination);
    clack.start(t + 0.05);
    clack.stop(t + 0.16);
  }

  // Authentic Eagle Vision (Isu / First Civilization ancient drone & sacred chord)
  playEagleVision(isActive = true) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // 1. Deep Sub-Bass Isu Drone (swelling 52Hz)
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(52, t);
    sub.frequency.exponentialRampToValueAtTime(isActive ? 64 : 40, t + 0.45);

    subGain.gain.setValueAtTime(0.001, t);
    subGain.gain.linearRampToValueAtTime(0.35, t + 0.08);
    subGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.75);

    sub.connect(subGain);
    subGain.connect(this.ctx.destination);
    sub.start(t);
    sub.stop(t + 0.8);

    // 2. Mystical Solfeggio / Isu Harmonics (432Hz, 528Hz sacred chord)
    [432, 528, 648].forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);
      osc.frequency.exponentialRampToValueAtTime(f * (isActive ? 1.04 : 0.96), t + 0.5);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.08 / (i + 1), t + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.85);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.9);
    });

    // 3. Soaring Wind Rush (filtered pink noise)
    if (this.noiseBuffer) {
      const windSrc = this.ctx.createBufferSource();
      windSrc.buffer = this.noiseBuffer;
      const windFilter = this.ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.Q.value = 2.2;
      windFilter.frequency.setValueAtTime(350, t);
      windFilter.frequency.exponentialRampToValueAtTime(1300, t + 0.25);
      windFilter.frequency.exponentialRampToValueAtTime(380, t + 0.65);

      const windGain = this.ctx.createGain();
      windGain.gain.setValueAtTime(0.001, t);
      windGain.gain.linearRampToValueAtTime(0.18, t + 0.15);
      windGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);

      windSrc.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(this.ctx.destination);
      windSrc.start(t);
      windSrc.stop(t + 0.75);
    }
  }

  // Animus Memory Sync (Low cinematic BRAAAM impact when switching eras)
  playMemorySync() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(105, t);
    osc.frequency.exponentialRampToValueAtTime(42, t + 0.45);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.36, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.6);
  }

  // Soft tactile UI click (stealth leather/mechanical tap)
  playUiClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(240, t);
    osc.frequency.exponentialRampToValueAtTime(75, t + 0.025);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.035);
  }

  // Soft UI hover (subtle velvet click)
  playUiHover() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(540, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.015);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.035, t + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.025);
  }

  // Backward compatibility aliases
  playBladeSwoosh() {
    this.playHiddenBlade();
  }

  playEaglePulse() {
    this.playEagleVision(true);
  }
}

export const animusAudio = new AnimusAudio();
window.animusAudio = animusAudio;

// ============================================================
// Living Atmospheric Particle Engine for the 3D Hero Card
// ============================================================
class HeroCardParticles {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.particles = [];
    this.type = 'dust'; // 'dust' | 'sparks' | 'snow' | 'sand' | 'sakura'
    this.animId = null;
    this.tiltX = 0;
    this.tiltY = 0;
    this.isRunning = false;
    this.width = 360;
    this.height = 490;

    this.init();
  }

  init() {
    if (!this.canvas) return;
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.createParticles();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = rect.width || 360;
    this.height = rect.height || 490;
    this.canvas.width = Math.round(this.width * dpr);
    this.canvas.height = Math.round(this.height * dpr);
    if (this.ctx) {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(dpr, dpr);
    }
  }

  setType(type) {
    this.type = type;
    this.createParticles();
  }

  createParticles() {
    this.particles = [];
    const count = 30;
    const w = this.width || 360;
    const h = this.height || 490;

    for (let i = 0; i < count; i++) {
      this.particles.push(this.initParticle(w, h, true));
    }
  }

  initParticle(w, h, randomY = false) {
    const p = {
      x: Math.random() * w,
      y: randomY ? Math.random() * h : -10,
      size: Math.random() * 2.4 + 1.2,
      opacity: Math.random() * 0.5 + 0.35,
      speedX: 0,
      speedY: 0,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      color: 'rgba(233, 195, 73, '
    };

    if (this.type === 'snow') {
      p.speedY = Math.random() * 1.2 + 0.7;
      p.speedX = (Math.random() - 0.5) * 0.6;
      p.color = 'rgba(230, 245, 255, ';
      p.size = Math.random() * 2.6 + 1.2;
    } else if (this.type === 'sand') {
      p.speedY = Math.random() * 1.3 + 0.8;
      p.speedX = Math.random() * 1.4 + 0.5;
      p.color = 'rgba(233, 195, 73, ';
      p.size = Math.random() * 1.8 + 1.0;
    } else if (this.type === 'sakura') {
      p.speedY = Math.random() * 1.1 + 0.6;
      p.speedX = (Math.random() - 0.3) * 0.9;
      p.color = 'rgba(255, 175, 195, ';
      p.size = Math.random() * 3.5 + 2.2;
    } else if (this.type === 'sparks') {
      p.y = randomY ? Math.random() * h : h + 10;
      p.speedY = -(Math.random() * 1.5 + 0.7);
      p.speedX = (Math.random() - 0.5) * 0.7;
      p.color = 'rgba(255, 215, 100, ';
      p.size = Math.random() * 2.2 + 1.0;
    } else {
      // dust
      p.speedY = (Math.random() - 0.3) * 0.6;
      p.speedX = (Math.random() - 0.5) * 0.6;
      p.color = 'rgba(233, 195, 73, ';
      p.size = Math.random() * 1.8 + 1.0;
    }
    return p;
  }

  setTilt(rotX, rotY) {
    this.tiltX = rotY * 0.06;
    this.tiltY = -rotX * 0.06;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    const loop = () => {
      if (!this.isRunning) return;
      this.render();
      this.animId = requestAnimationFrame(loop);
    };
    this.animId = requestAnimationFrame(loop);
  }

  stop() {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
  }

  render() {
    if (!this.ctx || !this.width || !this.height) return;
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.x += p.speedX + this.tiltX;
      p.y += p.speedY + this.tiltY;
      p.rotation += p.rotSpeed;

      // Reset if out of bounds
      if (p.y > h + 15 || p.y < -15 || p.x > w + 20 || p.x < -20) {
        this.particles[i] = this.initParticle(w, h, false);
        continue;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      if (this.type === 'sakura') {
        // Petal shape
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.shadowColor = p.color + '0.8)';
        ctx.shadowBlur = 4;
        ctx.fill();
      }

      ctx.restore();
    }
  }
}

// ============================================================
// Main Hero Showcase Controller
// ============================================================
export function initHeroShowcase() {
  const heroSection = document.getElementById('top');
  if (!heroSection) return;

  let currentMode = 'character'; // 'character' (Animus) | 'video' (Trailer Loop)
  let currentCharacterIndex = 0;
  let isVideoMuted = true;
  let isEagleVisionActive = false;

  // Initialize Interactive Animus Corridor Simulation Engine
  const animusCorridor = new AnimusCorridor('animus-canvas');

  // Initialize Living Card Particle Engine
  const cardParticles = new HeroCardParticles('hero-card-particles');

  // Container Elements
  const animusContainer = document.getElementById('hero-animus-container');
  const videoContainer = document.getElementById('hero-video-container');
  const localVideo = document.getElementById('hero-local-video');

  const modeVideoBtn = document.getElementById('hero-mode-video');
  const modeCharBtn = document.getElementById('hero-mode-char');
  const muteBtn = document.getElementById('hero-video-mute');
  const sagaNav = document.getElementById('hero-character-nav');
  const watchTrailerBtn = document.getElementById('hero-watch-trailer-btn');

  const actionsChar = document.getElementById('hero-actions-char');
  const actionsTrailer = document.getElementById('hero-actions-trailer');
  const trailerPrevBtn = document.getElementById('hero-trailer-prev');
  const trailerNextBtn = document.getElementById('hero-trailer-next');
  const returnCharBtn = document.getElementById('hero-return-char-btn');
  const ytDirectLink = document.getElementById('hero-yt-direct-link');

  // Text & Card Elements
  const chapterEl = heroSection.querySelector('.ac-chapter');
  const titleEl = heroSection.querySelector('h1');
  const quoteEl = document.getElementById('hero-quote-text');
  const charCardImg = document.getElementById('hero-char-img');
  const cardInnerBg = document.getElementById('hero-card-bg');
  const cardName = document.getElementById('hero-card-name');
  const cardEra = document.getElementById('hero-card-era');
  const cardArchetype = document.getElementById('hero-card-archetype');
  const cardScene = document.getElementById('hero-3d-scene');
  const card = document.getElementById('hero-char-card');
  const cardGlare = document.getElementById('hero-card-glare');
  const cardShadow = document.getElementById('hero-card-shadow');
  const cardEagleGlow = document.getElementById('hero-card-eagle-glow');
  const hudRot = document.getElementById('hero-hud-rot');
  const cardMemTag = document.getElementById('hero-card-mem-tag');
  const eagleBtn = document.getElementById('hero-eagle-btn');
  const eagleBtnText = document.getElementById('hero-eagle-btn-text');
  const slashFx = document.getElementById('hero-slash-fx');

  const animusMemoryHud = document.getElementById('animus-memory-hud');
  const animusSynchHud = document.getElementById('animus-synch-hud');

  // Update Nav Pill Active Highlighting
  function updateNavPills(activeIndex) {
    const pills = sagaNav?.querySelectorAll('button');
    pills?.forEach((p, idx) => {
      if (idx === activeIndex) {
        p.className = 'px-3.5 py-1.5 rounded-full bg-secondary text-black font-label-sm text-[11px] uppercase tracking-wider font-bold shadow-gold transition-all flex items-center gap-1.5 cursor-pointer scale-105';
        p.setAttribute('aria-pressed', 'true');
      } else {
        p.className = 'px-3.5 py-1.5 rounded-full bg-black/70 hover:bg-black/95 text-on-surface-variant hover:text-white border border-white/10 font-label-sm text-[11px] uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer';
        p.setAttribute('aria-pressed', 'false');
      }
    });
  }

  // Switch Character / Era
  function selectCharacter(index, isUserGesture = false) {
    currentCharacterIndex = (index + HERO_CHARACTERS.length) % HERO_CHARACTERS.length;
    const char = HERO_CHARACTERS[currentCharacterIndex];
    if (!char) return;

    // Trigger Animus Glitch Effect & Authentic Memory Sync Audio
    if (isUserGesture) {
      animusAudio.playMemorySync();
      window.triggerAnimusPulse?.(false);
      const desync = document.getElementById('ac-desync');
      if (desync) {
        desync.classList.add('ac-desync--active');
        setTimeout(() => desync.classList.remove('ac-desync--active'), 320);
      }
    }

    // Switch living atmospheric particle type
    cardParticles.setType(char.particleType || 'dust');

    // Update 3D card identity labels
    if (cardName) cardName.textContent = char.name;
    if (cardEra) cardEra.textContent = char.era;
    if (cardMemTag) cardMemTag.textContent = `ABSTERGO // MEM-0${currentCharacterIndex + 1}`;
    if (cardArchetype) {
      cardArchetype.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>${char.archetype}`;
    }

    // Update 3D card background wallpaper with smooth GSAP crossfade
    if (cardInnerBg) {
      gsap.to(cardInnerBg, {
        opacity: 0.15,
        duration: 0.2,
        onComplete: () => {
          cardInnerBg.src = char.wallpaper;
          gsap.to(cardInnerBg, { opacity: 0.6, duration: 0.45 });
        }
      });
    }

    // Update character pop-out cutout artwork inside 3D card
    if (charCardImg) {
      gsap.to(charCardImg, {
        scale: 0.92,
        opacity: 0.2,
        y: 12,
        duration: 0.18,
        onComplete: () => {
          charCardImg.src = char.image;
          charCardImg.alt = char.title;
          gsap.to(charCardImg, { scale: 1, opacity: 1, y: 0, duration: 0.42, ease: 'power2.out' });
        }
      });
    }

    // Update Animus HUD telemetry
    if (animusMemoryHud) {
      animusMemoryHud.textContent = `MEMORY BLOCK: 0${currentCharacterIndex + 1} // ${char.era}`;
    }
    if (animusSynchHud) {
      animusSynchHud.textContent = `SYNCHRONIZATION: 100.0%`;
    }

    // Update background native video (used in Trailer Loop mode)
    if (localVideo && char.videoSrc) {
      const currentSrc = localVideo.getAttribute('src');
      if (currentSrc !== char.videoSrc) {
        gsap.to(localVideo, {
          opacity: 0.25,
          duration: 0.25,
          onComplete: () => {
            localVideo.src = char.videoSrc;
            localVideo.muted = isVideoMuted;
            if (currentMode === 'video') {
              localVideo.play().catch(() => {});
            }
            gsap.to(localVideo, { opacity: 1, duration: 0.5 });
          }
        });
      }
    }

    // Update typography
    if (chapterEl) {
      chapterEl.textContent = currentMode === 'video'
        ? `Cinematic Archive · ${char.shortBadge} (${char.era})`
        : `Memory Sequence — ${char.subtitle}`;
    }

    if (quoteEl) {
      gsap.to(quoteEl, {
        opacity: 0,
        y: 6,
        duration: 0.18,
        onComplete: () => {
          quoteEl.textContent = char.quote;
          gsap.to(quoteEl, { opacity: 1, y: 0, duration: 0.35 });
        }
      });
    }

    // Update external 4K YouTube cinema link
    if (ytDirectLink && char.trailerId) {
      ytDirectLink.href = `https://www.youtube.com/watch?v=${char.trailerId}`;
    }

    // Update active highlight in selector pills
    updateNavPills(currentCharacterIndex);
  }

  // Switch Mode: Interactive Animus Simulation vs. Cinematic Trailer Video Loop
  function setMode(mode, isUserGesture = false) {
    currentMode = mode;
    const char = HERO_CHARACTERS[currentCharacterIndex];

    if (mode === 'video') {
      // --- MODE 2: TRAILER VIDEO LOOP ---
      // 1. Hide 3D character card to give full focus to video
      if (cardScene) {
        cardScene.style.opacity = '0';
        cardScene.style.pointerEvents = 'none';
        cardScene.style.transform = 'scale(0.95)';
        cardScene.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      }
      cardParticles.stop();

      // 2. Hide Animus corridor canvas and pause its animation loop
      if (animusContainer) {
        animusContainer.style.opacity = '0';
        animusContainer.style.pointerEvents = 'none';
      }
      animusCorridor.stop();

      // 3. Show native cinematic video background & play
      if (videoContainer) {
        videoContainer.style.opacity = '1';
        videoContainer.style.pointerEvents = 'auto';
      }
      if (localVideo) {
        if (char && localVideo.getAttribute('src') !== char.videoSrc) {
          localVideo.src = char.videoSrc;
        }
        localVideo.muted = isVideoMuted;
        localVideo.play().catch(() => {});
      }

      // 4. Update mode toggle button styles
      modeVideoBtn?.classList.add('bg-secondary', 'text-black', 'shadow-gold');
      modeVideoBtn?.classList.remove('text-on-surface-variant');
      modeCharBtn?.classList.remove('bg-secondary', 'text-black', 'shadow-gold');
      modeCharBtn?.classList.add('text-on-surface-variant');

      // 5. Show audio mute toggle button
      muteBtn?.classList.remove('hidden');
      muteBtn?.classList.add('flex');

      // 6. Switch left column action buttons
      actionsChar?.classList.add('hidden');
      actionsTrailer?.classList.remove('hidden');

      if (char) {
        if (chapterEl) chapterEl.textContent = `Cinematic Archive · ${char.shortBadge} (${char.era})`;
        if (ytDirectLink) ytDirectLink.href = `https://www.youtube.com/watch?v=${char.trailerId}`;
      }

      if (isUserGesture) animusAudio.playUiClick();
    } else {
      // --- MODE 1: INTERACTIVE ANIMUS SIMULATION ---
      // 1. Pause native video and hide its container
      if (localVideo) localVideo.pause();
      if (videoContainer) {
        videoContainer.style.opacity = '0';
        videoContainer.style.pointerEvents = 'none';
      }

      // 2. Show Animus corridor simulation canvas and start rendering
      if (animusContainer) {
        animusContainer.style.opacity = '1';
        animusContainer.style.pointerEvents = 'auto';
      }
      animusCorridor.start();

      // 3. Show interactive 3D character card hovering in Animus
      if (cardScene) {
        cardScene.style.opacity = '1';
        cardScene.style.pointerEvents = 'auto';
        cardScene.style.transform = 'scale(1)';
        cardScene.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      }
      cardParticles.start();

      // 4. Update mode toggle button styles
      modeCharBtn?.classList.add('bg-secondary', 'text-black', 'shadow-gold');
      modeCharBtn?.classList.remove('text-on-surface-variant');
      modeVideoBtn?.classList.remove('bg-secondary', 'text-black', 'shadow-gold');
      modeVideoBtn?.classList.add('text-on-surface-variant');

      // 5. Hide audio mute button (Animus simulation uses synthesized web audio)
      muteBtn?.classList.add('hidden');
      muteBtn?.classList.remove('flex');

      // 6. Switch left column action buttons
      actionsChar?.classList.remove('hidden');
      actionsTrailer?.classList.add('hidden');

      if (char) {
        if (chapterEl) chapterEl.textContent = `Memory Sequence — ${char.subtitle}`;
      }

      if (isUserGesture) {
        animusAudio.playHiddenBlade();
        window.triggerAnimusPulse?.(false);
      }
    }
  }

  // Automatic Video Loop Progression: When a trailer video ends, advance to next saga
  if (localVideo) {
    localVideo.addEventListener('ended', () => {
      if (currentMode === 'video') {
        selectCharacter(currentCharacterIndex + 1, false);
      }
    });
  }

  // Render Saga Nav Pills (Universal Selector for both modes)
  if (sagaNav) {
    sagaNav.innerHTML = '';
    HERO_CHARACTERS.forEach((char, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = idx === 0
        ? 'px-3.5 py-1.5 rounded-full bg-secondary text-black font-label-sm text-[11px] uppercase tracking-wider font-bold shadow-gold transition-all flex items-center gap-1.5 cursor-pointer scale-105'
        : 'px-3.5 py-1.5 rounded-full bg-black/70 hover:bg-black/95 text-on-surface-variant hover:text-white border border-white/10 font-label-sm text-[11px] uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer';
      btn.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-current"></span><span>${char.shortBadge}</span>`;
      
      btn.addEventListener('mouseenter', () => animusAudio.playUiHover());
      btn.addEventListener('click', () => selectCharacter(idx, true));
      sagaNav.appendChild(btn);
    });
  }

  // Next / Prev Trailer Buttons (Loops through all saga parts)
  trailerPrevBtn?.addEventListener('click', () => {
    selectCharacter(currentCharacterIndex - 1, true);
  });

  trailerNextBtn?.addEventListener('click', () => {
    selectCharacter(currentCharacterIndex + 1, true);
  });

  returnCharBtn?.addEventListener('click', () => {
    setMode('character', true);
  });

  // Mode Toggle Buttons
  modeVideoBtn?.addEventListener('click', () => setMode('video', true));
  modeCharBtn?.addEventListener('click', () => setMode('character', true));
  watchTrailerBtn?.addEventListener('click', () => setMode('video', true));

  // Audio Mute / Unmute Button for Trailer Video Loop
  muteBtn?.addEventListener('click', () => {
    isVideoMuted = !isVideoMuted;
    if (localVideo) localVideo.muted = isVideoMuted;

    const icon = muteBtn.querySelector('.material-symbols-outlined');
    const label = muteBtn.querySelector('.mute-label');
    if (icon) icon.textContent = isVideoMuted ? 'volume_off' : 'volume_up';
    if (label) label.textContent = isVideoMuted ? 'Muted' : 'Sound On';

    if (isVideoMuted) {
      muteBtn.classList.remove('bg-secondary', 'text-black', 'shadow-gold');
      muteBtn.classList.add('bg-black/80', 'text-secondary');
    } else {
      muteBtn.classList.add('bg-secondary', 'text-black', 'shadow-gold');
      muteBtn.classList.remove('bg-black/80', 'text-secondary');
    }
  });

  // Eagle Vision Button click handler
  eagleBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    isEagleVisionActive = !isEagleVisionActive;
    animusAudio.playEagleVision(isEagleVisionActive);

    if (cardEagleGlow) {
      cardEagleGlow.style.opacity = isEagleVisionActive ? '1' : '0';
    }

    if (eagleBtnText) {
      eagleBtnText.textContent = isEagleVisionActive ? 'Deactivate Eagle Vision' : 'Activate Eagle Vision';
    }

    window.toggleEagleVision?.();
    window.triggerAnimusPulse?.(true);
  });

  // Strike Action VFX Execution
  function executeStrikeAction() {
    animusAudio.playHiddenBlade();

    // Trigger Slash animation trail
    if (slashFx) {
      slashFx.classList.remove('ac-slash-active');
      void slashFx.offsetWidth; // force DOM reflow
      slashFx.classList.add('ac-slash-active');
    }

    // Dynamic micro camera recoil / spring shake on card
    if (card) {
      const shakeDir = Math.random() > 0.5 ? 1 : -1;
      gsap.fromTo(card,
        { x: shakeDir * 8, y: -4 },
        { x: 0, y: 0, duration: 0.35, ease: 'elastic.out(1.2, 0.28)' }
      );
    }

    // Desynchronization glitch flash
    const desync = document.getElementById('ac-desync');
    if (desync) {
      desync.classList.add('ac-desync--active');
      setTimeout(() => desync.classList.remove('ac-desync--active'), 320);
    }

    window.triggerAnimusPulse?.(false);
  }

  // 3D Interactive Assassin Card Engine (Stereoscopic Parallax & Specular Sheen)
  if (card && cardScene) {
    let mouseX = 0;
    let mouseY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let isHovering = false;
    let isHeroVisible = true;

    // Observe hero visibility to pause render loops when scrolled past
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        isHeroVisible = entries[0]?.isIntersecting ?? true;
        if (isHeroVisible) {
          if (currentMode === 'character') {
            animusCorridor.start();
            cardParticles.start();
          } else if (localVideo) {
            localVideo.play().catch(() => {});
          }
        } else {
          animusCorridor.stop();
          cardParticles.stop();
          if (localVideo) localVideo.pause();
        }
      }, { threshold: 0.05 });
      observer.observe(heroSection);
    }

    cardScene.addEventListener('mouseenter', () => {
      isHovering = true;
    });

    cardScene.addEventListener('mousemove', (e) => {
      if (!isHeroVisible) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Range from -1 to +1 relative to center of card
      mouseX = Math.max(-1, Math.min(1, (x / rect.width - 0.5) * 2));
      mouseY = Math.max(-1, Math.min(1, (y / rect.height - 0.5) * 2));

      // Specular holographic sheen coordinates
      if (cardGlare) {
        const px = Math.round((x / rect.width) * 100);
        const py = Math.round((y / rect.height) * 100);
        cardGlare.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.26) 0%, rgba(233,195,73,0.12) 35%, transparent 70%)`;
      }
    });

    cardScene.addEventListener('mouseleave', () => {
      isHovering = false;
      mouseX = 0;
      mouseY = 0;
      cardParticles.setTilt(0, 0);
    });

    function tiltLoop() {
      requestAnimationFrame(tiltLoop);
      if (!isHeroVisible || currentMode !== 'character') return;

      const targetRotX = isHovering ? -mouseY * 18 : 0; // ±18° vertical tilt
      const targetRotY = isHovering ? mouseX * 22 : 0;  // ±22° horizontal tilt

      currentRotX += (targetRotX - currentRotX) * 0.12;
      currentRotY += (targetRotY - currentRotY) * 0.12;

      // Send tilt vector to living particle engine
      cardParticles.setTilt(currentRotX, currentRotY);

      // True 3D perspective rotation with preserve-3d
      card.style.transform = `perspective(1200px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

      // Dynamic reactive shadow moving opposite to tilt
      if (cardShadow) {
        const shadowX = (-currentRotY * 1.5).toFixed(1);
        const shadowY = (currentRotX * 1.5 + 18).toFixed(1);
        cardShadow.style.transform = `translate3d(${shadowX}px, ${shadowY}px, 0)`;
      }

      // Live Animus telemetry HUD
      if (hudRot && isHovering) {
        hudRot.textContent = `ROT: ${currentRotX >= 0 ? '+' : ''}${currentRotX.toFixed(1)}° / ${currentRotY >= 0 ? '+' : ''}${currentRotY.toFixed(1)}°`;
      }
    }
    tiltLoop();

    // Clicking the character card triggers Assassin strike!
    card.addEventListener('click', (e) => {
      if (e.target.closest('#hero-eagle-btn')) return;
      executeStrikeAction();
    });
  }

  // Initial load: Start in Interactive Assassin mode with Part 1 (Altaïr / Masyaf)
  setMode('character', false);
  selectCharacter(0, false);
}
