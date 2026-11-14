import { ArrowUpRight, Check, Copy, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { useState } from "react";

import { DocumentLinks } from "@/components/ui/DocumentLinks";
import { Monogram } from "@/components/ui/Monogram";
import { Reveal } from "@/components/ui/Reveal";
import { profile } from "@/data/portfolio";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const links = [
    { label: "Email", value: "Send an email", href: `mailto:${profile.email}`, icon: Mail },
    { label: "LinkedIn", value: "md-soheb-ansari", href: profile.linkedin, icon: Linkedin, external: true },
    { label: "GitHub", value: "Soheb04-git", href: profile.github, icon: Github, external: true },
  ];

  return (
    <section aria-labelledby="contact-title" id="contact" className="relative overflow-hidden border-t border-line">
      <div aria-hidden className="bg-blueprint pointer-events-none absolute inset-0 opacity-50" />
      <div className="shell relative py-24 md:py-36">
        <Reveal>
          <p className="label-mono text-signal">
            [09] <span className="text-faint">~/contact</span>
          </p>
          <h2 id="contact-title" className="font-display mt-6 max-w-5xl text-5xl text-foreground md:text-7xl lg:text-8xl">
            Have a project, opportunity or idea worth discussing?
          </h2>
        </Reveal>

        <Reveal delay={0.08} className="mt-12 flex flex-wrap items-center gap-4">
          <a
            href={`mailto:${profile.email}`}
            className="group flex items-center gap-3 border-b border-signal pb-2 text-xl text-foreground transition-colors hover:text-signal md:text-3xl"
          >
            {profile.email}
            <ArrowUpRight className="size-6 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden />
          </a>
          <button
            type="button"
            onClick={copy}
            className="label-mono flex h-11 items-center gap-2 border border-line-strong px-4 text-muted-foreground transition-colors hover:border-signal hover:text-signal"
          >
            {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
            <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
          </button>
        </Reveal>

        <div className="mt-20 grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <ul className="grid gap-px border border-line bg-line sm:grid-cols-3">
              {links.map(({ label, value, href, icon: Icon, external }) => (
                <li key={label} className="bg-background">
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="group flex h-full flex-col gap-6 p-5 transition-colors hover:bg-surface"
                  >
                    <span className="flex items-center justify-between">
                      <Icon className="size-5 text-signal" aria-hidden />
                      <ArrowUpRight className="size-4 text-faint group-hover:text-foreground" aria-hidden />
                    </span>
                    <span>
                      <span className="label-mono block text-faint">{label}</span>
                      <span className="mt-1 block break-all text-sm text-foreground">{value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4 text-faint" aria-hidden /> {profile.location}
            </p>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-5">
            <div id="documents" className="ticks border border-line bg-surface p-6 md:p-8">
              <p className="label-mono text-faint">Documents</p>
              <h3 className="mt-3 text-2xl font-semibold text-foreground">Resume and CV</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Two separate documents, each provided as the original PDF.
              </p>
              <DocumentLinks className="mt-6" />
            </div>
          </Reveal>
        </div>
      </div>

      <footer className="relative border-t border-line">
        <div className="shell flex flex-col items-start justify-between gap-4 py-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3 text-foreground">
            <Monogram className="size-7" />
            <span className="text-sm text-muted-foreground">{profile.name}</span>
          </div>
          <p className="label-mono text-faint">Durgapur, India · Built with React and Three.js</p>
          <a href="#home" className="label-mono text-faint transition-colors hover:text-signal">
            Back to top
          </a>
        </div>
      </footer>
    </section>
  );
}
