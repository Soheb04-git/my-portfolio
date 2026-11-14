import { Menu, X, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

import { documents, navItems, profile } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Monogram } from "@/components/ui/Monogram";

export function SiteNav() {
  const [active, setActive] = useState<string>("home");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
  const savedTheme = localStorage.getItem("portfolio-theme");
  setTheme(savedTheme === "light" ? "light" : "dark");
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const sections = navItems
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );
    sections.forEach((s) => io.observe(s));
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const toggleTheme = () => {
  const nextTheme = theme === "dark" ? "light" : "dark";

  setTheme(nextTheme);
  localStorage.setItem("portfolio-theme", nextTheme);

  document.documentElement.classList.toggle("light", nextTheme === "light");
  document.documentElement.classList.toggle("dark", nextTheme === "dark");
  document.documentElement.style.colorScheme = nextTheme;
};

  const resume = documents.resume;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || open ? "border-b border-line bg-background/85 backdrop-blur-md" : "border-b border-transparent",
      )}
    >
      <nav aria-label="Primary" className="shell flex h-16 items-center justify-between gap-6">
        <a href="#home" className="flex items-center gap-3 text-foreground" aria-label={`${profile.name}, back to top`}>
          <Monogram className="size-8" />
          <span className="label-mono hidden text-muted-foreground sm:inline">soheb.ansari</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {navItems.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                aria-current={active === n.id ? "location" : undefined}
                className={cn(
                  "label-mono flex items-center gap-2 px-3 py-2 transition-colors",
                  active === n.id ? "text-foreground" : "text-faint hover:text-foreground",
                )}
              >
                <span
                  aria-hidden
                  className={cn("size-1.5 transition-colors", active === n.id ? "bg-signal" : "bg-transparent")}
                />
                {n.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={toggleTheme}
            className={cn(buttonVariants({ variant: "frame", size: "icon" }), "size-11")}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <a
            href={resume.href ?? "#documents"}
            {...(resume.href ? { download: resume.filename } : {})}
            className={cn(buttonVariants({ variant: "frame", size: "sm" }), "hidden sm:inline-flex")}
          >
            Resume
          </a>
          <button
            type="button"
            className={cn(buttonVariants({ variant: "frame", size: "icon" }), "size-11 lg:hidden")}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        hidden={!open}
        className="h-[calc(100svh-4rem)] overflow-y-auto border-t border-line bg-background lg:hidden"
      >
        <ul className="shell flex flex-col py-6">
          {navItems.map((n, i) => (
            <li key={n.id} className="border-b border-line">
              <a
                href={`#${n.id}`}
                onClick={() => setOpen(false)}
                className="flex items-baseline justify-between py-5 text-foreground"
              >
                <span className="font-display text-3xl">{n.label}</span>
                <span className="label-mono text-faint">0{i + 1}</span>
              </a>
            </li>
          ))}
          <li className="pt-6">
            <a
              href={resume.href ?? "#documents"}
              onClick={() => setOpen(false)}
              {...(resume.href ? { download: resume.filename } : {})}
              className={cn(buttonVariants({ variant: "signal", size: "lg" }), "w-full")}
            >
              Resume
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
