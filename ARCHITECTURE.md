# Arquitectura del Proyecto StaffLink

## 📋 Índice

1. [Visión General](#visión-general)
2. [Arquitectura Feature-Sliced Design](#arquitectura-feature-sliced-design)
3. [Estructura de Capas](#estructura-de-capas)
4. [Entidades del Dominio](#entidades-del-dominio)
5. [Features Implementadas](#features-implementadas)
6. [Optimizaciones Realizadas](#optimizaciones-realizadas)
7. [Flujo de Datos](#flujo-de-datos)
8. [Guías de Desarrollo](#guías-de-desarrollo)

---

## Visión General

**StaffLink** es una aplicación de gestión de empleados y asignaciones construida con:

- **React 18** + **TypeScript**
- **Material-UI (MUI)** para la interfaz
- **React Router** para navegación
- **Arquitectura FSD** (Feature-Sliced Design)

### Objetivo del Proyecto

Proporcionar una plataforma escalable para:
- ✅ Gestión completa de empleados (CRUD)
- ✅ Búsqueda avanzada de empleados por disponibilidad y skills
- 🔜 Gestión de proyectos y clientes
- 🔜 Asignaciones de empleados a proyectos
- 🔜 Control de vacaciones y ausencias
- 🔜 Peticiones de staffing

---

## Arquitectura Feature-Sliced Design

El proyecto sigue la metodología **FSD**, que organiza el código en capas jerárquicas:

```
src/
├── app/          # Configuración de la aplicación
├── pages/        # Páginas/rutas de la aplicación
├── widgets/      # Bloques complejos de UI
├── features/     # Características de negocio
├── entities/     # Entidades del dominio
└── shared/       # Código compartido
```

### Principios FSD Aplicados

1. **Separación por capas**: Cada capa tiene responsabilidades claras
2. **Desacoplamiento**: Las capas superiores dependen de las inferiores, nunca al revés
3. **Encapsulamiento**: Cada feature/entity exporta solo lo necesario vía `index.ts`
4. **Escalabilidad**: Fácil agregar nuevas features sin afectar el código existente

---

## Estructura de Capas

### 🎯 App Layer (`src/app/`)

Configuración global de la aplicación.

```
app/
├── App.tsx                    # Componente raíz con routing
├── providers/
│   ├── AppProviders.tsx      # Configuración de providers (Theme, Router)
│   └── styles/
│       └── theme.ts          # Tema personalizado de MUI
└── styles/
    └── globals.css           # Estilos globales
```

**Responsabilidades:**
- Inicialización de la app
- Configuración de providers (Theme, Router, etc.)
- Rutas principales
- Estilos globales

---

### 📄 Pages Layer (`src/pages/`)

Páginas correspondientes a rutas de la aplicación.

```
pages/
├── home/
│   └── ui/HomePage.tsx
├── employees/
│   └── ui/
│       ├── EmployeePage.tsx          # Lista de empleados
│       ├── EmployeeDetailPage.tsx    # Detalle de empleado
│       ├── EmployeeCreatePage.tsx    # Crear empleado
│       └── EmployeeEditPage.tsx      # Editar empleado
└── search-employees/
    └── ui/SearchEmployeesPage.tsx    # Búsqueda de empleados
```

**Responsabilidades:**
- Composición de features y widgets
- Manejo de navegación y parámetros de URL
- Layout específico de cada página

---

### 🧩 Widgets Layer (`src/widgets/`)

Bloques complejos de UI que componen features.

```
widgets/
├── app-shell/
│   └── ui/AppShell.tsx        # Layout principal con navbar
└── navbar/
    ├── ui/Navbar.tsx
    └── hooks/useNavbar.ts
```

**Responsabilidades:**
- Componentes complejos de UI
- Layouts reutilizables
- Navegación principal

---

### ⚡ Features Layer (`src/features/`)

Funcionalidades de negocio completas.

```
features/
├── manage-employee/
│   ├── hooks/
│   │   ├── useEmployees.ts           # Estado y operaciones CRUD
│   │   └── useEmployeeForm.ts        # Lógica del formulario
│   ├── lib/
│   │   ├── validation-utils.ts       # Validaciones de negocio
│   │   ├── completeness-validator.ts # Validación de completitud
│   │   └── form-utils.ts             # Utilidades del formulario
│   └── ui/
│       ├── EmployeeForm.tsx
│       ├── EmployeeList.tsx
│       └── form-sections/            # Secciones del formulario
│           ├── PersonalInfoSection.tsx
│           ├── OrganizationSection.tsx
│           ├── CareerSection.tsx
│           ├── SkillsSection.tsx
│           └── RolesSection.tsx
└── search-employees/
    ├── hooks/
    │   ├── useEmployeeSearch.ts      # Lógica de búsqueda
    │   └── useAvailability.ts        # Cálculo de disponibilidad
    ├── lib/
    │   └── search-filters.ts         # Filtros de búsqueda
    └── ui/
        ├── SearchEmployeesForm.tsx
        └── SearchResultsList.tsx
```

**Responsabilidades:**
- Lógica de negocio específica
- Interacción del usuario con entidades
- Validaciones y reglas de negocio
- Hooks personalizados para features

---

### 🗄️ Entities Layer (`src/entities/`)

Entidades del dominio del negocio.

Cada entidad sigue la estructura:

```
entities/
├── employee/              # ✅ ACTIVA
│   ├── api/
│   │   ├── employee-service.ts    # Operaciones CRUD
│   │   └── index.ts
│   └── model/
│       ├── types.ts               # Tipos TypeScript
│       └── employee-mock.ts       # Datos mock
├── asignacion/            # 🔜 FUTURA
├── cliente/               # 🔜 FUTURA
├── mes-horas/             # 🔜 FUTURA
├── peticion-staffing/     # 🔜 FUTURA
├── proyecto/              # 🔜 FUTURA
└── vacaciones/            # 🔜 FUTURA
```

**Entidades Implementadas:**

#### ✅ Employee (Activa)
- CRUD completo de empleados
- Gestión de información personal, profesional, skills
- Validación de datos

#### 🔜 Entidades Futuras
Ver README en cada carpeta de entidad para detalles:
- `asignacion/README.md`
- `cliente/README.md`
- `mes-horas/README.md`
- `peticion-staffing/README.md`
- `proyecto/README.md`
- `vacaciones/README.md`

---

### 🔧 Shared Layer (`src/shared/`)

Código compartido entre todas las capas.

```
shared/
├── ui/                        # Componentes UI reutilizables
│   ├── form-components/
│   │   ├── TextInput.tsx
│   │   ├── SelectField.tsx
│   │   ├── MultiSelectField.tsx
│   │   └── SearchableMultiSelectField.tsx
│   └── layout/
│       └── FormRow.tsx
├── lib/                       # Utilidades y helpers
│   └── catalogs/
│       └── catalog-helpers.ts # Helpers para catálogos
├── config/
│   └── app-info.ts           # Configuración de la app
├── mock/
│   └── catalogs.ts           # Catálogos mock
└── types/
    └── mui-theme.d.ts        # Tipos de MUI extendidos
```

---

## Entidades del Dominio

### Relaciones entre Entidades

```
Cliente
  └── Proyecto
       ├── Asignación ──────┐
       │                     │
       └── PeticionStaffing  │
                             │
Employee ────────────────────┘
  ├── MesHoras
  └── Vacaciones
```

### Flujo de Negocio (Futuro)

1. **Cliente** contrata servicios
2. Se crean **Proyectos** para el cliente
3. Se generan **Peticiones de Staffing** para cubrir necesidades
4. Se asignan **Empleados** mediante **Asignaciones**
5. Se registran **MesHoras** trabajadas
6. Se gestionan **Vacaciones** que afectan disponibilidad

---

## Features Implementadas

### 1. Gestión de Empleados (`manage-employee`)

**Funcionalidad:**
- Crear nuevos empleados
- Editar empleados existentes
- Eliminar empleados
- Visualizar lista de empleados
- Validación de datos

**Componentes Clave:**
- `EmployeeForm`: Formulario completo dividido en secciones
- `EmployeeList`: Lista con paginación y acciones
- `useEmployees`: Hook para operaciones CRUD
- `useEmployeeForm`: Hook para lógica del formulario

### 2. Búsqueda de Empleados (`search-employees`)

**Funcionalidad:**
- Búsqueda por skills, rol, ubicación
- Filtrado por disponibilidad
- Cálculo de capacidad y horas asignadas
- Visualización de resultados

**Componentes Clave:**
- `SearchEmployeesForm`: Formulario de búsqueda
- `SearchResultsList`: Lista de resultados
- `useEmployeeSearch`: Lógica de búsqueda y filtrado
- `useAvailability`: Cálculo de disponibilidad

---

## Optimizaciones Realizadas

### 🗑️ Código Eliminado (Sin Uso)

1. **`shared/lib/auth/`**: Sistema de autenticación no implementado
2. **`shared/lib/permissions/`**: Sistema de permisos no implementado
3. **`shared/lib/availability/availability-calculator.ts`**: Integrado directamente en `useAvailability`

### 🔄 Código Consolidado

1. **Cálculo de disponibilidad**: Movido de `availability-calculator.ts` a `useAvailability.ts`
   - Eliminada abstracción innecesaria
   - Código más directo y mantenible

2. **Employee Service**: Eliminados métodos sin uso
   - `getBySkills()` → No usado
   - `getByLocation()` → No usado
   - `getAvailable()` → No usado

### ✅ Mejoras de Código

1. **Validaciones**: Centralizadas en `validation-utils.ts`
2. **Formularios**: Lógica separada en hooks reutilizables
3. **Componentes**: Divididos en secciones mantenibles
4. **Documentación**: README en cada entidad

---

## Flujo de Datos

### Gestión de Estado

```
Component (UI)
    ↓
Custom Hook (useEmployees, useEmployeeSearch)
    ↓
Service Layer (employee-service)
    ↓
Mock Data (employee-mock)
```

### Ejemplo: Crear Empleado

```typescript
// 1. Usuario completa formulario
<EmployeeForm onSave={handleSave} />

// 2. Page llama al hook
const { createEmployee } = useEmployees();
handleSave(data);

// 3. Hook llama al servicio
const newEmployee = employeeService.create(data);

// 4. Servicio actualiza mock data
employees.push({ ...data, id: generateId() });

// 5. Hook actualiza estado local
loadEmployees();
```

---

## Guías de Desarrollo

### Agregar una Nueva Feature

1. Crear carpeta en `src/features/nombre-feature/`
2. Estructura recomendada:
   ```
   nombre-feature/
   ├── index.ts
   ├── hooks/
   ├── lib/
   └── ui/
   ```
3. Exportar solo lo necesario en `index.ts`
4. Usar entities existentes vía sus servicios

### Agregar una Nueva Entidad

1. Crear carpeta en `src/entities/nombre-entidad/`
2. Estructura obligatoria:
   ```
   nombre-entidad/
   ├── README.md
   ├── api/
   │   ├── nombre-entidad-service.ts
   │   └── index.ts
   └── model/
       ├── types.ts
       └── nombre-entidad-mock.ts
   ```
3. Documentar en README.md
4. Implementar servicio CRUD
5. Crear tipos TypeScript

### Agregar un Componente Compartido

1. Ubicar en `src/shared/ui/`
2. Hacerlo genérico y reutilizable
3. Exportar en `index.ts`
4. Documentar props con JSDoc

### Convenciones de Código

- **Nombres de archivos**: PascalCase para componentes, kebab-case para otros
- **Hooks**: Prefijo `use` (useEmployees, useAvailability)
- **Tipos**: Sufijo descriptivo (Employee, CreateEmployeeDTO)
- **Servicios**: Sufijo `-service` (employee-service.ts)
- **Exports**: Usar `index.ts` para encapsular

---

## Estado del Proyecto

### ✅ Completado
- [x] Arquitectura FSD implementada
- [x] Gestión completa de empleados
- [x] Búsqueda y filtrado de empleados
- [x] Cálculo de disponibilidad
- [x] Componentes UI reutilizables
- [x] Optimización de código
- [x] Documentación de arquitectura

### 🔜 Por Implementar
- [ ] Gestión de proyectos
- [ ] Gestión de clientes
- [ ] Sistema de asignaciones
- [ ] Gestión de vacaciones
- [ ] Peticiones de staffing
- [ ] Dashboards y reportes
- [ ] Backend real (actualmente mock)
- [ ] Autenticación y permisos
- [ ] Tests unitarios e integración

---

## Conclusión

Este proyecto está construido con una arquitectura sólida y escalable que facilita:

- ✅ **Mantenibilidad**: Código organizado y bien estructurado
- ✅ **Escalabilidad**: Fácil agregar nuevas features
- ✅ **Claridad**: Separación clara de responsabilidades
- ✅ **Reutilización**: Componentes y lógica compartida
- ✅ **Documentación**: Cada parte está documentada

El código está optimizado, sin duplicados ni funcionalidad en desuso, listo para crecer según las necesidades del negocio.
