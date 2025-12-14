import { createClient } from '@/lib/supabase/server'
import { AccountForm } from '@/components/cuentas/account-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EditAccountPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { data: cuenta } = await supabase
        .from('cuentas')
        .select('*')
        .eq('id', id)
        .single()

    if (!cuenta) {
        notFound()
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/cuentas">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Editar Cuenta</h1>
                    <p className="text-gray-500">Modifica los datos de la cuenta</p>
                </div>
            </div>

            <AccountForm cuenta={cuenta} />
        </div>
    )
}
