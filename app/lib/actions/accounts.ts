'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const AccountSchema = z.object({
    nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    tipo: z.enum(['efectivo', 'banco', 'tarjeta', 'billetera']),
    descripcion: z.string().optional(),
})

export type AccountState = {
    errors?: {
        nombre?: string[]
        tipo?: string[]
        descripcion?: string[]
        _form?: string[]
    }
    message?: string | null
}

export async function createAccount(prevState: AccountState, formData: FormData) {
    const supabase = await createClient()

    const rawData = {
        nombre: formData.get('nombre'),
        tipo: formData.get('tipo'),
        descripcion: formData.get('descripcion'),
    }

    const validatedFields = AccountSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Error en los campos',
        }
    }

    const { error } = await supabase.from('cuentas').insert({
        ...validatedFields.data,
        activa: true,
    })

    if (error) {
        return { message: 'Error al crear la cuenta' }
    }

    revalidatePath('/cuentas')
    revalidatePath('/movimientos/nuevo')
    redirect('/cuentas')
}

export async function updateAccount(id: string, prevState: AccountState, formData: FormData) {
    const supabase = await createClient()

    const rawData = {
        nombre: formData.get('nombre'),
        tipo: formData.get('tipo'),
        descripcion: formData.get('descripcion'),
    }

    const validatedFields = AccountSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Error en los campos',
        }
    }

    const { error } = await supabase
        .from('cuentas')
        .update(validatedFields.data)
        .eq('id', id)

    if (error) {
        return { message: 'Error al actualizar la cuenta' }
    }

    revalidatePath('/cuentas')
    revalidatePath('/movimientos/nuevo')
    redirect('/cuentas')
}

export async function toggleAccountStatus(id: string, currentStatus: boolean) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('cuentas')
        .update({ activa: !currentStatus })
        .eq('id', id)

    if (error) {
        throw new Error('Error al cambiar estado de cuenta')
    }

    revalidatePath('/cuentas')
    revalidatePath('/movimientos/nuevo')
}
