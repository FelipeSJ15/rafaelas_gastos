# README - Sistema de Control Financiero

Sistema web de control de ingresos, egresos y saldos para salón de belleza.

## 📋 Descripción

Sistema interno de control financiero diseñado específicamente para un salón de belleza pequeño. Permite gestionar ingresos, egresos, transferencias entre cuentas, y visualizar el estado financiero del negocio de forma clara y simple.

**No es un sistema de contabilidad tradicional ni facturación electrónica.** Es una herramienta interna enfocada en claridad operativa y control de flujo de caja.

## 🎯 Características V1

- ✅ Gestión de movimientos (ingresos, egresos, transferencias)
- ✅ Múltiples cuentas (efectivo, banco, tarjeta, billetera)
- ✅ Categorización de ingresos y egresos
- ✅ Dashboard con métricas y gráficos
- ✅ Exportación a CSV
- ✅ Autenticación con roles (admin/usuario)
- ✅ Control de acceso granular (RLS)

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14+ (App Router)
- **Backend**: Supabase (PostgreSQL + Auth)
- **Estilos**: Tailwind CSS
- **Gráficos**: Recharts
- **Lenguaje**: TypeScript
- **Validación**: Zod + React Hook Form

## 📁 Estructura del Proyecto

```
sistema-gastos/
├── database/           # Esquemas SQL y políticas RLS
├── docs/              # Documentación técnica
├── app/               # Aplicación Next.js (futuro)
└── README.md          # Este archivo
```

## 📚 Documentación

### Base de Datos
- [schema.sql](database/schema.sql) - Esquema completo de la base de datos
- [rls_policies.sql](database/rls_policies.sql) - Políticas de seguridad Row Level Security
- [queries.sql](database/queries.sql) - Queries y funciones SQL clave

### Diseño y Arquitectura
- [project_structure.md](docs/project_structure.md) - Estructura de carpetas y convenciones
- [business_logic.md](docs/business_logic.md) - Reglas de negocio y pseudocódigo
- [auth_flow.md](docs/auth_flow.md) - Flujo de autenticación y roles
- [screens_design.md](docs/screens_design.md) - Wireframes de pantallas

## 🧩 Modelo Conceptual

El sistema separa estrictamente tres conceptos:

1. **MOVIMIENTO** = Hecho financiero (qué pasó)
2. **CATEGORÍA** = Clasificación (por qué pasó)
3. **CUENTA** = Ubicación del dinero (dónde está)

### Tipos de Movimientos

#### Ingreso
- Dinero que entra al negocio
- Solo requiere cuenta destino
- Suma al resultado del período

#### Egreso
- Dinero que sale del negocio
- Solo requiere cuenta origen
- Resta del resultado del período

#### Transferencia
- Movimiento entre cuentas internas
- Requiere cuenta origen y destino
- **NO afecta el resultado** (no es ingreso ni egreso)

## 🔐 Roles y Permisos

### Admin
- Control total del sistema
- Puede crear, editar y eliminar cuentas y categorías
- Puede anular movimientos
- Puede gestionar usuarios

### Usuario
- Puede crear y ver movimientos
- Puede ver cuentas y categorías (solo lectura)
- No puede eliminar ni anular

## 🚀 Próximos Pasos

1. **Setup del proyecto Next.js**
   ```bash
   npx create-next-app@latest sistema-gastos --typescript --tailwind --app
   ```

2. **Configurar Supabase**
   - Crear proyecto en Supabase
   - Aplicar schema.sql
   - Aplicar rls_policies.sql
   - Configurar variables de entorno

3. **Implementar componentes base**
   - Sistema de diseño (botones, inputs, cards)
   - Layout principal (sidebar, navbar)
   - Componentes de autenticación

4. **Desarrollar funcionalidades**
   - Dashboard
   - Gestión de movimientos
   - Gestión de cuentas
   - Gestión de categorías
   - Exportación CSV

## 📊 Reglas de Negocio Clave

- ✅ Los saldos se calculan dinámicamente (nunca se almacenan)
- ✅ Los movimientos son inmutables (solo se anulan)
- ✅ Las transferencias NO afectan utilidades
- ✅ Todas las operaciones tienen auditoría (created_by, created_at)
- ✅ Soft deletes para cuentas y categorías (flag `activa`)

## 🎨 Principios de Diseño

- **Simplicidad**: Interfaz clara y sin elementos innecesarios
- **Claridad**: Información financiera fácil de entender
- **Rapidez**: Crear movimientos en pocos clicks
- **Confiabilidad**: Datos precisos y trazables
- **Accesibilidad**: Usable por personas no técnicas

## 📝 Licencia

Proyecto privado para uso interno del salón de belleza.

---

**Versión**: 1.0  
**Última actualización**: Diciembre 2024
