/**
 * Mock de datos para Cliente
 */
import type { Cliente } from './types';
import { ClienteTier } from './types';

export const clientesMock: Cliente[] = [
  {
    id: '1',
    title: 'Banco Santander',
    field_tier: ClienteTier.TIER1,
    field_manager_cliente: 'user-1',
    field_torre: 'torre-banking',
    field_comentarios: 'Cliente estratégico del sector bancario',
  },
  {
    id: '2',
    title: 'BBVA',
    field_tier: ClienteTier.TIER1,
    field_manager_cliente: 'user-2',
    field_torre: 'torre-banking',
  },
  {
    id: '3',
    title: 'Telefónica',
    field_tier: ClienteTier.TIER2,
    field_manager_cliente: 'user-3',
    field_torre: 'torre-telecom',
    field_comentarios: 'Cliente recurrente en proyectos de digitalización',
  },
  {
    id: '4',
    title: 'Inditex',
    field_tier: ClienteTier.TIER2,
    field_manager_cliente: 'user-1',
    field_torre: 'torre-retail',
  },
  {
    id: '5',
    title: 'Mercadona',
    field_tier: ClienteTier.TIER3,
    field_manager_cliente: 'user-4',
    field_torre: 'torre-retail',
  },
];
