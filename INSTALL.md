# Guía de Instalación y Setup

Instrucciones paso a paso para configurar el Sistema de Control Financiero.

## Prerrequisitos

- Node.js 18+ instalado
- Cuenta en Supabase (gratuita)
- Git (opcional)

## Paso 1: Crear Proyecto en Supabase

1. Ir a [supabase.com](https://supabase.com)
2. Crear cuenta o iniciar sesión
3. Click en "New Project"
4. Completar:
   - **Name**: Sistema Control Financiero
   - **Database Password**: (guardar en lugar seguro)
   - **Region**: Seleccionar la más cercana
5. Esperar a que el proyecto se cree (~2 minutos)

## Paso 2: Configurar Base de Datos

### 2.1 Aplicar Schema

1. En Supabase, ir a **SQL Editor**
2. Click en "New Query"
3. Copiar todo el contenido de `database/schema.sql`
4. Pegar en el editor
5. Click en "Run" (▶️)
6. Verificar que se ejecutó sin errores

### 2.2 Aplicar Políticas RLS

1. Nueva query en SQL Editor
2. Copiar contenido de `database/rls_policies.sql`
3. Pegar y ejecutar
4. Verificar ejecución exitosa

### 2.3 Aplicar Queries y Funciones

1. Nueva query en SQL Editor
2. Copiar contenido de `database/queries.sql`
3. Pegar y ejecutar
4. Verificar ejecución exitosa

### 2.4 Verificar Tablas

1. Ir a **Table Editor** en Supabase
2. Deberías ver:
   - ✅ profiles
   - ✅ cuentas
   - ✅ categorias
   - ✅ movimientos

## Paso 3: Crear Usuario Administrador

### 3.1 Crear Usuario en Auth

1. En Supabase, ir a **Authentication** → **Users**
2. Click en "Add user" → "Create new user"
3. Completar:
   - **Email**: tu-email@ejemplo.com
   - **Password**: (contraseña segura)
   - **Auto Confirm User**: ✅ Activar
4. Click en "Create user"
5. **Copiar el User ID** (lo necesitarás)

### 3.2 Asignar Rol Admin

1. Ir a **SQL Editor**
2. Ejecutar esta query (reemplazar con tu User ID):

```sql
-- Reemplazar 'USER_ID_AQUI' con el ID copiado
INSERT INTO profiles (id, email, nombre_completo, rol, activo)
VALUES (
  'USER_ID_AQUI',
  'tu-email@ejemplo.com',
  'Tu Nombre Completo',
  'admin',
  true
);
```

3. Verificar en **Table Editor** → **profiles** que el usuario existe

## Paso 4: Obtener Credenciales de Supabase

1. En Supabase, ir a **Settings** → **API**
2. Copiar:
   - **Project URL** (ej: https://xxxxx.supabase.co)
   - **anon public** key
   - **service_role** key (⚠️ mantener secreta)

## Paso 5: Crear Proyecto Next.js

```bash
# Navegar a la carpeta del proyecto
cd "C:\Users\USUARIO\Pictures\Rafaelas\Sistema de gastos"

# Crear proyecto Next.js
npx create-next-app@latest app --typescript --tailwind --app --no-src-dir

# Responder a las preguntas:
# ✔ Would you like to use ESLint? … Yes
# ✔ Would you like to use Turbopack? … No
# ✔ Would you like to customize the default import alias? … No
```

## Paso 6: Instalar Dependencias

```bash
cd app

# Instalar Supabase
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

# Instalar utilidades
npm install zod react-hook-form @hookform/resolvers
npm install date-fns

# Instalar gráficos
npm install recharts

# Instalar componentes UI (opcional - shadcn/ui)
npx shadcn-ui@latest init
```

## Paso 7: Configurar Variables de Entorno

1. En la carpeta `app/`, crear archivo `.env.local`
2. Copiar contenido de `.env.example`
3. Completar con tus valores de Supabase:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Paso 8: Crear Cliente de Supabase

Crear archivo `app/lib/supabase/client.ts`:

```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const supabase = createClientComponentClient()
```

Crear archivo `app/lib/supabase/server.ts`:

```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const createClient = () => {
  return createServerComponentClient({ cookies })
}
```

## Paso 9: Probar Conexión

Crear archivo `app/app/test/page.tsx`:

```typescript
import { createClient } from '@/lib/supabase/server'

export default async function TestPage() {
  const supabase = createClient()
  
  const { data: cuentas, error } = await supabase
    .from('cuentas')
    .select('*')
  
  if (error) {
    return <div>Error: {error.message}</div>
  }
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test de Conexión</h1>
      <p>Cuentas encontradas: {cuentas?.length || 0}</p>
      <pre className="mt-4 p-4 bg-gray-100 rounded">
        {JSON.stringify(cuentas, null, 2)}
      </pre>
    </div>
  )
}
```

## Paso 10: Ejecutar Aplicación

```bash
npm run dev
```

Abrir navegador en: http://localhost:3000/test

Deberías ver:
- ✅ "Cuentas encontradas: 1" (la cuenta "Caja Chica")
- ✅ JSON con los datos de la cuenta

## Paso 11: Generar Tipos de TypeScript

```bash
# Instalar CLI de Supabase
npm install -g supabase

# Generar tipos
npx supabase gen types typescript --project-id TU_PROJECT_ID > types/database.ts
```

Para obtener tu PROJECT_ID:
1. En Supabase, ir a **Settings** → **General**
2. Copiar **Reference ID**

## Verificación Final

### ✅ Checklist

- [ ] Proyecto Supabase creado
- [ ] Schema aplicado (4 tablas creadas)
- [ ] Políticas RLS aplicadas
- [ ] Funciones SQL aplicadas
- [ ] Usuario admin creado
- [ ] Proyecto Next.js creado
- [ ] Dependencias instaladas
- [ ] Variables de entorno configuradas
- [ ] Conexión a Supabase funcionando
- [ ] Tipos TypeScript generados

## Próximos Pasos

Una vez completado el setup:

1. **Implementar autenticación**
   - Página de login
   - Middleware de Next.js
   - Protección de rutas

2. **Crear componentes base**
   - Sistema de diseño
   - Layout principal
   - Componentes UI

3. **Desarrollar funcionalidades**
   - Dashboard
   - Gestión de movimientos
   - Gestión de cuentas
   - Gestión de categorías

## Solución de Problemas

### Error: "relation does not exist"
- Verificar que el schema se aplicó correctamente
- Revisar en Table Editor que las tablas existen

### Error: "new row violates row-level security policy"
- Verificar que las políticas RLS se aplicaron
- Verificar que el usuario tiene el rol correcto en `profiles`

### Error de conexión
- Verificar variables de entorno en `.env.local`
- Verificar que el proyecto de Supabase está activo
- Revisar que las URLs y keys son correctas

### No aparecen datos
- Verificar que hay datos de prueba en las tablas
- Revisar políticas RLS (puede estar bloqueando acceso)
- Verificar autenticación del usuario

## Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Next.js](https://nextjs.org/docs)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)

## Soporte

Para problemas o dudas:
1. Revisar documentación en `docs/`
2. Verificar logs en consola del navegador
3. Revisar logs en Supabase Dashboard
