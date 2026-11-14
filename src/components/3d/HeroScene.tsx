/**
 * Hero 3D scene. Client-only: loaded lazily from HeroVisual.
 * The portrait sits on a displaced plane so it gains real depth when it turns
 * toward the pointer. Everything else (orbits, panels, grid, particles) stays
 * quiet so the portrait remains the focus.
 */
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Float, Grid } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import bustUrl from "@/assets/soheb-3d-bust.jpg";

const BG = "#080A0D";
const AMBER = "#FF8A3D";
const INK = "#E8E9E7";

type SceneProps = {
  reducedMotion: boolean;
  lowPower: boolean;
  active: boolean;
  onReady: () => void;
};

/** Shared pointer + scroll state, written by DOM listeners, read in useFrame. */
const input = { px: 0, py: 0, scroll: 0 };

const bustVertex = /* glsl */ `
  uniform float uDepth;
  varying vec2 vUv;
  varying float vDepth;

  float dome(vec2 uv, vec2 c, vec2 r) {
    vec2 d = (uv - c) / r;
    float q = 1.0 - dot(d, d);
    return q > 0.0 ? sqrt(q) : 0.0;
  }

  void main() {
    vUv = uv;
    float head = dome(uv, vec2(0.5, 0.63), vec2(0.27, 0.31));
    float neck = dome(uv, vec2(0.5, 0.40), vec2(0.14, 0.16)) * 0.65;
    float body = dome(uv, vec2(0.5, -0.05), vec2(0.62, 0.42)) * 0.75;
    float d = max(head, max(neck, body));
    vDepth = d;
    vec3 p = position + normal * d * uDepth;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const bustFragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uReveal;
  uniform float uTime;
  uniform vec3 uAmber;
  varying vec2 vUv;
  varying float vDepth;

  void main() {
    vec4 tex = texture2D(uMap, vUv);
    vec3 col = tex.rgb;

    // gentle depth shading so the relief reads in 3D
    col *= 0.82 + vDepth * 0.28;

    // soft edge fade into the scene
    float ex = smoothstep(0.0, 0.14, vUv.x) * smoothstep(1.0, 0.86, vUv.x);
    float ey = smoothstep(0.0, 0.06, vUv.y) * smoothstep(1.0, 0.9, vUv.y);
    float edge = ex * ey;

    // entrance: scan reveal from bottom to top with an amber leading line
    float front = uReveal * 1.15 - 0.05;
    float shown = smoothstep(front, front - 0.04, vUv.y);
    float line = smoothstep(0.012, 0.0, abs(vUv.y - front)) * step(uReveal, 0.999);
    col += uAmber * line * 1.4;

    // very faint scanlines, only on the figure
    col *= 0.97 + 0.03 * sin(vUv.y * 900.0 + uTime * 2.0);

    float alpha = edge * max(shown, line);
    gl_FragColor = vec4(col, alpha);
    #include <colorspace_fragment>
  }
`;

function Bust({ reducedMotion, onReady }: { reducedMotion: boolean; onReady: () => void }) {
  const texture = useLoader(THREE.TextureLoader, bustUrl);
  const group = useRef<THREE.Group>(null);
  const readyFired = useRef(false);

  const uniforms = useMemo(
    () => ({
      uMap: { value: texture as THREE.Texture },
      uDepth: { value: 0.55 },
      uReveal: { value: reducedMotion ? 1 : 0 },
      uTime: { value: 0 },
      uAmber: { value: new THREE.Color(AMBER) },
    }),
    [texture, reducedMotion],
  );

  const material = useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return new THREE.ShaderMaterial({
      uniforms,
      vertexShader: bustVertex,
      fragmentShader: bustFragment,
      transparent: true,
      depthWrite: false,
    });
  }, [texture, uniforms]);

  useEffect(() => () => material.dispose(), [material]);

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const u = uniforms;
    u.uTime.value = state.clock.elapsedTime;
    if (u.uReveal.value < 1) u.uReveal.value = Math.min(1, u.uReveal.value + dt * 0.55);

    if (group.current) {
      const follow = reducedMotion ? 0.35 : 1;
      const ty = input.px * 0.32 * follow;
      const tx = -input.py * 0.14 * follow;
      const k = 1 - Math.exp(-4 * dt);
      group.current.rotation.y += (ty - group.current.rotation.y) * k;
      group.current.rotation.x += (tx - group.current.rotation.x) * k;
      if (!reducedMotion) group.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.03;
    }

    if (!readyFired.current) {
      readyFired.current = true;
      onReady();
    }
  });

  return (
    <group ref={group} position={[0, 0.05, 0]}>
      <mesh material={material}>
        <planeGeometry args={[2.55, 3.4, 140, 180]} />
      </mesh>
    </group>
  );
}

