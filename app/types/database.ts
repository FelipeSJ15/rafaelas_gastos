export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    nombre_completo: string | null
                    rol: 'admin' | 'usuario'
                    activo: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    nombre_completo?: string | null
                    rol?: 'admin' | 'usuario'
                    activo?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    nombre_completo?: string | null
                    rol?: 'admin' | 'usuario'
                    activo?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            cuentas: {
                Row: {
                    id: string
                    nombre: string
                    tipo: 'efectivo' | 'banco' | 'tarjeta' | 'billetera'
                    descripcion: string | null
                    activa: boolean
                    created_by: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    nombre: string
                    tipo: 'efectivo' | 'banco' | 'tarjeta' | 'billetera'
                    descripcion?: string | null
                    activa?: boolean
                    created_by?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    nombre?: string
                    tipo?: 'efectivo' | 'banco' | 'tarjeta' | 'billetera'
                    descripcion?: string | null
                    activa?: boolean
                    created_by?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            categorias: {
                Row: {
                    id: string
                    nombre: string
                    tipo: 'ingreso' | 'egreso'
                    parent_id: string | null
                    descripcion: string | null
                    activa: boolean
                    created_by: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    nombre: string
                    tipo: 'ingreso' | 'egreso'
                    parent_id?: string | null
                    descripcion?: string | null
                    activa?: boolean
                    created_by?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    nombre?: string
                    tipo?: 'ingreso' | 'egreso'
                    parent_id?: string | null
                    descripcion?: string | null
                    activa?: boolean
                    created_by?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            movimientos: {
                Row: {
                    id: string
                    tipo: 'ingreso' | 'egreso' | 'transferencia'
                    monto: number
                    fecha: string
                    cuenta_origen_id: string | null
                    cuenta_destino_id: string | null
                    categoria_id: string | null
                    descripcion: string | null
                    anulado: boolean
                    fecha_anulacion: string | null
                    motivo_anulacion: string | null
                    created_by: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    tipo: 'ingreso' | 'egreso' | 'transferencia'
                    monto: number
                    fecha?: string
                    cuenta_origen_id?: string | null
                    cuenta_destino_id?: string | null
                    categoria_id?: string | null
                    descripcion?: string | null
                    anulado?: boolean
                    fecha_anulacion?: string | null
                    motivo_anulacion?: string | null
                    created_by: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    tipo?: 'ingreso' | 'egreso' | 'transferencia'
                    monto?: number
                    fecha?: string
                    cuenta_origen_id?: string | null
                    cuenta_destino_id?: string | null
                    categoria_id?: string | null
                    descripcion?: string | null
                    anulado?: boolean
                    fecha_anulacion?: string | null
                    motivo_anulacion?: string | null
                    created_by?: string
                    created_at?: string
                }
            }
        }
        Views: {
            vista_saldos_cuentas: {
                Row: {
                    id: string
                    nombre: string
                    tipo: 'efectivo' | 'banco' | 'tarjeta' | 'billetera'
                    activa: boolean
                    saldo: number
                    created_at: string
                }
            }
            vista_movimientos_completos: {
                Row: {
                    id: string
                    tipo: 'ingreso' | 'egreso' | 'transferencia'
                    monto: number
                    fecha: string
                    descripcion: string | null
                    anulado: boolean
                    cuenta_origen_nombre: string | null
                    cuenta_origen_tipo: string | null
                    cuenta_destino_nombre: string | null
                    cuenta_destino_tipo: string | null
                    categoria_nombre: string | null
                    categoria_tipo: string | null
                    creado_por_nombre: string | null
                    creado_por_email: string | null
                    created_at: string
                }
            }
        }
        Functions: {
            calcular_saldo_cuenta: {
                Args: { p_cuenta_id: string }
                Returns: number
            }
            calcular_saldo_total: {
                Args: Record<string, never>
                Returns: number
            }
            anular_movimiento: {
                Args: { p_movimiento_id: string; p_motivo: string }
                Returns: boolean
            }
            is_admin: {
                Args: Record<string, never>
                Returns: boolean
            }
        }
    }
}
