# 📚 Índice de Documentación

Guía completa del Sistema de Control Financiero para Salón de Belleza.

## 🚀 Inicio Rápido

1. **[README.md](../README.md)** - Visión general del proyecto
2. **[INSTALL.md](../INSTALL.md)** - Guía de instalación paso a paso

## 📊 Base de Datos

### Archivos SQL
- **[schema.sql](../database/schema.sql)** - Esquema completo de la base de datos
  - Tablas: profiles, cuentas, categorias, movimientos
  - Constraints y validaciones
  - Datos iniciales
  - Triggers

- **[rls_policies.sql](../database/rls_policies.sql)** - Políticas de seguridad
  - Políticas para admin
  - Políticas para usuario
  - Control de acceso granular

- **[queries.sql](../database/queries.sql)** - Queries y funciones
  - `calcular_saldo_cuenta()` - Saldo de una cuenta
  - `calcular_saldo_total()` - Saldo consolidado
  - `reporte_ingresos_egresos()` - Reporte por período
  - `movimientos_por_categoria()` - Agrupación por categoría
  - `anular_movimiento()` - Anular un movimiento
  - Views optimizadas

### Documentación
- **[database_diagram.md](database_diagram.md)** - Diagrama ER y relaciones
  - Modelo entidad-relación
  - Relaciones detalladas
  - Constraints importantes
  - Índices de optimización
  - Ejemplos de datos

## 🏗️ Arquitectura

- **[project_structure.md](project_structure.md)** - Estructura del proyecto
  - Organización de carpetas
  - Convenciones de código
  - Dependencias
  - Variables de entorno
  - Scripts de desarrollo

## 💼 Lógica de Negocio

- **[business_logic.md](business_logic.md)** - Reglas de negocio
  - Modelo conceptual
  - Tipos de movimientos (ingreso, egreso, transferencia)
  - Pseudocódigo de operaciones clave
  - Validaciones
  - Cálculos importantes
  - Flujos de usuario

## 🔐 Autenticación

- **[auth_flow.md](auth_flow.md)** - Flujo de autenticación
  - Arquitectura de autenticación
  - Roles y permisos (admin/usuario)
  - Flujo de login/logout
  - Middleware de Next.js
  - Protección de rutas
  - Hooks de usuario
  - Seguridad y mejores prácticas

## 🎨 Diseño de Interfaz

- **[screens_design.md](screens_design.md)** - Wireframes y diseño
  - Login
  - Dashboard
  - Gestión de movimientos
  - Gestión de cuentas
  - Gestión de categorías
  - Detalle de movimiento
  - Paleta de colores
  - Iconografía
  - Responsive design
  - Accesibilidad

## 📋 Entregables por Fase

### ✅ Fase 1: Planificación y Diseño (COMPLETADO)
- [x] Plan de implementación
- [x] Esquema de base de datos
- [x] Políticas RLS
- [x] Queries clave
- [x] Estructura de carpetas

### ✅ Fase 2: Lógica de Negocio (COMPLETADO)
- [x] Reglas de negocio documentadas
- [x] Flujos de autenticación
- [x] Pseudocódigo de operaciones críticas

### ✅ Fase 3: Diseño de Interfaz (COMPLETADO)
- [x] Wireframes de pantallas
- [x] Flujos de usuario

### ⏳ Fase 4: Implementación (PENDIENTE)
- [ ] Setup del proyecto Next.js
- [ ] Configuración de Supabase
- [ ] Implementación de autenticación
- [ ] Desarrollo de componentes
- [ ] Desarrollo de funcionalidades
- [ ] Testing y validación

## 🔑 Conceptos Clave

### Modelo Conceptual
```
MOVIMIENTO (qué pasó) → CATEGORÍA (por qué) → CUENTA (dónde)
```

### Tipos de Movimientos

| Tipo | Cuenta Origen | Cuenta Destino | Categoría | Afecta Utilidades |
|------|---------------|----------------|-----------|-------------------|
| Ingreso | ❌ | ✅ | ✅ Requerida | ✅ Sí |
| Egreso | ✅ | ❌ | ✅ Requerida | ✅ Sí |
| Transferencia | ✅ | ✅ | ⚪ Opcional | ❌ No |

### Roles y Permisos

| Acción | Admin | Usuario |
|--------|-------|---------|
| Ver movimientos | ✅ | ✅ |
| Crear movimientos | ✅ | ✅ |
| Anular movimientos | ✅ | ❌ |
| Gestionar cuentas | ✅ | ❌ |
| Gestionar categorías | ✅ | ❌ |
| Gestionar usuarios | ✅ | ❌ |

## 📐 Reglas Fundamentales

1. **Saldos Dinámicos**: Los saldos se calculan en tiempo real, nunca se almacenan
2. **Inmutabilidad**: Los movimientos NO se editan, solo se anulan
3. **Transferencias**: NO afectan el resultado (ingresos - egresos)
4. **Auditoría**: Todos los movimientos tienen `created_by` y `created_at`
5. **Soft Deletes**: Cuentas y categorías se desactivan, no se eliminan

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14+ (App Router), React, TypeScript
- **Backend**: Supabase (PostgreSQL + Auth)
- **Estilos**: Tailwind CSS
- **Gráficos**: Recharts
- **Validación**: Zod + React Hook Form
- **Idioma**: Español

## 📖 Cómo Usar Esta Documentación

### Para Desarrolladores
1. Leer **README.md** para entender el proyecto
2. Seguir **INSTALL.md** para configurar el entorno
3. Revisar **database_diagram.md** para entender el modelo de datos
4. Leer **business_logic.md** para entender las reglas de negocio
5. Consultar **project_structure.md** para la organización del código

### Para Diseñadores
1. Revisar **screens_design.md** para wireframes y especificaciones
2. Consultar paleta de colores e iconografía
3. Entender flujos de usuario

### Para Product Owners
1. Leer **README.md** para visión general
2. Revisar **business_logic.md** para reglas de negocio
3. Consultar **screens_design.md** para funcionalidades

## 🔍 Búsqueda Rápida

### ¿Cómo calcular el saldo de una cuenta?
→ [queries.sql](../database/queries.sql) - Función `calcular_saldo_cuenta()`

### ¿Cómo crear un movimiento?
→ [business_logic.md](business_logic.md) - Pseudocódigo: Crear Movimiento

### ¿Cómo funcionan los permisos?
→ [auth_flow.md](auth_flow.md) - Roles y Permisos

### ¿Cómo se ve el dashboard?
→ [screens_design.md](screens_design.md) - Dashboard

### ¿Qué tablas hay en la BD?
→ [schema.sql](../database/schema.sql) o [database_diagram.md](database_diagram.md)

### ¿Cómo instalar el sistema?
→ [INSTALL.md](../INSTALL.md)

## 📞 Soporte

Para dudas o problemas:
1. Revisar esta documentación
2. Consultar logs de Supabase
3. Verificar configuración en `.env.local`

---

**Última actualización**: Diciembre 2024  
**Versión**: 1.0
