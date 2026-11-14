import { useEffect, useRef, useState } from "react";

/**
 * Precision cursor: a dot that tracks exactly and a ring that trails it.
 * Fine pointers only. pointer-events: none, so it never blocks clicks or
 * text selection. Elements can set data-cursor="view" for a labeled ring.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<"idle" | "link" | "view" | "text">("idle");

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine) and (hover: hover)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    let x = -100,
      y = -100,
      rx = -100,
      ry = -100,
      raf = 0,
      visible = false;

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible && dot.current && ring.current) {
        visible = true;
        rx = x;
        ry = y;
        dot.current.style.opacity = "1";
        ring.current.style.opacity = "1";
      }
      const t = e.target as HTMLElement | null;
      const el = t?.closest?.("[data-cursor], a, button, input, textarea, [role='button']") as HTMLElement | null;
      if (!el) setMode("idle");
      else if (el.dataset['cursor'] === "view") setMode("view");
      else if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") setMode("text");
      else setMode("link");
    };
    const leave = () => {
      visible = false;
      if (dot.current && ring.current) {
        dot.current.style.opacity = "0";
        ring.current.style.opacity = "0";
      }
    };
    const loop = () => {
      rx += (x - rx) * 0.2;
      ry += (y - ry) * 0.2;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!enabled) return null;

  const ringSize = mode === "view" ? 72 : mode === "link" ? 40 : mode === "text" ? 4 : 28;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <div ref={dot} className="absolute left-0 top-0 opacity-0">
        <div
          className={`-translate-x-1/2 -translate-y-1/2 bg-signal transition-[width,height] duration-200 ${
            mode === "text" ? "h-5 w-0.5" : "size-1.5"
          }`}
        />
      </div>
      <div ref={ring} className="absolute left-0 top-0 opacity-0">
        <div
          className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center border transition-all duration-300 ease-out ${
            mode === "view" ? "border-signal bg-background/70" : mode === "link" ? "border-signal/80" : "border-foreground/35"
          } ${mode === "text" ? "opacity-0" : ""}`}
          style={{ width: ringSize, height: ringSize }}
        >
          {mode === "view" && <span className="label-mono text-signal">Open</span>}
          {/* crosshair ticks */}
          {mode === "idle" && (
            <>
              <span className="absolute -top-1.5 left-1/2 h-1 w-px bg-foreground/40" />
              <span className="absolute -bottom-1.5 left-1/2 h-1 w-px bg-foreground/40" />
              <span className="absolute -left-1.5 top-1/2 h-px w-1 bg-foreground/40" />
              <span className="absolute -right-1.5 top-1/2 h-px w-1 bg-foreground/40" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
