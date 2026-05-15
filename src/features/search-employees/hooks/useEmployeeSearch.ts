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
  isLoading: boolean;
  error: string | null;
  startDate: Date | null;
  endDate: Date | null;
  setDateRange: (start: Date | null, end: Date | null) => void;
}

const initialCriteria: SearchCriteria = {
  skills: [],
  idiomas: [],
  categoria: [],
  tipoCarrera: undefined,
  area: undefined,
  oficina: undefined,
  minimumAvailability: 0,
  searchText: '',
};

/**
 * Hook principal para búsqueda de empleados con filtros
 */
export function useEmployeeSearch(): UseEmployeeSearchReturn {
  const [criteria, setCriteria] = useState<SearchCriteria>(initialCriteria);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date;
  });
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [employeesError, setEmployeesError] = useState<string | null>(null);

  // Cargar todos los empleados
  useEffect(() => {
    const loadEmployees = async () => {
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
    };
    loadEmployees();
  }, []);

  // Aplicar filtros de perfil primero (sin disponibilidad)
  const employeesAfterProfileFilter = useMemo(() => {
    const profileCriteria = { ...criteria, minimumAvailability: undefined };
    return filterEmployees(employees, profileCriteria);
  }, [employees, criteria]);

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
    startDate,
    endDate,
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
    if (!criteria.minimumAvailability) {
      return resultsWithAvailability;
    }

    // Filtrar por disponibilidad mínima
    const minAvailability = criteria.minimumAvailability;
    return resultsWithAvailability.filter((result) => {
      if (!result.availability || result.availability.length === 0) return false;

      const totalHorasDisponibles = result.availability.reduce(
        (sum, a) => sum + a.horasDisponibles,
        0
      );

      return totalHorasDisponibles >= minAvailability;
    });
  }, [employeesAfterProfileFilter, criteria.minimumAvailability, availabilityMap]);

  // Funciones para actualizar criterios de búsqueda
  const updateCriteria = useCallback((updates: Partial<SearchCriteria>) => {
    setCriteria((prev) => ({ ...prev, ...updates }));
  }, []);

  // Función para resetear criterios a valores iniciales
  const resetCriteria = useCallback(() => {
    setCriteria(initialCriteria);
    setStartDate(new Date());
    const newEndDate = new Date();
    newEndDate.setDate(newEndDate.getDate() + 30);
    setEndDate(newEndDate);
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
    isLoading: isLoadingEmployees || isLoadingAvailability,
    error: employeesError || availabilityError,
    startDate,
    endDate,
    setDateRange,
  };
}
