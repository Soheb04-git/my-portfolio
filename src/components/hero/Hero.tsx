import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Github, Linkedin } from "lucide-react";

import { HeroVisual } from "@/components/3d/HeroVisual";
import { buttonVariants } from "@/components/ui/button";
import { profile } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { Terminal } from "./Terminal";

const ease = [0.16, 1, 0.3, 1] as const;
const HEADLINE = ["Building software.", "Solving problems.", "Exploring technology."];

export function Hero() {
  return (
    <>
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] flex-col overflow-hidden md:block md:min-h-[max(100svh,46rem)]"
    >
      {/* Visual: stacked on mobile, full-bleed behind content on desktop */}
      <div className="relative order-1 h-[54svh] min-h-80 w-full md:absolute md:inset-0 md:h-auto">
        <HeroVisual />
        <div aria-hidden className="hero-fade pointer-events-none absolute inset-0 hidden md:block" />
        <div aria-hidden className="bottom-fade pointer-events-none absolute inset-x-0 bottom-0 h-32" />
      </div>

      <div className="shell relative order-2 -mt-10 flex flex-1 flex-col justify-center pb-12 md:mt-0 md:min-h-[max(100svh,46rem)] md:pb-20 md:pt-28">
        <div className="max-w-[48rem]">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="label-mono flex flex-wrap items-center gap-x-3 gap-y-1 text-faint"
          >
            <span className="text-signal">[01] /home/soheb</span>
            <span>Durgapur, India</span>
            <span aria-hidden>/</span>
            <span>B.Tech CSE 2027</span>
          </motion.p>

          <h1 id="hero-title" className="mt-6">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease }}
              className="block text-lg text-muted-foreground md:text-xl"
            >
              Hi, I'm <span className="text-foreground">{profile.name}</span>.
            </motion.span>
            <span className="font-display mt-4 block text-[2.6rem] text-foreground sm:text-6xl xl:text-7xl">
              {HEADLINE.map((line, i) => (
                <span key={line} className="block overflow-hidden pb-1">
                  <motion.span
                    className={cn("block", i === 2 && "text-signal")}
                    initial={{ y: "105%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, delay: 0.35 + i * 0.12, ease }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8, ease }}
            className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            Computer Science undergraduate focused on software development, practical engineering projects and
            continuous learning.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.95, ease }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a href="#projects" className={buttonVariants({ variant: "signal", size: "lg" })}>
              Explore projects <ArrowUpRight aria-hidden />
            </a>
            <a href="#contact" className={buttonVariants({ variant: "frame", size: "lg" })}>
              Get in touch
            </a>
            <span aria-hidden className="mx-1 hidden h-6 w-px bg-line sm:block" />
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
              className={cn(buttonVariants({ variant: "frame", size: "icon" }), "size-11")}
            >
              <Github />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn profile"
              className={cn(buttonVariants({ variant: "frame", size: "icon" }), "size-11")}
            >
              <Linkedin />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.15, ease }}
            className="mt-10 hidden lg:block"
          >
            <Terminal />
          </motion.div>
        </div>
      </div>

      <a
        href="#about"
        className="label-mono absolute bottom-6 right-5 hidden items-center gap-3 text-faint transition-colors hover:text-foreground md:flex md:right-10"
      >
        Scroll
        <span className="relative block h-10 w-px overflow-hidden bg-line">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scan-down_1.8s_ease-in-out_infinite] bg-signal" />
        </span>
        <ArrowDown className="size-3.5" aria-hidden />
      </a>

    </section>

    {/* Terminal sits below the hero on smaller screens */}
    <div className="shell pb-20 lg:hidden">
      <Terminal />
    </div>
    </>
  );
}
