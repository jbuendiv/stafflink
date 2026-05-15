# Entidad: Mes Horas

## Estado: ✅ En Uso Activo

Esta entidad es fundamental para el cálculo de disponibilidad de empleados.

## Descripción

La entidad `MesHoras` representa el calendario de horas disponibles por mes y oficina. Define cuántas horas laborables hay en un mes específico para cada ubicación.

## Campos Principales

- `id`: Identificador único
- `field_mes_ano`: Fecha del mes (formato: YYYY-MM-DD)
- `field_horas`: Total de horas laborables en ese mes
- `field_oficina`: Oficina a la que aplica el calendario

## Uso Actual

✅ **Actualmente en uso por:**
- `useAvailability` hook - Base para calcular disponibilidad
- `SearchEmployeesPage` - Determina horas disponibles por mes
- Cálculo de asignaciones - Referencia temporal para asignaciones

## Importancia

Esta entidad es crítica porque:
- Define el "techo" de horas disponibles por empleado
- Varía según la oficina (diferentes países, festivos)
- Es la base para calcular porcentajes de disponibilidad
- Permite ajustar calendarios por eventos especiales

## Arquitectura

```
mes-horas/
├── api/
│   ├── mes-horas-service.ts   # CRUD operations
│   └── index.ts
└── model/
    ├── types.ts               # TypeScript types
    └── mes-horas-mock.ts      # Mock data con calendarios por oficina
```

## Relaciones

- **Asignación**: Las asignaciones referencian un mes específico
- **Empleado**: Los empleados pertenecen a una oficina con su calendario
