// Catálogos generales compartidos de StaffLink

// Tipo para los elementos de catálogo
type CatalogItem = {
  id: string;
  value: string;
};

// Tipo para la estructura completa de catálogos
export type CatalogsData = {
  oficinas: CatalogItem[];
  areas: CatalogItem[];
  departments: CatalogItem[];
  divisions: CatalogItem[];
  bus: CatalogItem[];
  categorias: CatalogItem[];
  tipos_carrera: CatalogItem[];
  skills: CatalogItem[];
  idiomas: CatalogItem[];
};

export const oficinas = [
  { id: 'MAD', nombre: 'Madrid' },
  { id: 'BCN', nombre: 'Barcelona' },
  { id: 'VLC', nombre: 'Valencia' },
  { id: 'SEV', nombre: 'Sevilla' },
  { id: 'BIO', nombre: 'Bilbao' }
];

export const areas = [
  { id: 'DEV', nombre: 'Desarrollo' },
  { id: 'CONS', nombre: 'Consultoría' },
  { id: 'ARQ', nombre: 'Arquitectura' },
  { id: 'QA', nombre: 'QA' },
  { id: 'DEVOPS', nombre: 'DevOps' }
];

export const departamentos = [
  { id: 'FE', nombre: 'Frontend' },
  { id: 'BE', nombre: 'Backend' },
  { id: 'FS', nombre: 'FullStack' },
  { id: 'CLOUD', nombre: 'Cloud' },
  { id: 'DATA', nombre: 'Data' }
];

export const divisiones = [
  { id: 'TECH', nombre: 'Tecnología' },
  { id: 'DIG', nombre: 'Digital' },
  { id: 'INNO', nombre: 'Innovación' }
];

export const businessUnits = [
  { id: 'BANK', nombre: 'Banca' },
  { id: 'INS', nombre: 'Seguros' },
  { id: 'IND', nombre: 'Industria' },
  { id: 'RET', nombre: 'Retail' },
  { id: 'TEL', nombre: 'Telco' }
];

export const categorias = [
  { id: 'JR', nombre: 'Junior' },
  { id: 'SR', nombre: 'Senior' },
  { id: 'EXP', nombre: 'Expert' },
  { id: 'MGR', nombre: 'Manager' },
  { id: 'DIR', nombre: 'Director' }
];

export const tiposCarrera = [
  { id: 'TECH', nombre: 'Técnica' },
  { id: 'MGMT', nombre: 'Gestión' },
  { id: 'MIX', nombre: 'Mixta' }
];

export const skillsDisponibles = [
  { id: 'REACT', nombre: 'React' },
  { id: 'ANG', nombre: 'Angular' },
  { id: 'VUE', nombre: 'Vue.js' },
  { id: 'NODE', nombre: 'Node.js' },
  { id: 'PY', nombre: 'Python' },
  { id: 'JAVA', nombre: 'Java' },
  { id: 'CS', nombre: 'C#' },
  { id: 'NET', nombre: '.NET' },
  { id: 'AWS', nombre: 'AWS' },
  { id: 'AZ', nombre: 'Azure' },
  { id: 'DOCK', nombre: 'Docker' },
  { id: 'K8S', nombre: 'Kubernetes' },
  { id: 'TS', nombre: 'TypeScript' },
  { id: 'JS', nombre: 'JavaScript' },
  { id: 'SQL', nombre: 'SQL' },
  { id: 'MONGO', nombre: 'MongoDB' },
  { id: 'PG', nombre: 'PostgreSQL' },
  { id: 'REDIS', nombre: 'Redis' },
  { id: 'GQL', nombre: 'GraphQL' },
  { id: 'REST', nombre: 'REST API' }
];

export const idiomasDisponibles = [
  { id: 'ES-NAT', nombre: 'Español', nivel: 'Nativo' },
  { id: 'EN-C1', nombre: 'Inglés', nivel: 'C1' },
  { id: 'EN-B2', nombre: 'Inglés', nivel: 'B2' },
  { id: 'FR-B2', nombre: 'Francés', nivel: 'B2' },
  { id: 'FR-B1', nombre: 'Francés', nivel: 'B1' },
  { id: 'DE-B2', nombre: 'Alemán', nivel: 'B2' },
  { id: 'DE-A2', nombre: 'Alemán', nivel: 'A2' },
  { id: 'PT-B1', nombre: 'Portugués', nivel: 'B1' }
];

/**
 * Catálogos en formato unificado para gestión dinámica
 */
export const mockCatalogs: CatalogsData = {
  oficinas: oficinas.map(o => ({ id: o.id, value: o.nombre })),
  areas: areas.map(a => ({ id: a.id, value: a.nombre })),
  departments: departamentos.map(d => ({ id: d.id, value: d.nombre })),
  divisions: divisiones.map(d => ({ id: d.id, value: d.nombre })),
  bus: businessUnits.map(bu => ({ id: bu.id, value: bu.nombre })),
  categorias: categorias.map(c => ({ id: c.id, value: c.nombre })),
  tipos_carrera: tiposCarrera.map(tc => ({ id: tc.id, value: tc.nombre })),
  skills: skillsDisponibles.map(s => ({ id: s.id, value: s.nombre })),
  idiomas: idiomasDisponibles.map(i => ({ id: i.id, value: `${i.nombre} (${i.nivel})` })),
};

/**
 * Obtiene el nombre completo de una oficina a partir de su ID
 * @param oficinaId - ID de la oficina (ej: "MAD", "BCN", "VLC")
 * @returns Nombre completo de la oficina (ej: "Madrid", "Barcelona", "Valencia")
 */
export const getOficinaNombre = (oficinaId: string): string => {
  const oficina = oficinas.find(o => o.id === oficinaId);
  return oficina?.nombre || oficinaId;
};
