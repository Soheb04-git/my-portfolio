import { useRef, useState, type FormEvent } from "react";

import { certification, profile, projects, skillGroups } from "@/data/portfolio";

type Line = { kind: "cmd" | "out" | "err"; text: string };

const COMMANDS: Record<string, () => string[]> = {
  help: () => ["whoami   projects   skills   cert   contact   clear"],
  whoami: () => [`${profile.name}`, "B.Tech CSE, BCET Durgapur, 7th semester"],
  projects: () => projects.map((p) => `${p.index}  ${p.name.toLowerCase()}  ${p.tagline.toLowerCase()}`),
  skills: () => skillGroups.slice(0, 4).map((g) => `${g.key.padEnd(6)} ${g.items.join(", ")}`),
  cert: () => [`${certification.name} (${certification.issuer}, ${certification.year})`],
  contact: () => [profile.email, "github.com/Soheb04-git"],
};

const QUICK = ["whoami", "projects", "skills", "contact"];

/** A small working shell. Content mirrors the HTML sections below, so nothing lives only here. */
export function Terminal() {
  const [lines, setLines] = useState<Line[]>([
    { kind: "out", text: "soheb-os 1.0  type 'help' or pick a command" },
  ]);
  const [value, setValue] = useState("");
  const body = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    if (cmd === "clear") {
      setLines([]);
      return;
    }
    const fn = COMMANDS[cmd];
    const out: Line[] = fn
      ? fn().map((text) => ({ kind: "out" as const, text }))
      : [{ kind: "err", text: `command not found: ${cmd}. try 'help'` }];
    setLines((prev) => [...prev, { kind: "cmd" as const, text: cmd }, ...out].slice(-14));
    requestAnimationFrame(() => body.current?.scrollTo({ top: body.current.scrollHeight }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    run(value);
    setValue("");
  };

  return (
    <div className="ticks w-full max-w-md border border-line bg-surface/85 shadow-panel backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <span className="label-mono text-faint">tty1 : ~</span>
        <span className="size-2 bg-signal" aria-hidden />
      </div>
      <div
        ref={body}
        className="h-32 overflow-y-auto px-3 py-2 font-mono text-[12px] leading-relaxed"
        aria-live="polite"
        onClick={() => input.current?.focus()}
      >
        {lines.map((l, i) => (
          <p
            key={i}
            className={
              l.kind === "cmd" ? "text-foreground" : l.kind === "err" ? "text-destructive" : "text-muted-foreground"
            }
          >
            {l.kind === "cmd" && <span className="text-signal">$ </span>}
            {l.text}
          </p>
        ))}
        <form onSubmit={submit} className="flex items-center gap-1.5">
          <label htmlFor="term-input" className="text-signal">
            $
          </label>
          <input
            id="term-input"
            ref={input}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            aria-label="Terminal command"
            className="min-w-0 flex-1 bg-transparent text-foreground caret-[var(--signal)] outline-none placeholder:text-faint"
            placeholder="help"
          />
        </form>
      </div>
      <div className="flex flex-wrap gap-px border-t border-line bg-line">
        {QUICK.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => run(c)}
            className="label-mono flex-1 bg-surface px-2 py-2.5 text-faint transition-colors hover:bg-surface-raised hover:text-signal"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
