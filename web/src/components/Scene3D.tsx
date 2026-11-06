import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

// Fundo 3D cinematográfico com GLOW (bloom) e forma/cor TEMÁTICA por reino.
// O renderer é criado uma vez; ao navegar entre reinos, só o "cristal" e as cores trocam.

type Theme = { color: number; accent: number; geo: () => THREE.BufferGeometry; spin: number };

const THEMES: Record<string, Theme> = {
  default: { color: 0x8b5cf6, accent: 0xec4899, geo: () => new THREE.IcosahedronGeometry(1.7, 0), spin: 1 },
  metodo:  { color: 0xe879f9, accent: 0x8b5cf6, geo: () => new THREE.IcosahedronGeometry(1.7, 1), spin: 0.8 }, // cérebro/cristal facetado
  js:      { color: 0xf59e0b, accent: 0xfbbf24, geo: () => new THREE.TorusKnotGeometry(1.1, 0.34, 120, 16), spin: 1.1 },
  git:     { color: 0xf97316, accent: 0xfb923c, geo: () => new THREE.OctahedronGeometry(1.8, 0), spin: 1 },
  backend: { color: 0x10b981, accent: 0x34d399, geo: () => new THREE.BoxGeometry(2, 2, 2), spin: 0.7 }, // "servidor"
  db:      { color: 0x3b82f6, accent: 0x60a5fa, geo: () => new THREE.CylinderGeometry(1.4, 1.4, 1.8, 24, 3), spin: 0.6 }, // disco de banco
  sec:     { color: 0xef4444, accent: 0xf87171, geo: () => new THREE.TorusGeometry(1.4, 0.45, 16, 40), spin: 0.9 }, // anel/escudo
  front:   { color: 0x22d3ee, accent: 0x67e8f9, geo: () => new THREE.DodecahedronGeometry(1.7, 0), spin: 1 },
  rt:      { color: 0x8b5cf6, accent: 0x22d3ee, geo: () => new THREE.IcosahedronGeometry(1.7, 0), spin: 1.6 }, // "sinal" girando rápido
  ia:      { color: 0xec4899, accent: 0xa78bfa, geo: () => new THREE.TorusKnotGeometry(1.0, 0.3, 160, 20, 2, 3), spin: 1.2 },
  eng:     { color: 0x94a3b8, accent: 0xcbd5e1, geo: () => new THREE.BoxGeometry(1.6, 2.2, 1.6), spin: 0.6 }, // "pilar"
  devops:  { color: 0x14b8a6, accent: 0x2dd4bf, geo: () => new THREE.TorusGeometry(1.4, 0.3, 12, 32), spin: 1.3 }, // "engrenagem"
  pentest: { color: 0xf43f5e, accent: 0xfb7185, geo: () => new THREE.OctahedronGeometry(1.8, 1), spin: 1.1 }, // "espinhoso"
  carreira:{ color: 0xeab308, accent: 0xfde047, geo: () => new THREE.ConeGeometry(1.4, 2.2, 5), spin: 0.9 }, // "troféu"
  labs:    { color: 0xef4444, accent: 0xf87171, geo: () => new THREE.TorusGeometry(1.4, 0.45, 16, 40), spin: 1 },
};

function themeFromPath(path: string): Theme {
  const m = path.match(/^\/realm\/([a-z-]+)/);
  if (m && THEMES[m[1]]) return THEMES[m[1]];
  if (path.startsWith('/labs')) return THEMES.labs;
  return THEMES.default;
}

export function Scene3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const applyRef = useRef<((t: Theme) => void) | null>(null);
  const location = useLocation();

  // Setup único do renderer + bloom + partículas + loop
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.innerWidth < 640;

    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: !mobile, alpha: true, powerPreference: 'high-performance' }); }
    catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 6;

    // Cristal temático (trocável)
    const crystal = new THREE.Group();
    scene.add(crystal);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.04 });
    const wireMat = new THREE.LineBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.3 });
    let spin = 1;

    function buildCrystal(theme: Theme) {
      while (crystal.children.length) { const c = crystal.children.pop()!; (c as any).geometry?.dispose?.(); }
      const g = theme.geo();
      coreMat.color.setHex(theme.color);
      wireMat.color.setHex(theme.accent);
      crystal.add(new THREE.Mesh(g, coreMat));
      crystal.add(new THREE.LineSegments(new THREE.WireframeGeometry(g), wireMat));
      spin = theme.spin;
    }

    // Partículas
    const COUNT = mobile ? 1100 : 2600;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 44;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 44;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 44;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const stars = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: 0.045, vertexColors: true, transparent: true, opacity: 0.4, depthWrite: false, blending: THREE.AdditiveBlending }));
    scene.add(stars);

    function tintStars(theme: Theme) {
      const a = new THREE.Color(theme.color), b = new THREE.Color(theme.accent), c = new THREE.Color(0xffffff);
      for (let i = 0; i < COUNT; i++) {
        const r = Math.random();
        const col = r < 0.45 ? a : r < 0.85 ? b : c;
        colors[i * 3] = col.r; colors[i * 3 + 1] = col.g; colors[i * 3 + 2] = col.b;
      }
      pGeo.attributes.color.needsUpdate = true;
    }

    // Pós-processamento: bloom cinematográfico
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), mobile ? 0.3 : 0.5, 0.6, 0.25);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    // expõe a troca de tema
    applyRef.current = (theme) => { buildCrystal(theme); tintStars(theme); };
    applyRef.current(themeFromPath(window.location.pathname));

    const target = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => { target.x = (e.clientX / window.innerWidth - 0.5) * 0.7; target.y = (e.clientY / window.innerHeight - 0.5) * 0.7; };
    window.addEventListener('mousemove', onMove);
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight); composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    let raf = 0, running = true;
    const clock = new THREE.Clock();
    const render = () => {
      const t = clock.getElapsedTime();
      crystal.rotation.x = t * 0.07 * spin;
      crystal.rotation.y = t * 0.1 * spin;
      crystal.scale.setScalar(1 + Math.sin(t * 0.5) * 0.03);
      stars.rotation.y = t * 0.012;
      camera.position.x += (target.x - camera.position.x) * 0.025;
      camera.position.y += (-target.y - camera.position.y) * 0.025;
      camera.lookAt(scene.position);
      composer.render();
    };
    const loop = () => { if (!running) return; render(); raf = requestAnimationFrame(loop); };
    if (reduce) render(); else loop();

    const onVis = () => { running = document.visibilityState === 'visible' && !reduce; if (running) loop(); };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      running = false; cancelAnimationFrame(raf);
      applyRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
      composer.dispose(); renderer.dispose(); pGeo.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  // Troca de tema ao navegar (sem recriar o renderer)
  useEffect(() => { applyRef.current?.(themeFromPath(location.pathname)); }, [location.pathname]);

  return (
    <>
      <div ref={mountRef} aria-hidden className="fixed inset-0 -z-10 pointer-events-none" />
      {/* véu que acalma o fundo e garante leitura do conteúdo */}
      <div aria-hidden className="fixed inset-0 -z-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(7,7,14,0.5) 0%, rgba(7,7,14,0.72) 55%, rgba(7,7,14,0.88) 100%)' }} />
    </>
  );
}
