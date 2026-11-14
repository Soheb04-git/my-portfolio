import { useState } from "react";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { skillGroups } from "@/data/portfolio";
import { cn } from "@/lib/utils";

/**
 * Terminal-style explorer on desktop (pick a module on the left), a plain
 * stacked list on mobile. All groups are always in the HTML.
 */
export function Skills() {
  const [current, setCurrent] = useState<string>(skillGroups[0].key);

  return (
    <section aria-labelledby="skills-title" id="skills" className="relative border-y border-line bg-surface/40 py-24 md:py-36">
      <div aria-hidden className="bg-blueprint pointer-events-none absolute inset-0 opacity-60" />
      <div className="shell relative">
        <SectionHeader
          index="03"
          path="~/skills"
          title="Technical skills"
          id="skills-title"
          aside="Grouped by area. No percentages, just what I use."
        />

        <Reveal className="mt-14 hidden border border-line bg-background/80 shadow-panel md:grid md:grid-cols-[17rem_1fr]">
          <div className="border-r border-line" role="tablist" aria-label="Skill groups" aria-orientation="vertical">
            <p className="label-mono border-b border-line px-5 py-3 text-faint">$ ls ~/skills</p>
            {skillGroups.map((g) => (
              <button
                key={g.key}
                role="tab"
                type="button"
                id={`tab-${g.key}`}
                aria-selected={current === g.key}
                aria-controls={`panel-${g.key}`}
                onClick={() => setCurrent(g.key)}
                onMouseEnter={() => setCurrent(g.key)}
                className={cn(
                  "flex w-full items-center justify-between border-b border-line px-5 py-4 text-left transition-colors last:border-b-0",
                  current === g.key ? "bg-surface-raised text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="text-sm">{g.title}</span>
                <span className={cn("label-mono", current === g.key ? "text-signal" : "text-faint")}>
                  {String(g.items.length).padStart(2, "0")}
                </span>
              </button>
            ))}
          </div>
          <div className="relative min-h-[26rem]">
            {skillGroups.map((g) => (
              <div
                key={g.key}
                role="tabpanel"
                id={`panel-${g.key}`}
                aria-labelledby={`tab-${g.key}`}
                hidden={current !== g.key}
                className="p-8 lg:p-10"
              >
                <p className="label-mono text-faint">
                  <span className="text-signal">$</span> cat {g.key}.mod
                </p>
                <h3 className="font-display mt-5 text-3xl text-foreground lg:text-4xl">{g.title}</h3>
                {"note" in g && g.note && <p className="mt-3 max-w-md text-sm text-muted-foreground">{g.note}</p>}
                <ul className="mt-8 grid border-l border-t border-line sm:grid-cols-2 xl:grid-cols-3">
                  {g.items.map((item, i) => (
                    <li key={item} className="flex items-center gap-4 border-b border-r border-line bg-background px-5 py-4">
                      <span className="label-mono text-faint">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 md:hidden">
          {skillGroups.map((g) => (
            <Reveal key={g.key} className="border border-line bg-background/80 p-5">
              <p className="label-mono text-signal">{g.key}.mod</p>
              <h3 className="mt-2 text-lg font-semibold text-foreground">{g.title}</h3>
              {"note" in g && g.note && <p className="mt-1 text-sm text-muted-foreground">{g.note}</p>}
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.items.map((item) => (
                  <li key={item} className="border border-line px-2.5 py-1.5 text-sm text-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
