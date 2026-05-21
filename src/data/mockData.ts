import { Client, ClientManager, Project, Office, MonthlyCalendar, OfficeVacation, VacationRequest } from '../types';

export const MOCK_CLIENT_MANAGERS: ClientManager[] = [
  { id: 'm1', name: 'Violeta Medina' },
  { id: 'm2', name: 'Javi Papell' },
  { id: 'm3', name: 'Carlos Sánchez' },
  { id: 'm4', name: 'Laura Gómez' },
  { id: 'm5', name: 'Javi Lagos' },
];

const levels = [1, 2, 3];
const sectors = ['Tecnología', 'Finanzas', 'Energía', 'Retail', 'Salud', 'Publico'];

export const MOCK_CLIENTS: Client[] = Array.from({ length: 53 }, (_, i) => {
  const level = levels[i % levels.length];
  const sector = sectors[i % sectors.length];
  const manager = MOCK_CLIENT_MANAGERS[i % MOCK_CLIENT_MANAGERS.length];
  
  return {
    id: `client-${i + 1}`,
    name: `Cliente Ejemplo ${i + 1}`,
    level: level,
    sector: sector,
    manager: manager,
  };
});

const estados = ['Planned', 'In Progress', 'Completed'];

export const MOCK_OFFICES: Office[] = [
  { id: 'off-1', name: 'Madrid' },
  { id: 'off-2', name: 'Barcelona' },
  { id: 'off-3', name: 'Sevilla' },
  { id: 'off-4', name: 'Valencia' },
  { id: 'off-5', name: 'Bilbao' },
];

export const MOCK_CALENDARS: MonthlyCalendar[] = [
  {
    id: 'cal-1',
    officeId: 'off-1',
    officeName: 'Madrid',
    month: 5,
    year: 2024,
    workingHours: 168,
    holidays: ['2024-05-01', '2024-05-02', '2024-05-15'],
  },
  {
    id: 'cal-2',
    officeId: 'off-2',
    officeName: 'Barcelona',
    month: 5,
    year: 2024,
    workingHours: 176,
    holidays: ['2024-05-01'],
  },
  {
    id: 'cal-3',
    officeId: 'off-1',
    officeName: 'Madrid',
    month: 6,
    year: 2024,
    workingHours: 160,
    holidays: [],
  }
];

export const MOCK_OFFICE_VACATIONS: OfficeVacation[] = [
  {
    id: 'vac-1',
    officeId: 'off-1',
    officeName: 'Madrid',
    year: 2026,
    vacationDays: 23,
  },
  {
    id: 'vac-2',
    officeId: 'off-2',
    officeName: 'Barcelona',
    year: 2026,
    vacationDays: 22,
  }
];

export const MOCK_VACATION_REQUESTS: VacationRequest[] = [
  {
    id: 'req-1',
    employeeId: 'emp-1',
    startDate: '2023-01-01',
    endDate: '2023-01-05',
    status: 'Approved',
  },
  {
    id: 'req-2',
    employeeId: 'emp-1',
    startDate: '2023-01-06',
    endDate: '2023-01-10',
    status: 'Pending',
  },
  {
    id: 'req-3',
    employeeId: 'emp-1',
    startDate: '2023-01-11',
    endDate: '2023-01-15',
    status: 'Rejected',
  },
  {
    id: 'req-4',
    employeeId: 'emp-1',
    startDate: '2023-01-16',
    endDate: '2023-01-20',
    status: 'Approved',
  },
  {
    id: 'req-5',
    employeeId: 'emp-1',
    startDate: '2023-01-21',
    endDate: '2023-01-25',
    status: 'Pending',
  }
];

export const MOCK_PROJECTS: Project[] = Array.from({ length: 42 }, (_, i) => {
  const client = MOCK_CLIENTS[i % MOCK_CLIENTS.length];
  const managerId = MOCK_CLIENT_MANAGERS[i % MOCK_CLIENT_MANAGERS.length].id;
  const projectManagerId = MOCK_CLIENT_MANAGERS[(i + 1) % MOCK_CLIENT_MANAGERS.length].id;
  const technicalLeadId = MOCK_CLIENT_MANAGERS[(i + 2) % MOCK_CLIENT_MANAGERS.length].id;
  const estado = estados[i % estados.length];
  
  return {
    id: `proj-${i + 1}`,
    name: `Proyecto ODS ${2024 + (i % 3)} - ${i + 1}`,
    clientId: client.id,
    clientName: client.name,
    codigoProyecto: `INT-${String(Math.floor(Math.random() * 900000) + 100000)}-${String(Math.floor(Math.random() * 90000) + 10000)}`,
    managerId,
    projectManagerId,
    technicalLeadId,
    estado,
    startDate: `2024-0${1 + (i % 9)}-01`,
    endDate: i % 4 === 0 ? null : `2025-0${1 + (i % 9)}-01`,
  };
});
