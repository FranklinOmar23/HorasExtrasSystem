import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listarPeriodos } from '../api/periodos';
import type { Periodo } from '../types/api';

interface PeriodoContextValue {
  periodos: Periodo[];
  cargando: boolean;
  periodoActivo: Periodo | null;
  periodoActivoId: string | null;
  seleccionarPeriodo: (id: string) => void;
}

const PeriodoContext = createContext<PeriodoContextValue | null>(null);

function elegirPeriodoPorDefecto(periodos: Periodo[]): Periodo | null {
  if (periodos.length === 0) return null;
  const abierto = periodos.find((p) => p.estado === 'ABIERTO');
  if (abierto) return abierto;
  return [...periodos].sort((a, b) => b.fechaInicio.localeCompare(a.fechaInicio))[0];
}

export function PeriodoProvider({ children }: { children: ReactNode }) {
  const [periodoElegidoId, setPeriodoElegidoId] = useState<string | null>(null);

  const { data: periodos = [], isLoading } = useQuery({
    queryKey: ['periodos'],
    queryFn: listarPeriodos,
  });

  const periodoActivo = useMemo(() => {
    if (periodoElegidoId) {
      return periodos.find((p) => p.id === periodoElegidoId) ?? elegirPeriodoPorDefecto(periodos);
    }
    return elegirPeriodoPorDefecto(periodos);
  }, [periodos, periodoElegidoId]);

  const value = useMemo<PeriodoContextValue>(
    () => ({
      periodos,
      cargando: isLoading,
      periodoActivo,
      periodoActivoId: periodoActivo?.id ?? null,
      seleccionarPeriodo: setPeriodoElegidoId,
    }),
    [periodos, isLoading, periodoActivo],
  );

  return <PeriodoContext.Provider value={value}>{children}</PeriodoContext.Provider>;
}

export function usePeriodoActivo(): PeriodoContextValue {
  const ctx = useContext(PeriodoContext);
  if (!ctx) throw new Error('usePeriodoActivo debe usarse dentro de <PeriodoProvider>');
  return ctx;
}
