export interface Vacation {
  id: string;
  field_rango_vacaciones: {
    start: string; // ISO date string
    end: string; // ISO date string
  };
  field_solicitante: string; // Employee ID
  field_responsable: string; // Responsible ID
  field_estado: 'Approved' | 'Pending' | 'Rejected';
}
