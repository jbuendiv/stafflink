# Entidad: Vacaciones

## Estado: 🔜 Preparación para Funcionalidad Futura

Esta entidad está estructurada y lista para soportar la funcionalidad de gestión de vacaciones y ausencias.

## Descripción

La entidad `Vacaciones` representa los periodos de ausencia de los empleados (vacaciones, bajas, permisos). Es esencial para el cálculo preciso de disponibilidad.

## Campos Principales

- `id`: Identificador único
- `field_empleado`: ID del empleado
- `field_fecha_inicio`: Fecha de inicio de la ausencia
- `field_fecha_fin`: Fecha de finalización de la ausencia
- `field_tipo`: Tipo de ausencia (Vacaciones, Baja médica, Permiso, etc.)
- `field_estado`: Estado de la solicitud (Pendiente, Aprobada, Rechazada)
- `field_comentarios`: Notas adicionales

## Uso Actual

⚠️ **Preparada pero sin uso activo**

Esta entidad está lista con:
- ✅ Tipos TypeScript definidos
- ✅ Mock data disponible
- ✅ Servicio CRUD completo

## Funcionalidad Futura

Cuando se implemente la gestión de vacaciones, esta entidad soportará:
- Solicitud de vacaciones por empleados
- Workflow de aprobación de vacaciones
- Visualización de calendario de ausencias
- Cálculo de disponibilidad real descontando ausencias
- Gestión de diferentes tipos de permisos
- Reportes de días disponibles vs consumidos
- Conflictos en asignaciones por ausencias

## Impacto en Disponibilidad

Cuando se integre completamente:
- El cálculo de disponibilidad en `useAvailability` deberá descontar las horas de vacaciones
- Los reportes mostrarán disponibilidad neta (capacidad - asignaciones - vacaciones)
- Las búsquedas de empleados considerarán ausencias programadas

## Arquitectura

```
vacaciones/
├── api/
│   ├── vacaciones-service.ts  # CRUD operations
│   └── index.ts
└── model/
    ├── types.ts               # TypeScript types
    └── vacaciones-mock.ts     # Mock data
```

## Relaciones

- **Empleado**: Cada ausencia pertenece a un empleado
- **MesHoras**: Las ausencias reducen la disponibilidad del mes
- **Asignación**: Las ausencias pueden generar conflictos con asignaciones existentes
