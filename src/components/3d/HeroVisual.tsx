import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState } from "react";

import bustUrl from "@/assets/soheb-3d-bust.jpg";
import { useMedia } from "@/hooks/use-media";
import { cn } from "@/lib/utils";

const HeroScene = lazy(() => import("./HeroScene"));

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * The static portrait renders on the server and stays visible until the 3D
 * scene draws its first frame, so there is never an empty hero and the page
 * still works without WebGL.
 */
export function HeroVisual() {
  const wrap = useRef<HTMLDivElement>(null);
  const reducedMotion = useMedia("(prefers-reduced-motion: reduce)");
  const small = useMedia("(max-width: 767px)");
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const nav = navigator as Navigator & { deviceMemory?: number };
    const weak = (nav.deviceMemory !== undefined && nav.deviceMemory < 3) || (nav.hardwareConcurrency ?? 8) < 3;
    setWebgl(hasWebGL() && !weak);
  }, []);

  // Pause rendering when the hero is off screen.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(!!e?.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0" data-scene-ready={ready ? "true" : undefined}>
      <img
        src={bustUrl}
        alt="Portrait of MD Soheb Ansari in a dark blazer, lit with a warm amber rim light"
        width={956}
        height={1280}
        fetchPriority="high"
        className={cn(
          "absolute bottom-0 left-1/2 h-[92%] w-auto max-w-none -translate-x-1/2 object-contain transition-opacity duration-700 md:left-[66%]",
          "[mask-image:radial-gradient(ellipse_60%_62%_at_50%_45%,black_55%,transparent_100%)]",
          ready ? "opacity-0" : "opacity-100",
        )}
      />
      <ClientOnly fallback={null}>
        {webgl && (
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 md:left-[30%]",
              ready ? "opacity-100" : "opacity-0",
            )}
          >
            <Suspense fallback={null}>
              <HeroScene reducedMotion={reducedMotion} lowPower={small} active={active} onReady={() => setReady(true)} />
            </Suspense>
          </div>
        )}
      </ClientOnly>
    </div>
  );
}
