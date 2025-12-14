# Estructura del Proyecto

Sistema de Control Financiero para Salón de Belleza - Next.js 14+ con App Router

## Estructura de Carpetas

```
sistema-gastos/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx              # Página de inicio de sesión
│   │   └── layout.tsx                # Layout para rutas de autenticación
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx                # Layout principal con sidebar/navbar
│   │   ├── page.tsx                  # Dashboard principal
│   │   │
│   │   ├── movimientos/
│   │   │   ├── page.tsx              # Lista de movimientos
│   │   │   ├── nuevo/
│   │   │   │   └── page.tsx          # Crear movimiento
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Detalle de movimiento
│   │   │
│   │   ├── cuentas/
│   │   │   ├── page.tsx              # Lista de cuentas
│   │   │   ├── nueva/
│   │   │   │   └── page.tsx          # Crear cuenta
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Editar cuenta
│   │   │
│   │   └── categorias/
│   │       ├── page.tsx              # Lista de categorías
│   │       ├── nueva/
│   │       │   └── page.tsx          # Crear categoría
│   │       └── [id]/
│   │           └── page.tsx          # Editar categoría
│   │
│   ├── api/
│   │   ├── movimientos/
│   │   │   ├── route.ts              # GET, POST movimientos
│   │   │   └── [id]/
│   │   │       └── route.ts          # GET, PATCH, DELETE movimiento
│   │   ├── cuentas/
│   │   │   └── route.ts              # CRUD cuentas
│   │   ├── categorias/
│   │   │   └── route.ts              # CRUD categorías
│   │   └── export/
│   │       └── route.ts              # Exportar CSV
│   │
│   ├── layout.tsx                    # Root layout
│   └── globals.css                   # Estilos globales
│
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── dialog.tsx
│   │   ├── badge.tsx
│   │   └── chart.tsx                 # Componente de gráficos
│   │
│   ├── layout/
│   │   ├── sidebar.tsx               # Barra lateral de navegación
│   │   ├── navbar.tsx                # Barra superior
│   │   └── user-menu.tsx             # Menú de usuario
│   │
│   ├── dashboard/
│   │   ├── stats-card.tsx            # Tarjeta de estadísticas
│   │   ├── income-chart.tsx          # Gráfico de ingresos
│   │   ├── expense-chart.tsx         # Gráfico de egresos
│   │   └── recent-movements.tsx      # Movimientos recientes
│   │
│   ├── movimientos/
│   │   ├── movement-form.tsx         # Formulario de movimiento
│   │   ├── movement-list.tsx         # Lista de movimientos
│   │   ├── movement-filters.tsx      # Filtros de búsqueda
│   │   └── movement-type-selector.tsx # Selector de tipo
│   │
│   ├── cuentas/
│   │   ├── account-form.tsx          # Formulario de cuenta
│   │   ├── account-card.tsx          # Tarjeta de cuenta con saldo
│   │   └── account-list.tsx          # Lista de cuentas
│   │
│   └── categorias/
│       ├── category-form.tsx         # Formulario de categoría
│       ├── category-tree.tsx         # Árbol de categorías
│       └── category-list.tsx         # Lista de categorías
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Cliente de Supabase (browser)
│   │   ├── server.ts                 # Cliente de Supabase (server)
│   │   └── middleware.ts             # Middleware de autenticación
│   │
│   ├── utils/
│   │   ├── format.ts                 # Formateo de moneda, fechas
│   │   ├── validation.ts             # Validaciones de formularios
│   │   └── export.ts                 # Utilidades de exportación
│   │
│   └── hooks/
│       ├── use-user.ts               # Hook para usuario actual
│       ├── use-movements.ts          # Hook para movimientos
│       ├── use-accounts.ts           # Hook para cuentas
│       └── use-categories.ts         # Hook para categorías
│
├── types/
│   ├── database.ts                   # Tipos generados de Supabase
│   ├── models.ts                     # Modelos de negocio
│   └── api.ts                        # Tipos de API
│
├── database/
│   ├── schema.sql                    # Esquema de base de datos
│   ├── rls_policies.sql              # Políticas RLS
│   └── queries.sql                   # Queries y funciones
│
├── docs/
│   ├── project_structure.md          # Este archivo
│   ├── business_logic.md             # Lógica de negocio
│   ├── auth_flow.md                  # Flujo de autenticación
│   └── screens_design.md             # Diseño de pantallas
│
├── public/
│   ├── icons/                        # Iconos personalizados
│   └── images/                       # Imágenes
│
├── .env.local                        # Variables de entorno
├── .env.example                      # Ejemplo de variables
├── middleware.ts                     # Middleware de Next.js
├── next.config.js                    # Configuración de Next.js
├── tailwind.config.js                # Configuración de Tailwind
├── tsconfig.json                     # Configuración de TypeScript
└── package.json                      # Dependencias

```

## Dependencias Principales

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/supabase-js": "^2.38.0",
    "@supabase/auth-helpers-nextjs": "^0.8.0",
    "recharts": "^2.10.0",
    "date-fns": "^2.30.0",
    "zod": "^3.22.0",
    "react-hook-form": "^7.48.0",
    "@hookform/resolvers": "^3.3.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "tailwindcss": "^3.3.0",
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

## Convenciones de Código

### Nomenclatura
- **Componentes**: PascalCase (`MovementForm.tsx`)
- **Utilidades**: camelCase (`formatCurrency.ts`)
- **Tipos**: PascalCase con prefijo `T` (`TMovement`)
- **Interfaces**: PascalCase con prefijo `I` (`IMovementForm`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_AMOUNT`)

### Organización de Archivos
- Un componente por archivo
- Colocar tipos relacionados en el mismo archivo si son específicos
- Exportar tipos compartidos desde `types/`
- Agrupar por feature, no por tipo de archivo

### Estructura de Componentes
```typescript
// 1. Imports
import { useState } from 'react'
import { Button } from '@/components/ui/button'

// 2. Types
interface MovementFormProps {
  onSubmit: (data: TMovement) => void
}

// 3. Component
export function MovementForm({ onSubmit }: MovementFormProps) {
  // 3.1 Hooks
  const [loading, setLoading] = useState(false)
  
  // 3.2 Handlers
  const handleSubmit = () => {}
  
  // 3.3 Render
  return <form>...</form>
}
```

## Variables de Entorno

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Scripts de Desarrollo

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "db:types": "supabase gen types typescript --project-id your_project_id > types/database.ts"
  }
}
```

## Rutas de la Aplicación

### Públicas
- `/login` - Inicio de sesión

### Protegidas (requieren autenticación)
- `/` - Dashboard principal
- `/movimientos` - Lista de movimientos
- `/movimientos/nuevo` - Crear movimiento
- `/cuentas` - Gestión de cuentas
- `/categorias` - Gestión de categorías

### API Routes
- `GET /api/movimientos` - Listar movimientos
- `POST /api/movimientos` - Crear movimiento
- `PATCH /api/movimientos/[id]` - Anular movimiento
- `GET /api/cuentas` - Listar cuentas
- `GET /api/export` - Exportar CSV

## Notas de Implementación

1. **Autenticación**: Usar Supabase Auth con middleware de Next.js
2. **Estado**: React hooks + Supabase realtime para datos en tiempo real
3. **Formularios**: React Hook Form + Zod para validación
4. **Gráficos**: Recharts para visualizaciones
5. **Estilos**: Tailwind CSS con componentes reutilizables
6. **Tipos**: TypeScript estricto, generar tipos desde Supabase
