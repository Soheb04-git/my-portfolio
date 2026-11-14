import { Award, GraduationCap } from "lucide-react";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { beyondCode, certification, education } from "@/data/portfolio";

export function Certification() {
  return (
    <section aria-labelledby="cert-title" id="certification" className="shell py-24 md:py-32">
      <SectionHeader index="06" path="~/certs" title="Certification" id="cert-title" />
      <Reveal className="ticks mt-14 grid border border-line bg-surface md:grid-cols-[1fr_1.3fr]">
        <div className="flex flex-col justify-between gap-10 border-b border-line p-8 md:border-b-0 md:border-r md:p-10">
          <div className="flex items-center justify-between">
            <span className="flex size-12 items-center justify-center border border-line-strong text-signal">
              <Award aria-hidden />
            </span>
            <span className="label-mono text-faint">Issued {certification.year}</span>
          </div>
          <div>
            <p className="label-mono text-signal">{certification.issuer}</p>
            <h3 className="font-display mt-3 text-3xl text-foreground md:text-4xl">{certification.name}</h3>
          </div>
        </div>
        <div className="p-8 md:p-10">
          <p className="label-mono text-faint">Topics covered</p>
          <ul className="mt-5 grid border-l border-t border-line sm:grid-cols-2">
            {certification.topics.map((t) => (
              <li key={t} className="border-b border-r border-line bg-background px-4 py-3 text-sm text-foreground">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}

export function Education() {
  return (
    <section aria-labelledby="edu-title" id="education" className="shell py-24 md:py-32">
      <SectionHeader index="07" path="~/education" title="Education" id="edu-title" />
      <ol className="mt-14 border-t border-line">
        {education.map((e, i) => (
          <Reveal key={e.title} delay={i * 0.05}>
            <li className="grid gap-3 border-b border-line py-8 md:grid-cols-12 md:items-baseline md:gap-8">
              <span className="label-mono text-faint md:col-span-2">{e.period ?? (i === 1 ? "Higher secondary" : "Secondary")}</span>
              <div className="md:col-span-6">
                <h3 className="flex items-center gap-3 text-xl font-semibold text-foreground md:text-2xl">
                  {i === 0 && <GraduationCap className="size-5 text-signal" aria-hidden />}
                  {e.title}
                </h3>
                <p className="mt-1 text-muted-foreground">{e.school}</p>
                {e.current && <p className="label-mono mt-3 text-signal">{e.current}</p>}
              </div>
              <p className="font-mono text-sm text-foreground md:col-span-4 md:text-right">{e.result}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

export function BeyondCode() {
  return (
    <section aria-labelledby="beyond-title" id="beyond" className="shell pb-24 pt-8 md:pb-36">
      <SectionHeader index="08" path="~/beyond" title="Beyond code" id="beyond-title" aside="Events and initiatives" />
      <ul className="mt-14 grid gap-px border border-line bg-line md:grid-cols-3">
        {beyondCode.map((b, i) => (
          <li key={b.title} className="bg-background">
            <Reveal delay={i * 0.06} className="flex h-full flex-col gap-8 p-8">
              <span className="label-mono text-signal">0{i + 1}</span>
              <div>
                <h3 className="text-xl font-semibold text-foreground">{b.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{b.body}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
