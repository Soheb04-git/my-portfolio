import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { experience } from "@/data/portfolio";

export function Experience() {
  return (
    <section aria-labelledby="experience-title" id="experience" className="border-t border-line bg-surface/40 py-24 md:py-36">
      <div className="shell">
        <SectionHeader
          index="05"
          path="~/experience"
          title="Leadership"
          id="experience-title"
          aside="Student roles at BCET"
        />
        <ol className="relative mt-14 md:ml-4">
          <span aria-hidden className="absolute bottom-0 left-[5px] top-2 w-px bg-line md:left-[calc(33.333%+5px)]" />
          {experience.map((e, i) => (
            <li key={e.org} className="relative grid gap-4 pb-16 pl-10 last:pb-0 md:grid-cols-3 md:gap-10 md:pl-0">
              <span
                aria-hidden
                className="absolute left-0 top-2 size-[11px] border border-signal bg-background md:left-[33.333%]"
              />
              <Reveal className="md:pr-10 md:text-right">
                <p className="label-mono text-signal">{e.period}</p>
                <p className="mt-3 hidden text-sm text-muted-foreground md:block">{e.org}</p>
              </Reveal>
              <Reveal delay={0.06} className="md:col-span-2 md:pl-10">
                <h3 className="font-display text-2xl text-foreground md:text-3xl">{e.role}</h3>
                <p className="mt-1 text-muted-foreground">{e.org}</p>
                <ul className="mt-6 grid gap-px border border-line bg-line">
                  {e.points.map((p, j) => (
                    <li key={p} className="flex gap-4 bg-background px-5 py-3.5 text-sm text-foreground">
                      <span className="label-mono pt-0.5 text-faint">
                        {i + 1}.{j + 1}
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
