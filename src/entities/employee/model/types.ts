// Tipos para la entidad Employee
export interface Employee {
  id: string;
  field_num_empleado?: string;
  username?: string; // nombre de usuario
  name: string; // nombre principal / surname
  surname: string;
  email?: string;
  roles: EmployeeRole[]; // default: USUARIO_AUTENTICADO
  field_estado_empleado: string; // Bloqueado | Activo
  field_oficina: string;
  field_area: string;
  field_department: string;
  field_division: string;
  field_bu: string;
  field_categoria: string;
  field_tipo_carrera?: string;
  skills?: string[];
  idiomas: string[];
  field_responsables?: string[];
  field_fecha_ultima_revision_ann?: string;
  field_cv?: string;
  field_preferencias?: string;
  field_incompatibilidades?: string;
  field_fecha_fin_asignacion_act?: string;
  user_picture?: string;
}

export type EmployeeRole =
  | 'USUARIO_AUTENTICADO'
  | 'ADMINISTRADOR'
  | 'STAFF'
  | 'RESPONSABLE'
  | 'RESPONSABLE_STAFFING';

// DTOs: reutilizan Employee sin los campos autogenerados
export type CreateEmployeeDTO = Omit<Employee, 'id'> & { password?: string };
export type UpdateEmployeeDTO = Partial<CreateEmployeeDTO>;

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
