'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { createCategory, updateCategory, type CategoryState } from '@/lib/actions/categories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { Categoria } from '@/types/models'

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Guardando...' : isEditing ? 'Actualizar Categoría' : 'Crear Categoría'}
        </Button>
    )
}

interface CategoryFormProps {
    categoria?: Categoria
    categoriasPadre?: Categoria[]
}

export function CategoryForm({ categoria, categoriasPadre = [] }: CategoryFormProps) {
    const [tipo, setTipo] = useState<'ingreso' | 'egreso'>(categoria?.tipo || 'egreso')
    const [state, setState] = useState<CategoryState>({})

    // Filtrar posibles padres (mismo tipo, no es ella misma)
    const padresDisponibles = categoriasPadre.filter(c =>
        c.tipo === tipo &&
        c.id !== categoria?.id &&
        !c.parent_id // Solo permitimos 1 nivel de profundidad por ahora para simplificar
    )

    const handleSubmit = async (formData: FormData) => {
        formData.append('tipo', tipo)

        let result
        if (categoria) {
            result = await updateCategory(categoria.id, state, formData)
        } else {
            result = await createCategory(state, formData)
        }

        if (result?.errors || result?.message) {
            setState(result)
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => setTipo('ingreso')}
                    className={cn(
                        'flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all',
                        tipo === 'ingreso'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-100 bg-white hover:bg-gray-50'
                    )}
                >
                    <TrendingUp className="w-6 h-6 mb-2" />
                    <span className="font-medium">Ingreso</span>
                </button>
                <button
                    type="button"
                    onClick={() => setTipo('egreso')}
                    className={cn(
                        'flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all',
                        tipo === 'egreso'
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-100 bg-white hover:bg-gray-50'
                    )}
                >
                    <TrendingDown className="w-6 h-6 mb-2" />
                    <span className="font-medium">Egreso</span>
                </button>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <form action={handleSubmit} className="space-y-4">
                        {state.message && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                                {state.message}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nombre</label>
                            <Input
                                name="nombre"
                                placeholder="Ej: Servicios, Arriendo, Nómina"
                                defaultValue={categoria?.nombre}
                                required
                            />
                            {state.errors?.nombre && (
                                <p className="text-sm text-red-500">{state.errors.nombre[0]}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Categoría Padre (Opcional)</label>
                            <select
                                name="parent_id"
                                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600"
                                defaultValue={categoria?.parent_id || ''}
                            >
                                <option value="">Ninguna (Categoría Principal)</option>
                                {padresDisponibles.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="pt-4">
                            <SubmitButton isEditing={!!categoria} />
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
