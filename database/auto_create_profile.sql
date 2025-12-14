-- TRIGGER PARA CREAR PERFIL AUTOMÁTICAMENTE
-- Este trigger se ejecutará cada vez que se cree un usuario en Authentication
-- y creará automáticamente su entrada en la tabla 'profiles' con rol 'usuario'.

-- 1. Crear la función manejadora
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nombre_completo, rol, activo)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Nuevo Usuario'),
    'usuario', -- Rol por defecto
    true
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Crear el trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
