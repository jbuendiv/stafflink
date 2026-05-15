export interface ClientManager {
  id: string;
  name: string;
}

export interface Client {
  id: string;
  name: string;
  level: number;
  sector: string;
  manager: ClientManager;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  codigoProyecto: string;
  managerId: string;
  projectManagerId: string;
  technicalLeadId: string;
  estado: string; // 'Planned' | 'In Progress' | 'Completed'
  startDate: string | null;
  endDate: string | null;
}

export interface Office {
  id: string;
  name: string;
}

export interface MonthlyCalendar {
  id: string;
  officeId: string;
  officeName: string;
  month: number; // 1-12
  year: number;
  workingHours: number;
  holidays: string[]; // array of YYYY-MM-DD
}

export interface OfficeVacation {
  id: string;
  officeId: string;
  officeName: string;
  year: number;
  vacationDays: number;
}

export interface VacationRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface Opportunity {
  id: string;
  name: string;
  clientId: string;
  managerId: string;
  projectManagerId: string;
  technicalLeadId: string;
  candidatos: string[]; // employee ids
  startDate: string | null;
  endDate: string | null;
  status: string; // 'Abierta' | 'Ganada' | 'Perdida' | 'En curso'
}

export type CreateOpportunityDTO = Omit<Opportunity, "id">;
export type UpdateOpportunityDTO = Partial<CreateOpportunityDTO>;

export type EmployeeRole = "USUARIO_AUTENTICADO" | "ADMINISTRADOR" | "STAFF" | "RESPONSABLE" | "RESPONSABLE_STAFFING";

export interface Employee {
  id: string;
  field_num_empleado?: string;
  name: string;
  surname: string;
  email: string;
  roles: EmployeeRole[];
  field_estado_empleado: string;
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

export type CreateEmployeeDTO = Omit<Employee, "id" | "field_num_empleado">;
export type UpdateEmployeeDTO = Partial<CreateEmployeeDTO>;

export interface MesHoras {
  id: string;
  field_mes_ano: string; // YYYY-MM-DD
  field_oficina: string;
  field_horas: number;
}

export interface Asignacion {
  id: string;
  field_empleado: string;
  field_mes_horas: string;
  field_horas: number;
  field_estado: string; // 'Forecast' | 'Confirmed' etc.
}
