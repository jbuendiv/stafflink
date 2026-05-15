# Entidad: Proyecto

## Estado: 🔜 Preparación para Funcionalidad Futura

Esta entidad está estructurada y lista para soportar la funcionalidad de gestión de proyectos.

## Descripción

La entidad `Proyecto` representa los proyectos en los que trabajan los empleados. Es la entidad central que conecta clientes, empleados y asignaciones.

## Campos Principales

- `id`: Identificador único
- `field_nombre`: Nombre del proyecto
- `field_cliente`: Cliente propietario del proyecto
- `field_descripcion`: Descripción del proyecto
- `field_fecha_inicio`: Fecha de inicio
- `field_fecha_fin`: Fecha estimada de finalización
- `field_estado`: Estado del proyecto (Activo, Pausado, Cerrado)
- `field_responsable`: Líder/responsable del proyecto

## Uso Actual

⚠️ **Preparada pero sin uso activo**

Esta entidad está lista con:
- ✅ Tipos TypeScript definidos
- ✅ Mock data disponible
- ✅ Servicio CRUD completo

## Funcionalidad Futura

Cuando se implemente la gestión de proyectos, esta entidad soportará:
- Creación y edición de proyectos
- Visualización de proyectos activos/históricos
- Asignación de equipo al proyecto
- Seguimiento de horas consumidas vs presupuestadas
- Gestión de estados del proyecto
- Reportes de rentabilidad y utilización
- Dashboard de proyectos

## Arquitectura

```
proyecto/
├── api/
│   ├── proyecto-service.ts   # CRUD operations
│   └── index.ts
└── model/
    ├── types.ts              # TypeScript types
    └── proyecto-mock.ts      # Mock data
```

## Relaciones

- **Cliente**: Cada proyecto pertenece a un cliente
- **Asignación**: Los empleados se asignan a proyectos con horas específicas
- **Petición Staffing**: Las peticiones de recursos pertenecen a proyectos
- **Empleado**: Los empleados trabajan en uno o más proyectos simultáneamente
