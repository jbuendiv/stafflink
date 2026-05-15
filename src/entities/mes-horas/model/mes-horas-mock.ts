/**
 * Mock de datos para MesHoras
 */
import type { MesHoras } from './types';

export const mesHorasMock: MesHoras[] = [
  {
    id: '1',
    field_mes_ano: '2026-05-01T00:00:00.000Z',
    field_oficina: 'MAD',
    field_horas: 168, // ~21 días laborables * 8 horas
    field_festivos: ['2026-05-01', '2026-05-02', '2026-05-15'],
  },
  {
    id: '2',
    field_mes_ano: '2026-05-01T00:00:00.000Z',
    field_oficina: 'BCN',
    field_horas: 176, // ~22 días laborables * 8 horas
    field_festivos: ['2026-05-01'],
  },
  {
    id: '3',
    field_mes_ano: '2026-06-01T00:00:00.000Z',
    field_oficina: 'MAD',
    field_horas: 168,
    field_festivos: [],
  },
  {
    id: '4',
    field_mes_ano: '2026-06-01T00:00:00.000Z',
    field_oficina: 'BCN',
    field_horas: 168,
    field_festivos: ['2026-06-24'],
  },
  {
    id: '5',
    field_mes_ano: '2026-07-01T00:00:00.000Z',
    field_oficina: 'MAD',
    field_horas: 184,
    field_festivos: [],
  },
  {
    id: '6',
    field_mes_ano: '2026-07-01T00:00:00.000Z',
    field_oficina: 'BCN',
    field_horas: 184,
    field_festivos: [],
  },
  // Valencia
  {
    id: '7',
    field_mes_ano: '2026-05-01T00:00:00.000Z',
    field_oficina: 'VLC',
    field_horas: 168,
    field_festivos: ['2026-05-01'],
  },
  {
    id: '8',
    field_mes_ano: '2026-06-01T00:00:00.000Z',
    field_oficina: 'VLC',
    field_horas: 168,
    field_festivos: [],
  },
  {
    id: '9',
    field_mes_ano: '2026-07-01T00:00:00.000Z',
    field_oficina: 'VLC',
    field_horas: 184,
    field_festivos: [],
  },
  // Sevilla
  {
    id: '10',
    field_mes_ano: '2026-05-01T00:00:00.000Z',
    field_oficina: 'SEV',
    field_horas: 168,
    field_festivos: ['2026-05-01'],
  },
  {
    id: '11',
    field_mes_ano: '2026-06-01T00:00:00.000Z',
    field_oficina: 'SEV',
    field_horas: 168,
    field_festivos: [],
  },
  {
    id: '12',
    field_mes_ano: '2026-07-01T00:00:00.000Z',
    field_oficina: 'SEV',
    field_horas: 184,
    field_festivos: [],
  },
];
