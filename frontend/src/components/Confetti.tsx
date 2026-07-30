import { useMemo } from 'react';
import type { CSSProperties } from 'react';

const COLORES = ['var(--brand)', 'var(--accent)', 'var(--c-sun-400)', 'var(--c-sea-400)', 'var(--c-coral-400, #FF7C63)'];

interface Pieza {
  color: string;
  x: number;
  y: number;
  r: number;
  delay: number;
}

function generarPiezas(cantidad: number): Pieza[] {
  return Array.from({ length: cantidad }, (_, i) => {
    const angulo = (Math.PI * 2 * i) / cantidad + Math.random() * 0.6;
    const distancia = 60 + Math.random() * 70;
    return {
      color: COLORES[i % COLORES.length],
      x: Math.cos(angulo) * distancia,
      y: Math.sin(angulo) * distancia - 20,
      r: Math.random() * 540 - 270,
      delay: Math.random() * 120,
    };
  });
}

/** Ráfaga de confeti de una sola vez, centrada en el contenedor padre (que debe
 *  tener `position: relative`). Se usa para celebrar un momento puntual de
 *  éxito (import completado, periodo cerrado) — no es un loop continuo. */
export function Confetti({ cantidad = 18 }: { cantidad?: number }) {
  const piezas = useMemo(() => generarPiezas(cantidad), [cantidad]);

  return (
    <>
      {piezas.map((p, i) => (
        <span
          key={i}
          className="hx-confetti-piece"
          style={{
            background: p.color,
            animationDelay: `${p.delay}ms`,
            '--hx-confetti-x': `${p.x}px`,
            '--hx-confetti-y': `${p.y}px`,
            '--hx-confetti-r': `${p.r}deg`,
          } as CSSProperties}
        />
      ))}
    </>
  );
}