/** Thin amber orbits behind the portrait: the "kernel" ring motif. */
function Orbits({ reducedMotion }: { reducedMotion: boolean }) {
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);
  const c = useRef<THREE.LineSegments>(null);

  const ticks = useMemo(() => {
    const pts: number[] = [];
    const n = 72;
    for (let i = 0; i < n; i++) {
      const t = (i / n) * Math.PI * 2;
      const r1 = 2.05;
      const r2 = i % 6 === 0 ? 2.2 : 2.11;
      pts.push(Math.cos(t) * r1, Math.sin(t) * r1, 0, Math.cos(t) * r2, Math.sin(t) * r2, 0);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);

  useFrame((_, rawDelta) => {
    if (reducedMotion) return;
    const dt = Math.min(rawDelta, 0.05);
    if (a.current) a.current.rotation.z += dt * 0.06;
    if (b.current) b.current.rotation.z -= dt * 0.035;
    if (c.current) c.current.rotation.z += dt * 0.02;
  });

  return (
    <group position={[0, 0.35, -1.1]}>
      <mesh ref={a} rotation={[0, 0, 0.4]}>
        <ringGeometry args={[1.74, 1.75, 160, 1, 0, Math.PI * 1.45]} />
        <meshBasicMaterial color={AMBER} transparent opacity={0.55} />
      </mesh>
      <mesh ref={b} rotation={[0, 0, 2.2]}>
        <ringGeometry args={[2.42, 2.428, 180, 1, 0, Math.PI * 0.8]} />
        <meshBasicMaterial color={INK} transparent opacity={0.22} />
      </mesh>
      <lineSegments ref={c} geometry={ticks}>
        <lineBasicMaterial color={INK} transparent opacity={0.16} />
      </lineSegments>
    </group>
  );
}

/** Small wireframe solids: abstract "system components". */
function Solids({ reducedMotion }: { reducedMotion: boolean }) {
  const ico = useRef<THREE.Mesh>(null);
  const oct = useRef<THREE.Mesh>(null);
  useFrame((_, rawDelta) => {
    if (reducedMotion) return;
    const dt = Math.min(rawDelta, 0.05);
    if (ico.current) {
      ico.current.rotation.x += dt * 0.2;
      ico.current.rotation.y += dt * 0.25;
    }
    if (oct.current) {
      oct.current.rotation.y -= dt * 0.3;
    }
  });
  return (
    <>
      <Float speed={reducedMotion ? 0 : 1.2} floatIntensity={0.4} rotationIntensity={0}>
        <mesh ref={ico} position={[1.45, 1.75, -0.7]}>
          <icosahedronGeometry args={[0.2, 0]} />
          <meshBasicMaterial color={AMBER} wireframe transparent opacity={0.8} />
        </mesh>
      </Float>
      <Float speed={reducedMotion ? 0 : 0.9} floatIntensity={0.5} rotationIntensity={0}>
        <mesh ref={oct} position={[1.9, -0.95, -0.2]}>
          <octahedronGeometry args={[0.16, 0]} />
          <meshBasicMaterial color={INK} wireframe transparent opacity={0.5} />
        </mesh>
      </Float>
    </>
  );
}

function makePanelTexture(lines: { text: string; tone?: "dim" | "amber" | "ink" }[], title: string) {
  const w = 512;
  const h = 64 + lines.length * 40;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { tex: new THREE.CanvasTexture(canvas), aspect: w / h };
  ctx.fillStyle = "rgba(16,20,25,0.92)";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(232,233,231,0.18)";
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, w - 2, h - 2);
  ctx.fillStyle = "rgba(36,43,50,1)";
  ctx.fillRect(0, 0, w, 40);
  ctx.font = "500 18px 'JetBrains Mono', monospace";
  ctx.fillStyle = "rgba(232,233,231,0.55)";
  ctx.fillText(title, 16, 27);
  ctx.fillStyle = AMBER;
  ctx.fillRect(w - 28, 16, 10, 10);
  ctx.font = "400 22px 'JetBrains Mono', monospace";
  lines.forEach((l, i) => {
    ctx.fillStyle = l.tone === "amber" ? AMBER : l.tone === "dim" ? "rgba(232,233,231,0.45)" : INK;
    ctx.fillText(l.text, 18, 78 + i * 40);
  });
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return { tex, aspect: w / h };
}

