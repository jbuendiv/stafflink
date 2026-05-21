import { useState, useCallback, useMemo, useEffect } from 'react';
import type { Employee } from '@/entities/employee/model/types';
import { employeeService } from '@/entities/employee/api';
import { useAvailability } from './useAvailability';
import {
  filterEmployees,
  type SearchCriteria,
  type EmployeeSearchResult,
} from '../lib/search-filters';

interface UseEmployeeSearchReturn {
  results: EmployeeSearchResult[];
  criteria: SearchCriteria;
  updateCriteria: (updates: Partial<SearchCriteria>) => void;
  resetCriteria: () => void;
  triggerSearch: () => void;
  reloadEmployees: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  startDate: Date | null;
  endDate: Date | null;
  setDateRange: (start: Date | null, end: Date | null) => void;
}

const initialCriteria: SearchCriteria = {
  searchText: '',
  department: '',
  area: '',
  oficina: '',
  responsables: [],
  proyectosOportunidades: [],
  categoria: '',
  tipoCarrera: '',
  idiomas: [],
  skills: [],
  division: '',
  disponibilidadMeses: [],
};

/**
 * Hook principal para búsqueda de empleados con filtros
 */
export function useEmployeeSearch(): UseEmployeeSearchReturn {
  const [criteria, setCriteria] = useState<SearchCriteria>(initialCriteria);
  const [appliedCriteria, setAppliedCriteria] = useState<SearchCriteria>(initialCriteria);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date;
  });
  const [appliedStartDate, setAppliedStartDate] = useState<Date | null>(startDate);
  const [appliedEndDate, setAppliedEndDate] = useState<Date | null>(endDate);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [employeesError, setEmployeesError] = useState<string | null>(null);

  // Trigger search applies draft criteria to active filters
  const triggerSearch = useCallback(() => {
    setAppliedCriteria(criteria);
    setAppliedStartDate(startDate);
    setAppliedEndDate(endDate);
  }, [criteria, startDate, endDate]);

  const loadEmployees = useCallback(async () => {
    setIsLoadingEmployees(true);
    setEmployeesError(null);
    try {
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (err) {
      setEmployeesError(err instanceof Error ? err.message : 'Error al cargar empleados');
    } finally {
      setIsLoadingEmployees(false);
    }
  }, []);

  // Cargar todos los empleados
  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  // Aplicar filtros de perfil primero (sin disponibilidad)
  const employeesAfterProfileFilter = useMemo(() => {
    const profileCriteria = { ...appliedCriteria, minimumAvailability: undefined };
    return filterEmployees(employees, profileCriteria);
  }, [employees, appliedCriteria]);

  // Cargar disponibilidad solo para empleados que pasaron el filtro de perfil
  const employeeIds = useMemo(
    () => employeesAfterProfileFilter.map((r) => r.employee.id),
    [employeesAfterProfileFilter]
  );

  
  const employeeOffices = useMemo(() => {
    const map = new Map<string, string>();
    employeesAfterProfileFilter.forEach((r) => {
      map.set(r.employee.id, r.employee.field_oficina);
    });
    return map;
  }, [employeesAfterProfileFilter]);

  // Cargar disponibilidad solo para empleados que pasaron el filtro de perfil
  const {
    availabilityMap,
    isLoading: isLoadingAvailability,
    error: availabilityError,
  } = useAvailability({
    employeeIds,
    employeeOffices,
    startDate: appliedStartDate,
    endDate: appliedEndDate,
  });

  // Aplicar filtro de disponibilidad sobre resultados ya filtrados
  const results = useMemo(() => {
    // Si no hay datos de disponibilidad, retornar solo perfiles
    if (!availabilityMap || availabilityMap.size === 0) {
      return employeesAfterProfileFilter;
    }

    // Agregar datos de disponibilidad a todos los empleados
    const resultsWithAvailability = employeesAfterProfileFilter.map((result) => {
      const availability = availabilityMap.get(result.employee.id);
      const averageAvailability = availability && availability.length > 0
        ? availability.reduce((sum, a) => sum + a.porcentajeDisponible, 0) / availability.length
        : 0;

      return {
        ...result,
        availability,
        averageAvailability,
      };
    });

    // Si no hay filtro de disponibilidad mínima, retornar todos con availability
    if (!appliedCriteria.minimumAvailability) {
      return resultsWithAvailability;
    }

    // Filtrar por disponibilidad mínima
    const minAvailability = appliedCriteria.minimumAvailability;
    return resultsWithAvailability.filter((result) => {
      if (!result.availability || result.availability.length === 0) return false;

      const totalHorasDisponibles = result.availability.reduce(
        (sum, a) => sum + a.horasDisponibles,
        0
      );

      return totalHorasDisponibles >= minAvailability;
    });
  }, [employeesAfterProfileFilter, appliedCriteria.minimumAvailability, availabilityMap]);

  // Funciones para actualizar criterios de búsqueda
  const updateCriteria = useCallback((updates: Partial<SearchCriteria>) => {
    setCriteria((prev) => ({ ...prev, ...updates }));
  }, []);

  // Función para resetear criterios a valores iniciales
  const resetCriteria = useCallback(() => {
    setCriteria(initialCriteria);
    setAppliedCriteria(initialCriteria);
    const initialStart = new Date();
    setStartDate(initialStart);
    setAppliedStartDate(initialStart);
    const newEndDate = new Date();
    newEndDate.setDate(newEndDate.getDate() + 30);
    setEndDate(newEndDate);
    setAppliedEndDate(newEndDate);
  }, []);

  // Cargar datos base para cálculo de disponibilidad (mesHoras y asignaciones)
  const setDateRange = useCallback((start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  }, []);

  return {
    results,
    criteria,
    updateCriteria,
    resetCriteria,
    triggerSearch,
    reloadEmployees: loadEmployees,
    isLoading: isLoadingEmployees || isLoadingAvailability,
    error: employeesError || availabilityError,
    startDate,
    endDate,
    setDateRange,
  };
}
