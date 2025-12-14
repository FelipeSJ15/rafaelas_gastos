import { createClient } from '@/lib/supabase/server'
import { MovementList } from '@/components/movimientos/movement-list'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

async function getMovements() {
    const supabase = await createClient()

    const { data } = await supabase
        .from('vista_movimientos_completos')
        .select('*')
        .order('fecha', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(50) // Límite inicial para rendimiento

    return data || []
}

export default async function MovimientosPage() {
    const movimientos = await getMovements()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Movimientos</h1>
                    <p className="text-gray-500 mt-1">Gestiona tus ingresos y egresos</p>
                </div>
                <Link href="/movimientos/nuevo">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Nuevo Movimiento
                    </Button>
                </Link>
            </div>

            <MovementList movimientos={movimientos} />
        </div>
    )
}
