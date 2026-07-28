import { rangosDeFechasSeSolapan } from './rango-fechas.util';

function f(iso: string): Date {
  return new Date(iso);
}

describe('rangosDeFechasSeSolapan', () => {
  it('detecta solapamiento parcial (B empieza dentro de A)', () => {
    expect(
      rangosDeFechasSeSolapan(f('2026-01-01'), f('2026-01-15'), f('2026-01-10'), f('2026-01-20')),
    ).toBe(true);
  });

  it('detecta que B está completamente contenido en A', () => {
    expect(
      rangosDeFechasSeSolapan(f('2026-01-01'), f('2026-01-31'), f('2026-01-10'), f('2026-01-20')),
    ).toBe(true);
  });

  it('no hay solapamiento si terminan/empiezan en días distintos', () => {
    expect(
      rangosDeFechasSeSolapan(f('2026-01-01'), f('2026-01-14'), f('2026-01-15'), f('2026-01-20')),
    ).toBe(false);
  });

  it('se consideran solapados si comparten exactamente el día límite', () => {
    expect(
      rangosDeFechasSeSolapan(f('2026-01-01'), f('2026-01-15'), f('2026-01-15'), f('2026-01-20')),
    ).toBe(true);
  });

  it('un rango indefinido (fechaHasta null) se solapa con cualquier fecha futura', () => {
    expect(
      rangosDeFechasSeSolapan(f('2026-01-01'), null, f('2027-06-01'), f('2027-06-30')),
    ).toBe(true);
  });

  it('dos rangos indefinidos que empiezan en momentos distintos siempre se solapan', () => {
    expect(rangosDeFechasSeSolapan(f('2026-01-01'), null, f('2026-06-01'), null)).toBe(
      true,
    );
  });

  it('no se solapan si el indefinido empieza después de que el otro termina', () => {
    expect(
      rangosDeFechasSeSolapan(f('2026-01-01'), f('2026-01-31'), f('2026-02-01'), null),
    ).toBe(false);
  });
});
