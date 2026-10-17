// Animus Corridor — Authentic Assassin's Creed Memory Synchronizing Space
// Interactive 3D Perspective Grid, DNA Memory Strands, Hex Code Streams & Eagle Sonar

export class AnimusCorridor {
  constructor(canvasId = 'animus-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.isRunning = false;
    this.rafId = null;

    // Mouse coordinates (normalized -1 to +1)
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;

    // Sonar pulse rings
    this.pulses = [];

    // DNA Memory particles
    this.particles = [];
    this.particleCount = 65;

    // Hex stream codes
    this.hexStreams = [];
    this.hexStreamCount = 12;

    // Time tracking
    this.time = 0;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    // Track mouse movement across hero section
    const heroSection = document.getElementById('top');
    if (heroSection) {
      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        this.targetMouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        this.targetMouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      }, { passive: true });

      heroSection.addEventListener('mouseleave', () => {
        this.targetMouseX = 0;
        this.targetMouseY = 0;
      });

      heroSection.addEventListener('click', (e) => {
        // Don't trigger if clicked on an interactive button or card
        if (e.target.closest('button, a, #hero-char-card, input')) return;
        const rect = heroSection.getBoundingClientRect();
        this.triggerPulse(e.clientX - rect.left, e.clientY - rect.top, false);
      });
    }

    // Initialize DNA particles
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        z: Math.random() * 800 + 100, // Depth
        speedY: 0.5 + Math.random() * 1.2,
        size: 1.2 + Math.random() * 2.5,
        opacity: 0.2 + Math.random() * 0.6,
        isGold: Math.random() > 0.6
      });
    }

    // Initialize floating Hex memory codes
    const hexSamples = [
      'MEM_SEQ // 01.1191',
      'DNA_BLOCK: 0x8FA4',
      'SYNC_RATE: 99.4%',
      'SYNAPSE_LINK: OK',
      'ANIMUS_4.2',
      'LOC: MASYAF_COORD',
      'SUBJECT_17 // DESMOND',
      'GENOME: STABLE',
      'ABSTERGO_NET: SECURE',
      '0x41 0x43 0x31',
      'CORRIDOR // ACTIVE'
    ];

    for (let i = 0; i < this.hexStreamCount; i++) {
      this.hexStreams.push({
        text: hexSamples[i % hexSamples.length],
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        speedY: 0.3 + Math.random() * 0.6,
        opacity: 0.15 + Math.random() * 0.35,
        fontSize: Math.floor(9 + Math.random() * 3)
      });
    }

    // Expose pulse trigger globally for Eagle Vision synchronization
    window.triggerAnimusPulse = (isEagleVision = true) => {
      this.triggerPulse(this.width / 2, this.height * 0.6, isEagleVision);
    };
  }

  resize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    this.width = this.canvas.width = parent ? parent.clientWidth : window.innerWidth;
    this.height = this.canvas.height = parent ? parent.clientHeight : window.innerHeight;
  }

  triggerPulse(x, y, isEagle = false) {
    this.pulses.push({
      x,
      y,
      radius: 10,
      maxRadius: Math.max(this.width, this.height) * 1.1,
      speed: isEagle ? 28 : 18,
      alpha: 1,
      isEagle
    });
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.resize();
    this.loop();
  }

  stop() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  loop() {
    if (!this.isRunning) return;
    this.rafId = requestAnimationFrame(() => this.loop());
    this.render();
  }

  render() {
    const ctx = this.ctx;
    if (!ctx) return;

    this.time += 0.016;

    // Smooth cursor interpolation (damping)
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.08;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.08;

    const w = this.width;
    const h = this.height;

    // Clear with dark Animus cyber gradient
    ctx.fillStyle = '#07080b';
    ctx.fillRect(0, 0, w, h);

    // 1. Draw Animus 3D Perspective Floor Grid
    this.drawPerspectiveGrid(ctx, w, h);

    // 2. Draw Floating DNA / Memory Particles
    this.drawMemoryParticles(ctx, w, h);

    // 3. Draw Floating Animus Hex Streams
    this.drawHexStreams(ctx, w, h);

    // 4. Draw Interactive Sonar Pulses
    this.drawPulses(ctx);

    // 5. Draw Digital Vignette & Scanline Overlay
    this.drawScanlines(ctx, w, h);
  }

  drawPerspectiveGrid(ctx, w, h) {
    const isEagleActive = document.documentElement.classList.contains('ac-eagle-active');
    const gridColor = isEagleActive ? 'rgba(233, 195, 73, ' : 'rgba(34, 211, 238, ';

    // Horizon line with subtle cursor parallax
    const horizonY = h * 0.42 + this.mouseY * 35;
    const vanishingX = w * 0.5 + this.mouseX * 60;

    ctx.save();

    // Floor perspective lines converging to vanishing point
    const lineCount = 26;
    for (let i = 0; i <= lineCount; i++) {
      const xBottom = (w / lineCount) * i;
      const alpha = 0.04 + (Math.sin(this.time * 2 + i * 0.4) + 1) * 0.02;

      ctx.strokeStyle = `${gridColor}${alpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(vanishingX, horizonY);
      ctx.lineTo(xBottom, h);
      ctx.stroke();
    }

    // Horizontal grid lines receding into distance
    const depthCount = 14;
    for (let i = 1; i <= depthCount; i++) {
      // Perspective compression curve
      const p = Math.pow(i / depthCount, 2.2);
      const y = horizonY + (h - horizonY) * p;
      const alpha = 0.03 + p * 0.12;

      ctx.strokeStyle = `${gridColor}${alpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Subtle horizon glow
    const horizonGrad = ctx.createLinearGradient(0, horizonY - 40, 0, horizonY + 60);
    horizonGrad.addColorStop(0, 'rgba(0,0,0,0)');
    horizonGrad.addColorStop(0.5, isEagleActive ? 'rgba(233,195,73,0.1)' : 'rgba(34,211,238,0.06)');
    horizonGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = horizonGrad;
    ctx.fillRect(0, horizonY - 40, w, 100);

    ctx.restore();
  }

  drawMemoryParticles(ctx, w, h) {
    const isEagleActive = document.documentElement.classList.contains('ac-eagle-active');

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.y -= p.speedY;

      // Wrap around top
      if (p.y < 0) {
        p.y = h + 10;
        p.x = Math.random() * w;
      }

      // Parallax shift based on depth (z)
      const px = p.x - this.mouseX * (400 / p.z) * 12;
      const py = p.y - this.mouseY * (400 / p.z) * 8;

      const alpha = p.opacity * (0.6 + Math.sin(this.time * 3 + i) * 0.4);
      const color = isEagleActive || p.isGold
        ? `rgba(233, 195, 73, ${alpha})`
        : `rgba(56, 189, 248, ${alpha * 0.8})`;

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();

      // Draw faint vertical memory connection line
      if (i % 4 === 0) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px, py + p.size * 6);
        ctx.stroke();
      }
    }
  }

  drawHexStreams(ctx, w, h) {
    const isEagleActive = document.documentElement.classList.contains('ac-eagle-active');
    ctx.font = '10px monospace';

    for (let i = 0; i < this.hexStreams.length; i++) {
      const s = this.hexStreams[i];
      s.y -= s.speedY;

      if (s.y < 0) {
        s.y = h + 20;
        s.x = Math.random() * (w - 200) + 50;
      }

      const sx = s.x - this.mouseX * 15;
      const sy = s.y - this.mouseY * 10;

      const alpha = s.opacity * (0.7 + Math.sin(this.time * 2 + i) * 0.3);
      ctx.fillStyle = isEagleActive
        ? `rgba(233, 195, 73, ${alpha * 0.9})`
        : `rgba(34, 211, 238, ${alpha * 0.6})`;

      ctx.fillText(s.text, sx, sy);
    }
  }

  drawPulses(ctx) {
    for (let i = this.pulses.length - 1; i >= 0; i--) {
      const pulse = this.pulses[i];
      pulse.radius += pulse.speed;
      pulse.alpha = Math.max(0, 1 - pulse.radius / pulse.maxRadius);

      const ringColor = pulse.isEagle ? 'rgba(233, 195, 73, ' : 'rgba(34, 211, 238, ';

      // Main pulse wave
      ctx.save();
      ctx.lineWidth = pulse.isEagle ? 3 : 1.5;
      ctx.strokeStyle = `${ringColor}${pulse.alpha * 0.8})`;
      ctx.beginPath();
      ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
      ctx.stroke();

      // Outer secondary ripple
      if (pulse.radius > 60) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = `${ringColor}${pulse.alpha * 0.35})`;
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, pulse.radius * 0.82, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      if (pulse.alpha <= 0 || pulse.radius >= pulse.maxRadius) {
        this.pulses.splice(i, 1);
      }
    }
  }

  drawScanlines(ctx, w, h) {
    // Subtle digital scanline overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    const scanStep = 4;
    for (let y = 0; y < h; y += scanStep) {
      ctx.fillRect(0, y, w, 1);
    }
  }
}
