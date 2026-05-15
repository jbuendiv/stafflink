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
