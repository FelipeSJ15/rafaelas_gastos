import { AccountForm } from '@/components/cuentas/account-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewAccountPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/cuentas">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Nueva Cuenta</h1>
                    <p className="text-gray-500">Registra una cuenta bancaria, efectivo o tarjeta</p>
                </div>
            </div>

            <AccountForm />
        </div>
    )
}
