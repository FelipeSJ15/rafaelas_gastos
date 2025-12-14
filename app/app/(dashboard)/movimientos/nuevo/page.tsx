import { getAccounts, getCategories } from '@/lib/actions/data'
import { MovementForm } from '@/components/movimientos/movement-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function NewMovementPage() {
    const [cuentas, categorias] = await Promise.all([
        getAccounts(),
        getCategories(),
    ])

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/movimientos">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Nuevo Movimiento</h1>
                    <p className="text-gray-500">Registra un ingreso, egreso o transferencia</p>
                </div>
            </div>

            <MovementForm cuentas={cuentas} categorias={categorias} />
        </div>
    )
}
