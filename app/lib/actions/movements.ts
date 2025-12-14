'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const MovementSchema = z.object({
    tipo: z.enum(['ingreso', 'egreso', 'transferencia']),
    monto: z.number().min(1, 'El monto debe ser mayor a 0'),
    fecha: z.string(),
    descripcion: z.string().optional(),
    cuenta_origen_id: z.string().uuid().optional(),
    cuenta_destino_id: z.string().uuid().optional(),
    categoria_id: z.string().uuid().optional(),
})

export type MovementState = {
    errors?: {
        tipo?: string[]
        monto?: string[]
        fecha?: string[]
        descripcion?: string[]
        cuenta_origen_id?: string[]
        cuenta_destino_id?: string[]
        categoria_id?: string[]
        _form?: string[]
    }
    message?: string | null
}

export async function createMovement(prevState: MovementState, formData: FormData) {
    const supabase = await createClient()

    // Validar sesión
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { message: 'No autorizado' }
    }

    // Parsear datos
    const rawData = {
        tipo: formData.get('tipo'),
        monto: Number(formData.get('monto')),
        fecha: formData.get('fecha'),
        descripcion: formData.get('descripcion'),
        cuenta_origen_id: formData.get('cuenta_origen_id') || undefined,
        cuenta_destino_id: formData.get('cuenta_destino_id') || undefined,
        categoria_id: formData.get('categoria_id') || undefined,
    }

    // Validar esquema
    const validatedFields = MovementSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Error en los campos. Por favor revisa el formulario.',
        }
    }

    const { tipo, monto, fecha, descripcion, cuenta_origen_id, cuenta_destino_id, categoria_id } = validatedFields.data

    // Validaciones lógicas adicionales
    if (tipo === 'ingreso' && !cuenta_destino_id) {
        return {
            errors: { cuenta_destino_id: ['Requerido para ingresos'] },
            message: 'Falta cuenta destino',
        }
    }

    if (tipo === 'egreso' && !cuenta_origen_id) {
        return {
            errors: { cuenta_origen_id: ['Requerido para egresos'] },
            message: 'Falta cuenta origen',
        }
    }

    if (tipo === 'transferencia') {
        if (!cuenta_origen_id || !cuenta_destino_id) {
            return {
                message: 'Se requieren ambas cuentas para transferencia',
            }
        }
        if (cuenta_origen_id === cuenta_destino_id) {
            return {
                errors: { cuenta_destino_id: ['La cuenta destino debe ser diferente a la origen'] },
                message: 'Cuentas iguales',
            }
        }
    }

    // Insertar en base de datos
    const { error } = await supabase.from('movimientos').insert({
        tipo,
        monto,
        fecha,
        descripcion,
        cuenta_origen_id: tipo === 'ingreso' ? null : cuenta_origen_id,
        cuenta_destino_id: tipo === 'egreso' ? null : cuenta_destino_id,
        categoria_id: tipo === 'transferencia' ? null : categoria_id,
        created_by: user.id,
    })

    if (error) {
        console.error('Database Error:', error)
        return {
            message: 'Error al crear el movimiento. Intenta nuevamente.',
        }
    }

    revalidatePath('/movimientos')
    revalidatePath('/') // Actualizar dashboard
    redirect('/movimientos')
}

export async function anularMovimiento(id: string, motivo: string) {
    const supabase = await createClient()

    const { error } = await supabase.rpc('anular_movimiento', {
        p_movimiento_id: id,
        p_motivo: motivo
    })

    if (error) {
        console.error('Error anulando:', error)
        throw new Error('No se pudo anular el movimiento')
    }

    revalidatePath('/movimientos')
    revalidatePath('/')
}
