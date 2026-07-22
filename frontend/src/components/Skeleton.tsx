import type { CSSProperties } from 'react';

const ANCHOS_VARIADOS = ['92%', '68%', '84%', '55%', '76%'];

export function SkeletonLine({
  width = '100%',
  height = 12,
  align = 'left',
  style,
}: {
  width?: number | string;
  height?: number;
  align?: 'left' | 'right' | 'center';
  style?: CSSProperties;
}) {
  return (
    <span
      className="hx-skel hx-skel-line"
      style={{
        width,
        height,
        marginLeft: align === 'right' || align === 'center' ? 'auto' : 0,
        marginRight: align === 'left' || align === 'center' ? 'auto' : 0,
        ...style,
      }}
    />
  );
}

export function SkeletonCircle({ size = 32 }: { size?: number }) {
  return <span className="hx-skel hx-skel-circle" style={{ width: size, height: size }} />;
}

export function SkeletonBlock({ width = '100%', height = 80, style }: { width?: number | string; height?: number; style?: CSSProperties }) {
  return <span className="hx-skel hx-skel-block" style={{ width, height, ...style }} />;
}

/** Filas de tabla en estado de carga — coincide con la estructura real (misma cantidad de columnas) para que el layout no salte cuando llegan los datos. */
export function SkeletonTableRows({
  columns,
  rows = 6,
  align,
}: {
  columns: number;
  rows?: number;
  align?: ('left' | 'right' | 'center')[];
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r}>
          {Array.from({ length: columns }).map((_, c) => (
            <td className="hx-td" key={c}>
              <SkeletonLine width={ANCHOS_VARIADOS[(r + c) % ANCHOS_VARIADOS.length]} align={align?.[c] ?? 'left'} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
