-- ============================================
-- QUERIES Y FUNCIONES CLAVE
-- Sistema de Control Financiero
-- ============================================

-- ============================================
-- FUNCIÓN: Calcular saldo de una cuenta específica
-- ============================================

CREATE OR REPLACE FUNCTION calcular_saldo_cuenta(p_cuenta_id UUID)
RETURNS DECIMAL(12, 2) AS $$
DECLARE
    v_saldo DECIMAL(12, 2);
BEGIN
    SELECT 
        COALESCE(SUM(
            CASE 
                -- Ingresos: suma al saldo
                WHEN tipo = 'ingreso' AND cuenta_destino_id = p_cuenta_id THEN monto
                -- Egresos: resta del saldo
                WHEN tipo = 'egreso' AND cuenta_origen_id = p_cuenta_id THEN -monto
                -- Transferencias: entrada suma, salida resta
                WHEN tipo = 'transferencia' AND cuenta_destino_id = p_cuenta_id THEN monto
                WHEN tipo = 'transferencia' AND cuenta_origen_id = p_cuenta_id THEN -monto
                ELSE 0
            END
        ), 0)
    INTO v_saldo
    FROM movimientos
    WHERE 
        (cuenta_origen_id = p_cuenta_id OR cuenta_destino_id = p_cuenta_id)
        AND anulado = false;
    
    RETURN v_saldo;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCIÓN: Calcular saldo total (todas las cuentas activas)
-- ============================================

CREATE OR REPLACE FUNCTION calcular_saldo_total()
RETURNS DECIMAL(12, 2) AS $$
DECLARE
    v_saldo_total DECIMAL(12, 2);
BEGIN
    SELECT 
        COALESCE(SUM(calcular_saldo_cuenta(id)), 0)
    INTO v_saldo_total
    FROM cuentas
    WHERE activa = true;
    
    RETURN v_saldo_total;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCIÓN: Reporte de ingresos y egresos por período
-- ============================================

