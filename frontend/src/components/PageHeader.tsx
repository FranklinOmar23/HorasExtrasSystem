import type { ReactNode } from 'react';

export function PageHeader({
  eyebrow,
  title,
  actions,
  extra,
}: {
  eyebrow: string;
  title: string;
  actions?: ReactNode;
  extra?: ReactNode;
}) {
  return (
    <div className="hx-page-head">
      <div>
        <div className="hx-eyebrow">{eyebrow}</div>
        <h1 style={{ fontSize: 30, margin: 0 }}>{title}</h1>
        {extra}
      </div>
      {actions && <div style={{ display: 'flex', gap: 10 }}>{actions}</div>}
    </div>
  );
}
