import type { ReactNode } from 'react';

type Tono = 'success' | 'warning' | 'danger' | 'neutral' | 'sea' | 'sun' | 'coral';

export function Badge({ tono, children, dot }: { tono: Tono; children: ReactNode; dot?: boolean }) {
  return (
    <span className={`hx-badge hx-badge-${tono}`}>
      {dot && <span className="hx-dot" />}
      {children}
    </span>
  );
}