CREATE OR REPLACE FUNCTION reporte_ingresos_egresos(
    p_fecha_inicio DATE,
    p_fecha_fin DATE
)
RETURNS TABLE (
    total_ingresos DECIMAL(12, 2),
    total_egresos DECIMAL(12, 2),
    resultado DECIMAL(12, 2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(CASE WHEN tipo = 'ingreso' THEN monto ELSE 0 END), 0) as total_ingresos,
        COALESCE(SUM(CASE WHEN tipo = 'egreso' THEN monto ELSE 0 END), 0) as total_egresos,
        COALESCE(SUM(CASE WHEN tipo = 'ingreso' THEN monto WHEN tipo = 'egreso' THEN -monto ELSE 0 END), 0) as resultado
    FROM movimientos
    WHERE 
        fecha BETWEEN p_fecha_inicio AND p_fecha_fin
        AND anulado = false;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCIÓN: Movimientos agrupados por categoría
-- ============================================

CREATE OR REPLACE FUNCTION movimientos_por_categoria(
    p_fecha_inicio DATE,
    p_fecha_fin DATE,
    p_tipo TEXT DEFAULT NULL
)
RETURNS TABLE (
    categoria_id UUID,
    categoria_nombre TEXT,
    tipo_categoria TEXT,
    total DECIMAL(12, 2),
    cantidad_movimientos BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id as categoria_id,
        c.nombre as categoria_nombre,
        c.tipo as tipo_categoria,
        COALESCE(SUM(m.monto), 0) as total,
        COUNT(m.id) as cantidad_movimientos
    FROM categorias c
    LEFT JOIN movimientos m ON m.categoria_id = c.id 
        AND m.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
        AND m.anulado = false
        AND (p_tipo IS NULL OR m.tipo = p_tipo)
    WHERE c.activa = true
        AND (p_tipo IS NULL OR c.tipo = p_tipo)
    GROUP BY c.id, c.nombre, c.tipo
    HAVING COUNT(m.id) > 0
    ORDER BY total DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VIEW: Saldos de cuentas
-- ============================================

CREATE OR REPLACE VIEW vista_saldos_cuentas AS
SELECT 
    c.id,
    c.nombre,
    c.tipo,
    c.activa,
    calcular_saldo_cuenta(c.id) as saldo,
    c.created_at
FROM cuentas c
ORDER BY c.nombre;

-- ============================================
-- VIEW: Movimientos con detalles completos
-- ============================================

CREATE OR REPLACE VIEW vista_movimientos_completos AS
SELECT 
    m.id,
    m.tipo,
    m.monto,
    m.fecha,
    m.descripcion,
    m.anulado,
    
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

-- ============================================
-- QUERY: Dashboard del mes actual
-- ============================================

-- Esta query se puede usar directamente en la aplicación
-- o convertir en una función si se necesita

-- Ejemplo de uso:
/*
SELECT 
    (SELECT calcular_saldo_total()) as saldo_total,
    (SELECT total_ingresos FROM reporte_ingresos_egresos(
        DATE_TRUNC('month', CURRENT_DATE)::DATE,
        CURRENT_DATE
    )) as ingresos_mes,
    (SELECT total_egresos FROM reporte_ingresos_egresos(
        DATE_TRUNC('month', CURRENT_DATE)::DATE,
        CURRENT_DATE
    )) as egresos_mes,
    (SELECT resultado FROM reporte_ingresos_egresos(
        DATE_TRUNC('month', CURRENT_DATE)::DATE,
        CURRENT_DATE
    )) as resultado_mes;
*/

-- ============================================
-- QUERY: Exportación de movimientos (CSV)
-- ============================================

-- Query base para exportar movimientos
-- Se puede filtrar por fecha, cuenta, categoría, etc.

/*
SELECT 
    fecha,
    tipo,
    monto,
    COALESCE(cuenta_origen_nombre, '-') as cuenta_origen,
    COALESCE(cuenta_destino_nombre, '-') as cuenta_destino,
    COALESCE(categoria_nombre, '-') as categoria,
    COALESCE(descripcion, '') as descripcion,
    CASE WHEN anulado THEN 'ANULADO' ELSE 'ACTIVO' END as estado
FROM vista_movimientos_completos
WHERE fecha BETWEEN '2024-01-01' AND '2024-12-31'
    AND anulado = false
ORDER BY fecha DESC, created_at DESC;
*/

-- ============================================
-- FUNCIÓN: Anular movimiento
-- ============================================

CREATE OR REPLACE FUNCTION anular_movimiento(
    p_movimiento_id UUID,
    p_motivo TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE movimientos
    SET 
        anulado = true,
        fecha_anulacion = NOW(),
        motivo_anulacion = p_motivo
    WHERE id = p_movimiento_id
        AND anulado = false;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- QUERY: Top categorías de gasto
-- ============================================

/*
SELECT 
    categoria_nombre,
    total,
    cantidad_movimientos,
    ROUND((total / NULLIF(SUM(total) OVER (), 0) * 100), 2) as porcentaje
FROM movimientos_por_categoria(
    DATE_TRUNC('month', CURRENT_DATE)::DATE,
    CURRENT_DATE,
    'egreso'
)
ORDER BY total DESC
LIMIT 10;
*/

-- ============================================
-- QUERY: Evolución mensual
-- ============================================

/*
SELECT 
    DATE_TRUNC('month', fecha)::DATE as mes,
    SUM(CASE WHEN tipo = 'ingreso' THEN monto ELSE 0 END) as ingresos,
    SUM(CASE WHEN tipo = 'egreso' THEN monto ELSE 0 END) as egresos,
    SUM(CASE WHEN tipo = 'ingreso' THEN monto WHEN tipo = 'egreso' THEN -monto ELSE 0 END) as resultado
FROM movimientos
WHERE anulado = false
    AND fecha >= DATE_TRUNC('year', CURRENT_DATE)
GROUP BY DATE_TRUNC('month', fecha)
ORDER BY mes DESC;
*/

-- ============================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- ============================================

-- Ya están definidos en schema.sql, pero aquí están documentados
-- para referencia de las queries:

-- idx_movimientos_fecha (para filtros por período)
-- idx_movimientos_fecha_tipo_anulado (para reportes)
-- idx_movimientos_cuenta_origen (para cálculo de saldos)
-- idx_movimientos_cuenta_destino (para cálculo de saldos)
-- idx_movimientos_categoria (para agrupación por categoría)
