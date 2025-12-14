'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { createMovement, type MovementState } from '@/lib/actions/movements'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRightLeft, TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { Categoria, Cuenta } from '@/types/models'

// Componente de botón de submit con estado de carga
function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Guardando...' : 'Guardar Movimiento'}
        </Button>
    )
}

interface MovementFormProps {
    cuentas: Cuenta[]
    categorias: Categoria[]
}

export function MovementForm({ cuentas, categorias }: MovementFormProps) {
    const [tipo, setTipo] = useState<'ingreso' | 'egreso' | 'transferencia'>('ingreso')
    const [state, setState] = useState<MovementState>({})

    // Filtrar categorías según el tipo seleccionado
    const categoriasFiltradas = categorias.filter(c => c.tipo === tipo)

    const handleSubmit = async (formData: FormData) => {
        // Agregar el tipo al formData
        formData.append('tipo', tipo)

        const result = await createMovement(state, formData)
        if (result?.errors || result?.message) {
            setState(result)
        }
    }

    return (
        <div className="space-y-6">
            {/* Selector de Tipo */}
            <div className="grid grid-cols-3 gap-4">
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
                <button
                    type="button"
                    onClick={() => setTipo('transferencia')}
                    className={cn(
                        'flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all',
                        tipo === 'transferencia'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-100 bg-white hover:bg-gray-50'
                    )}
                >
                    <ArrowRightLeft className="w-6 h-6 mb-2" />
                    <span className="font-medium">Transferencia</span>
                </button>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <form action={handleSubmit} className="space-y-4">
                        {/* Mensaje de error general */}
                        {state.message && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                                {state.message}
                            </div>
                        )}

                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Monto */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Monto</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                                    <Input
                                        name="monto"
                                        type="number"
                                        placeholder="0"
                                        className="pl-7"
                                        min="1"
                                        required
                                    />
                                </div>
                                {state.errors?.monto && (
                                    <p className="text-sm text-red-500">{state.errors.monto[0]}</p>
                                )}
                            </div>

                            {/* Fecha */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Fecha</label>
                                <Input
                                    name="fecha"
                                    type="date"
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                    required
                                />
                                {state.errors?.fecha && (
                                    <p className="text-sm text-red-500">{state.errors.fecha[0]}</p>
                                )}
                            </div>
                        </div>

                        {/* Cuentas */}
                        <div className="grid gap-4 md:grid-cols-2">
                            {tipo !== 'ingreso' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Cuenta Origen</label>
                                    <select
                                        name="cuenta_origen_id"
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600"
                                        required
                                    >
                                        <option value="">Seleccionar cuenta...</option>
                                        {cuentas.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.nombre} ({c.tipo})
                                            </option>
                                        ))}
                                    </select>
                                    {state.errors?.cuenta_origen_id && (
                                        <p className="text-sm text-red-500">{state.errors.cuenta_origen_id[0]}</p>
                                    )}
                                </div>
                            )}

                            {tipo !== 'egreso' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Cuenta Destino</label>
                                    <select
                                        name="cuenta_destino_id"
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600"
                                        required
                                    >
                                        <option value="">Seleccionar cuenta...</option>
                                        {cuentas.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.nombre} ({c.tipo})
                                            </option>
                                        ))}
                                    </select>
                                    {state.errors?.cuenta_destino_id && (
                                        <p className="text-sm text-red-500">{state.errors.cuenta_destino_id[0]}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Categoría (Solo para Ingreso/Egreso) */}
                        {tipo !== 'transferencia' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Categoría</label>
                                <select
                                    name="categoria_id"
                                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600"
                                    required
                                >
                                    <option value="">Seleccionar categoría...</option>
                                    {categoriasFiltradas.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.nombre}
                                        </option>
                                    ))}
                                </select>
                                {state.errors?.categoria_id && (
                                    <p className="text-sm text-red-500">{state.errors.categoria_id[0]}</p>
                                )}
                            </div>
                        )}

                        {/* Descripción */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Descripción (Opcional)</label>
                            <Input
                                name="descripcion"
                                placeholder="Detalles adicionales..."
                            />
                        </div>

                        <div className="pt-4">
                            <SubmitButton />
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
