/**
 * Helpers para convertir IDs de catálogos a sus nombres completos
 */

import {
  oficinas,
  areas,
  categorias,
  departamentos,
  divisiones,
  businessUnits,
  tiposCarrera,
  skillsDisponibles,
  idiomasDisponibles,
} from '@/shared/mock/catalogs';

/**
 * Función genérica para obtener el nombre de un elemento de catálogo por su ID
 */
function getCatalogName(
  catalog: Array<{ id: string; nombre: string }>,
  id: string
): string {
  const item = catalog.find((c) => c.id === id);
  return item ? item.nombre : id;
}

/**
 * Obtiene el nombre completo de una oficina desde su ID
 * @example getOficinaName('MAD') => 'Madrid'
 */
export function getOficinaName(id: string): string {
  return getCatalogName(oficinas, id);
}

/**
 * Obtiene el nombre completo de un área desde su ID
 * @example getAreaName('DEV') => 'Desarrollo'
 */
export function getAreaName(id: string): string {
  return getCatalogName(areas, id);
}

/**
 * Obtiene el nombre completo de una categoría desde su ID
 * @example getCategoriaName('JR') => 'Junior'
 */
export function getCategoriaName(id: string): string {
  return getCatalogName(categorias, id);
}

/**
 * Obtiene el nombre completo de un departamento desde su ID
 * @example getDepartamentoName('FE') => 'Frontend'
 */
export function getDepartamentoName(id: string): string {
  return getCatalogName(departamentos, id);
}

/**
 * Obtiene el nombre completo de una división desde su ID
 * @example getDivisionName('TECH') => 'Tecnología'
 */
export function getDivisionName(id: string): string {
  return getCatalogName(divisiones, id);
}

/**
 * Obtiene el nombre completo de una Business Unit desde su ID
 * @example getBusinessUnitName('BANK') => 'Banca'
 */
export function getBusinessUnitName(id: string): string {
  return getCatalogName(businessUnits, id);
}

/**
 * Obtiene el nombre completo de un tipo de carrera desde su ID
 * @example getTipoCarreraName('TECH') => 'Técnica'
 */
export function getTipoCarreraName(id: string): string {
  return getCatalogName(tiposCarrera, id);
}

/**
 * Obtiene el nombre completo de una skill desde su ID
 * @example getSkillName('REACT') => 'React'
 */
export function getSkillName(id: string): string {
  return getCatalogName(skillsDisponibles, id);
}

/**
 * Obtiene el nombre completo de un idioma con su nivel desde su ID
 * @example getIdiomaName('ES-NAT') => 'Español (Nativo)'
 * @example getIdiomaName('EN-C1') => 'Inglés (C1)'
 */
export function getIdiomaName(id: string): string {
  const idioma = idiomasDisponibles.find((i) => i.id === id);
  return idioma ? `${idioma.nombre} (${idioma.nivel})` : id;
}
