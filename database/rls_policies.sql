-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Sistema de Control Financiero
-- ============================================
--
-- ROLES:
-- - admin: acceso completo a todo
-- - usuario: crear y ver movimientos, no eliminar cuentas/categorías
--
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cuentas ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimientos ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS PARA: profiles
-- ============================================

-- Los usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

-- Los admins pueden ver todos los perfiles
CREATE POLICY "Admins can view all profiles"
    ON profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Los admins pueden actualizar perfiles
CREATE POLICY "Admins can update profiles"
    ON profiles FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Los admins pueden crear perfiles
CREATE POLICY "Admins can insert profiles"
    ON profiles FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- ============================================
-- POLÍTICAS PARA: cuentas
-- ============================================

-- Todos los usuarios autenticados pueden ver cuentas activas
CREATE POLICY "Authenticated users can view active accounts"
    ON cuentas FOR SELECT
    USING (auth.uid() IS NOT NULL AND activa = true);

-- Los admins pueden ver todas las cuentas (incluso inactivas)
CREATE POLICY "Admins can view all accounts"
    ON cuentas FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Los admins pueden crear cuentas
CREATE POLICY "Admins can insert accounts"
    ON cuentas FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Los admins pueden actualizar cuentas
CREATE POLICY "Admins can update accounts"
    ON cuentas FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Los admins pueden eliminar cuentas (soft delete: activa = false)
CREATE POLICY "Admins can delete accounts"
    ON cuentas FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- ============================================
-- POLÍTICAS PARA: categorias
-- ============================================

-- Todos los usuarios autenticados pueden ver categorías activas
CREATE POLICY "Authenticated users can view active categories"
    ON categorias FOR SELECT
    USING (auth.uid() IS NOT NULL AND activa = true);

-- Los admins pueden ver todas las categorías
CREATE POLICY "Admins can view all categories"
    ON categorias FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Los admins pueden crear categorías
CREATE POLICY "Admins can insert categories"
    ON categorias FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Los admins pueden actualizar categorías
CREATE POLICY "Admins can update categories"
    ON categorias FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Los admins pueden eliminar categorías
CREATE POLICY "Admins can delete categories"
    ON categorias FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- ============================================
-- POLÍTICAS PARA: movimientos
-- ============================================

-- Todos los usuarios autenticados pueden ver movimientos
CREATE POLICY "Authenticated users can view movements"
    ON movimientos FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- Todos los usuarios autenticados pueden crear movimientos
CREATE POLICY "Authenticated users can insert movements"
    ON movimientos FOR INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL AND
        created_by = auth.uid()
    );

-- Solo admins pueden anular movimientos (UPDATE)
CREATE POLICY "Admins can update movements"
    ON movimientos FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Solo admins pueden eliminar movimientos (NO RECOMENDADO, usar anulación)
CREATE POLICY "Admins can delete movements"
    ON movimientos FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- ============================================
-- FUNCIÓN HELPER: Verificar si usuario es admin
-- ============================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND rol = 'admin' AND activo = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================

-- 1. Las políticas RLS se evalúan con AND, no OR
--    Por eso hay políticas separadas para admins y usuarios
--
-- 2. USING se aplica a SELECT, UPDATE, DELETE
--    WITH CHECK se aplica a INSERT, UPDATE
--
-- 3. Los movimientos NO deben editarse, solo anularse
--    La política de UPDATE existe solo para el flag 'anulado'
--
-- 4. Para desactivar cuentas/categorías, usar soft delete
--    (activa = false) en lugar de DELETE físico
