-- ACTUALIZAR VISTA DE MOVIMIENTOS
-- Agregamos la columna 'created_by' para poder validar permisos en el frontend

DROP VIEW IF EXISTS vista_movimientos_completos;

CREATE OR REPLACE VIEW vista_movimientos_completos AS
SELECT 
    m.id,
    m.tipo,
    m.monto,
    m.fecha,
    m.descripcion,
    m.anulado,
    m.created_by, -- Columna necesaria para validación de permisos
    
    -- Cuenta origen
    co.nombre as cuenta_origen_nombre,
    co.tipo as cuenta_origen_tipo,
    
    -- Cuenta destino
    cd.nombre as cuenta_destino_nombre,
    cd.tipo as cuenta_destino_tipo,
    
    -- Categoría
    cat.nombre as categoria_nombre,
    cat.tipo as categoria_tipo,
    
    -- Usuario que creó
    p.nombre_completo as creado_por_nombre,
    p.email as creado_por_email,
    
    m.created_at
FROM movimientos m
LEFT JOIN cuentas co ON m.cuenta_origen_id = co.id
LEFT JOIN cuentas cd ON m.cuenta_destino_id = cd.id
LEFT JOIN categorias cat ON m.categoria_id = cat.id
LEFT JOIN profiles p ON m.created_by = p.id
ORDER BY m.fecha DESC, m.created_at DESC;
