import { entradaSalidaAjustadas, parsearHora, solapeMinutos } from './hora.util';

describe('parsearHora', () => {
  it('convierte "HH:mm" a minutos desde medianoche', () => {
    expect(parsearHora('00:00')).toBe(0);
    expect(parsearHora('08:30')).toBe(510);
    expect(parsearHora('23:59')).toBe(1439);
  });
});

describe('entradaSalidaAjustadas', () => {
  it('no ajusta si la salida es posterior a la entrada', () => {
    expect(entradaSalidaAjustadas('08:30', '17:30')).toEqual({ entrada: 510, salida: 1050 });
  });

  it('suma 24h a la salida si cruza medianoche', () => {
    expect(entradaSalidaAjustadas('22:00', '08:00')).toEqual({ entrada: 1320, salida: 1920 });
  });

  it('trata entrada y salida iguales como 0 minutos', () => {
    expect(entradaSalidaAjustadas('08:30', '08:30')).toEqual({ entrada: 510, salida: 510 });
  });
});

describe('solapeMinutos', () => {
  it('devuelve 0 si los rangos no se tocan', () => {
    expect(solapeMinutos(0, 100, 200, 300)).toBe(0);
  });

  it('devuelve la intersección cuando se solapan parcialmente', () => {
    expect(solapeMinutos(0, 150, 100, 300)).toBe(50);
  });

  it('devuelve el rango completo cuando uno contiene al otro', () => {
    expect(solapeMinutos(0, 300, 100, 200)).toBe(100);
  });

  it('devuelve 0 si apenas se tocan en el límite (rango medio-abierto)', () => {
    expect(solapeMinutos(0, 100, 100, 200)).toBe(0);
  });
});
