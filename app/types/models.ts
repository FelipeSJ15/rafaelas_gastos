export type TipoMovimiento = 'ingreso' | 'egreso' | 'transferencia'
export type TipoCuenta = 'efectivo' | 'banco' | 'tarjeta' | 'billetera'
export type TipoCategoria = 'ingreso' | 'egreso'
export type Rol = 'admin' | 'usuario'

export interface Cuenta {
    id: string
    nombre: string
    tipo: TipoCuenta
    descripcion?: string
    activa: boolean
    saldo?: number
    created_at: string
}

export interface Categoria {
    id: string
    nombre: string
    tipo: TipoCategoria
    parent_id?: string
    descripcion?: string
    activa: boolean
    created_at: string
}

export interface Movimiento {
    id: string
    tipo: TipoMovimiento
    monto: number
    fecha: string
    cuenta_origen_id?: string
    cuenta_destino_id?: string
    categoria_id?: string
    descripcion?: string
    anulado: boolean
    created_by: string
    created_at: string
}

export interface MovimientoCompleto extends Movimiento {
    cuenta_origen_nombre?: string
    cuenta_destino_nombre?: string
    categoria_nombre?: string
    creado_por_nombre?: string
}

export interface Profile {
    id: string
    email: string
    nombre_completo?: string
    rol: Rol
    activo: boolean
}

export interface DashboardStats {
    saldo_total: number
    ingresos_mes: number
    egresos_mes: number
    resultado_mes: number
}

export interface MovimientoPorCategoria {
    categoria_id: string
    categoria_nombre: string
    total: number
    cantidad: number
}
