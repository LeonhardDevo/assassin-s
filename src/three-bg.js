import * as THREE from 'three';

/**
 * Creates a soft radial glow sprite texture for luminous particles
 * without relying on external image asset loading.
 */
function createGlowTexture(colorStr = '#ffffff') {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, colorStr);
  gradient.addColorStop(0.25, colorStr);
  gradient.addColorStop(0.65, 'rgba(233, 195, 73, 0.25)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function initThreeBackground() {
  const canvas = document.querySelector('#webgl-canvas');
  if (!canvas) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const isLowPerf = isMobile || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

  if (prefersReduced) {
    renderStatic(canvas);
    return;
  }

  const scene = new THREE.Scene();
  // Deep cinematic Animus dark atmosphere
  const fogColor = 0x07080b;
  scene.fog = new THREE.FogExp2(fogColor, 0.012);

  const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 45;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: 'high-performance',
    depth: false,
    stencil: false
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));

  // --- 1. Animus Gold Memory Embers (100% GPU Shader Driven) ---
  const goldTexture = createGlowTexture('#ffe088');
  const goldCount = isLowPerf ? 220 : 450;
  const goldGeo = new THREE.BufferGeometry();
  const goldPos = new Float32Array(goldCount * 3);
  const goldSpeed = new Float32Array(goldCount);
  const goldPhase = new Float32Array(goldCount);
  const goldScale = new Float32Array(goldCount);

  for (let i = 0; i < goldCount; i++) {
    goldPos[i * 3 + 0] = (Math.random() - 0.5) * 120;
    goldPos[i * 3 + 1] = (Math.random() - 0.5) * 100;
    goldPos[i * 3 + 2] = (Math.random() - 0.5) * 80;
    goldSpeed[i] = 0.6 + Math.random() * 1.4;
    goldPhase[i] = Math.random() * 6.28;
    goldScale[i] = 0.8 + Math.random() * 0.9;
  }
  goldGeo.setAttribute('position', new THREE.BufferAttribute(goldPos, 3));
  goldGeo.setAttribute('aSpeed', new THREE.BufferAttribute(goldSpeed, 1));
  goldGeo.setAttribute('aPhase', new THREE.BufferAttribute(goldPhase, 1));
  goldGeo.setAttribute('aScale', new THREE.BufferAttribute(goldScale, 1));

  const goldMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uTexture: { value: goldTexture },
      uColor: { value: new THREE.Color(0xffe088) }
    },
    vertexShader: `
      uniform float uTime;
      uniform float uScroll;
      attribute float aSpeed;
      attribute float aPhase;
      attribute float aScale;
      varying float vAlpha;

      void main() {
        vec3 pos = position;
        // Seamless GPU drift wrapping without CPU array mutation
        float drift = uTime * aSpeed * 3.2 - uScroll * 0.015;
        pos.y = mod(pos.y + drift + 60.0, 120.0) - 60.0;
        pos.x += sin(uTime * 0.5 + aPhase) * 1.5;
        pos.z += cos(uTime * 0.4 + aPhase) * 1.2;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = (aScale * 38.0) / -mvPosition.z;
        gl_Position = projectionMatrix * mvPosition;

        float edgeFade = smoothstep(58.0, 42.0, abs(pos.y));
        vAlpha = edgeFade * (0.4 + 0.35 * sin(uTime * 1.6 + aPhase));
      }
    `,
    fragmentShader: `
      uniform sampler2D uTexture;
      uniform vec3 uColor;
      varying float vAlpha;

      void main() {
        vec4 tex = texture2D(uTexture, gl_PointCoord);
        gl_FragColor = vec4(uColor * tex.rgb, tex.a * vAlpha * 0.75);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const goldMesh = new THREE.Points(goldGeo, goldMat);
  scene.add(goldMesh);

  // --- 2. Animus Cyan / Silver Memory Nodes ---
  const cyanTexture = createGlowTexture('#80e2ff');
  const cyanCount = isLowPerf ? 160 : 320;
  const cyanGeo = new THREE.BufferGeometry();
  const cyanPos = new Float32Array(cyanCount * 3);
  for (let i = 0; i < cyanCount * 3; i++) {
    cyanPos[i] = (Math.random() - 0.5) * 140;
  }
  cyanGeo.setAttribute('position', new THREE.BufferAttribute(cyanPos, 3));

  const cyanMat = new THREE.PointsMaterial({
    size: isMobile ? 0.6 : 0.85,
    map: cyanTexture,
    transparent: true,
    opacity: 0.45,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const cyanMesh = new THREE.Points(cyanGeo, cyanMat);
  scene.add(cyanMesh);

  // --- 3. Piece of Eden / Animus Synch Core (3D Sacred Geometry) ---
  const coreGroup = new THREE.Group();
  coreGroup.position.set(0, 0, -15);

  // Outer Icosahedron
  const outerGeo = new THREE.IcosahedronGeometry(18, 1);
  const outerMat = new THREE.MeshBasicMaterial({
    color: 0xe9c349,
    wireframe: true,
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending
  });
  const outerCore = new THREE.Mesh(outerGeo, outerMat);
  coreGroup.add(outerCore);

  // Inner Core Sphere
  const innerGeo = new THREE.DodecahedronGeometry(11, 0);
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0x4fc3f7,
    wireframe: true,
    transparent: true,
    opacity: 0.08,
    blending: THREE.AdditiveBlending
  });
  const innerCore = new THREE.Mesh(innerGeo, innerMat);
  coreGroup.add(innerCore);

  // Subtle orbital rings
  const ringGeo = new THREE.TorusGeometry(24, 0.06, 8, 80);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xe9c349,
    transparent: true,
    opacity: 0.09,
    blending: THREE.AdditiveBlending
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 3;
  coreGroup.add(ring);

  scene.add(coreGroup);

  // --- Mouse Parallax ---
  let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - windowHalfX) * 0.02;
    mouseY = (e.clientY - windowHalfY) * 0.02;
  }, { passive: true });

  const startTime = performance.now();
  let running = true;

  let currentScroll = 0;
  let targetScroll = 0;
  let scrollVelocity = 0;

  window.addEventListener('scroll', () => {
    targetScroll = window.scrollY;
  }, { passive: true });

  function animate() {
    if (!running) return;
    requestAnimationFrame(animate);

    scrollVelocity = (targetScroll - currentScroll) * 0.08;
    currentScroll += scrollVelocity;

    // Only compute and render 3D WebGL when in or near hero atmosphere (< 1400px)
    if (currentScroll > 1400 && targetScroll > 1400) {
      return;
    }

    const t = (performance.now() - startTime) * 0.001;

    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;

    // Smooth camera drift + depth scroll parallax
    const scrollOffsetY = -currentScroll * 0.025;
    camera.position.x = targetX * 0.4;
    camera.position.y = -targetY * 0.4 + scrollOffsetY;
    camera.lookAt(0, scrollOffsetY, 0);

    // Rotate Animus Synch Core slowly + reactive scroll boost
    const scrollSpin = currentScroll * 0.003;
    outerCore.rotation.x = t * 0.05 + scrollSpin * 0.5;
    outerCore.rotation.y = t * 0.08 + scrollSpin;
    innerCore.rotation.x = -t * 0.07 - scrollSpin * 0.7;
    innerCore.rotation.z = t * 0.06;
    ring.rotation.z = t * 0.03 + scrollSpin * 0.3;

    // Update GPU uniforms (0 CPU mutations, 0 VBO buffer re-uploads)
    goldMat.uniforms.uTime.value = t;
    goldMat.uniforms.uScroll.value = currentScroll;

    // Cyan memory nodes slow orbit
    cyanMesh.rotation.y = t * 0.015 + scrollSpin * 0.2;
    cyanMesh.rotation.x = Math.sin(t * 0.01) * 0.05;

    renderer.render(scene, camera);
  }
  animate();

  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) animate();
  });

  let lastW = window.innerWidth;
  let lastH = window.innerHeight;
  window.addEventListener('resize', () => {
    if (window.innerWidth === lastW && window.innerHeight === lastH) return;
    lastW = window.innerWidth;
    lastH = window.innerHeight;
    camera.aspect = lastW / lastH;
    camera.updateProjectionMatrix();
    renderer.setSize(lastW, lastH);
  }, { passive: true });
}

function renderStatic(canvas) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x07080b, 0.015);
  const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 45;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(1);

  const texture = createGlowTexture('#ffe088');
  const count = 500;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 100;
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ size: 0.8, map: texture, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending });
  scene.add(new THREE.Points(geo, mat));

  renderer.render(scene, camera);
}
