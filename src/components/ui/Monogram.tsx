/** SA monogram, same geometry as the favicon. */
export function Monogram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <rect x="3.5" y="3.5" width="57" height="57" rx="3" fill="none" stroke="currentColor" strokeOpacity="0.25" />
      <path d="M29 15H9v16.5h20V49H9" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="square" />
      <path d="M35 49 45.5 15 56 49" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="square" />
      <path d="M41 38h9" stroke="var(--signal)" strokeWidth="5" strokeLinecap="square" />
    </svg>
  );
}
