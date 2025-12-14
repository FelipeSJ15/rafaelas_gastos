-- ============================================
-- SISTEMA DE CONTROL FINANCIERO - SALÓN DE BELLEZA
-- Esquema de Base de Datos V1
-- ============================================
-- 
-- MODELO CONCEPTUAL:
-- 1. MOVIMIENTO = hecho financiero (qué pasó)
-- 2. CATEGORÍA = clasificación (por qué pasó)
-- 3. CUENTA = ubicación del dinero (dónde está)
--
-- REGLAS:
-- - Los saldos se calculan dinámicamente, NO se almacenan
-- - Los movimientos son inmutables (solo se anulan)
-- - Las transferencias NO afectan utilidades
-- ============================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLA: profiles
-- Extensión de usuarios de Supabase Auth
-- ============================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    nombre_completo TEXT,
    rol TEXT NOT NULL CHECK (rol IN ('admin', 'usuario')) DEFAULT 'usuario',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para profiles
CREATE INDEX idx_profiles_rol ON profiles(rol);
CREATE INDEX idx_profiles_activo ON profiles(activo);

-- ============================================
-- TABLA: cuentas
-- Representa dónde está el dinero
-- ============================================
CREATE TABLE cuentas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('efectivo', 'banco', 'tarjeta', 'billetera')),
    descripcion TEXT,
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id)
);

-- Índices para cuentas
CREATE INDEX idx_cuentas_activa ON cuentas(activa);
CREATE INDEX idx_cuentas_tipo ON cuentas(tipo);

-- ============================================
-- TABLA: categorias
-- Clasificación de ingresos y egresos
-- Soporta jerarquía (parent_id)
-- ============================================
CREATE TABLE categorias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('ingreso', 'egreso')),
    parent_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
    descripcion TEXT,
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id)
);

-- Índices para categorías
CREATE INDEX idx_categorias_tipo ON categorias(tipo);
CREATE INDEX idx_categorias_activa ON categorias(activa);
CREATE INDEX idx_categorias_parent ON categorias(parent_id);

-- ============================================
-- TABLA: movimientos
-- Núcleo del sistema - Registro de transacciones
-- ============================================
CREATE TABLE movimientos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo TEXT NOT NULL CHECK (tipo IN ('ingreso', 'egreso', 'transferencia')),
    monto DECIMAL(12, 2) NOT NULL CHECK (monto > 0),
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Cuentas involucradas (según tipo de movimiento)
    cuenta_origen_id UUID REFERENCES cuentas(id),
    cuenta_destino_id UUID REFERENCES cuentas(id),
    
    -- Clasificación
    categoria_id UUID REFERENCES categorias(id),
    
    -- Detalles
    descripcion TEXT,
    
    -- Auditoría
    anulado BOOLEAN DEFAULT false,
    fecha_anulacion TIMESTAMPTZ,
    motivo_anulacion TEXT,
    created_by UUID REFERENCES profiles(id) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints de integridad según tipo
    CONSTRAINT check_ingreso CHECK (
        tipo != 'ingreso' OR (cuenta_origen_id IS NULL AND cuenta_destino_id IS NOT NULL)
    ),
    CONSTRAINT check_egreso CHECK (
        tipo != 'egreso' OR (cuenta_origen_id IS NOT NULL AND cuenta_destino_id IS NULL)
    ),
    CONSTRAINT check_transferencia CHECK (
        tipo != 'transferencia' OR (cuenta_origen_id IS NOT NULL AND cuenta_destino_id IS NOT NULL AND cuenta_origen_id != cuenta_destino_id)
    ),
    CONSTRAINT check_categoria_requerida CHECK (
        tipo = 'transferencia' OR categoria_id IS NOT NULL
    )
);

-- Índices para movimientos (optimizados para queries frecuentes)
CREATE INDEX idx_movimientos_fecha ON movimientos(fecha DESC);
CREATE INDEX idx_movimientos_tipo ON movimientos(tipo);
CREATE INDEX idx_movimientos_anulado ON movimientos(anulado);
CREATE INDEX idx_movimientos_cuenta_origen ON movimientos(cuenta_origen_id) WHERE cuenta_origen_id IS NOT NULL;
CREATE INDEX idx_movimientos_cuenta_destino ON movimientos(cuenta_destino_id) WHERE cuenta_destino_id IS NOT NULL;
CREATE INDEX idx_movimientos_categoria ON movimientos(categoria_id);
CREATE INDEX idx_movimientos_created_by ON movimientos(created_by);

-- Índice compuesto para reportes por período
CREATE INDEX idx_movimientos_fecha_tipo_anulado ON movimientos(fecha, tipo, anulado);

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cuentas_updated_at BEFORE UPDATE ON cuentas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON categorias
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Categorías predefinidas de INGRESOS
INSERT INTO categorias (nombre, tipo, descripcion) VALUES
    ('Servicios de Uñas', 'ingreso', 'Ingresos por servicios de manicure y pedicure'),
    ('Productos', 'ingreso', 'Venta de productos de belleza'),
    ('Otros Ingresos', 'ingreso', 'Ingresos diversos');

-- Categorías predefinidas de EGRESOS
INSERT INTO categorias (nombre, tipo, descripcion) VALUES
    ('Nómina', 'egreso', 'Pagos a empleados'),
    ('Insumos', 'egreso', 'Compra de materiales y productos'),
    ('Servicios Públicos', 'egreso', 'Luz, agua, internet'),
    ('Arriendo', 'egreso', 'Pago de local'),
    ('Mantenimiento', 'egreso', 'Reparaciones y mantenimiento'),
    ('Otros Gastos', 'egreso', 'Gastos diversos');

-- Cuenta inicial de efectivo
INSERT INTO cuentas (nombre, tipo, descripcion) VALUES
    ('Caja Chica', 'efectivo', 'Efectivo en caja del salón');

-- ============================================
-- COMENTARIOS EN TABLAS
-- ============================================

COMMENT ON TABLE profiles IS 'Perfiles de usuario con roles (admin/usuario)';
COMMENT ON TABLE cuentas IS 'Cuentas donde se almacena el dinero (efectivo, banco, etc)';
COMMENT ON TABLE categorias IS 'Categorías para clasificar ingresos y egresos';
COMMENT ON TABLE movimientos IS 'Registro inmutable de todas las transacciones financieras';

COMMENT ON COLUMN movimientos.tipo IS 'ingreso: solo cuenta_destino | egreso: solo cuenta_origen | transferencia: ambas cuentas';
COMMENT ON COLUMN movimientos.anulado IS 'Los movimientos NO se eliminan, solo se anulan';
COMMENT ON COLUMN categorias.parent_id IS 'Permite jerarquía de categorías (ej: Nómina > Manicuristas)';
