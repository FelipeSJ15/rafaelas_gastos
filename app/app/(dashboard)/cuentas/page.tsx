import { createClient } from '@/lib/supabase/server'
import { AccountCard } from '@/components/cuentas/account-card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

async function getAccounts() {
    const supabase = await createClient()

    const { data } = await supabase
        .from('vista_saldos_cuentas')
        .select('*')
        .order('activa', { ascending: false })
        .order('nombre')

    return data || []
}

export default async function CuentasPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Obtener perfil para verificar rol
    const { data: profile } = await supabase
        .from('profiles')
        .select('rol')
        .eq('id', user?.id)
        .single()

    const isAdmin = profile?.rol === 'admin'
    const cuentas = await getAccounts()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Cuentas</h1>
                    <p className="text-gray-500 mt-1">Administra tus cajas y bancos</p>
                </div>
                {isAdmin && (
                    <Link href="/cuentas/nueva">
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Nueva Cuenta
                        </Button>
                    </Link>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cuentas.map((cuenta) => (
                    <AccountCard
                        key={cuenta.id}
                        {...cuenta}
                        isAdmin={isAdmin}
                    />
                ))}

                {cuentas.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-200">
                        <p className="text-gray-500">No tienes cuentas registradas.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
