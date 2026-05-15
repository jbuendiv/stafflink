import { useState, useEffect, useMemo } from 'react';
import { mesHorasService } from '@/entities/mes-horas/api';
import { asignacionService } from '@/entities/asignacion/api';
import type { MesHoras } from '@/entities/mes-horas/model/types';
import type { Asignacion } from '@/entities/asignacion/model/types';
import type { AvailabilityResult } from '@/shared/lib/availability';

export type { AvailabilityResult };

/**
 * Calcula la disponibilidad de un empleado en un mes específico
 * Considera solo asignaciones confirmadas (excluye "Forecast")
 */
function calculateEmployeeAvailability(
  empleadoId: string,
  mesHoras: MesHoras,
  asignaciones: Asignacion[]
): AvailabilityResult {
  // Filtrar asignaciones del empleado para ese mes
  const asignacionesMes = asignaciones.filter(
    (a) => a.field_empleado === empleadoId && a.field_mes_horas === mesHoras.id
  );

  // Sumar horas asignadas (solo las confirmadas, no las de estado "Forecast")
  const horasAsignadas = asignacionesMes
    .filter((a) => a.field_estado !== 'Forecast')
    .reduce((sum, a) => sum + a.field_horas, 0);

  const horasTotales = mesHoras.field_horas;
  const horasDisponibles = Math.max(0, horasTotales - horasAsignadas);
  const porcentajeDisponible = horasTotales > 0 
    ? (horasDisponibles / horasTotales) * 100 
    : 0;

  return {
    empleadoId,
    mesHorasId: mesHoras.id,
    horasTotales,
    horasAsignadas,
    horasDisponibles,
    porcentajeDisponible,
  };
}

/**
 * Calcula disponibilidad para múltiples meses
 */
function calculateEmployeeAvailabilityMultiple(
  empleadoId: string,
  mesesHoras: MesHoras[],
  asignaciones: Asignacion[]
): AvailabilityResult[] {
  return mesesHoras.map((mesHoras) =>
    calculateEmployeeAvailability(empleadoId, mesHoras, asignaciones)
  );
}

interface UseAvailabilityParams {
  employeeIds: string[];
  employeeOffices: Map<string, string>; // Map de employeeId -> oficina
  startDate: Date | null;
  endDate: Date | null;
}

interface UseAvailabilityReturn {
  availabilityMap: Map<string, AvailabilityResult[]>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook para obtener la disponibilidad de múltiples empleados
 * Optimizado para cargar datos base una sola vez y calcular disponibilidad con useMemo
 */
export function useAvailability({
  employeeIds,
  employeeOffices,
  startDate,
  endDate,
}: UseAvailabilityParams): UseAvailabilityReturn {
  const [error, setError] = useState<string | null>(null);

  // Cargar datos base una sola vez y cachearlos
  const [allMesHoras, setAllMesHoras] = useState<MesHoras[]>([]);
  const [allAsignaciones, setAllAsignaciones] = useState<Asignacion[]>([]);
  const [isLoadingBase, setIsLoadingBase] = useState(true);
  const [hasLoadedBase, setHasLoadedBase] = useState(false);

  // Cargar datos base solo una vez
  useEffect(() => {
    if (hasLoadedBase) return;

    const loadBaseData = async () => {
      setIsLoadingBase(true);
      setError(null);
      try {
        const [mesHoras, asignaciones] = await Promise.all([
          mesHorasService.getAll(),
          asignacionService.getAll(),
        ]);
        setAllMesHoras(mesHoras);
        setAllAsignaciones(asignaciones);
        setHasLoadedBase(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos base');
      } finally {
        setIsLoadingBase(false);
      }
    };

    loadBaseData();
  }, [hasLoadedBase]);

  // Calcular disponibilidad cuando cambian los parámetros
  const availabilityMap = useMemo(() => {
    // Validaciones
    if (employeeIds.length === 0 || !startDate || !endDate) {
      return new Map<string, AvailabilityResult[]>();
    }

    // Validar rango de fechas
    if (startDate > endDate) {
      return new Map<string, AvailabilityResult[]>();
    }

    // No calcular si aún no se cargaron los datos base
    if (!hasLoadedBase || allMesHoras.length === 0) {
      return new Map<string, AvailabilityResult[]>();
    }

    const newMap = new Map<string, AvailabilityResult[]>();

    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();
    const startYearMonth = startYear * 12 + startMonth;
    const endYearMonth = endYear * 12 + endMonth;

    // Recorrer empleados y calcular disponibilidad
    for (const employeeId of employeeIds) {
      const employeeOficina = employeeOffices.get(employeeId);
      
      // Filtrar calendarios por oficina del empleado y rango de fechas
      const employeeMesHoras = allMesHoras.filter((mh) => {
        const mesDate = new Date(mh.field_mes_ano);
        const mesYear = mesDate.getFullYear();
        const mesMonth = mesDate.getMonth();
        const mesYearMonth = mesYear * 12 + mesMonth;
        
      
        return (
          mh.field_oficina === employeeOficina &&
          mesYearMonth >= startYearMonth &&
          mesYearMonth <= endYearMonth
        );
      });

      // Filtrar asignaciones del empleado
      const employeeAsignaciones = allAsignaciones.filter(
        (a) => a.field_empleado === employeeId
      );

      // Calcular disponibilidad
      const availability = calculateEmployeeAvailabilityMultiple(
        employeeId,
        employeeMesHoras,
        employeeAsignaciones
      );

      newMap.set(employeeId, availability);
    }

    return newMap;
  }, [employeeIds, employeeOffices, startDate, endDate, allMesHoras, allAsignaciones, hasLoadedBase]);

  return {
    availabilityMap,
    isLoading: isLoadingBase,
    error,
  };
}
