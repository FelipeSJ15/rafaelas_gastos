-- ACTUALIZAR FUNCIÓN DE ANULACIÓN
-- Permitir que los usuarios anulen sus propios movimientos

DROP FUNCTION IF EXISTS anular_movimiento(UUID, TEXT);

CREATE OR REPLACE FUNCTION anular_movimiento(p_movimiento_id UUID, p_motivo TEXT)
RETURNS VOID AS $$
DECLARE
    v_created_by UUID;
    v_is_admin BOOLEAN;
BEGIN
    -- Obtener el creador del movimiento
    SELECT created_by INTO v_created_by
    FROM movimientos
    WHERE id = p_movimiento_id;

    -- Verificar si es admin (usando la función helper existente)
    v_is_admin := is_admin();

    -- Validar permisos: Admin o Dueño
    IF v_is_admin OR v_created_by = auth.uid() THEN
        UPDATE movimientos
        SET 
            anulado = true,
            motivo_anulacion = p_motivo,
            fecha_anulacion = NOW()
        WHERE id = p_movimiento_id;
    ELSE
        RAISE EXCEPTION 'No tienes permiso para anular este movimiento';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
