import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import type { PointerEvent, ReactNode } from "react";

import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { medicineRoutes, moreRepos, projects, type Project } from "@/data/portfolio";
import { cn } from "@/lib/utils";

/** Perspective tilt that follows the pointer, with the screenshot moving a little deeper. */
function TiltFrame({ children, href, label }: { children: ReactNode; href?: string | undefined; label: string }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 150, damping: 18 });
  const ix = useSpring(useTransform(mx, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 20 });
  const iy = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 20 });

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const inner = (
    <motion.div style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200 }} className="will-change-transform">
      <motion.div style={{ x: ix, y: iy }}>{children}</motion.div>
    </motion.div>
  );

  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      data-cursor="view"
      onPointerMove={onMove}
      onPointerLeave={reset}
      className="block"
    >
      {inner}
    </a>
  ) : (
    <div onPointerMove={onMove} onPointerLeave={reset}>
      {inner}
    </div>
  );
}

function BrowserFrame({ url, children }: { url: string; children: ReactNode }) {
  return (
    <div className="ticks overflow-hidden border border-line bg-surface shadow-panel">
      <div className="flex items-center gap-3 border-b border-line px-3 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2 bg-line-strong" />
          <span className="size-2 bg-line-strong" />
          <span className="size-2 bg-signal" />
        </span>
        <span className="label-mono truncate text-faint normal-case tracking-normal">{url}</span>
      </div>
      <div className="relative overflow-hidden">{children}</div>
    </div>
  );
}

