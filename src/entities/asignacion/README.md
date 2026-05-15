# Entidad: Asignación

## Estado: 🔜 Preparación para Funcionalidad Futura

Esta entidad está estructurada y lista para soportar la funcionalidad de gestión de asignaciones de empleados a proyectos.

## Descripción

La entidad `Asignacion` representa la asignación de horas de un empleado a un proyecto en un mes específico.

## Campos Principales

- `id`: Identificador único
- `field_empleado`: ID del empleado asignado
- `field_proyecto`: ID del proyecto
- `field_mes_horas`: ID del mes/calendario
- `field_horas`: Horas asignadas
- `field_estado`: Estado de la asignación (Confirmado, Forecast, etc.)

## Uso Actual

✅ **Actualmente en uso por:**
- `useAvailability` hook - Calcula disponibilidad de empleados
- `SearchEmployeesPage` - Muestra empleados disponibles

## Funcionalidad Futura

Cuando se implemente la gestión completa de asignaciones, esta entidad soportará:
- Creación de nuevas asignaciones
- Edición de horas asignadas
- Cambio de estado de asignaciones
- Gestión de forecasts vs confirmaciones
- Reportes de utilización de empleados

## Arquitectura

```
asignacion/
├── api/
│   ├── asignacion-service.ts  # CRUD operations
│   └── index.ts
└── model/
    ├── types.ts               # TypeScript types
    └── asignacion-mock.ts     # Mock data
