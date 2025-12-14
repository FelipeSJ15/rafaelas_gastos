# Sistema de Control Financiero - Setup Rápido

## 🚀 Inicio Rápido

### 1. Configurar Variables de Entorno

Crear archivo `.env.local` en la carpeta `app/` con el siguiente contenido:

```bash
# Supabase - Obtener de tu proyecto en supabase.com
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui

# Solo para operaciones admin (mantener secreto)
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui

# URL de la aplicación
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Configurar Base de Datos en Supabase

1. Ir a [supabase.com](https://supabase.com) y crear un proyecto
2. En el SQL Editor, ejecutar los siguientes archivos en orden:
   - `../database/schema.sql`
   - `../database/rls_policies.sql`
   - `../database/queries.sql`

### 3. Crear Usuario Administrador

En Supabase SQL Editor:

```sql
-- 1. Crear usuario en Authentication > Users
-- 2. Copiar el User ID
-- 3. Ejecutar:

INSERT INTO profiles (id, email, nombre_completo, rol, activo)
VALUES (
  'USER_ID_AQUI',
  'tu-email@ejemplo.com',
  'Tu Nombre',
  'admin',
  true
);
```

### 4. Instalar Dependencias (si aún no está hecho)

```bash
npm install
```

### 5. Ejecutar la Aplicación

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## 📝 Credenciales de Prueba

Usar el email y contraseña del usuario administrador que creaste en Supabase.

## 🎯 Funcionalidades Implementadas

- ✅ Autenticación con Supabase
- ✅ Dashboard con métricas del mes
- ✅ Sidebar con navegación
- ✅ Protección de rutas
- ✅ Roles (admin/usuario)

## 📁 Estructura

```
app/
├── app/
│   ├── (dashboard)/      # Rutas protegidas
│   │   ├── layout.tsx    # Layout con sidebar
│   │   └── page.tsx      # Dashboard principal
│   └── login/
│       └── page.tsx      # Página de login
├── components/
│   ├── ui/               # Componentes base
│   └── layout/           # Sidebar, navbar
├── lib/
│   ├── supabase/         # Clientes de Supabase
│   ├── utils/            # Utilidades
│   └── hooks/            # Custom hooks
└── types/                # TypeScript types
```

## 🔧 Próximos Pasos

1. Configurar variables de entorno
2. Aplicar schema de base de datos
3. Crear usuario admin
4. Probar login
5. Implementar páginas de movimientos, cuentas y categorías

## 🐛 Solución de Problemas

### Error: "Invalid API key"
- Verificar que las variables de entorno estén correctas
- Reiniciar el servidor de desarrollo

### Error: "relation does not exist"
- Verificar que el schema SQL se aplicó correctamente en Supabase

### No puedo hacer login
- Verificar que el usuario existe en Authentication
- Verificar que el perfil existe en la tabla `profiles`
- Verificar que `activo = true`

## 📚 Documentación Completa

Ver `../docs/INDEX.md` para documentación completa del sistema.
