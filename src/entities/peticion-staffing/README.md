# Entidad: Petición Staffing

## Estado: 🔜 Preparación para Funcionalidad Futura

Esta entidad está estructurada y lista para soportar la funcionalidad de gestión de peticiones de staffing.

## Descripción

La entidad `PeticionStaffing` representa las solicitudes de recursos/empleados para proyectos. Es el punto de partida para el proceso de asignación de personal.

## Campos Principales

- `id`: Identificador único
- `field_proyecto`: Proyecto que solicita el recurso
- `field_rol`: Rol técnico solicitado
- `field_horas_requeridas`: Horas necesarias
- `field_fecha_inicio`: Inicio previsto
- `field_fecha_fin`: Fin previsto
- `field_estado`: Estado de la petición (Pendiente, Asignada, Cerrada)
- `field_prioridad`: Prioridad de la petición

## Uso Actual

⚠️ **Preparada pero sin uso activo**

Esta entidad está lista con:
- ✅ Tipos TypeScript definidos
- ✅ Mock data disponible
- ✅ Servicio CRUD completo

## Funcionalidad Futura

Cuando se implemente la gestión de staffing, esta entidad soportará:
- Creación de nuevas peticiones de recursos
- Workflow de aprobación de peticiones
- Búsqueda de candidatos que cumplan requisitos
- Matching automático de empleados con peticiones
- Asignación de empleados a peticiones
- Seguimiento del estado de peticiones
- Reportes de tiempo de cobertura

## Arquitectura

```
peticion-staffing/
├── api/
│   ├── peticion-staffing-service.ts  # CRUD operations
│   └── index.ts
└── model/
    ├── types.ts                      # TypeScript types
    └── peticion-staffing-mock.ts     # Mock data
```

## Relaciones

- **Proyecto**: Cada petición pertenece a un proyecto
- **Asignación**: Una petición resulta en una o más asignaciones
- **Empleado**: Los empleados son candidatos para cubrir peticiones
