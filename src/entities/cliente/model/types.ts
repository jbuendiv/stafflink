/**
 * Tipos relacionados con la entidad Cliente
 */

/**
 * Tipos de Tier de cliente
 */
export const ClienteTier = {
  TIER1: 'Tier1',
  TIER2: 'Tier2',
  TIER3: 'Tier3',
} as const;

export type ClienteTier = typeof ClienteTier[keyof typeof ClienteTier];

/**
 * Interface principal de Cliente
 */
export interface Cliente {
  id: string;
  title: string;
  field_tier: ClienteTier;
  field_manager_cliente: string; // ObjectId → usuarios
  field_torre: string; // ObjectId → taxonomy_torre
  field_comentarios?: string;
}

/**
 * Type para crear un nuevo cliente (sin id)
 */
export type ClienteCreate = Omit<Cliente, 'id'>;

/**
 * Type para actualizar un cliente (campos opcionales)
 */
export type ClienteUpdate = Partial<ClienteCreate>;
