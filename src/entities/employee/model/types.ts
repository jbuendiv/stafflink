// Tipos para la entidad Employee
export interface Employee {
  id: string;
  name: string;
  surname: string;
  email: string;
  roles: EmployeeRole[];
  field_estado_empleado: 'activo' | 'inactivo';
  field_num_empleado: string;
  field_oficina: string;
  field_area: string;
  field_department: string;
  field_division: string;
  field_bu: string;
  field_categoria: string;
  field_tipo_carrera: string;
  skills: string[];
  idiomas: string[];
  field_responsables: string[];
}

export type EmployeeRole =
  | 'USUARIO_AUTENTICADO'
  | 'ADMINISTRADOR'
  | 'STAFF'
  | 'RESPONSABLE'
  | 'RESPONSABLE_STAFFING';

// DTOs: reutilizan Employee sin los campos autogenerados
export type CreateEmployeeDTO = Omit<Employee, 'id' | 'field_num_empleado'>;
export type UpdateEmployeeDTO = Omit<Employee, 'id' | 'field_num_empleado'>;

// Catálogos - Interfaz base genérica
export interface CatalogItem {
  id: string;
  nombre: string;
}

// Type aliases para catálogos simples
export type Oficina = CatalogItem;
export type Area = CatalogItem;
export type Departamento = CatalogItem;
export type Division = CatalogItem;
export type BusinessUnit = CatalogItem;
export type Categoria = CatalogItem;
export type TipoCarrera = CatalogItem;
export type Skill = CatalogItem;

// Idioma necesita un campo extra, así que extiende CatalogItem
export interface Idioma extends CatalogItem {
  nivel: string;
}
