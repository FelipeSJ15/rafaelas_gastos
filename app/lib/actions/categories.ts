'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const CategorySchema = z.object({
    nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    tipo: z.enum(['ingreso', 'egreso']),
    parent_id: z.string().uuid().optional().nullable(),
})

export type CategoryState = {
    errors?: {
        nombre?: string[]
        tipo?: string[]
        parent_id?: string[]
        _form?: string[]
    }
    message?: string | null
}

export async function createCategory(prevState: CategoryState, formData: FormData) {
    const supabase = await createClient()

    const rawData = {
        nombre: formData.get('nombre'),
        tipo: formData.get('tipo'),
        parent_id: formData.get('parent_id') || null,
    }

    const validatedFields = CategorySchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Error en los campos',
        }
    }

    const { error } = await supabase.from('categorias').insert({
        ...validatedFields.data,
        activa: true,
    })

    if (error) {
        return { message: 'Error al crear la categoría' }
    }

    revalidatePath('/categorias')
    revalidatePath('/movimientos/nuevo')
    redirect('/categorias')
}

export async function updateCategory(id: string, prevState: CategoryState, formData: FormData) {
    const supabase = await createClient()

    const rawData = {
        nombre: formData.get('nombre'),
        tipo: formData.get('tipo'),
        parent_id: formData.get('parent_id') || null,
    }

    const validatedFields = CategorySchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Error en los campos',
        }
    }

    const { error } = await supabase
        .from('categorias')
        .update(validatedFields.data)
        .eq('id', id)

    if (error) {
        return { message: 'Error al actualizar la categoría' }
    }

    revalidatePath('/categorias')
    revalidatePath('/movimientos/nuevo')
    redirect('/categorias')
}

export async function deleteCategory(id: string) {
    const supabase = await createClient()

    // Verificar si tiene movimientos
    const { count } = await supabase
        .from('movimientos')
        .select('*', { count: 'exact', head: true })
        .eq('categoria_id', id)
        .eq('anulado', false)

    if (count && count > 0) {
        return { message: 'No se puede eliminar: tiene movimientos asociados' }
    }

    // Soft delete
    const { error } = await supabase
        .from('categorias')
        .update({ activa: false })
        .eq('id', id)

    if (error) {
        return { message: 'Error al eliminar la categoría' }
    }

    revalidatePath('/categorias')
    revalidatePath('/movimientos/nuevo')
    return { message: null }
}
