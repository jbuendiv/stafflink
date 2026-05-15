# Entidad: Cliente

## Estado: 🔜 Preparación para Funcionalidad Futura

Esta entidad está estructurada y lista para soportar la funcionalidad de gestión de clientes.

## Descripción

La entidad `Cliente` representa a los clientes de la empresa que solicitan servicios y proyectos.

## Campos Principales

- `id`: Identificador único
- `field_nombre`: Nombre del cliente
- `field_descripcion`: Descripción del cliente
- `field_estado`: Estado del cliente (activo/inactivo)

## Uso Actual

⚠️ **Preparada pero sin uso activo**

Esta entidad está lista con:
- ✅ Tipos TypeScript definidos
- ✅ Mock data disponible
- ✅ Servicio CRUD completo

## Funcionalidad Futura

Cuando se implemente la gestión de clientes, esta entidad soportará:
- Creación y edición de clientes
- Listado de clientes activos/inactivos
- Asociación de clientes con proyectos
- Historial de proyectos por cliente
- Datos de contacto y facturación

## Arquitectura

```
cliente/
├── api/
│   ├── cliente-service.ts     # CRUD operations
│   └── index.ts
└── model/
    ├── types.ts               # TypeScript types
    └── cliente-mock.ts        # Mock data
```

## Relaciones

- **Proyecto**: Un cliente puede tener múltiples proyectos
- **Petición Staffing**: Las peticiones están asociadas a proyectos de clientes