function Panel({
  position,
  rotation,
  width,
  title,
  lines,
  speed,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
  title: string;
  lines: { text: string; tone?: "dim" | "amber" | "ink" }[];
  speed: number;
}) {
  const { tex, aspect } = useMemo(() => makePanelTexture(lines, title), [lines, title]);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <Float speed={speed} floatIntensity={0.35} rotationIntensity={0.05}>
      <mesh position={position} rotation={rotation}>
        <planeGeometry args={[width, width / aspect]} />
        <meshBasicMaterial map={tex} transparent opacity={0.88} toneMapped={false} />
      </mesh>
    </Float>
  );
}

const PANEL_B = [
  { text: "$ git log --oneline -3", tone: "dim" as const },
  { text: "diagnofra  fra plots", tone: "ink" as const },
  { text: "greentogether  portals", tone: "ink" as const },
  { text: "medicine-ordering  cart", tone: "ink" as const },
];
const PANEL_C = [
  { text: "spring-boot  :8080", tone: "amber" as const },
  { text: "GET /api/status 200", tone: "ink" as const },
];

function Particles({ count, reducedMotion }: { count: number; reducedMotion: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    // deterministic pseudo-random so every load looks the same
    let seed = 7;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rand() - 0.5) * 9;
      pos[i * 3 + 1] = (rand() - 0.5) * 6;
      pos[i * 3 + 2] = -rand() * 5 + 0.5;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count]);
  useFrame((_, rawDelta) => {
    if (reducedMotion || !ref.current) return;
    ref.current.rotation.y += Math.min(rawDelta, 0.05) * 0.012;
  });
  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial color={INK} size={0.014} sizeAttenuation transparent opacity={0.5} depthWrite={false} />
    </points>
  );
}

/** Pointer parallax + scroll-driven dolly for the camera. */
function CameraRig({ reducedMotion, baseZ }: { reducedMotion: boolean; baseZ: number }) {
  const { camera } = useThree();
  const look = useMemo(() => new THREE.Vector3(0, 0.2, 0), []);
  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const k = 1 - Math.exp(-3 * dt);
    const m = reducedMotion ? 0 : 1;
    const s = input.scroll;
    const tx = input.px * 0.25 * m;
    const ty = 0.2 + input.py * 0.12 * m - s * 0.9;
    const tz = baseZ + s * 1.6;
    camera.position.x += (tx - camera.position.x) * k;
    camera.position.y += (ty - camera.position.y) * k;
    camera.position.z += (tz - camera.position.z) * k;
    look.set(0, 0.2 - s * 0.5, 0);
    camera.lookAt(look);
  });
  return null;
}

export default function HeroScene({ reducedMotion, lowPower, active, onReady }: SceneProps) {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      input.px = (e.clientX / window.innerWidth) * 2 - 1;
      input.py = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onScroll = () => {
      input.scroll = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
    };
    onScroll();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const baseZ = lowPower ? 7.4 : 6.2;

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={lowPower ? [1, 1.25] : [1, 1.75]}
      camera={{ fov: 35, position: [0, 0.2, baseZ], near: 0.1, far: 40 }}
      gl={{ antialias: !lowPower, alpha: true, powerPreference: "high-performance" }}
      aria-hidden
    >
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 6, 14]} />
      <CameraRig reducedMotion={reducedMotion} baseZ={baseZ} />

      <Grid
        position={[0, -1.85, 0]}
        args={[30, 30]}
        cellSize={0.4}
        cellThickness={0.5}
        cellColor="#242B32"
        sectionSize={2}
        sectionThickness={0.9}
        sectionColor="#3a3f45"
        fadeDistance={11}
        fadeStrength={1.6}
        infiniteGrid
        followCamera={false}
      />

      <Orbits reducedMotion={reducedMotion} />
      <Solids reducedMotion={reducedMotion} />
      <Particles count={lowPower ? 120 : 380} reducedMotion={reducedMotion} />

      {!lowPower && (
        <>
          <Panel position={[2.2, 0.95, -0.9]} rotation={[0, -0.4, 0]} width={1.45} title="~/projects" lines={PANEL_B} speed={reducedMotion ? 0 : 0.8} />
          <Panel position={[1.95, -0.35, -0.3]} rotation={[0, -0.3, 0]} width={1.1} title="service" lines={PANEL_C} speed={reducedMotion ? 0 : 1.3} />
        </>
      )}

      <Suspense fallback={null}>
        <Bust reducedMotion={reducedMotion} onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
