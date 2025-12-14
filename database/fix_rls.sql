-- FIX RLS RECURSION
-- El problema es que la política de admin consulta la tabla profiles, 
-- lo que dispara la política de nuevo -> recursión infinita.

-- 1. Asegurar que la función is_admin existe y es SECURITY DEFINER (bypasses RLS)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND rol = 'admin' AND activo = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Eliminar políticas existentes que causan problemas
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;

-- 3. Recrear políticas usando la función segura
CREATE POLICY "Admins can view all profiles"
    ON profiles FOR SELECT
    USING (is_admin());

CREATE POLICY "Admins can update profiles"
    ON profiles FOR UPDATE
    USING (is_admin());

CREATE POLICY "Admins can insert profiles"
    ON profiles FOR INSERT
    WITH CHECK (is_admin());

-- 4. Asegurar que la política básica de usuario existe
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);
