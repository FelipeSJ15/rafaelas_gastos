'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { createAccount, updateAccount, type AccountState } from '@/lib/actions/accounts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Wallet, Building2, CreditCard, Banknote } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { Cuenta } from '@/types/models'

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Guardando...' : isEditing ? 'Actualizar Cuenta' : 'Crear Cuenta'}
        </Button>
    )
}

interface AccountFormProps {
    cuenta?: Cuenta
}

export function AccountForm({ cuenta }: AccountFormProps) {
    const [tipo, setTipo] = useState<'efectivo' | 'banco' | 'tarjeta' | 'billetera'>(
        cuenta?.tipo || 'banco'
    )
    const [state, setState] = useState<AccountState>({})

    const handleSubmit = async (formData: FormData) => {
        formData.append('tipo', tipo)

        let result
        if (cuenta) {
            result = await updateAccount(cuenta.id, state, formData)
        } else {
            result = await createAccount(state, formData)
        }

        if (result?.errors || result?.message) {
            setState(result)
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                    type="button"
                    onClick={() => setTipo('banco')}
                    className={cn(
                        'flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all',
                        tipo === 'banco'
                            ? 'border-violet-500 bg-violet-50 text-violet-700'
                            : 'border-gray-100 bg-white hover:bg-gray-50'
                    )}
                >
                    <Building2 className="w-6 h-6 mb-2" />
                    <span className="font-medium text-sm">Banco</span>
                </button>
                <button
                    type="button"
                    onClick={() => setTipo('efectivo')}
                    className={cn(
                        'flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all',
                        tipo === 'efectivo'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-100 bg-white hover:bg-gray-50'
                    )}
                >
                    <Banknote className="w-6 h-6 mb-2" />
                    <span className="font-medium text-sm">Efectivo</span>
                </button>
                <button
                    type="button"
                    onClick={() => setTipo('tarjeta')}
                    className={cn(
                        'flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all',
                        tipo === 'tarjeta'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-100 bg-white hover:bg-gray-50'
                    )}
                >
                    <CreditCard className="w-6 h-6 mb-2" />
                    <span className="font-medium text-sm">Tarjeta</span>
                </button>
                <button
                    type="button"
                    onClick={() => setTipo('billetera')}
                    className={cn(
                        'flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all',
                        tipo === 'billetera'
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-100 bg-white hover:bg-gray-50'
                    )}
                >
                    <Wallet className="w-6 h-6 mb-2" />
                    <span className="font-medium text-sm">Billetera</span>
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
                            <label className="text-sm font-medium">Nombre de la Cuenta</label>
                            <Input
                                name="nombre"
                                placeholder="Ej: Bancolombia Principal"
                                defaultValue={cuenta?.nombre}
                                required
                            />
                            {state.errors?.nombre && (
                                <p className="text-sm text-red-500">{state.errors.nombre[0]}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Descripción (Opcional)</label>
                            <Input
                                name="descripcion"
                                placeholder="Ej: Cuenta de ahorros terminada en 1234"
                                defaultValue={cuenta?.descripcion || ''}
                            />
                        </div>

                        <div className="pt-4">
                            <SubmitButton isEditing={!!cuenta} />
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
