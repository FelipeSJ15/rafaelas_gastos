'use client'

import { formatCurrency, formatDateShort } from '@/lib/utils/format'
import { ArrowRight, TrendingDown, TrendingUp, ArrowRightLeft, AlertCircle, Ban } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { MovimientoCompleto } from '@/types/models'
import { anularMovimiento } from '@/lib/actions/movements'
import { Button } from '@/components/ui/button'
import { useUser } from '@/lib/hooks/use-user'

interface MovementListProps {
    movimientos: MovimientoCompleto[]
}

export function MovementList({ movimientos }: MovementListProps) {
    const { user, isAdmin } = useUser()

    const handleAnular = async (id: string) => {
        const motivo = window.prompt('¿Por qué deseas anular este movimiento? (Escribe una razón)')

        if (motivo) {
            try {
                await anularMovimiento(id, motivo)
            } catch (error) {
                alert('Error al anular el movimiento')
            }
        }
    }

    if (movimientos.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No hay movimientos</h3>
                <p className="text-gray-500 mt-1">Registra tu primer movimiento para comenzar.</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                            <th className="px-4 py-3">Fecha</th>
                            <th className="px-4 py-3">Tipo</th>
                            <th className="px-4 py-3">Categoría / Descripción</th>
                            <th className="px-4 py-3">Cuenta</th>
                            <th className="px-4 py-3 text-right">Monto</th>
                            <th className="px-4 py-3 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {movimientos.map((mov) => (
                            <tr key={mov.id} className={cn("hover:bg-gray-50 transition-colors", mov.anulado && "opacity-50 bg-gray-50")}>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    {formatDateShort(mov.fecha)}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        {mov.tipo === 'ingreso' && <TrendingUp className="w-4 h-4 text-emerald-600" />}
                                        {mov.tipo === 'egreso' && <TrendingDown className="w-4 h-4 text-rose-600" />}
                                        {mov.tipo === 'transferencia' && <ArrowRightLeft className="w-4 h-4 text-secondary" />}
                                        <span className="capitalize">{mov.tipo}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="font-medium text-gray-900">
                                        {mov.categoria_nombre || 'Transferencia'}
                                    </div>
                                    {mov.descripcion && (
                                        <div className="text-xs text-gray-500 truncate max-w-[200px]">
                                            {mov.descripcion}
                                        </div>
                                    )}
                                    {mov.anulado && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mt-1">
                                            Anulado
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    {mov.tipo === 'transferencia' ? (
                                        <div className="flex items-center gap-1 text-xs">
                                            <span>{mov.cuenta_origen_nombre}</span>
                                            <ArrowRight className="w-3 h-3 text-gray-400" />
                                            <span>{mov.cuenta_destino_nombre}</span>
                                        </div>
                                    ) : (
                                        <span>{mov.cuenta_origen_nombre || mov.cuenta_destino_nombre}</span>
                                    )}
                                </td>
                                <td className={cn(
                                    "px-4 py-3 text-right font-medium",
                                    mov.tipo === 'ingreso' ? "text-emerald-600" : mov.tipo === 'egreso' ? "text-rose-600" : "text-secondary",
                                    mov.anulado && "text-gray-500 line-through"
                                )}>
                                    {mov.tipo === 'egreso' ? '-' : '+'}
                                    {formatCurrency(mov.monto)}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    {!mov.anulado && (isAdmin || user?.id === mov.created_by) && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 text-gray-400 hover:text-red-600"
                                            onClick={() => handleAnular(mov.id)}
                                            title="Anular movimiento"
                                        >
                                            <Ban className="w-4 h-4" />
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
