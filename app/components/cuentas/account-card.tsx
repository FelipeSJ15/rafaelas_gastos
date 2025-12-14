'use client'

import { formatCurrency } from '@/lib/utils/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Banknote, CreditCard, Wallet, MoreVertical, Pencil, Power } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toggleAccountStatus } from '@/lib/actions/accounts'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

interface AccountCardProps {
    id: string
    nombre: string
    tipo: 'efectivo' | 'banco' | 'tarjeta' | 'billetera'
    saldo: number
    activa: boolean
    descripcion?: string | null
    isAdmin?: boolean
}

const icons = {
    banco: Building2,
    efectivo: Banknote,
    tarjeta: CreditCard,
    billetera: Wallet,
}

const colors = {
    banco: 'text-secondary bg-secondary/10',
    efectivo: 'text-emerald-600 bg-emerald-50',
    tarjeta: 'text-primary bg-primary/10',
    billetera: 'text-amber-600 bg-amber-50',
}

export function AccountCard({ id, nombre, tipo, saldo, activa, descripcion, isAdmin }: AccountCardProps) {
    const Icon = icons[tipo] || Building2
    const colorClass = colors[tipo] || colors.banco

    return (
        <Card className={cn("transition-all hover:shadow-md", !activa && "opacity-60 grayscale")}>
            <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className={cn("p-2 rounded-lg", colorClass)}>
                    <Icon className="w-5 h-5" />
                </div>
                {isAdmin && (
                    <div className="flex gap-1">
                        <Link href={`/cuentas/${id}/editar`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Pencil className="w-4 h-4 text-gray-500" />
                            </Button>
                        </Link>
                        <form action={() => toggleAccountStatus(id, activa)}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Power className={cn("w-4 h-4", activa ? "text-green-600" : "text-red-600")} />
                            </Button>
                        </form>
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                    {nombre}
                </CardTitle>
                {descripcion && (
                    <p className="text-xs text-gray-500 mb-4 line-clamp-1">{descripcion}</p>
                )}
                <div className="mt-4">
                    <p className="text-sm text-gray-500">Saldo Actual</p>
                    <p className={cn("text-2xl font-bold", saldo >= 0 ? "text-gray-900" : "text-red-600")}>
                        {formatCurrency(saldo)}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