function RepoPreview() {
  const flow = ["/medicines", "/cart", "/checkout", "/payment", "/order-confirmation"];
  return (
    <BrowserFrame url="github.com/Soheb04-git/online-medicine-ordering-system">
      <div className="grid bg-background font-mono text-[11px] sm:aspect-[16/10] sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] sm:text-xs">
        <div className="min-w-0 overflow-hidden border-b border-line p-4 sm:border-b-0 sm:border-r">
          <p className="label-mono mb-3 text-faint">Files</p>
          <ul className="space-y-1.5">
            {medicineRoutes.map((r) => (
              <li key={r} className="truncate text-muted-foreground">
                <span className="text-faint">{r.split("/").slice(0, -1).join("/")}/</span>
                <span className={r.endsWith("firebase.ts") ? "text-signal" : "text-foreground"}>{r.split("/").pop()}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex min-w-0 flex-col justify-between gap-4 p-4">
          <div>
            <p className="label-mono mb-3 text-faint">Order flow</p>
            <ol className="space-y-0">
              {flow.map((f, i) => (
                <li key={f} className="flex items-stretch gap-3">
                  <span className="flex flex-col items-center">
                    <span className={cn("mt-1 size-2", i === flow.length - 1 ? "bg-signal" : "border border-line-strong")} />
                    {i < flow.length - 1 && <span className="w-px flex-1 bg-line" />}
                  </span>
                  <span className="pb-3 text-foreground">{f}</span>
                </li>
              ))}
            </ol>
          </div>
          <p className="text-faint">
            admin: <span className="text-muted-foreground">/admin/medicines, /admin/orders</span>
          </p>
        </div>
      </div>
    </BrowserFrame>
  );
}

function ProjectBlock({ project, flip }: { project: Project; flip: boolean }) {
  const host = project.live ? new URL(project.live).host : undefined;
  return (
    <article aria-labelledby={`${project.id}-title`} className="grid gap-10 border-b border-line py-16 md:py-24 lg:grid-cols-12 lg:gap-14">
      <Reveal className={cn("min-w-0 lg:col-span-7", flip && "lg:order-2")}>
        {project.preview && host ? (
          <TiltFrame href={project.live} label={`Open ${project.name} live site`}>
            <BrowserFrame url={host}>
              <img
                src={project.preview.src}
                alt={project.preview.alt}
                width={1440}
                height={900}
                loading="lazy"
                className="aspect-[16/10] w-full object-cover object-top"
              />
            </BrowserFrame>
          </TiltFrame>
        ) : (
          <TiltFrame label={`${project.name} repository preview`}>
            <RepoPreview />
          </TiltFrame>
        )}
        {project.status && (
          <div className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2">
            <div className="bg-background p-5">
              <p className="label-mono text-ok">Working in current build</p>
              <ul className="mt-3 space-y-2 text-sm text-foreground">
                {project.status.working.map((w) => (
                  <li key={w} className="flex gap-3">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 bg-ok" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-background p-5">
              <p className="label-mono text-faint">Proposed / planned</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {project.status.planned.map((w) => (
                  <li key={w} className="flex gap-3">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 border border-faint" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
            <p className="bg-surface p-4 text-xs leading-relaxed text-muted-foreground sm:col-span-2">
              {project.status.note}
            </p>
          </div>
        )}
      </Reveal>

      <Reveal delay={0.08} className={cn("min-w-0 lg:col-span-5", flip && "lg:order-1")}>
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-display text-6xl text-line-strong md:text-7xl">{project.index}</span>
          <span className="label-mono text-right text-signal">{project.category}</span>
        </div>
        <h3 id={`${project.id}-title`} className="font-display mt-6 text-3xl text-foreground md:text-4xl">
          {project.name}
        </h3>
        <p className="mt-2 text-lg text-muted-foreground">{project.tagline}</p>
        {project.period && <p className="label-mono mt-3 text-faint">{project.period}</p>}

        <dl className="mt-8 space-y-6">
          <div>
            <dt className="label-mono text-faint">Problem</dt>
            <dd className="mt-2 leading-relaxed text-muted-foreground">{project.problem}</dd>
          </div>
          <div>
            <dt className="label-mono text-faint">Solution</dt>
            <dd className="mt-2 leading-relaxed text-foreground">{project.solution}</dd>
          </div>
          <div>
            <dt className="label-mono text-faint">Features</dt>
            <dd>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                {project.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <span aria-hidden className="text-signal">/</span>
                    {f}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt className="label-mono text-faint">Role and contribution</dt>
            <dd>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                {project.contribution.map((f) => (
                  <li key={f} className="flex gap-3">
                    <span aria-hidden className="text-signal">/</span>
                    {f}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt className="label-mono text-faint">Stack (from the repository)</dt>
            <dd className="mt-3 flex flex-wrap gap-1.5">
              {project.stack.map((s) => (
                <span key={s} className="border border-line px-2 py-1 font-mono text-[11px] text-muted-foreground">
                  {s}
                </span>
              ))}
            </dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          {project.live && (
            <a href={project.live} target="_blank" rel="noreferrer" className={buttonVariants({ variant: "signal", size: "lg" })}>
              Live site <ArrowUpRight aria-hidden />
            </a>
          )}
          {project.repo && (
            <a href={project.repo} target="_blank" rel="noreferrer" className={buttonVariants({ variant: "frame", size: "lg" })}>
              <Github aria-hidden /> Repository
            </a>
          )}
        </div>
      </Reveal>
    </article>
  );
}

export function Projects() {
  return (
    <section aria-labelledby="projects-title" id="projects" className="shell py-24 md:py-36">
      <SectionHeader
        index="04"
        path="~/projects"
        title="Featured projects"
        id="projects-title"
        aside="Stacks verified from each repository. Planned features marked as planned."
      />
      {projects.map((p, i) => (
        <ProjectBlock key={p.id} project={p} flip={i % 2 === 1} />
      ))}

      <Reveal className="pt-16">
        <p className="label-mono text-faint">
          <span className="text-signal">$</span> ls ~/github --more
        </p>
        <ul className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {moreRepos.map((r) => (
            <li key={r.name} className="bg-background">
              <a
                href={r.href}
                target="_blank"
                rel="noreferrer"
                className="group flex h-full flex-col justify-between gap-6 p-5 transition-colors hover:bg-surface"
              >
                <div>
                  <p className="flex items-center justify-between text-foreground">
                    <span className="font-medium">{r.name}</span>
                    <ArrowUpRight className="size-4 text-faint transition-colors group-hover:text-signal" aria-hidden />
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{r.description}</p>
                </div>
                <span className="label-mono text-faint">{r.lang}</span>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
