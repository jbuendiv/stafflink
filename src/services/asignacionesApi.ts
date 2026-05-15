// src/services/asignacionesApi.ts

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// --- Types based on the API Documentation ---

export interface CreateAsignacionPayload {
  user_id: string;
  year: string;
  month: string;
  field_dates?: string;
  last_modified: string;
  num_horas: number;
  nid?: string;
  status?: string;
}

export interface EditFechaPayload {
  user_id: string;
  mes_id: string;
  asignacion_id: string;
  fecha_objetivo: string;
  field_dates: string;
  mes_horas_entity: string;
  nid: string;
  field_horas: number;
  // Puede incluir otros campos de cálculo
  [key: string]: any;
}

// Interceptor/Helper para construir URLs
const buildUrl = (path: string) => `${API_BASE_URL}${path}`;

// --- API Service ---

export const asignacionesApi = {
  /**
   * getListOptions: Lista proyectos y oportunidades combinadas
   */
  getListOptions: async () => {
    const response = await fetch(buildUrl('/asignaciones/stfl-api/get-list-options-proyectos-mkt'));
    if (!response.ok) throw new Error('Error fetching list options');
    return response.json();
  },

  /**
   * getAsignaciones: Asignaciones de usuario por año/mes
   */
  getAsignaciones: async (userId: string, year: string, month: string) => {
    const response = await fetch(buildUrl(`/asignaciones/stfl-api/get-asignaciones/${userId}/${year}/${month}`));
    if (!response.ok) throw new Error('Error fetching asignaciones');
    return response.json();
  },

  /**
   * getHorasPendientes: Horas pendientes de asignar
   */
  getHorasPendientes: async (userId: string, year: string, month: string) => {
    const response = await fetch(buildUrl(`/asignaciones/stfl-api/pending-hours/${userId}/${year}/${month}`));
    if (!response.ok) throw new Error('Error fetching pending hours');
    return response.json();
  },

  /**
   * editProyectoMkt: Edita proyecto/MKT de una asignación
   */
  editProyectoMkt: async (asignacionId: string, nid: string) => {
    const response = await fetch(buildUrl(`/asignaciones/stfl-api/edit/${asignacionId}/proyecto-mkt/${nid}`));
    if (!response.ok) throw new Error('Error editing proyecto/mkt');
    return response.json();
  },

  /**
   * editHoras: Edita horas de una asignación
   */
  editHoras: async (asignacionId: string, addHoras: number) => {
    const response = await fetch(buildUrl(`/asignaciones/stfl-api/edit/${asignacionId}/horas/${addHoras}`));
    if (!response.ok) throw new Error('Error editing horas');
    return response.json();
  },

  /**
   * editEstado: Edita estado de una asignación
   */
  editEstado: async (asignacionId: string, estado: string) => {
    const response = await fetch(buildUrl(`/asignaciones/stfl-api/edit/${asignacionId}/estado/${estado}`));
    if (!response.ok) throw new Error('Error editing estado');
    return response.json();
  },

  /**
   * editComentarios: Edita comentarios de una asignación
   */
  editComentarios: async (asignacionId: string, comentarios: string) => {
    const encoded = encodeURIComponent(comentarios);
    const response = await fetch(buildUrl(`/asignaciones/stfl-api/edit/${asignacionId}/comentarios/${encoded}`));
    if (!response.ok) throw new Error('Error editing comentarios');
    return response.json();
  },

  /**
   * createAsignacion: Crea una nueva asignación
   */
  createAsignacion: async (payload: CreateAsignacionPayload) => {
    const response = await fetch(buildUrl('/asignaciones/stfl-api/create'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Error creating asignacion');
    return response.json();
  },

  /**
   * deleteAsignacion: Elimina una asignación
   */
  deleteAsignacion: async (asignacionId: string) => {
    const response = await fetch(buildUrl(`/asignaciones/stfl-api/delete/${asignacionId}`));
    if (!response.ok) throw new Error('Error deleting asignacion');
    return response.json();
  },

  /**
   * editFecha: Modifica rango de fechas y recalcula horas
   */
  editFecha: async (payload: EditFechaPayload) => {
    const response = await fetch(buildUrl('/asignaciones/stfl-api/edit/fecha'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Error editing fecha');
    return response.json();
  }
};
