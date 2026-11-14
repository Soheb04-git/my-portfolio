import portrait from "@/assets/soheb-portrait.webp.asset.json";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

const FACTS = [
  ["Based in", "Durgapur, West Bengal"],
  ["Studying", "B.Tech CSE, BCET"],
  ["Semester", "7th, batch of 2027"],
  ["Working on", "Web apps, Java, Spring Boot"],
];

export function About() {
  return (
    <section aria-labelledby="about-title" id="about" className="shell py-24 md:py-36">
      <SectionHeader index="02" path="~/about" title="About" id="about-title" aside="cat readme.md" />

      <div className="mt-14 grid gap-12 md:grid-cols-12 md:gap-10">
        <Reveal className="md:col-span-4">
          <figure className="ticks relative overflow-hidden border border-line bg-surface">
            <img
              src={portrait.url}
              alt="MD Soheb Ansari, wearing a dark blazer and light blue shirt"
              width={900}
              height={1200}
              loading="lazy"
              className="aspect-[3/4] w-full object-cover grayscale contrast-[1.05]"
            />
            <div aria-hidden className="absolute inset-0 bg-signal mix-blend-color opacity-20" />
            <figcaption className="label-mono flex justify-between border-t border-line px-3 py-2.5 text-faint">
              <span>soheb.jpg</span>
              <span>Durgapur</span>
            </figcaption>
          </figure>
        </Reveal>

        <div className="md:col-span-8 md:pl-6">
          <Reveal>
            <p className="text-2xl leading-snug text-foreground md:text-[2rem] md:leading-[1.25]">
              I'm a Computer Science and Engineering student at Bengal College of Engineering and Technology in
              Durgapur. I like software that solves a specific problem for specific people, and most of what I've
              built started that way.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8 grid gap-6 text-base leading-relaxed text-muted-foreground md:grid-cols-2 md:text-lg">
              <p>
                That includes a waste reporting platform and a transformer diagnostics dashboard for Smart India
                Hackathon 2025, and a medicine ordering app built with two classmates. Each one taught me to break a
                vague problem into screens, data and steps a real user can follow.
              </p>
              <p>
                I write mostly Java, JavaScript and React, and I'm building up my backend skills with Spring Boot.
                Outside my own projects I coordinate a coding club and handle technical work for the college's
                Entrepreneurship Development Cell, which has taught me as much about planning as about code.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <dl className="mt-12 grid grid-cols-2 border-t border-line md:grid-cols-4">
              {FACTS.map(([k, v]) => (
                <div key={k} className="border-b border-line py-5 pr-4 md:border-b-0">
                  <dt className="label-mono text-faint">{k}</dt>
                  <dd className="mt-2 text-sm text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
