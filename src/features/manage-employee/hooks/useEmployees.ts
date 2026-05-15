import { useState, useCallback } from 'react';
import { employeeService } from '@/entities/employee/api';

import type { Employee, CreateEmployeeDTO, UpdateEmployeeDTO } from '@/entities/employee/model/types';

/**
 * Hook para gestionar empleados
 * Proporciona operaciones CRUD y estado de permisos del usuario actual
 */

// Hook para gestionar empleados
export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>(() => employeeService.getAll());
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  

  // Función para cargar empleados
  const loadEmployees = useCallback(() => {
    setEmployees(employeeService.getAll());
  }, []);

  // Funciones para crear, actualizar y eliminar empleados
  const createEmployee = useCallback((data: CreateEmployeeDTO) => {
    const newEmployee = employeeService.create(data);
    loadEmployees();
    return newEmployee;
  }, [loadEmployees]);

  const updateEmployee = useCallback((id: string, data: UpdateEmployeeDTO) => {
    const updated = employeeService.update(id, data);
    if (updated) {
      loadEmployees();
    }
    return updated;
  }, [loadEmployees]);

  const deleteEmployee = useCallback((id: string) => {
    const success = employeeService.delete(id);
    if (success) {
      loadEmployees();
    }
    return success;
  }, [loadEmployees]);

  return {
    employees,
    selectedEmployee,
    
    loadEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    selectEmployee: setSelectedEmployee
  };
};
