import { Reveal } from "./Reveal";

export function SectionHeader({
  index,
  path,
  title,
  aside,
  id,
}: {
  index: string;
  path: string;
  title: string;
  aside?: string;
  id: string;
}) {
  return (
    <Reveal className="flex items-end justify-between gap-6 border-b border-line pb-6">
      <div>
        <p className="label-mono text-signal">
          [{index}] <span className="text-faint">{path}</span>
        </p>
        <h2 id={id} className="font-display mt-4 text-4xl text-foreground md:text-6xl">
          {title}
        </h2>
      </div>
      {aside && <p className="label-mono hidden max-w-xs text-right text-faint md:block">{aside}</p>}
    </Reveal>
  );
}
