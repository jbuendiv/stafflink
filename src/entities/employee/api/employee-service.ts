import { employees } from '@/entities/employee/model/employee-mock';
import type { Employee, CreateEmployeeDTO, UpdateEmployeeDTO } from '@/entities/employee/model/types';

// Clave para localStorage
const STORAGE_KEY = 'stafflink_employees_v2';

/**
 * Guarda los empleados en localStorage
 */
const saveToStorage = (data: Employee[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error al guardar empleados en localStorage:', error);
  }
};

/**
 * Carga los empleados desde localStorage o retorna los datos por defecto
 */
const loadFromStorage = (): Employee[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error al cargar empleados desde localStorage:', error);
  }
  return [...employees];
};

// Array mutable de empleados en memoria
let employeeData: Employee[] = loadFromStorage();

/**
 * Genera un ID único para un nuevo empleado
 */
const generateId = (): string => {
  const maxId = employeeData.reduce((max, emp) => {
    const num = parseInt(emp.id.split('-')[1]);
    return num > max ? num : max;
  }, 0);
  return `user-${maxId + 1}`;
};

/**
 * Genera un número de empleado único
 */
const generateEmployeeNumber = (): string => {
  const maxNum = employeeData.reduce((max, emp) => {
    const parts = emp.field_num_empleado ? emp.field_num_empleado.split('-') : [];
    const numPart = parts.length > 1 ? parts[1] : emp.field_num_empleado;
    const num = parseInt(numPart || '0');
    return !isNaN(num) && num > max ? num : max;
  }, 0);
  return String(maxNum + 1).padStart(6, '0');
};

/**
 * Servicio de gestión de empleados
 * Proporciona operaciones CRUD para la entidad Employee
 */
export const employeeService = {
  /**
   * Obtiene todos los empleados
   */
  getAll: (): Employee[] => {
    return [...employeeData];
  },

  /**
   * Obtiene un empleado por su ID
   */
  getById: (id: string): Employee | undefined => {
    return employeeData.find(emp => emp.id === id);
  },

  /**
   * Crea un nuevo empleado
   */
  create: (data: CreateEmployeeDTO): Employee => {
    const newEmployee: Employee = {
      ...data,
      id: generateId(),
      field_num_empleado: data.field_num_empleado || generateEmployeeNumber()
    };

    employeeData.push(newEmployee);
    saveToStorage(employeeData);
    return newEmployee;
  },

  /**
   * Actualiza un empleado existente
   */
  update: (id: string, data: UpdateEmployeeDTO): Employee | null => {
    const index = employeeData.findIndex(emp => emp.id === id);
    if (index === -1) {
      return null;
    }

    const updatedEmployee: Employee = {
      ...employeeData[index],
      ...data
    };

    employeeData[index] = updatedEmployee;
    saveToStorage(employeeData);
    return updatedEmployee;
  },

  /**
   * Elimina un empleado
   */
  delete: (id: string): boolean => {
    const index = employeeData.findIndex(emp => emp.id === id);
    if (index === -1) {
      return false;
    }

    employeeData.splice(index, 1);
    saveToStorage(employeeData);
    return true;
  },

  /**
   * Resetea los datos a los valores iniciales
   */
  reset: (): void => {
    employeeData = [...employees];
    saveToStorage(employeeData);
  }
};
